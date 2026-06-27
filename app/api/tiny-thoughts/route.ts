import {
  getPublicTinyThoughts,
} from "../../lib/tiny-thoughts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitValue = Number(searchParams.get("limit") ?? "");
    const limit =
      Number.isFinite(limitValue) && limitValue > 0
        ? Math.min(Math.floor(limitValue), 60)
        : undefined;

    return Response.json({
      thoughts: await getPublicTinyThoughts(limit),
    });
  } catch (error) {
    console.error("Tiny thoughts GET failed", error);
    return Response.json(
      { error: "Tiny thoughts are temporarily unavailable." },
      { status: 500 },
    );
  }
}
