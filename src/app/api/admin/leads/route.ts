import { NextRequest } from "next/server";
import { desc, isNull } from "drizzle-orm";
import { resolveAuthContext, assertCan } from "@/modules/identity";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { apiSuccess, apiError, encodeCursor } from "@/common/utils/api-response";
import { logger } from "@/common/logger";

export async function GET(req: NextRequest) {
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  try {
    // 1. Resolve active user session context
    const context = await resolveAuthContext(req.headers);

    // 2. Enforce central RBAC authorization (Owner & Admin permitted; Member & Viewer denied)
    assertCan(context, "lead:read");

    // 3. Query PostgreSQL for non-deleted B2B leads
    const leadsList = await db
      .select({
        id: leads.id,
        reference_id: leads.reference_id,
        business_name: leads.business_name,
        owner_name: leads.owner_name,
        company_email: leads.company_email,
        budget: leads.budget,
        tier_selected: leads.tier_selected,
        message: leads.message,
        status: leads.status,
        created_at: leads.created_at,
        updated_at: leads.updated_at,
      })
      .from(leads)
      .where(isNull(leads.deleted_at))
      .orderBy(desc(leads.created_at))
      .limit(50);

    const lastItem = leadsList[leadsList.length - 1];
    const nextCursor = lastItem
      ? encodeCursor({ id: lastItem.id, createdAt: lastItem.created_at })
      : undefined;

    logger.info(
      "ADMIN_LEADS_FETCHED",
      {
        count: leadsList.length,
        organizationId: context.organizationId,
        userId: context.user.id,
      },
      requestId,
    );

    return apiSuccess(
      leadsList,
      {
        requestId,
        cursor: {
          nextCursor,
          hasMore: false,
          limit: 50,
          total: leadsList.length,
        },
      },
      200,
    );
  } catch (err: unknown) {
    return apiError(err, undefined, undefined, requestId);
  }
}
