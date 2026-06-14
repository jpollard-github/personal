import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "arcadeghosts_admin";
const sessionValue = "guestbook-admin";

function getAdminUsername() {
  return process.env.ADMIN_USERNAME ?? "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function getAdminToken() {
  const username = getAdminUsername();
  const password = getAdminPassword();

  if (!username || !password) {
    return "";
  }

  return createHmac("sha256", password)
    .update(`${sessionValue}:${username}`)
    .digest("hex");
}

function constantTimeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminUsername() && getAdminPassword());
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();

  if (!expectedUsername || !expectedPassword || !username || !password) {
    return false;
  }

  return (
    constantTimeEquals(username, expectedUsername) &&
    constantTimeEquals(password, expectedPassword)
  );
}

export async function isAdminAuthenticated() {
  const token = getAdminToken();
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(cookieName)?.value ?? "";

  if (!token || !cookieToken) {
    return false;
  }

  return constantTimeEquals(cookieToken, token);
}

export async function setAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(cookieName, getAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(cookieName);
}
