import { isAdminAuthenticated } from "./admin-auth";

export function jsonError(error: string, status = 400) {
  return Response.json({ error }, { status });
}

export async function parseJsonBody(request: Request) {
  return (await request.json().catch(() => ({}))) as Record<string, unknown>;
}

export async function requireAdminJson() {
  if (!(await isAdminAuthenticated())) {
    return jsonError("Admin login required.", 401);
  }

  return null;
}

export function logRouteError(context: string, error: unknown) {
  console.error(context, error);
}

export function routeFailure(context: string, message: string, error: unknown, status = 500) {
  logRouteError(context, error);
  return jsonError(message, status);
}
