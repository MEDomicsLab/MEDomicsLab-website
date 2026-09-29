import { expect, test } from "@playwright/test";

const mainLinks = [
  ["Home", "/"],
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
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test("renders the configured primary links and keeps the bar fixed while scrolling", async ({
    page,
  }) => {
    await page.goto("/");

    const navigation = page.getByRole("navigation", { name: "Main navigation" });
    await expect(navigation).toBeVisible();

    for (const [label, href] of mainLinks) {
      await expect(navigation.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }

    await expect(navigation.getByRole("button", { name: "Visions" })).toBeDisabled();
    await expect(navigation.getByRole("button", { name: "Visions" })).toHaveCSS(
      "cursor",
      "not-allowed"
    );
    await navigation.getByRole("link", { name: "Research" }).hover();
    await expect(navigation.locator('[data-slot="motion-highlight"]')).toBeVisible();
    await page.mouse.move(0, 200);
    await expect.poll(async () => (await navigation.boundingBox())?.y).toBeCloseTo(30, 1);

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

      await page.evaluate(() => window.scrollTo(0, 120));

      const navigation = page.getByRole("navigation", { name: "Main navigation" });
      const brand = page.getByRole("link", { name: "MEDomicsLab homepage", exact: true });
      await expect(navigation).toBeVisible();
      await expect(brand).toBeVisible();
      for (const [label] of mainLinks) {
        await expect(navigation.getByRole("link", { name: label })).toBeVisible();
      }
      await expect(page.getByRole("button", { name: "Community" })).toBeVisible();
      await expect.poll(async () => (await brand.boundingBox())?.y).toBeCloseTo(16, 1);

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
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete");

    const communityButton = page.getByRole("button", { name: "Community" });
    const menu = page.getByRole("menu");
    await communityButton.press("ArrowDown");
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

  test("GitHub and Community share immediate opening and matching close delays", async ({
    page,
  }) => {
    await page.goto("/research");
    await page.evaluate(() => document.fonts.ready);
    await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
    await page.clock.pauseAt(new Date("2026-01-01T00:00:10Z"));

    for (const [trigger, menuName] of [
      [page.getByRole("button", { name: "Community", exact: true }), "Community"],
      [page.getByRole("link", { name: "GitHub", exact: true }), "MEDomicsLab apps"],
    ]) {
      const menu = page.getByRole("menu", { name: menuName, exact: true });
      await trigger.hover();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await page.clock.runFor(60);
      await page.mouse.move(0, 700);
      await page.clock.runFor(999);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await page.clock.runFor(1);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      await trigger.hover();
      await page.clock.runFor(60);
      await menu.hover();
      await page.clock.runFor(1000);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await page.mouse.move(0, 700);
      await page.clock.runFor(399);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await page.clock.runFor(1);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    }
  });

  for (const path of ["/", "/research", "/community/news"]) {
    test(`dropdown links use homepage beige for hover and keyboard focus on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      for (const [trigger, name] of [
        [page.getByRole("button", { name: "Community" }), "Community"],
        [page.getByRole("link", { name: "GitHub", exact: true }), "MEDomicsLab apps"],
      ]) {
        await expect(trigger).toHaveCSS("cursor", "pointer");
        await trigger.hover();
        const menu = page.getByRole("menu", { name, exact: true });
        const item = menu.getByRole("menuitem").first();
        await item.hover();
        await expect(item).toHaveCSS("color", "rgb(240, 231, 212)");
        await expect(item).toHaveCSS("cursor", "pointer");
        await page.mouse.move(0, 300);
        await trigger.press("ArrowDown");
        await expect(item).toBeFocused();
        await expect(item).toHaveCSS("color", "rgb(240, 231, 212)");
        await page.keyboard.press("Escape");
        await expect(menu).toBeHidden();
      }
    });
  }
});

test.describe("phone GitHub menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: "reduce" });

  test("shows the labelled pill below navigation and opens the organization only on the second tap", async ({
    page,
    context,
  }) => {
    await context.route("https://github.com/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "GitHub organization" })
    );
    for (const path of ["/", "/research"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const trigger = page.getByRole("link", { name: "GitHub", exact: true });
      const menu = page.getByRole("menu", { name: "MEDomicsLab apps", exact: true });
      await expect(trigger).toBeVisible();
      const nav = await page.locator(".liquid-nav-anchor").boundingBox();
      const pill = await page.locator(".liquid-github-anchor").boundingBox();
      expect(pill.y).toBeGreaterThan(nav.y + nav.height);
      expect(pill.x + pill.width / 2).toBeCloseTo(195, 0);
      expect(pill.width).toBeGreaterThan(90);
      await trigger.tap();
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(trigger.locator(".github-slide__arrow")).toHaveCSS("opacity", "1");
      expect(context.pages()).toHaveLength(1);
      await page.locator(".neue-hero-description, .interior-page-title, h1").last().tap();
      await expect(menu).toBeHidden();
      await trigger.tap();
      await expect(menu).toBeVisible();
      const popupPromise = page.waitForEvent("popup");
      await trigger.tap();
      const popup = await popupPromise;
      await expect(popup).toHaveURL("https://github.com/MEDomicsLab");
      await popup.close();
    }
  });
});
