import {
  ensureTinyThoughtsTable,
  toTinyThought,
  type TinyThoughtRow,
} from "../../lib/tiny-thoughts";
import { getGuestbookSql } from "../../lib/guestbook";

export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureTinyThoughtsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      SELECT
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
      FROM tiny_thoughts
      ORDER BY created_at DESC
      LIMIT 24
    `;

    return Response.json({
      thoughts: (rows as TinyThoughtRow[]).map(toTinyThought),
    });
  } catch (error) {
    console.error("Tiny thoughts GET failed", error);
    return Response.json(
      { error: "Tiny thoughts are temporarily unavailable." },
      { status: 500 },
    );
  }
}
