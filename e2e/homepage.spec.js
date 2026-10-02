import { test, expect } from "@playwright/test";
import home from "../src/data/home.json" with { type: "json" };
import layout from "../src/data/layout.json" with { type: "json" };
import team from "../src/data/team.json" with { type: "json" };

test("homepage identity, appointments and shared footer use the content data", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const pi = team.find((group) => group.year === "Lab Principal Investigator").members[0];
  const profile = page.locator(".neue-profile");
  await expect(profile.locator(".neue-profile-photo")).toHaveAttribute("alt", pi.name);
  await expect(profile.locator("#lab-heading")).toHaveText(
    new RegExp(`${pi.name.replaceAll(" ", "\\s*")}, ${pi.degreeSuffix}`)
  );
  await expect(profile.getByRole("link", { name: /^Explore/ })).toHaveAttribute(
    "href",
    `/team/${pi.slug}`
  );
  await expect(profile.locator(".neue-appointments > p")).toHaveCount(pi.appointments.length);
  for (const [index, appointment] of pi.appointments.entries()) {
    const row = profile.locator(".neue-appointments > p").nth(index);
    await expect(row).toContainText(appointment.title);
    await expect(row).toContainText(appointment.department);
    await expect(row).toContainText(appointment.university);
    await expect(row.locator("a")).toHaveAttribute("href", appointment.href);
  }
  const partners = profile.locator(".neue-institute-set").first().getByRole("link");
  await expect(partners).toHaveCount(pi.institutes.length);
  for (const [index, institute] of pi.institutes.entries()) {
    await expect(partners.nth(index)).toHaveAttribute("href", institute.url);
  }
  for (const path of ["/", "/team"]) {
    if (path !== "/") await page.goto(path);
    const footer = page.locator("footer");
    await expect(footer.locator(".neue-footer-logo img")).toHaveAttribute(
      "src",
      home.brand.lightLogoUrl
    );
    await expect(footer.locator(".neue-footer-wordmark")).toHaveText(home.brand.name);
    await expect(footer.locator(".neue-footer-office")).toHaveText(layout.footer.contact.office);
    for (const affiliation of layout.footer.affiliations) {
      await expect(
        footer.getByRole("link", { name: affiliation.name, exact: true })
      ).toHaveAttribute("href", affiliation.href);
    }
    await expect(
      footer.getByRole("link", { name: "Réseau santé numérique (RSN)", exact: true })
    ).toHaveAttribute("href", "https://rsn.quebec/");
  }
});

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ stargazers_count: 42, forks_count: 7, open_issues_count: 0 }),
    })
  );
});

test("all generated ecosystem and project-card artwork remains available", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const sources = await page
    .locator(".neue-ecosystem-app img, .neue-next-card img")
    .evaluateAll((images) => [...new Set(images.map((image) => image.getAttribute("src")))]);
  expect(sources).toHaveLength(19);
  for (const source of sources) {
    const response = await request.get(source);
    expect(response.ok(), source).toBe(true);
    expect(response.headers()["content-type"], source).toMatch(/^image\//);
  }
});

