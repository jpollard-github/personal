import {
  clearAdminSession,
  isAdminAuthenticated,
  isAdminPasswordConfigured,
  setAdminSession,
  verifyAdminCredentials,
} from "../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    authenticated: await isAdminAuthenticated(),
    configured: isAdminPasswordConfigured(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!isAdminPasswordConfigured()) {
    return Response.json(
      { error: "ADMIN_USERNAME or ADMIN_PASSWORD is not configured." },
      { status: 500 },
    );
  }

  if (!verifyAdminCredentials(username, password)) {
    return Response.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  await setAdminSession();
  return Response.json({ authenticated: true });
}

export async function DELETE() {
  await clearAdminSession();
  return Response.json({ authenticated: false });
}
