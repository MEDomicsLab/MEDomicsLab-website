import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";
import theme from "../src/data/theme.json" with { type: "json" };

const path = "/this-route-does-not-exist";
const blue = theme.cssVars["--tertiary"];

test.use({ viewport: { width: 1440, height: 1000 } });

test("404 keeps the full-screen pointer trail with homepage-blue digits", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(path);
  const trail = page.locator(".text-trail");
  await expect(trail).toHaveAttribute("data-animated", "true");
  await expect(page.locator(".neue-interior-layout")).toHaveCSS(
    "background-color",
    "rgb(26, 26, 26)"
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "font-family",
    '"Homepage Neue Montreal", sans-serif'
  );
  await expect(page.getByRole("link", { name: "Return home" })).toHaveCSS(
    "color",
    "rgb(240, 231, 212)"
  );
  const box = await trail.boundingBox();
  expect(box.x).toBe(0);
  expect(box.y).toBe(0);
  expect(box.width).toBe(1440);
  expect(box.height).toBeGreaterThanOrEqual(1000);
  expect(await trail.evaluate((el) => el.style.color)).toBe("rgb(60, 82, 128)");

  const first = await sharp(await trail.screenshot())
    .removeAlpha()
    .raw()
    .toBuffer();
  const rgb = blue.match(/\w\w/g).map((value) => Number.parseInt(value, 16));
  let bluePixels = 0;
  for (let i = 0; i < first.length; i += 3) {
    if (rgb.every((value, channel) => first[i + channel] === value)) bluePixels += 1;
  }
  expect(bluePixels).toBeGreaterThan(50000);
  await page.mouse.move(box.width - 60, 160);
  await page.waitForTimeout(700);
  const second = await sharp(await trail.screenshot())
    .removeAlpha()
    .raw()
    .toBuffer();
  let changedPixels = 0;
  for (let i = 0; i < first.length; i += 3) {
    if (Math.abs(first[i + 2] - second[i + 2]) > 8) changedPixels += 1;
  }
  expect(changedPixels).toBeGreaterThan(1000);
  expect(errors).toEqual([]);
});

test("reduced motion uses static blue digits and supports live preference changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  const trail = page.locator(".text-trail");
  await expect(trail.locator("canvas")).toHaveCount(0);
  await expect(trail.locator(".text-trail-static")).toBeVisible();
  await expect(trail).toHaveCSS("color", "rgb(60, 82, 128)");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(trail).toHaveAttribute("data-animated", "true");
  await expect(trail.locator("canvas")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(trail.locator("canvas")).toHaveCount(0);
  await expect(trail.locator(".text-trail-static")).toBeVisible();
});

test("unavailable WebGL keeps a usable static 404 and reports the fallback", async ({ page }) => {
  const messages = [];
  page.on("console", (message) => messages.push(message.text()));
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
      return getContext.call(this, type, ...args);
    };
  });
  await page.goto(path);
  await expect(page.locator(".text-trail-static")).toBeVisible();
  await expect(page.locator(".text-trail canvas")).toHaveCount(0);
  await expect
    .poll(() => messages.some((message) => message.includes("Showing static text.")))
    .toBe(true);
  await page.getByRole("link", { name: "Return home" }).click();
  await expect(page).toHaveURL("/");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("404 fits small screens, has an accessible home link and survives history navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
      .toBeLessThanOrEqual(1);
    const home = page.getByRole("link", { name: "Return home" });
    const box = await home.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await home.focus();
    await expect(home).toHaveCSS("outline-style", "solid");
    await expect(home).toHaveCSS("cursor", "pointer");
  }
  await expect(page.locator(".not-found-art")).toHaveAttribute("aria-hidden", "true");
  const results = await new AxeBuilder({ page })
    .include(".not-found-copy")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole("link", { name: "Return home" }).click();
  await expect(page).toHaveURL("/");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.goBack();
  await expect(page).toHaveURL(path);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("leaving before font loading finishes does not revive a disposed WebGL canvas", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const load = document.fonts.load.bind(document.fonts);
    window.finishTrailFont = () => {};
    document.fonts.load = (font, text) => {
      if (font === '600 64px "Homepage Neue Montreal"') {
        return new Promise((resolve) => {
          window.finishTrailFont = () => load(font, text).then(resolve);
        });
      }
      return load(font, text);
    };
  });
  await page.goto(path);
  await expect(page.locator(".text-trail canvas")).toHaveCount(1);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Research", exact: true })
    .click();
  await page.evaluate(() => window.finishTrailFont());
  await expect(page).toHaveURL("/research");
  await expect(page.locator(".text-trail")).toHaveCount(0);
  expect(errors).toEqual([]);
});
