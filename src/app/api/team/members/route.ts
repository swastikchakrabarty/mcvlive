import { NextResponse } from "next/server";
import { resolveAuthContext, teamService } from "@/modules/identity";
import { AppError } from "@/common/errors";

export async function GET(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const members = await teamService.listMembers(context);
    return NextResponse.json({ success: true, data: members }, { status: 200 });
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

export async function POST(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const body = await request.json();
    const result = await teamService.inviteMember(context, {
      email: body.email,
      role: body.role,
    });
    return NextResponse.json({ success: true, data: result }, { status: 201 });
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
