import { resolveAuthContext } from "@/modules/identity";
import { tenancyService } from "@/modules/tenancy";
import { apiSuccess, apiError } from "@/common/utils";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await resolveAuthContext(request.headers);
    const { id } = await params;

    const workspace = await tenancyService.getWorkspaceById(context.organizationId, id);

    return apiSuccess(workspace);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await resolveAuthContext(request.headers);
    const { id } = await params;

    const result = await tenancyService.deleteWorkspace(context, id);

    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
