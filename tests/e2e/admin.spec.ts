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

async function seedSessionDraft(page: Page, key: string, value: unknown) {
  await page.addInitScript(
    ({ draftKey, draftValue }) => {
      window.sessionStorage.setItem(draftKey, JSON.stringify(draftValue));
    },
    { draftKey: key, draftValue: value },
  );
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
  await expect(
    page.getByRole("link", { name: "Open Error Previews" }),
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

test("content inbox now drafts import into the now editor", async ({ page }) => {
  await seedSessionDraft(page, "arcadeghosts-now-draft", {
    label: "Current",
    title: "AI Connections",
    text: "A note about how AI tools connect ideas.",
  });
  await loginAsAdmin(page);

  await page.goto("/admin/now");

  await expect(page.getByLabel("Title").last()).toHaveValue("AI Connections");
  await expect(page.getByLabel("Text").last()).toHaveValue("A note about how AI tools connect ideas.");
  await expect(
    page.getByText("Imported draft from Content Inbox. Save changes when you're ready."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Changes" })).toBeVisible();
});

test("content inbox project drafts import into the projects editor", async ({ page }) => {
  await seedSessionDraft(page, "arcadeghosts-project-draft", {
    title: "Imported Project Draft",
    type: "Project update",
    description: "Imported from Content Inbox.",
    phase: "Phase 0",
  });
  await loginAsAdmin(page);

  await page.goto("/admin/projects");

  await expect(page.getByRole("button", { name: "Collapse" })).toBeVisible();
  await expect(page.getByLabel("Title").last()).toHaveValue("Imported Project Draft");
  await expect(
    page.getByText("Imported draft from Content Inbox. Refine it, then save when ready."),
  ).toBeVisible();
});

test("content inbox tiny thought drafts import into the tiny thoughts editor", async ({ page }) => {
  await seedSessionDraft(page, "arcadeghosts-tiny-thought-draft", {
    content: "AI connections keep turning into site ideas.",
    category: "other",
    inspiredByCategory: "conversation",
    inspiredBy: "ChatGPT",
  });
  await loginAsAdmin(page);

  await page.goto("/admin/tiny-thoughts");

  await expect(page.getByLabel("Thought")).toHaveValue("AI connections keep turning into site ideas.");
  await expect(
    page.getByText("Imported draft from Content Inbox. Edit it, then save when it feels right."),
  ).toBeVisible();
});

test("content inbox writing drafts import into the writing drafts editor", async ({ page }) => {
  await seedSessionDraft(page, "arcadeghosts-writing-draft", {
    title: "AI Connections",
    slug: "ai-connections",
    summary: "A note about how AI tools connect ideas.",
    body: "Longer-form draft body.",
    status: "draft",
  });
  await loginAsAdmin(page);

  await page.goto("/admin/writing-drafts");

  await expect(page.getByLabel("Title")).toHaveValue("AI Connections");
  await expect(page.getByLabel("Slug")).toHaveValue("ai-connections");
  await expect(page.getByLabel("Body")).toHaveValue("Longer-form draft body.");
  await expect(
    page.getByText("Imported draft from Content Inbox. Shape it, then save when ready."),
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
  await expect(
    page.getByRole("button", {
      name: /Save Static Profile|Static Profile Saved/,
    }),
  ).toBeVisible();
  await expect(page.getByText("Memory Core")).toBeVisible();

  await page
    .getByRole("button", { name: "Create ChatGPT Context Refresh File" })
    .click();

  await expect(
    page.getByText("Context refresh export created from the saved static profile and site data."),
  ).toBeVisible();
  await expect(
    page.getByLabel("Markdown + YAML front matter"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
});

test("authenticated admin can open error previews", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/error-previews");

  await expect(
    page.getByRole("heading", { name: "Error Previews" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open 404 Preview" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open 500 Preview" }),
  ).toBeVisible();
});
