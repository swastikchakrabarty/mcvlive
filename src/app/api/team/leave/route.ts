import { resolveAuthContext, teamService } from "@/modules/identity";
import { apiSuccess, apiError } from "@/common/utils";

export async function POST(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const result = await teamService.leaveOrganization(context);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