test("the hero stays pinned while the profile covers it; navigation is centred independently of its shortcuts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1706, height: 897 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "MEDomicsLab", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "MEDomicsLab homepage" })).toBeHidden();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete", {
    timeout: 8000,
  });
  const nav = await page.locator(".liquid-nav-anchor").boundingBox();
  const github = await page.locator(".liquid-github-anchor").boundingBox();
  expect(Math.abs(github.x - nav.x - nav.width - 12)).toBeLessThan(2);
  expect(Math.abs(nav.x + nav.width / 2 - 853)).toBeLessThan(2);
  const film = await page.locator(".neue-hero-film").boundingBox();
  const word = await page.locator(".neue-hero-medomics").boundingBox();
  const lab = await page.locator(".neue-hero-lab").boundingBox();
  const bottom = await page.locator(".neue-hero-bottom").boundingBox();
  const navBottom = Math.max(nav.y + nav.height, github.y + github.height);
  const centre = (navBottom + bottom.y) / 2;
  const description = await page.locator(".neue-hero-description").boundingBox();
  expect(Math.abs(film.x - description.x)).toBeLessThan(1);
  expect(Math.abs(lab.x - word.x)).toBeLessThan(1);
  expect(lab.y).toBeGreaterThan(word.y + word.height);
  expect(word.x - film.x - film.width).toBeGreaterThan(24);
  expect(Math.abs(word.x + word.width - 1682)).toBeLessThan(1);
  expect(film.width).toBeGreaterThan(800);
  expect(Math.abs(film.y + film.height / 2 - centre)).toBeLessThan(1);
  expect(Math.abs(lab.y + lab.height - film.y - film.height)).toBeLessThan(1);
  await expect(page.locator(".neue-hero-medomics")).toHaveCSS(
    "font-size",
    await page.locator(".neue-hero-lab").evaluate((el) => getComputedStyle(el).fontSize)
  );
  await expect(page.locator(".neue-profile-photo")).toHaveAttribute(
    "src",
    "/images/team/martin-vallieres/avatar-256.avif"
  );
  await expect(page.locator('[aria-current="page"]')).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(page.getByRole("link", { name: "MEDomicsLab homepage" })).toBeVisible();
  const hero = await page.locator(".neue-hero").boundingBox();
  expect(hero.y).toBe(0);
  const expanded = await page.locator(".neue-hero-film").boundingBox();
  expect(Math.abs(expanded.x)).toBeLessThan(1);
  expect(Math.abs(expanded.y)).toBeLessThan(1);
  expect(expanded.width).toBeCloseTo(1706, 0);
  expect(expanded.height).toBeCloseTo(897, 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1706);
  const portrait = await page.locator(".neue-profile-photo").boundingBox();
  const appointments = page.locator(".neue-appointments > p");
  const first = await appointments.first().boundingBox();
  const last = await appointments.last().boundingBox();
  expect(Math.abs(first.y - portrait.y)).toBeLessThan(1);
  expect(Math.abs(last.y + last.height - portrait.y - portrait.height)).toBeLessThan(1);
  const crest = page.getByRole("img", { name: "McGill University", exact: true });
  await expect(crest).toHaveAttribute(
    "src",
    "/images/logo/institutes/mcgill-university-crest.webp"
  );
  await expect.poll(() => crest.evaluate((el) => el.naturalWidth)).toBeGreaterThan(0);
  const profile = await page.locator("#lab").boundingBox();
  expect(Math.abs(profile.y - 497)).toBeLessThan(2);
});

test("project focus reveals statistics and publications expose four readable, linked abstracts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const app = page.getByRole("link", { name: "MEDomics, website", exact: true });
  await app.focus();
  await app.scrollIntoViewIfNeeded();
  await expect(page.locator(".neue-ecosystem-stats")).not.toContainText("MEDomics");
  await expect(page.locator(".neue-stat-counts")).toContainText("42");
  await expect(page.locator(".neue-stat-counts")).toContainText("7");
  for (const name of ["MEDomics", "MED3pa", "MEDfl", "MEDiml", "MEDprofiles"]) {
    await page.locator(`.neue-ecosystem-app[aria-label^="${name},"]`).focus();
    const logo = page.getByRole("img", { name: `${name} logo`, exact: true });
    await expect(logo).toHaveAttribute("src", `/images/homepage-neue/${name}-white.png`);
    await expect.poll(() => logo.evaluate((el) => el.naturalWidth)).toBeGreaterThan(0);
  }
  await expect(page.locator(".neue-ecosystem-stats")).not.toContainText("On GitHub");
  const tabs = page.getByRole("button", { name: /^Read publication/ });
  await expect(tabs).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await tabs.nth(i).scrollIntoViewIfNeeded();
    await tabs.nth(i).focus();
    await tabs.nth(i).press("Enter");
    await expect(tabs.nth(i)).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(".neue-publication-content:visible");
    await expect(panel).toHaveCount(1);
    await expect(panel.locator(".neue-publication-abstract")).not.toContainText("Loading abstract");
    expect(
      (await panel.locator(".neue-publication-abstract").textContent()).length
    ).toBeGreaterThan(200);
    await expect(panel.locator("h3")).not.toContainText("(Journal Article)");
    await expect(
      panel.getByRole("link", { name: "Read publication", exact: true })
    ).toHaveAttribute("href", /^\/publications\/.+/);
    if (i === 0)
      await expect(panel.locator(".neue-publication-venue")).toContainText(
        "Journal of the American Medical Informatics Association"
      );
  }
});

