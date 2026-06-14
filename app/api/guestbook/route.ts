import { createHash, randomUUID } from "crypto";
import {
  ensureGuestbookTable,
  getGuestbookSql,
  guestbookCategories,
  toGuestbookEntry,
  type GuestbookCategory,
  type GuestbookRow,
} from "../../lib/guestbook";

export const runtime = "nodejs";

const maxMessageLength = 500;
const maxNameLength = 80;
const maxEmailLength = 160;
const maxSubmissionsPerHour = 5;

function normalizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ");
}

function cleanText(value: unknown, maxLength: number) {
  return normalizeText(value).slice(0, maxLength);
}

function isGuestbookCategory(value: string): value is GuestbookCategory {
  return guestbookCategories.includes(value as GuestbookCategory);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();

  return forwardedFor || realIp || vercelIp || "unknown";
}

function hashIp(ip: string) {
  const salt =
    process.env.GUESTBOOK_RATE_LIMIT_SECRET ??
    process.env.ADMIN_PASSWORD ??
    process.env.RESEND_API_KEY ??
    "arcadeghosts-guestbook-rate-limit";

  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

async function enforceRateLimit(sql: ReturnType<typeof getGuestbookSql>, ipHash: string) {
  const rows = await sql`
    INSERT INTO guestbook_rate_limits (ip_hash, window_start, submissions, updated_at)
    VALUES (${ipHash}, now(), 1, now())
    ON CONFLICT (ip_hash) DO UPDATE
    SET
      window_start = CASE
        WHEN guestbook_rate_limits.window_start < now() - interval '1 hour'
          THEN now()
        ELSE guestbook_rate_limits.window_start
      END,
      submissions = CASE
        WHEN guestbook_rate_limits.window_start < now() - interval '1 hour'
          THEN 1
        ELSE guestbook_rate_limits.submissions + 1
      END,
      updated_at = now()
    RETURNING submissions
  `;

  const submissions = Number((rows as { submissions: number }[])[0]?.submissions ?? 1);

  return submissions <= maxSubmissionsPerHour;
}

export async function GET() {
  try {
    await ensureGuestbookTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      SELECT id, name, category, message, created_at
      FROM guestbook_entries
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 24
    `;

    return Response.json({
      entries: (rows as GuestbookRow[]).map(toGuestbookEntry),
    });
  } catch (error) {
    console.error("Guestbook GET failed", error);
    return Response.json(
      { error: "The guestbook is temporarily unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const honeypot = cleanText(body.website, 120);

    if (honeypot) {
      return Response.json({ ok: true, entry: null, emailSent: false });
    }

    const rawName = normalizeText(body.name);
    const name = rawName.slice(0, maxNameLength);
    const rawEmail = cleanText(body.email, maxEmailLength);
    const email = rawEmail && isValidEmail(rawEmail) ? rawEmail : "";
    const categoryValue = cleanText(body.category, 30);
    const category = isGuestbookCategory(categoryValue) ? categoryValue : "other";
    const rawMessage = normalizeText(body.message);
    const message = rawMessage.slice(0, maxMessageLength);
    const notifyOwner = Boolean(body.notifyOwner);

    if (!name) {
      return Response.json(
        { error: "Add a name before sending your signal." },
        { status: 400 },
      );
    }

    if (rawName.length > maxNameLength) {
      return Response.json(
        { error: `Keep your name to ${maxNameLength} characters or fewer.` },
        { status: 400 },
      );
    }

    if (message.length < 3) {
      return Response.json(
        { error: "Leave a little more of a signal before sending." },
        { status: 400 },
      );
    }

    if (rawMessage.length > maxMessageLength) {
      return Response.json(
        { error: `Keep your signal to ${maxMessageLength} characters or fewer.` },
        { status: 400 },
      );
    }

    await ensureGuestbookTable();

    const sql = getGuestbookSql();
    const isAllowed = await enforceRateLimit(sql, hashIp(getClientIp(request)));

    if (!isAllowed) {
      return Response.json(
        { error: "The guestbook can accept 5 submissions per hour. Try again soon." },
        { status: 429 },
      );
    }

    const rows = await sql`
      INSERT INTO guestbook_entries (
        id,
        name,
        email,
        category,
        message,
        notify_owner,
        email_sent,
        status
      )
      VALUES (
        ${randomUUID()},
        ${name},
        ${email || null},
        ${category},
        ${message},
        ${notifyOwner},
        false,
        'pending'
      )
      RETURNING id, name, category, message, created_at
    `;

    return Response.json({
      ok: true,
      entry: toGuestbookEntry((rows as GuestbookRow[])[0]),
      status: "pending",
    });
  } catch (error) {
    console.error("Guestbook POST failed", error);
    return Response.json(
      { error: "The guestbook could not save that signal." },
      { status: 500 },
    );
  }
}
