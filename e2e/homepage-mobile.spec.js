import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
});

test.beforeEach(async ({ page }) => {
  await page.route("https://stream.mux.com/**", (route) => route.abort());
  await page.route("https://api.github.com/**", (route) => route.abort());
});

test("mobile shares a native 540p player, pauses offscreen, and resumes without replacing it", async ({
  page,
}) => {
  await page.goto("/");
  const player = page.locator("mux-player");
  await expect(player).toHaveCount(1);
  await expect(page.locator(".neue-hero-film mux-player")).toHaveCount(1);
  await expect(page.locator(".neue-video-frame")).toHaveCount(0);
  for (const surface of [
    ".liquid-nav-anchor",
    ".liquid-github-anchor",
    ".liquid-ecosystem-anchor",
  ]) {
    await expect(page.locator(`${surface} .glass__warp`)).toHaveCount(1);
  }
  await expect.poll(() => player.evaluate((el) => Boolean(el.media?.nativeEl))).toBe(true);
  expect(await player.evaluate((el) => el.maxResolution)).toBe("540p");
  await player.evaluate(async (el) => {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 180;
    const context = canvas.getContext("2d");
    const draw = () => {
      context.fillStyle = "rgb(40, 130, 210)";
      context.fillRect(0, 0, 320, 180);
      requestAnimationFrame(draw);
    };
    draw();
    const video = el.media.nativeEl;
    window.mobileFilm = video;
    video.srcObject = canvas.captureStream(24);
    await video.play();
  });
  const pause = page.getByRole("button", { name: "Pause background videos and animations" });
  await expect(pause).toHaveCSS("opacity", "1");
  await pause.tap();
  await expect.poll(() => player.evaluate((el) => el.paused)).toBe(true);
  await page.getByRole("button", { name: "Play background videos and animations" }).tap();
  await expect.poll(() => player.evaluate((el) => el.paused)).toBe(false);
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#lab").offsetTop));
  await expect.poll(() => player.evaluate((el) => el.paused)).toBe(true);

  for (const section of [".neue-reel", ".neue-events", ".neue-hero"]) {
    await page
      .locator(section)
      .evaluate((el) => window.scrollTo(0, el.matches(".neue-hero") ? 0 : el.offsetTop));
    await expect(page.locator(`${section} mux-player`)).toHaveCount(1);
    await expect
      .poll(() => player.evaluate((el) => !el.paused && el.media.nativeEl === window.mobileFilm))
      .toBe(true);
    await expect(player).toHaveCount(1);
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Research", exact: true })
    .tap();
  await expect(page).toHaveURL(/\/research$/);
  await expect(player).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Home", exact: true })
    .tap();
  await expect(page.locator(".neue-hero-film mux-player")).toHaveCount(1);
});

test("mobile keeps the film stable during scroll and restores the original WebGL postcard", async ({
  page,
}) => {
  const scripts = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const film = page.locator(".neue-hero-film");
  const original = await film.boundingBox();
  await page.evaluate(() => window.scrollTo(0, 160));
  await expect.poll(async () => (await film.boundingBox()).width).toBeCloseTo(original.width, 0);
  await expect.poll(async () => (await film.boundingBox()).height).toBeCloseTo(original.height, 0);
  const postcard = page.getByRole("button", { name: "Turn postcard to read our mission" });
  await expect(page.locator(".neue-postcard")).toHaveClass(/is-ready/);
  await expect(page.locator(".neue-postcard canvas")).toHaveCount(1);
  await postcard.tap();
  await expect(page.locator(".neue-postcard")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".neue-postcard-fallback-back")).toContainText(
    "We advance precision medicine"
  );
  await page.locator("#ecosystem").scrollIntoViewIfNeeded();
  const image = page.locator(".neue-ecosystem-app img").first();
  await expect.poll(() => image.evaluate((el) => el.currentSrc)).toMatch(/-(360|720)\.webp$/);
  await expect(page.locator(".neue-reel-reduced")).toBeVisible();
  expect(scripts.some((url) => /LabPostcard/.test(url))).toBe(true);
  expect(scripts.some((url) => /TextTrail/.test(url))).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("mobile reduced motion does not autoplay and can be explicitly enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const play = page.getByRole("button", { name: "Play background videos and animations" });
  await expect(play).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.locator("mux-player").evaluate((el) => el.preload)).toBe("none");
  await expect.poll(() => page.locator("mux-player").evaluate((el) => el.paused)).toBe(true);
  await play.tap();
  await expect(
    page.getByRole("button", { name: "Pause background videos and animations" })
  ).toHaveAttribute("aria-pressed", "false");
  await expect.poll(() => page.locator("mux-player").evaluate((el) => el.preload)).toBe("metadata");
});

for (const reducedMotion of ["no-preference", "reduce"]) {
  test(`mobile title and shortcuts switch instantly after the first screen with ${reducedMotion} motion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const title = page.locator("#home-heading");
    const brand = page.getByRole("link", { name: "MEDomicsLab homepage", exact: true });
    const github = page.locator(".liquid-github-anchor");
    const ecosystem = page.locator(".liquid-ecosystem-anchor");
    const firstScreen = await page.locator(".neue-hero").evaluate((el) => el.offsetHeight);
    const start = await title.boundingBox();
    const titleTransform = await title.evaluate((el) => getComputedStyle(el).transform);
    const shortcutStart = await github.boundingBox();

    for (const y of [160, Math.floor(firstScreen / 2), firstScreen - 1]) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await expect(brand).toBeHidden();
      await expect.poll(async () => (await title.boundingBox()).width).toBeCloseTo(start.width, 0);
      await expect(title).toHaveCSS("transform", titleTransform);
      await expect.poll(async () => (await github.boundingBox()).x).toBeCloseTo(shortcutStart.x, 0);
      await expect
        .poll(async () => (await github.boundingBox()).y)
        .toBeCloseTo(reducedMotion === "reduce" ? shortcutStart.y - y : shortcutStart.y, 0);
      await expect(page.locator(".liquid-action-anchor").first()).toHaveClass(/is-in-hero/);
    }

    await page.evaluate((y) => window.scrollTo(0, y), firstScreen);
    await expect(brand).toBeVisible();
    await expect(page.locator(".neue-home-brand")).toHaveCSS("opacity", "1");
    await expect(title.locator("span").first()).toHaveCSS("opacity", "0");
    await expect(page.locator(".liquid-action-anchor").first()).not.toHaveClass(/is-in-hero/);
    await expect
      .poll(async () => {
        const box = await github.boundingBox();
        return box.x + box.width / 2;
      })
      .toBeCloseTo(195, 0);
    await expect
      .poll(async () => {
        const box = await ecosystem.boundingBox();
        return box.y + box.height;
      })
      .toBeCloseTo(844 - 16, 0);
    await expect(page.locator(".liquid-github-anchor .glass__warp")).toHaveCount(1);

    await page.evaluate((y) => window.scrollTo(0, y), firstScreen - 1);
    await expect(brand).toBeHidden();
    await expect(title.locator("span").first()).toHaveCSS("opacity", "1");
    await expect.poll(async () => (await github.boundingBox()).x).toBeCloseTo(shortcutStart.x, 0);
    await expect
      .poll(async () => (await github.boundingBox()).y)
      .toBeCloseTo(
        reducedMotion === "reduce" ? shortcutStart.y - (firstScreen - 1) : shortcutStart.y,
        0
      );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  });
}
