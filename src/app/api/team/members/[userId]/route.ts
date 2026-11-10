import { NextResponse } from "next/server";
import { resolveAuthContext, teamService } from "@/modules/identity";
import { AppError } from "@/common/errors";

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const context = await resolveAuthContext(request.headers);
    const { userId } = await params;
    const body = await request.json();

    const result = await teamService.changeMemberRole(context, {
      targetUserId: userId,
      newRole: body.newRole,
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const context = await resolveAuthContext(request.headers);
    const { userId } = await params;

    const result = await teamService.removeMember(context, userId);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
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
