/**
 * Background Jobs Module — Public Facade Interface
 */

export * from "./job-queue";

export const jobsModule = {
  name: "jobs",
  description:
    "Asynchronous background job queue, idempotent execution, and exponential backoff retry",
} as const;
