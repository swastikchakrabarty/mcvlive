import { eq } from "drizzle-orm";
import { getDb, backgroundJobs } from "@/db";
import { ValidationError, NotFoundError } from "@/common/errors";

export type BackgroundJobType = "send_email" | "generate_pdf_invoice" | "process_webhook";
export type JobStatus = "pending" | "running" | "completed" | "failed";

export interface EnqueueJobParams<T = Record<string, unknown>> {
  jobType: BackgroundJobType;
  organizationId: string;
  idempotencyKey: string;
  payload: T;
  maxAttempts?: number;
}

export type JobHandler<T = unknown, R = unknown> = (payload: T) => Promise<R>;

export class JobQueueService {
  private handlers = new Map<string, JobHandler>();

  constructor() {
    this.registerDefaultHandlers();
  }

  /**
   * Register default handlers for email notifications, PDF generation, and webhook processing
   */
  private registerDefaultHandlers() {
    // 1. Send Email Notification Handler
    this.registerHandler("send_email", async (payload: unknown) => {
      const data = payload as { to: string; subject: string; template: string };
      console.log(`[JobQueue] Executing send_email to ${data.to}: "${data.subject}"`);
      return { sent: true, recipient: data.to, dispatchedAt: new Date().toISOString() };
    });

    // 2. Generate PDF Invoice Handler
    this.registerHandler("generate_pdf_invoice", async (payload: unknown) => {
      const data = payload as { invoiceNumber: string; amountMinor: number };
      console.log(`[JobQueue] Executing generate_pdf_invoice for ${data.invoiceNumber}`);
      return {
        generated: true,
        invoiceNumber: data.invoiceNumber,
        pdfPath: `invoices/${data.invoiceNumber}.pdf`,
        generatedAt: new Date().toISOString(),
      };
    });

    // 3. Process External Webhook Handler
    this.registerHandler("process_webhook", async (payload: unknown) => {
      const data = payload as { eventId: string; eventType: string };
      console.log(`[JobQueue] Executing asynchronous process_webhook for ${data.eventId}`);
      return { processed: true, eventId: data.eventId, processedAt: new Date().toISOString() };
    });
  }

  /**
   * Register a custom handler function for a job type
   */
  registerHandler<T, R>(jobType: string, handler: JobHandler<T, R>): void {
    this.handlers.set(jobType, handler as JobHandler);
  }

  /**
   * Enqueues an asynchronous background job with strict idempotency.
   */
  async enqueueJob<T extends Record<string, unknown>>(
    params: EnqueueJobParams<T>,
    customDb = getDb(),
  ): Promise<{ jobId: string; duplicate: boolean; status: JobStatus }> {
    const { jobType, organizationId, idempotencyKey, payload, maxAttempts = 3 } = params;

    if (!jobType || !organizationId || !idempotencyKey) {
      throw new ValidationError("jobType, organizationId, and idempotencyKey are mandatory");
    }

    // 1. Idempotency Check
    const [existing] = await customDb
      .select()
      .from(backgroundJobs)
      .where(eq(backgroundJobs.idempotency_key, idempotencyKey))
      .limit(1);

    if (existing) {
      return {
        jobId: existing.id,
        duplicate: true,
        status: existing.status as JobStatus,
      };
    }

    // 2. Enqueue Job
    const [created] = await customDb
      .insert(backgroundJobs)
      .values({
        job_type: jobType,
        organization_id: organizationId,
        idempotency_key: idempotencyKey,
        payload,
        status: "pending",
        attempts: 0,
        max_attempts: maxAttempts,
      })
      .returning();

    if (!created) {
      throw new Error("Failed to persist background job record");
    }

    return {
      jobId: created.id,
      duplicate: false,
      status: "pending",
    };
  }

  /**
   * Executes a job by ID, handling exponential backoff and max retry limits.
   */
  async executeJob(
    jobId: string,
    customDb = getDb(),
  ): Promise<{ success: boolean; result?: unknown }> {
    const [job] = await customDb
      .select()
      .from(backgroundJobs)
      .where(eq(backgroundJobs.id, jobId))
      .limit(1);

    if (!job) {
      throw new NotFoundError("Background Job", jobId);
    }

    const handler = this.handlers.get(job.job_type);
    if (!handler) {
      throw new Error(`No registered handler found for job type '${job.job_type}'`);
    }

    // Mark running
    await customDb
      .update(backgroundJobs)
      .set({ status: "running", locked_at: new Date(), updated_at: new Date() })
      .where(eq(backgroundJobs.id, job.id));

    try {
      const result = await handler(job.payload);

      // Mark completed
      await customDb
        .update(backgroundJobs)
        .set({
          status: "completed",
          completed_at: new Date(),
          last_error: null,
          updated_at: new Date(),
        })
        .where(eq(backgroundJobs.id, job.id));

      return { success: true, result };
    } catch (err) {
      const nextAttempt = job.attempts + 1;
      const errorMsg = err instanceof Error ? err.message : "Unknown job execution failure";
      const isExhausted = nextAttempt >= job.max_attempts;

      // Exponential backoff: 2^attempt seconds (e.g. 2s, 4s, 8s)
      const backoffSeconds = Math.pow(2, nextAttempt);
      const nextScheduledAt = new Date(Date.now() + backoffSeconds * 1000);

      // Structured failure log
      console.error(
        JSON.stringify({
          level: "ERROR",
          type: "JOB_EXECUTION_FAILURE",
          jobId: job.id,
          jobType: job.job_type,
          attempt: nextAttempt,
          maxAttempts: job.max_attempts,
          isExhausted,
          error: errorMsg,
          nextScheduledAt: isExhausted ? null : nextScheduledAt.toISOString(),
        }),
      );

      await customDb
        .update(backgroundJobs)
        .set({
          status: isExhausted ? "failed" : "pending",
          attempts: nextAttempt,
          last_error: errorMsg,
          scheduled_for: isExhausted ? job.scheduled_for : nextScheduledAt,
          updated_at: new Date(),
        })
        .where(eq(backgroundJobs.id, job.id));

      return { success: false };
    }
  }
}

export const jobQueue = new JobQueueService();
