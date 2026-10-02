import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({ json: { stargazers_count: 1, forks_count: 1, open_issues_count: 0 } })
  );
});

async function openHome(page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete", {
    timeout: 8000,
  });
}

async function scrollToBottom(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  await page.waitForTimeout(300);
}

async function expectAtTop(page, path) {
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
}

for (const reducedMotion of ["no-preference", "reduce"]) {
  test.describe(`route scrolling with motion: ${reducedMotion}`, () => {
    test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion });

    test("footer links open every new page at the top", async ({ page }) => {
      await openHome(page);
      for (const [label, path] of [
        ["Research", "/research"],
        ["Team", "/team"],
        ["Publications", "/publications"],
        ["News", "/community/news"],
        ["Contact us", "/community/contact"],
        ["Home", "/"],
      ]) {
        await scrollToBottom(page);
        await page.locator("footer").getByRole("link", { name: label, exact: true }).click();
        await expectAtTop(page, path);
      }
    });

    for (const width of [1440, 375]) {
      test(`navbar and back/forward reset settled bottom positions at ${width}px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await openHome(page);
        const navigation = page.getByRole("navigation", { name: "Main navigation" });
        for (const [label, path] of [
          ["Research", "/research"],
          ["Team", "/team"],
        ]) {
          await scrollToBottom(page);
          await navigation.getByRole("link", { name: label, exact: true }).click();
          await expectAtTop(page, path);
        }
        for (const path of ["/research", "/"]) {
          await scrollToBottom(page);
          await page.goBack();
          await expectAtTop(page, path);
        }
        for (const path of ["/research", "/team"]) {
          await scrollToBottom(page);
          await page.goForward();
          await expectAtTop(page, path);
        }
      });
    }

    test("navigation interrupts a smooth scroll without dragging the next page down", async ({
      page,
    }) => {
      await openHome(page);
      await page.mouse.move(100, 400);
      await page.mouse.wheel(0, 3000);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Research", exact: true })
        .click();
      await expectAtTop(page, "/research");
    });

    test("detail links reset the page without breaking in-page section navigation", async ({
      page,
    }) => {
      await page.goto("/team");
      await page
        .locator(".section-ticks")
        .getByRole("button", { name: "2025", exact: true })
        .click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
      await page.locator('[id="year-2025"] .team-profile-link').first().click();
      await expectAtTop(page, "/team/mariem-kallel");
      await page.getByRole("link", { name: "Back to Team", exact: true }).click();
      await expectAtTop(page, "/team");
    });

    test("the ecosystem shortcut reaches its section from another route and on repeat visits", async ({
      page,
    }) => {
      for (const path of ["/research", "/"]) {
        await page.goto(path);
        if (path === "/") await page.keyboard.press("Escape");
        const shortcut = page.getByRole("link", { name: "MEDomics Ecosystem", exact: true });
        await shortcut.click();
        await expect(page).toHaveURL(/\/#ecosystem$/);
        const distance = () =>
          page.locator("#ecosystem").evaluate((el) => Math.abs(el.getBoundingClientRect().top));
        await expect.poll(distance).toBeLessThan(2);
        await page.waitForTimeout(800);
        expect(await distance()).toBeLessThan(2);
        await page.evaluate(() => window.scrollTo(0, 0));
        await shortcut.press("Enter");
        await expect.poll(distance).toBeLessThan(2);
      }
      await page.reload();
      await expect
        .poll(() =>
          page.locator("#ecosystem").evaluate((el) => Math.abs(el.getBoundingClientRect().top))
        )
        .toBeLessThan(2);
    });

    test("the homepage anchor still reaches the lab before navigating to a new page", async ({
      page,
    }) => {
      await openHome(page);
      await page.getByRole("link", { name: /Discover the laboratory/ }).click();
      await expect(page).toHaveURL(/\/#lab$/);
      await expect
        .poll(() => page.locator("#lab").evaluate((el) => el.getBoundingClientRect().top))
        .toBe(0);
      await page.waitForTimeout(800);
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Research", exact: true })
        .click();
      await expectAtTop(page, "/research");
    });
  });
}
