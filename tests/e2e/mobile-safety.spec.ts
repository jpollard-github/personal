import { expect, test } from "@playwright/test";

const mobileWidths = [
  { label: "375px", width: 375, height: 812 },
  { label: "390px", width: 390, height: 844 },
  { label: "430px", width: 430, height: 932 },
] as const;

const routes = [
  "/",
  "/about",
  "/work-with-me",
  "/music",
  "/writings",
  "/search",
  "/arcade",
  "/movies-tv",
  "/tiny-thoughts",
  "/updates",
  "/twin-peaks-self",
  "/cats/beverly-and-lucinda",
  "/cats/thomas-jones-missy-cass",
];

const tapTargetChecks = [
  {
    route: "/",
    selectors: [".nav-links a"],
  },
  {
    route: "/search",
    selectors: [".back-link", ".search-input-wrap input", ".search-quick-link-chip", ".search-result-link"],
  },
  {
    route: "/updates",
    selectors: [".back-link", ".feed-link", ".update-link"],
  },
  {
    route: "/tiny-thoughts",
    selectors: [".back-link", ".feed-link"],
  },
  {
    route: "/writings",
    selectors: [".back-link", ".list-panel a"],
  },
  {
    route: "/twin-peaks-self",
    selectors: [".back-link", ".lodge-actions button", ".lodge-export-actions button"],
  },
  {
    route: "/arcade",
    selectors: [".back-link", ".arcade-card-copy a"],
  },
  {
    route: "/movies-tv",
    selectors: [".back-link", ".media-card-copy > a"],
  },
] as const;

for (const route of routes) {
  test.describe(`mobile safety ${route}`, () => {
    for (const viewport of mobileWidths) {
      test(`has no obvious horizontal overflow at ${viewport.label}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle").catch(() => undefined);

        const overflow = await page.evaluate(() => {
          const viewportWidth = window.innerWidth;
          const rootOverflow = document.documentElement.scrollWidth - viewportWidth;
          const bodyOverflow = document.body.scrollWidth - viewportWidth;

          return {
            viewportWidth,
            rootOverflow,
            bodyOverflow,
          };
        });

        expect(
          overflow.rootOverflow,
          `document overflow detected for ${route} at ${viewport.label} (viewport ${overflow.viewportWidth}px)`,
        ).toBeLessThanOrEqual(1);
        expect(
          overflow.bodyOverflow,
          `body overflow detected for ${route} at ${viewport.label} (viewport ${overflow.viewportWidth}px)`,
        ).toBeLessThanOrEqual(1);
      });
    }
  });
}

for (const check of tapTargetChecks) {
  test.describe(`mobile tap targets ${check.route}`, () => {
    test("keeps primary mobile controls finger-friendly at 390px", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(check.route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => undefined);

      const violations = await page.evaluate((selectors) => {
        const minimumTarget = 40;

        return selectors.flatMap((selector) => {
          const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((element) => {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);

            return (
              rect.width > 0 &&
              rect.height > 0 &&
              styles.visibility !== "hidden" &&
              styles.display !== "none"
            );
          });

          return elements
            .map((element) => {
              const rect = element.getBoundingClientRect();
              const smallerSide = Math.min(rect.width, rect.height);

              return {
                selector,
                width: rect.width,
                height: rect.height,
                smallerSide,
                text: element.textContent?.trim().slice(0, 60) ?? "",
              };
            })
            .filter((entry) => entry.smallerSide < minimumTarget);
        });
      }, [...check.selectors]);

      expect(violations, `small tap targets detected on ${check.route}`).toEqual([]);
    });
  });
}
