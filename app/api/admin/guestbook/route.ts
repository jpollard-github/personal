import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { revalidateGuestbookViews } from "../../../lib/admin-revalidation";
import {
  ensureGuestbookTable,
  getGuestbookSql,
  toAdminGuestbookEntry,
  type GuestbookRow,
} from "../../../lib/guestbook";
import { sendGuestbookEmail } from "../../../lib/guestbook-email";

export const runtime = "nodejs";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Admin login required." }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    await ensureGuestbookTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      SELECT id, name, email, category, message, notify_owner, email_sent, status, created_at
      FROM guestbook_entries
      WHERE status IN ('pending', 'approved')
      ORDER BY
        CASE status WHEN 'pending' THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT 50
    `;

    return Response.json({
      entries: (rows as GuestbookRow[]).map(toAdminGuestbookEntry),
    });
  } catch (error) {
    console.error("Admin guestbook GET failed", error);
    return Response.json(
      { error: "Pending guestbook entries are unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const action =
      body.action === "delete" ? "delete" : body.action === "reject" ? "reject" : "approve";

    if (!id) {
      return Response.json({ error: "Missing entry id." }, { status: 400 });
    }

    await ensureGuestbookTable();
    const sql = getGuestbookSql();

    if (action === "delete") {
      const rows = await sql`
        DELETE FROM guestbook_entries
        WHERE id = ${id}
        RETURNING id, name, email, category, message, notify_owner, email_sent, status, created_at
      `;

      if (!rows.length) {
        return Response.json({ error: "Entry was not found." }, { status: 404 });
      }

      revalidateGuestbookViews();

      return Response.json({
        ok: true,
        entry: toAdminGuestbookEntry((rows as GuestbookRow[])[0]),
        deleted: true,
        emailSent: false,
      });
    }

    if (action === "reject") {
      const rows = await sql`
        UPDATE guestbook_entries
        SET status = 'rejected', rejected_at = now()
        WHERE id = ${id} AND status = 'pending'
        RETURNING id, name, email, category, message, notify_owner, email_sent, status, created_at
      `;

      if (!rows.length) {
        return Response.json({ error: "Entry was not pending." }, { status: 404 });
      }

      revalidateGuestbookViews();

      return Response.json({
        ok: true,
        entry: toAdminGuestbookEntry((rows as GuestbookRow[])[0]),
        emailSent: false,
      });
    }

    const pendingRows = await sql`
      SELECT id, name, email, category, message, notify_owner, email_sent, status, created_at
      FROM guestbook_entries
      WHERE id = ${id} AND status = 'pending'
      LIMIT 1
    `;

    if (!pendingRows.length) {
      return Response.json({ error: "Entry was not pending." }, { status: 404 });
    }

    const pendingEntry = toAdminGuestbookEntry((pendingRows as GuestbookRow[])[0]);
    const emailSent = pendingEntry.notifyOwner && !pendingEntry.emailSent
      ? await sendGuestbookEmail({
          name: pendingEntry.name,
          email: pendingEntry.email,
          category: pendingEntry.category,
          message: pendingEntry.message,
        })
      : false;
    const finalEmailSent = pendingEntry.emailSent || emailSent;

    const rows = await sql`
      UPDATE guestbook_entries
      SET status = 'approved', approved_at = now(), email_sent = ${finalEmailSent}
      WHERE id = ${id} AND status = 'pending'
      RETURNING id, name, email, category, message, notify_owner, email_sent, status, created_at
    `;

    revalidateGuestbookViews();

    return Response.json({
      ok: true,
      entry: toAdminGuestbookEntry((rows as GuestbookRow[])[0]),
      emailSent: finalEmailSent,
      emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.GUESTBOOK_EMAIL_FROM),
    });
  } catch (error) {
    console.error("Admin guestbook POST failed", error);
    return Response.json(
      { error: "Guestbook entry could not be moderated." },
      { status: 500 },
    );
  }
}