test("postcard, footer and route changes preserve their interactions", async ({ page }) => {
  await page.goto("/");
  const postcard = page.getByRole("button", { name: "Turn postcard to read our mission" });
  await postcard.scrollIntoViewIfNeeded();
  await expect(postcard).toBeVisible();
  await postcard.click();
  await expect(
    page.getByRole("button", { name: "Turn postcard to the team photograph" })
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Turn the postcard", exact: true }).click();
  await expect(postcard).toHaveAttribute("aria-pressed", "false");
  const footer = page.locator(".neue-footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.getByRole("link", { name: "Contact us", exact: true })).toHaveAttribute(
    "href",
    "/community/contact"
  );
  await expect(footer.getByRole("link", { name: "Google Scholar" })).toHaveAttribute(
    "href",
    /user=fRkjFK4AAAAJ/
  );
  await expect(footer.locator(".shiny-text")).toHaveText("Designed by Simon");
  await expect(footer.getByRole("link", { name: "Maintained by Lab members" })).toHaveAttribute(
    "href",
    "https://github.com/MEDomicsLab/MEDomicsLab-website"
  );
  await footer.getByRole("link", { name: "Publications", exact: true }).click();
  await expect(page).toHaveURL(/\/publications$/);
  await expect(page.locator(".neue-home-layout")).toHaveCount(0);
  await expect(page.locator(".neue-footer")).toHaveCount(1);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(page.locator(".neue-home-layout")).toBeVisible();
  await expect(page.getByRole("link", { name: "MEDomicsLab homepage" })).toBeHidden();
});

for (const width of [320, 390, 768]) {
  test(`homepage fits a ${width}px viewport, including its navigation and project links`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect
      .poll(async () => {
        const bounds = await page.locator(".liquid-github-anchor").boundingBox();
        return bounds.x + bounds.width;
      })
      .toBeLessThanOrEqual(width);
    const nav = await page.locator(".liquid-nav-anchor").boundingBox();
    const github = await page.locator(".liquid-github-anchor").boundingBox();
    expect(nav.x).toBeGreaterThanOrEqual(0);
    expect(github.x + github.width).toBeLessThanOrEqual(width);
    expect(Math.abs(nav.x + nav.width / 2 - width / 2)).toBeLessThan(2);
    expect(github.x >= nav.x + nav.width || github.y >= nav.y + nav.height).toBe(true);
    await page.locator(".neue-ecosystem").scrollIntoViewIfNeeded();
    if (width < 768) {
      for (const app of await page.locator(".neue-ecosystem-app").all()) {
        const rect = await app.boundingBox();
        expect(rect.x).toBeGreaterThanOrEqual(0);
        expect(rect.x + rect.width).toBeLessThanOrEqual(width);
      }
    }
    await page.locator(".neue-footer").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

test("reduced motion keeps every subject visible without waiting for scroll animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Play background videos and animations" })
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".neue-reel").scrollIntoViewIfNeeded();
  await expect(page.locator(".neue-reel-reduced")).toHaveText("Publications · News · Events");
  await expect(page.locator(".neue-reel-reduced")).toBeVisible();
  await page.locator(".neue-ecosystem").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "The MEDomics Ecosystem." })).toBeVisible();
});

test("homepage navigation keeps its text colour on hover across backgrounds", async ({ page }) => {
  await page.setViewportSize({ width: 1706, height: 897 });
  await page.goto("/");
  const link = page
    .locator(".liquid-nav-anchor nav")
    .getByRole("link", { name: "Research", exact: true });
  const capsule = page.locator(".liquid-nav-anchor");
  const background = await capsule.evaluate((el) => getComputedStyle(el).backgroundColor);
  await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
  await link.hover();
  await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(capsule).toHaveCSS("background-color", background);
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#lab").offsetTop + 100));
  await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
  expect(await link.evaluate((el) => el.style.getPropertyValue("--nav-hover-color"))).toBe("");
  await page.mouse.move(10, 200);
  await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("rolling subjects keep their weight; publication hover resets and footer arrows turn right", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1706, height: 897 });
  await page.goto("/");
  const weights = [];
  for (const [index, progress] of [
    [0, 0.1],
    [0, 0.2],
    [1, 0.43],
    [1, 0.56],
    [2, 0.83],
    [2, 0.95],
  ]) {
    await page.evaluate((progress) => {
      const reel = document.querySelector(".neue-reel");
      window.scrollTo(0, reel.offsetTop + (reel.offsetHeight - innerHeight) * progress);
    }, progress);
    const word = page.locator(".neue-reel-word").nth(index);
    await expect(word).toHaveCSS("opacity", "1");
    weights.push(await word.evaluate((el) => Number(getComputedStyle(el).fontWeight)));
  }
  expect(weights[0]).toBe(weights[1]);
  expect(weights[2]).toBe(weights[3]);
  expect(weights[4]).toBe(weights[5]);
  expect(weights[0]).toBeLessThan(weights[2]);
  expect(weights[2]).toBeLessThan(weights[4]);
  const tabs = page.getByRole("button", { name: /^Read publication/ });
  await tabs.nth(2).hover();
  await expect(tabs.nth(2)).toHaveAttribute("aria-expanded", "true");
  await page.locator(".neue-publications-intro").hover();
  await expect(tabs.nth(0)).toHaveAttribute("aria-expanded", "true");
  const maps = page.getByRole("link", { name: "Open Maps" });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".neue-footer-column").last()).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 0, 0)"
  );
  await maps.hover();
  await expect(maps.locator("svg")).toHaveCSS("rotate", "45deg");
});

