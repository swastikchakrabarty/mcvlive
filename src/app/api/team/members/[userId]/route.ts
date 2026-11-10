import { z } from "zod";
import { resolveAuthContext, teamService } from "@/modules/identity";
import { apiSuccess, apiError, parseJsonBody } from "@/common/utils";

const changeRoleSchema = z.object({
  newRole: z.enum(["owner", "admin", "member", "viewer"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const context = await resolveAuthContext(request.headers);
    const { userId } = await params;
    const body = await parseJsonBody(request, changeRoleSchema);

    const result = await teamService.changeMemberRole(context, {
      targetUserId: userId,
      newRole: body.newRole,
    });

    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
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
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
