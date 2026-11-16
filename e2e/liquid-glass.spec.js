import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ viewport: { width: 1440, height: 900 } });

test("glass surfaces refract, and the hover lens also follows keyboard focus", async ({ page }) => {
  await page.goto("/research");
  const nav = page.locator(".liquid-nav-anchor");
  await expect(nav).toHaveAttribute("data-vaso-root", "");
  await expect
    .poll(() =>
      nav.locator(":scope > [data-vaso]").evaluate((el) => getComputedStyle(el).backdropFilter)
    )
    .toContain("url(");
  const team = nav.getByRole("link", { name: "Team", exact: true });
  await team.focus();
  const lens = nav.locator(".nav-hover-lens__glass");
  await expect(lens).toBeVisible();
  await expect(lens).toHaveAttribute("data-vaso-root", "");
  const community = nav.getByRole("button", { name: "Community", exact: true });
  await community.press("ArrowDown");
  const panel = page.locator(".community-glass");
  await expect(panel).toHaveAttribute("data-vaso-root", "");
  const results = await new AxeBuilder({ page })
    .include(".liquid-nav-anchor")
    .include(".community-glass")
    .include(".site-shortcuts")
    .disableRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole("menuitem", { name: "News", exact: true }).click();
  await expect(page).toHaveURL(/\/community\/news$/);
  await expect(page.getByRole("menu", { name: "Community" })).toHaveCount(0);
});

test("hero glass swells on press, changes its lens while moving and settles on release", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const button = page.locator(".liquid-github-anchor a");
  const glass = page.locator(".liquid-github-anchor .shortcut-glass > [data-vaso]");
  const scale = () =>
    glass.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  const box = await button.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(scale).toBeGreaterThan(1.02);
  const initial = await glass.evaluate((el) =>
    el.nextElementSibling?.querySelector("feImage")?.getAttribute("href")
  );
  await page.mouse.move(box.x + box.width / 2 + 16, box.y + box.height / 2, { steps: 5 });
  await expect
    .poll(() =>
      glass.evaluate((el) => el.nextElementSibling?.querySelector("feImage")?.getAttribute("href"))
    )
    .not.toBe(initial);
  await page.mouse.move(5, 700);
  await page.mouse.up();
  await expect.poll(scale).toBeCloseTo(1, 3);
});

test("ecosystem glass link preserves client routing and native new-tab behavior", async ({
  page,
  context,
}) => {
  await page.goto("/research");
  await page.evaluate(() => {
    document.documentElement.dataset.glassNavigation = "same-document";
  });
  const ecosystem = page.locator(".liquid-ecosystem-anchor a");
  const popupPromise = context.waitForEvent("page");
  await ecosystem.click({ button: "middle" });
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\/#ecosystem$/);
  await popup.close();
  await ecosystem.click();
  await expect(page).toHaveURL(/\/#ecosystem$/);
  await expect(page.locator("html")).toHaveAttribute("data-glass-navigation", "same-document");
});

test("reduced transparency gives the glass an opaque fallback and preserves navigation", async ({
  page,
  context,
}) => {
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-transparency", value: "reduce" },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });
  await page.goto("/research");
  const nav = page.locator(".liquid-nav-anchor");
  const glass = nav.locator(":scope > [data-vaso]");
  await expect(glass).toHaveCSS("backdrop-filter", "none");
  await expect(glass).toHaveCSS("background-color", "rgb(32, 40, 48)");
  await nav.getByRole("link", { name: "Team", exact: true }).click();
  await expect(page).toHaveURL(/\/team$/);
  await expect(nav).toBeVisible();
});