test("partner logos and ecosystem orbit move continuously and honour the pause control", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1706, height: 897 });
  await page.goto("/");
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete", {
    timeout: 8000,
  });
  const credit = page.locator(".neue-hero-credit");
  await credit.hover();
  await expect(credit.locator(".lucide-arrow-down")).toHaveCSS("rotate", "none");
  const partner = page.getByRole("link", {
    name: "Research Institute of the McGill University Health Centre (RI-MUHC)",
    exact: true,
  });
  await expect(partner).toHaveAttribute("href", "https://rimuhc.ca/");
  const marquee = page.locator(".neue-marquee");
  await marquee.hover();
  await expect(page.locator(".neue-marquee-track")).toHaveCSS("animation-play-state", "running");
  const orbit = page.locator(".neue-ecosystem-orbit");
  const track = page.locator(".neue-institute-track");
  for (const element of [orbit, track]) {
    const initial = await element.evaluate((el) => getComputedStyle(el).transform);
    await expect
      .poll(() => element.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(initial);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Pause background videos and animations" }).click();
  await expect(orbit).toHaveCSS("animation-play-state", "paused");
  await expect(track).toHaveCSS("animation-play-state", "paused");
});

test("homepage titles enter from the right and the same video enters from the left", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1706, height: 897 });
  let releasePoster;
  const posterGate = new Promise((resolve) => {
    releasePoster = resolve;
  });
  await page.route("**/images/homepage.jpg", async (route) => {
    await posterGate;
    await route.continue();
  });
  await page.route("https://stream.mux.com/**", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const film = page.locator(".neue-hero-film");
  await expect(film).toHaveCSS("opacity", "0");
  await expect(film.locator(".neue-video-frame")).toHaveCSS("opacity", "0");
  await expect
    .poll(() => page.locator(".neue-video-source mux-player").evaluate((el) => el.paused))
    .toBe(true);
  await page.locator(".neue-video-source mux-player").evaluate((el) => {
    el.dataset.entranceIdentity = "original-player";
  });
  await page.evaluate(() => document.fonts.ready);
  const selectors = [
    ".neue-hero-medomics",
    ".neue-hero-lab",
    ".neue-hero-description",
    ".neue-hero-credit",
    ".liquid-nav-anchor",
    ".liquid-github-anchor",
    ".neue-hero-film",
  ];
  const initialPositions = await page.evaluate(
    (selectors) =>
      selectors.map((selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { x: rect.x, y: rect.y };
      }),
    selectors
  );
  releasePoster();
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete", {
    timeout: 8000,
  });
  const bounds = await film.boundingBox();
  expect(Math.abs(bounds.x - 24)).toBeLessThan(1);
  const navigation = await page.locator(".liquid-nav-anchor").boundingBox();
  const bottom = await page.locator(".neue-hero-bottom").boundingBox();
  const centre = (navigation.y + navigation.height + bottom.y) / 2;
  expect(Math.abs(bounds.y + bounds.height / 2 - centre)).toBeLessThan(1);
  expect(bounds.width).toBeGreaterThan(800);
  const finalPositions = await page.evaluate(
    (selectors) =>
      selectors.map((selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { x: rect.x, y: rect.y };
      }),
    selectors
  );
  expect(finalPositions[0].x).toBeLessThan(initialPositions[0].x - 50);
  expect(finalPositions[1].x).toBeLessThan(initialPositions[1].x - 50);
  expect(finalPositions[6].x).toBeGreaterThan(initialPositions[6].x + 50);
  for (const i of [2, 3]) expect(finalPositions[i].y).toBeLessThan(initialPositions[i].y - 40);
  for (const i of [4, 5]) expect(finalPositions[i].y).toBeGreaterThan(initialPositions[i].y + 70);
  await expect(page.locator(".neue-video-source mux-player")).toHaveAttribute(
    "data-entrance-identity",
    "original-player"
  );
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

