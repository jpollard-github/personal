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
      name: "Recent changes worth noticing.",
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

test("homepage build log preview links to the full build log", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Open the full build log" }).click();

  await expect(page).toHaveURL(/\/build-log$/);
  await expect(
    page.getByRole("heading", { name: "What changed behind the curtain." }),
  ).toBeVisible();
});

test("homepage terminal shows help and project link output", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("80s Dev Terminal"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "RESET" }),
  ).toBeVisible();
  await expect(
    page.getByText("Type help for commands."),
  ).toBeVisible();
  await expect(
    page.getByText("currently exploring: AI tools, VS Code extensions, weird web toys"),
  ).toBeVisible();

  const terminalInput = page.getByLabel("Terminal command");

  await terminalInput.fill("help");
  await terminalInput.press("Enter");

  await expect(
    page.getByText("Available commands:"),
  ).toBeVisible();
  await expect(
    page.getByText("help  reset  hello  projects  about  music  cats  arcade  contact"),
  ).toBeVisible();

  await terminalInput.fill("hello");
  await terminalInput.press("Enter");

  await expect(
    page.getByText(/^hello$/),
  ).toBeVisible();

  await terminalInput.fill("projects");
  await terminalInput.press("Enter");

  const projectLink = page.getByRole("link", { name: "Open projects in a new tab" });
  await expect(projectLink).toBeVisible();
  await expect(projectLink).toHaveAttribute("target", "_blank");
  await expect(projectLink).toHaveAttribute("href", "/#projects");

  await page.getByRole("button", { name: "Reset" }).click();

  const terminal = page.getByRole("region", { name: "80s developer terminal" });

  await expect(
    terminal.getByText("Jason Pollard", { exact: true }),
  ).toBeVisible();
  await expect(
    terminal.getByText("Project archive loaded."),
  ).not.toBeVisible();
});
