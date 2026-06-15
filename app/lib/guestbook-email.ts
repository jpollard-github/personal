import { Resend } from "resend";
import type { GuestbookCategory } from "./guestbook";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

export async function sendGuestbookEmail({
  name,
  email,
  category,
  message,
}: {
  name: string;
  email: string;
  category: GuestbookCategory;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.GUESTBOOK_EMAIL_FROM;
  const to = process.env.GUESTBOOK_EMAIL_TO ?? "jason@arcadeghosts.org";
  const adminLink = process.env.ADMIN_LINK?.trim() ?? "";

  if (!apiKey || !from) {
    return false;
  }

  const resend = new Resend(apiKey);
  const sender = name || "Mystery visitor";
  const textLines = [
    "A new guestbook signal is waiting for approval.",
    adminLink ? `Review it here: ${adminLink}` : "",
    "",
    `From: ${sender}`,
    email ? `Email: ${email}` : "Email: not provided",
    `Category: ${category}`,
    "",
    message,
  ].filter((line, index, lines) => line || lines[index - 1] !== "");
  const html = [
    "<p>A new guestbook signal is waiting for approval.</p>",
    adminLink
      ? `<p><a href="${escapeHtml(adminLink)}">Open the admin dashboard</a></p>`
      : "",
    "<dl>",
    `<dt>From</dt><dd>${escapeHtml(sender)}</dd>`,
    `<dt>Email</dt><dd>${email ? escapeHtml(email) : "not provided"}</dd>`,
    `<dt>Category</dt><dd>${escapeHtml(category)}</dd>`,
    "</dl>",
    `<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
  ].join("");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject: `New ArcadeGhosts guestbook note: ${category}`,
      text: textLines.join("\n"),
      html,
    });

    if (error) {
      console.error("Guestbook email failed", error);
      return false;
    }
  } catch (error) {
    console.error("Guestbook email failed", error);
    return false;
  }

  return true;
}
