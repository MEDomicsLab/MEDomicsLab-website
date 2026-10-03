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

      await page.evaluate(() => window.scrollTo(0, 400));

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
      expect(brandBox.x + brandBox.width / 2).toBeCloseTo(width / 2, 0);
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

  test("Community opens immediately and preserves its trigger and menu close delays", async ({
    page,
  }) => {
    await page.goto("/research");
    await page.evaluate(() => document.fonts.ready);
    await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
    await page.clock.pauseAt(new Date("2026-01-01T00:00:10Z"));

    const trigger = page.getByRole("button", { name: "Community", exact: true });
    const menu = page.getByRole("menu", { name: "Community", exact: true });
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
  });

  for (const path of ["/", "/research", "/community/news"]) {
    test(`dropdown links use homepage beige for hover and keyboard focus on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      const trigger = page.getByRole("button", { name: "Community", exact: true });
      await expect(trigger).toHaveCSS("cursor", "pointer");
      await trigger.hover();
      const menu = page.getByRole("menu", { name: "Community", exact: true });
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
    });
  }
});

test.describe("navigation shortcuts", () => {
  test.use({ reducedMotion: "reduce" });

  for (const width of [320, 390, 768, 1200, 1440]) {
    test(`both shortcuts fit and GitHub opens on the first press at ${width}px`, async ({
      page,
      context,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await context.route("https://github.com/**", (route) =>
        route.fulfill({ contentType: "text/html", body: "GitHub organization" })
      );
      for (const path of ["/", "/research"]) {
        await page.goto(path);
        if (path === "/") await page.keyboard.press("Escape");
        await page.evaluate(() => document.fonts.ready);
        await page.mouse.move(0, 600);
        const github = page.locator(".site-shortcuts").getByRole("link", {
          name: path === "/" ? "GitHub Organization" : "GitHub",
          exact: true,
        });
        const ecosystem = page.getByRole("link", { name: "MEDomics Ecosystem", exact: true });
        await expect(ecosystem).toHaveAttribute("href", "/#ecosystem");
        await expect(github).not.toHaveAttribute("aria-haspopup");
        await expect
          .poll(async () => {
            const last = await page.locator(".liquid-ecosystem-anchor").boundingBox();
            return last.x + last.width;
          })
          .toBeLessThanOrEqual(width);
        const nav = await page.locator(".liquid-nav-anchor").boundingBox();
        const first = await page.locator(".liquid-github-anchor").boundingBox();
        const last = await page.locator(".liquid-ecosystem-anchor").boundingBox();
        expect(first.height).toBeGreaterThanOrEqual(44);
        expect(nav.x + nav.width / 2).toBeCloseTo(width / 2, 0);
        if (path === "/") {
          const film = await page.locator(".neue-hero-film").boundingBox();
          expect((first.x + last.x + last.width) / 2).toBeCloseTo(film.x + film.width / 2, 0);
          expect(last.y).toBeCloseTo(first.y, 0);
          expect(first.x + first.width).toBeLessThan(last.x);
          if (width <= 767) {
            expect(first.y).toBeCloseTo(film.y + film.height + 16, 0);
            expect(first.x).toBeGreaterThan(0);
            expect(first.height).toBeGreaterThanOrEqual(54);
          } else {
            expect(first.y + first.height / 2).toBeCloseTo(film.y + film.height / 2, 0);
            expect(first.x).toBeGreaterThan(film.x);
            expect(last.x + last.width).toBeLessThan(film.x + film.width);
            expect(first.height).toBeGreaterThanOrEqual(64);
          }
        } else if (width <= 767) {
          expect(first.x + first.width / 2).toBeCloseTo(width / 2, 0);
          expect(last.x + last.width / 2).toBeCloseTo(width / 2, 0);
          expect(last.y + last.height).toBeCloseTo(900 - 16, 0);
          expect(last.y - first.y - first.height).toBeCloseTo(8, 0);
          expect(first.width).toBeLessThan(95);
        } else {
          expect(first.x + first.width).toBeCloseTo(width - 24, 0);
          expect(last.x + last.width).toBeCloseTo(width - 24, 0);
          expect(last.y - first.y - first.height).toBeCloseTo(8, 0);
        }
        await github.hover();
        await expect(page.getByRole("menu", { name: "MEDomicsLab apps" })).toHaveCount(0);
        const popupPromise = page.waitForEvent("popup");
        await github.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL("https://github.com/MEDomicsLab");
        await popup.close();
      }
    });
  }
});

test.describe("phone shortcut activity", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("fades both shortcuts to 40% when idle and restores them on scroll or focus", async ({
    page,
    context,
  }) => {
    await context.route("https://github.com/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "GitHub organization" })
    );
    test.setTimeout(60_000);
    await page.goto("/research");
    const shortcuts = page.locator(".liquid-action-anchor");
    for (const shortcut of await shortcuts.all()) {
      await expect(shortcut).toHaveCSS("--glass-opacity", "0.4", { timeout: 8000 });
    }
    await page.evaluate(() => window.scrollTo(0, 300));
    for (const shortcut of await shortcuts.all())
      await expect(shortcut).toHaveCSS("--glass-opacity", "1");
    for (const shortcut of await shortcuts.all()) {
      await expect(shortcut).toHaveCSS("--glass-opacity", "0.4", { timeout: 8000 });
    }
    const ecosystem = page.getByRole("link", { name: "MEDomics Ecosystem", exact: true });
    await ecosystem.focus();
    await expect(page.locator(".liquid-action-anchor:has(.liquid-ecosystem-anchor)")).toHaveCSS(
      "--glass-opacity",
      "1"
    );
    await page.waitForTimeout(7100);
    await expect(page.locator(".liquid-action-anchor:has(.liquid-ecosystem-anchor)")).toHaveCSS(
      "--glass-opacity",
      "1"
    );
    await ecosystem.blur();
    await expect(page.locator(".liquid-action-anchor:has(.liquid-github-anchor)")).toHaveCSS(
      "--glass-opacity",
      "0.4",
      {
        timeout: 8000,
      }
    );
    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "GitHub", exact: true }).tap();
    const popup = await popupPromise;
    await expect(popup).toHaveURL("https://github.com/MEDomicsLab");
    await popup.close();
    await ecosystem.tap();
    await expect(page).toHaveURL(/\/#ecosystem$/);
    await expect
      .poll(() =>
        page.locator("#ecosystem").evaluate((el) => Math.abs(el.getBoundingClientRect().top))
      )
      .toBeLessThan(2);
    for (const shortcut of await shortcuts.all()) {
      await expect(shortcut).toHaveCSS("--glass-opacity", "0.4", { timeout: 8000 });
    }
  });
});

for (const width of [390, 768, 1440]) {
  test(`shortcuts wait five seconds before fading at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/research");
    await page.evaluate(() => document.fonts.ready);
    await page.clock.install({ time: new Date("2026-10-02T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-02T12:00:01Z"));
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    const shortcuts = page.locator(".liquid-action-anchor");
    await page.clock.fastForward(4999);
    for (const shortcut of await shortcuts.all()) await expect(shortcut).not.toHaveClass(/is-idle/);
    await page.clock.fastForward(1);
    for (const shortcut of await shortcuts.all())
      await expect(shortcut).toHaveCSS("--glass-opacity", "0.4");
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    for (const shortcut of await shortcuts.all())
      await expect(shortcut).toHaveCSS("--glass-opacity", "1");
  });
}

