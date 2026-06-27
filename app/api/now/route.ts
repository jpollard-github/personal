import { getPublicNowItems } from "../../lib/now";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json({
      items: await getPublicNowItems(),
    });
  } catch (error) {
    console.error("Now GET failed", error);
    return Response.json(
      { error: "Now cards are temporarily unavailable." },
      { status: 500 },
    );
  }
}
