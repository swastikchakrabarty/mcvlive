import { NextRequest } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { resolveAuthContext, assertCan } from "@/modules/identity";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { apiSuccess, apiError } from "@/common/utils/api-response";
import { NotFoundError } from "@/common/errors";
import { logger } from "@/common/logger";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  try {
    const context = await resolveAuthContext(req.headers);
    assertCan(context, "lead:read");

    const { id } = await params;

    // Reject non-UUID IDs with clean 404 to defeat ID enumeration attacks
    if (!UUID_REGEX.test(id)) {
      throw new NotFoundError("Lead", id);
    }

    const [leadRecord] = await db
      .select()
      .from(leads)
      .where(and(eq(leads.id, id), isNull(leads.deleted_at)))
      .limit(1);

    if (!leadRecord) {
      throw new NotFoundError("Lead", id);
    }

    logger.info(
      "ADMIN_LEAD_DETAIL_ACCESSED",
      {
        leadId: id,
        organizationId: context.organizationId,
        userId: context.user.id,
      },
      requestId,
    );

    return apiSuccess(leadRecord, { requestId });
  } catch (err: unknown) {
    return apiError(err, undefined, undefined, requestId);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  try {
    const context = await resolveAuthContext(req.headers);

    // Only Owner role possesses lead:delete permissions
    assertCan(context, "lead:delete");

    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      throw new NotFoundError("Lead", id);
    }

    const [existing] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(and(eq(leads.id, id), isNull(leads.deleted_at)))
      .limit(1);

    if (!existing) {
      throw new NotFoundError("Lead", id);
    }

    // Execute soft delete for tenant recovery
    await db
      .update(leads)
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .where(eq(leads.id, id));

    logger.info(
      "ADMIN_LEAD_SOFT_DELETED",
      {
        leadId: id,
        organizationId: context.organizationId,
        userId: context.user.id,
      },
      requestId,
    );

    return apiSuccess({ deleted: true, id }, { requestId });
  } catch (err: unknown) {
    return apiError(err, undefined, undefined, requestId);
  }
}