test("both shortcuts use the same icon, label and arrow hover animation", async ({ page }) => {
  await page.goto("/research");
  for (const label of ["GitHub", "MEDomics Ecosystem"]) {
    const shortcut = page.getByRole("link", { name: label, exact: true });
    await shortcut.hover();
    await expect(shortcut.locator(".nav-action-slide__icon")).toHaveCSS("opacity", "0");
    await expect(shortcut.locator(".nav-action-slide__arrow")).toHaveCSS("opacity", "1");
    await expect(shortcut.locator(".nav-action-slide__text")).not.toHaveCSS("transform", "none");
    await page.mouse.move(0, 600);
    await expect(shortcut.locator(".nav-action-slide__icon")).toHaveCSS("opacity", "1");
    await expect(shortcut.locator(".nav-action-slide__arrow")).toHaveCSS("opacity", "0");
  }
});

for (const width of [390, 1100, 1440]) {
  test(`hero shortcuts stay visible, dock on scroll and return to the film at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(0, 600);
    await page.clock.install({ time: new Date("2026-10-02T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-10-02T12:00:01Z"));
    const shortcuts = page.locator(".liquid-action-anchor");
    await page.clock.fastForward(8000);
    for (const shortcut of await shortcuts.all()) {
      await expect(shortcut).not.toHaveClass(/is-idle/);
      await expect(shortcut).toHaveCSS("--glass-opacity", "1");
    }
    const initial = await page.locator(".liquid-github-anchor").boundingBox();
    await page.evaluate(() => window.scrollTo(0, 160));
    await page.clock.runFor(100);
    const midway = await page.locator(".liquid-github-anchor").boundingBox();
    const mobile = width <= 767;
    expect(midway.x).toBeGreaterThan(initial.x);
    if (mobile) expect(midway.y).toBeGreaterThan(initial.y);
    else expect(midway.y).toBeLessThan(initial.y);
    await page.evaluate(() =>
      window.scrollTo(0, document.querySelector(".neue-hero").offsetHeight * 0.38 - 1)
    );
    await page.clock.runFor(100);
    const arriving = await page.locator(".liquid-github-anchor").boundingBox();
    expect(arriving.height).toBeLessThan(initial.height);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.clock.runFor(100);
    await expect(page.getByRole("link", { name: "GitHub", exact: true })).toBeVisible();
    const first = await page.locator(".liquid-github-anchor").boundingBox();
    const last = await page.locator(".liquid-ecosystem-anchor").boundingBox();
    expect(first.y).toBeCloseTo(arriving.y, 0);
    if (mobile) {
      expect(first.x + first.width / 2).toBeCloseTo(width / 2, 0);
      expect(last.x + last.width / 2).toBeCloseTo(width / 2, 0);
      expect(last.y + last.height).toBeCloseTo(900 - 16, 0);
    } else {
      expect(first.x + first.width).toBeCloseTo(width - 24, 0);
      expect(last.x + last.width).toBeCloseTo(first.x + first.width, 0);
    }
    expect(last.y - first.y - first.height).toBeCloseTo(8, 0);
    await page.clock.fastForward(5100);
    for (const shortcut of await shortcuts.all()) await expect(shortcut).toHaveClass(/is-idle/);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.clock.runFor(200);
    await expect(
      page
        .locator(".site-shortcuts")
        .getByRole("link", { name: "GitHub Organization", exact: true })
    ).toBeVisible();
    const returned = await page.locator(".liquid-github-anchor").boundingBox();
    expect(returned.x).toBeCloseTo(initial.x, 0);
    expect(returned.y).toBeCloseTo(initial.y, 0);
    for (const shortcut of await shortcuts.all()) await expect(shortcut).not.toHaveClass(/is-idle/);
  });
}
