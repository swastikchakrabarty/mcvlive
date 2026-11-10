import { resolveAuthContext } from "@/modules/identity";
import { tenancyService, createWorkspaceSchema } from "@/modules/tenancy";
import { apiSuccess, apiError, parseJsonBody, encodeCursor } from "@/common/utils";

export async function GET(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const workspacesList = await tenancyService.listWorkspaces(context.organizationId);

    // Build cursor metadata
    const lastItem = workspacesList[workspacesList.length - 1];
    const nextCursor = lastItem
      ? encodeCursor({ id: lastItem.id, createdAt: lastItem.createdAt })
      : undefined;

    return apiSuccess(workspacesList, {
      cursor: {
        nextCursor,
        hasMore: false,
        limit: 20,
        total: workspacesList.length,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await resolveAuthContext(request.headers);
    const body = await parseJsonBody(request, createWorkspaceSchema);

    const workspace = await tenancyService.createWorkspace(context, body);

    return apiSuccess(workspace, undefined, 201);
  } catch (error) {
    return apiError(error);
  }
}
