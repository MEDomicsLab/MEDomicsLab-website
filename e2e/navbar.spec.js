import { expect, test } from "@playwright/test";

const mainLinks = [
  ["Home", "/"],
  ["Visions", "/visions"],
  ["Research", "/research"],
  ["Team", "/team"],
  ["Publications", "/publications"],
];

const communityLinks = [
  ["News", "/community/news"],
  ["Events", "/community/events"],
  ["Courses", "/community/courses"],
];

test.describe("main navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("renders the configured primary links and keeps the bar fixed while scrolling", async ({
    page,
  }) => {
    await page.goto("/");

    const navigation = page.getByRole("navigation", { name: "Main navigation" });
    await expect(navigation).toBeVisible();

    for (const [label, href] of mainLinks) {
      await expect(navigation.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }

    await navigation.getByRole("link", { name: "Visions" }).hover();
    await expect(navigation.locator('[data-slot="motion-highlight"]')).toBeVisible();

    const navBox = await navigation.boundingBox();
    expect(navBox).not.toBeNull();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(async () => (await navigation.boundingBox())?.y).toBeCloseTo(navBox.y, 1);
  });

  test("navigates via primary links and exposes the current page", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Team" })
      .click();
    await expect(page).toHaveURL(/\/team$/);

    const teamLink = page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Team" });
    await expect(teamLink).toHaveClass(/text-primary/);
    await expect(teamLink.locator("span")).toBeVisible();
  });

  test("keeps every compact navigation control centred on common mobile widths", async ({
    page,
  }) => {
    for (const width of [320, 375, 390, 414, 430]) {
      await page.setViewportSize({ width, height: 667 });
      await page.goto("/");

      const navigation = page.getByRole("navigation", { name: "Main navigation" });
      const brand = page.getByRole("link", { name: "MEDomicsLab homepage", exact: true });
      await expect(navigation).toBeVisible();
      await expect(brand).toBeVisible();
      for (const [label] of mainLinks) {
        await expect(navigation.getByRole("link", { name: label })).toBeVisible();
      }
      await expect(page.getByRole("button", { name: "Community" })).toBeVisible();

      const navBox = await navigation.boundingBox();
      const brandBox = await brand.boundingBox();
      expect(navBox).not.toBeNull();
      expect(brandBox).not.toBeNull();
      expect(navBox.x + navBox.width / 2).toBeCloseTo(width / 2, 1);
      expect(brandBox.y + brandBox.height).toBeLessThanOrEqual(navBox.y);

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect.poll(async () => (await brand.boundingBox())?.y).toBeCloseTo(brandBox.y, 1);
    }
  });

  test("opens the Community menu on hover, preserves it while the pointer crosses the gap, and closes it", async ({
    page,
  }) => {
    await page.goto("/");

    const communityButton = page.getByRole("button", { name: "Community" });
    const menu = page.getByRole("menu");
    await communityButton.hover();
    await expect(communityButton).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    for (const [label, href] of communityLinks) {
      await expect(menu.getByRole("menuitem", { name: label })).toHaveAttribute("href", href);
    }

    await menu.hover();
    await page.waitForTimeout(1_100);
    await expect(menu).toBeVisible();

    await page.mouse.move(0, 700);
    await expect(menu).toBeHidden({ timeout: 2_000 });
    await expect(communityButton).toHaveAttribute("aria-expanded", "false");
  });

  test("supports keyboard control and retains the animated contact label", async ({ page }) => {
    await page.goto("/");

    const communityButton = page.getByRole("button", { name: "Community" });
    const menu = page.getByRole("menu");
    await communityButton.focus();
    await page.keyboard.press("ArrowDown");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem").first()).toBeFocused();

    const contactLink = menu.getByRole("menuitem", { name: /(?:Reach|Join) US!/ });
    const initialLabel = await contactLink.textContent();
    await page.waitForTimeout(2_100);
    await expect(contactLink).not.toHaveText(initialLabel ?? "");

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(communityButton).toBeFocused();
  });
});
