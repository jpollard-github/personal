import { expect, test } from "@playwright/test";

test("homepage renders the hero and key sections", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await expect(
    page.getByRole("heading", {
      name: "Useful tools with a strange little heartbeat.",
    }),
  ).toBeVisible();
  await expect(
    mainNav.getByRole("link", { name: "Work With Me", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "What I'm building and thinking about.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Shipped, active, paused, and becoming.",
    }),
  ).toBeVisible();
});

test("homepage navigation reaches the work page", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await mainNav.getByRole("link", { name: "Work With Me", exact: true }).click();

  await expect(page).toHaveURL(/\/work-with-me$/);
  await expect(
    page.getByRole("heading", {
      name: "Small projects. Clear problems. Personal attention.",
    }),
  ).toBeVisible();
});
