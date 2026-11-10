import { NextResponse } from "next/server";
import { resolveAuthContext, teamService } from "@/modules/identity";
import { AppError } from "@/common/errors";

export async function POST(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const result = await teamService.leaveOrganization(context);
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
