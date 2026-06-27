import {
  getPublicTinyThoughts,
} from "../../lib/tiny-thoughts";

export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json({
      thoughts: await getPublicTinyThoughts(),
    });
  } catch (error) {
    console.error("Tiny thoughts GET failed", error);
    return Response.json(
      { error: "Tiny thoughts are temporarily unavailable." },
      { status: 500 },
    );
  }
}
