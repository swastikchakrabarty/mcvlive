import { NextResponse } from "next/server";
import { eq, and, isNull } from "drizzle-orm";
import { getDb, workspaces } from "@/db";
import { resolveAuthContext, assertCan } from "@/modules/identity";
import { AppError, NotFoundError } from "@/common/errors";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await resolveAuthContext(request.headers);
    const { id } = await params;
    const db = getDb();

    // 1. Fetch workspace
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, id), isNull(workspaces.deleted_at)))
      .limit(1);

    if (!workspace) {
      throw new NotFoundError("Workspace", id);
    }

    // 2. Central authorization assert:
    // If foreign organization, throws 404 (BOLA protection)
    // If role unauthorized, throws 403
    assertCan(context, "workspace:read", workspace);

    return NextResponse.json({ success: true, data: workspace }, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: { code: error.errorCode, message: error.message } },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await resolveAuthContext(request.headers);
    const { id } = await params;
    const db = getDb();

    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, id), isNull(workspaces.deleted_at)))
      .limit(1);

    if (!workspace) {
      throw new NotFoundError("Workspace", id);
    }

    // Central authorization assert:
    // If foreign organization, throws 404 (BOLA protection)
    // If role unauthorized, throws 403
    assertCan(context, "workspace:delete", workspace);

    // Soft delete workspace
    await db
      .update(workspaces)
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .where(eq(workspaces.id, id));

    return NextResponse.json({ success: true, data: { deleted: true, id } }, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: { code: error.errorCode, message: error.message } },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
      },
      { status: 500 },
    );
  }
}
