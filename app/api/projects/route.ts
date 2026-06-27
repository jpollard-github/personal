import { getPublicProjects } from "../../lib/projects";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json({
      projects: await getPublicProjects(),
    });
  } catch (error) {
    console.error("Projects GET failed", error);
    return Response.json(
      { error: "Projects are temporarily unavailable." },
      { status: 500 },
    );
  }
}