test("homepage entrance can be skipped and is omitted for reduced motion", async ({ page }) => {
  await page.route("https://stream.mux.com/**", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", /waiting|holding/);
  await page.keyboard.press("Escape");
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".neue-home")).not.toHaveAttribute(
    "data-hero-intro",
    /waiting|holding|shrinking|entering/
  );
  const bounds = await page.locator(".neue-hero-film").boundingBox();
  expect(bounds.x).toBeGreaterThan(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize().width);
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

test("all film surfaces share one uninterrupted source and one pause control", async ({ page }) => {
  await page.route("https://stream.mux.com/**", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Escape");
  const player = page.locator(".neue-video-source mux-player");
  await expect(page.locator("mux-player")).toHaveCount(1);
  await expect.poll(() => player.evaluate((el) => Boolean(el.media?.nativeEl))).toBe(true);
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
    video.dataset.sharedIdentity = "original-film";
    video.srcObject = canvas.captureStream(24);
    await video.play();
  });
  let previousTime = 0;
  for (const selector of [".neue-hero-film", ".neue-reel", ".neue-events", ".neue-hero-film"]) {
    if (selector === ".neue-hero-film") await page.evaluate(() => window.scrollTo(0, 0));
    else await page.locator(selector).evaluate((el) => el.scrollIntoView());
    const surface = page.locator(`${selector} .neue-video-frame`);
    await expect(surface).toHaveAttribute("data-ready", "true");
    await expect
      .poll(() =>
        surface.evaluate((el) => {
          const pixel = el.getContext("2d").getImageData(el.width / 2, el.height / 2, 1, 1).data;
          return pixel[2];
        })
      )
      .toBeGreaterThan(180);
    await expect
      .poll(() => player.evaluate((el) => el.media.nativeEl.currentTime))
      .toBeGreaterThan(previousTime);
    previousTime = await player.evaluate((el) => el.media.nativeEl.currentTime);
    expect(await player.evaluate((el) => el.media.nativeEl.dataset.sharedIdentity)).toBe(
      "original-film"
    );
    await expect(page.locator("mux-player")).toHaveCount(1);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Pause background videos and animations" }).click();
  await expect.poll(() => player.evaluate((el) => el.media.nativeEl.paused)).toBe(true);
  const pausedAt = await player.evaluate((el) => el.media.nativeEl.currentTime);
  await page.locator(".neue-events").evaluate((el) => el.scrollIntoView());
  await expect(page.locator(".neue-events canvas")).toBeInViewport();
  expect(await player.evaluate((el) => el.media.nativeEl.currentTime)).toBe(pausedAt);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Play background videos and animations" }).click();
  await expect
    .poll(() => player.evaluate((el) => el.media.nativeEl.currentTime))
    .toBeGreaterThan(pausedAt);
});

test("dropdown links underline and the navbar stays centred on other routes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/research");
  await expect
    .poll(async () => {
      const nav = await page.locator(".liquid-nav-anchor").boundingBox();
      return Math.abs(nav.x + nav.width / 2 - 720);
    })
    .toBeLessThan(2);
  await page.getByRole("button", { name: "Community", exact: true }).hover();
  const news = page.getByRole("menuitem", { name: "News", exact: true });
  await news.hover();
  await expect(news).toHaveCSS("text-decoration-line", "underline");
  const github = page.locator(".liquid-github-anchor a");
  await github.hover();
  await expect(github.locator(".nav-action-slide__arrow")).toHaveCSS("opacity", "1");
  await expect(github).toHaveAttribute("href", "https://github.com/MEDomicsLab");
  await expect(page.getByRole("menu", { name: "MEDomicsLab apps" })).toHaveCount(0);
  await page.goto("/");
  await page.keyboard.press("Escape");
  await expect(page.locator('[aria-current="page"]')).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.locator("#lab").evaluate((el) => el.scrollIntoView());
  await expect(page.locator('[aria-current="page"]')).toHaveCSS("color", "rgb(240, 231, 212)");
});
