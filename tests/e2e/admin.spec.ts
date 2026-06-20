import { expect, test, type Page } from "@playwright/test";
import { getAdminCredentials } from "./helpers/admin-env";

async function loginAsAdmin(page: Page) {
  const credentials = getAdminCredentials();

  test.skip(
    !credentials.username || !credentials.password,
    "Admin credentials are not configured for e2e login coverage.",
  );

  await page.goto("/admin");
  await page.getByLabel("Username").fill(credentials.username);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(
    page.getByText("Signed in. Choose an admin tool."),
  ).toBeVisible();
}

test("admin dashboard supports sign in and sign out", async ({ page }) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Dashboard" }),
  ).toBeVisible();
  await expect(
    page.getByText("Sign in once to manage the site."),
  ).toBeVisible();

  await loginAsAdmin(page);

  await expect(
    page.getByRole("link", { name: "Open Guestbook Review" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open Tiny Thoughts" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Log Out" }).click();

  await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
  await expect(page.getByText("Signed out.")).toBeVisible();
});

test("authenticated admin can open guestbook review", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/guestbook");

  await expect(
    page.getByRole("heading", { name: "Guestbook Review" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Log Out" })).toBeVisible();
});

test("authenticated admin can open projects editor", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/projects");

  await expect(
    page.getByRole("heading", { name: "Edit Projects" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add Project" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Expand" }).first()).toBeVisible();
  await expect(
    page.getByText(/^Projects loaded\.$|^No projects yet\.$/),
  ).toBeVisible();

  const firstExpandButton = page.getByRole("button", { name: "Expand" }).first();
  await firstExpandButton.click();
  await expect(page.getByLabel("Title").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Project" }).first()).toBeVisible();
});

test("authenticated admin can open now editor", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/now");

  await expect(
    page.getByRole("heading", { name: "Edit Now" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add Now Card" })).toBeVisible();
  await expect(page.getByLabel("Title").first()).toBeVisible();
  await expect(
    page.getByText(/^Now cards loaded\.$|^No Now cards yet\.$/),
  ).toBeVisible();
});

test("authenticated admin can create a context refresh export", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/context-refresh");

  await expect(
    page.getByRole("heading", { name: "Context Refresh Export" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Log Out" })).toBeVisible();
  await expect(
    page.getByLabel("Redact sensitive fields"),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Create ChatGPT Context Refresh File" })
    .click();

  await expect(
    page.getByText(
      "Context refresh export created. Edit the Markdown, then save when ready.",
    ),
  ).toBeVisible();
  await expect(
    page.getByLabel("Markdown + YAML front matter"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
});
