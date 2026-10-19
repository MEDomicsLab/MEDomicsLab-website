import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test.beforeEach(async ({ page }) => {
  await page.route("https://stream.mux.com/**", (route) => route.abort());
  await page.route("https://api.github.com/**", (route) => route.abort());
});

test("mobile project cards move only while visible and resume from the same place", async ({
  page,
}) => {
  await page.goto("/");
  const rail = page.locator(".neue-marquee");
  const track = page.locator(".neue-marquee-track");
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await rail.scrollIntoViewIfNeeded();
  await expect(track).toHaveCSS("animation-play-state", "running");
  await expect(page.locator('.neue-marquee-set[aria-hidden="true"]')).toBeVisible();
  const start = await track.evaluate((el) => getComputedStyle(el).transform);
  await expect.poll(() => track.evaluate((el) => getComputedStyle(el).transform)).not.toBe(start);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(track).toHaveCSS("animation-play-state", "paused");
  const pausedTime = await track.evaluate((el) => el.getAnimations()[0].currentTime);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  );
  expect(await track.evaluate((el) => el.getAnimations()[0].currentTime)).toBe(pausedTime);
  await rail.scrollIntoViewIfNeeded();
  await expect(track).toHaveCSS("animation-play-state", "running");
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations()[0].currentTime))
    .toBeGreaterThan(pausedTime);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("the shared pause control also stops visible mobile project cards", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause background videos and animations" }).tap();
  await page.locator(".neue-marquee").scrollIntoViewIfNeeded();
  await expect(page.locator(".neue-marquee-track")).toHaveCSS("animation-play-state", "paused");
});

test("reduced motion keeps project cards static and available to swipe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const rail = page.locator(".neue-marquee");
  await rail.scrollIntoViewIfNeeded();
  await expect(page.locator(".neue-marquee-track")).toHaveCSS("animation-name", "none");
  await expect(page.locator('.neue-marquee-set[aria-hidden="true"]')).toBeHidden();
  await rail.evaluate((el) => {
    el.scrollLeft = 300;
  });
  await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
});
