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
  const ecosystem = await page.locator(".liquid-ecosystem-anchor").boundingBox();
  expect(Math.abs(nav.x + nav.width / 2 - 853)).toBeLessThan(2);
  const film = await page.locator(".neue-hero-film").boundingBox();
  const word = await page.locator(".neue-hero-medomics").boundingBox();
  const lab = await page.locator(".neue-hero-lab").boundingBox();
  const bottom = await page.locator(".neue-hero-bottom").boundingBox();
  expect((github.x + ecosystem.x + ecosystem.width) / 2).toBeCloseTo(film.x + film.width / 2, 0);
  expect(github.y + github.height / 2).toBeCloseTo(film.y + film.height / 2, 0);
  expect(ecosystem.y).toBeCloseTo(github.y, 0);
  const navBottom = nav.y + nav.height;
  const centre = (navBottom + bottom.y) / 2;
  const title = await page.locator("#home-heading").boundingBox();
  expect(film.x - title.x).toBeGreaterThanOrEqual(0);
  expect(film.x - title.x).toBeLessThan(16);
  expect(Math.abs(film.x + film.width - title.x - title.width)).toBeLessThan(4);
  expect(Math.abs(lab.y - word.y)).toBeLessThan(1);
  expect(Math.abs(lab.x - word.x - word.width)).toBeLessThan(1);
  expect(film.y - title.y - title.height).toBeGreaterThan(10);
  expect(film.y - title.y - title.height).toBeLessThan(20);
  expect(Math.abs(title.x + title.width / 2 - 853)).toBeLessThan(1);
  expect(film.width).toBeGreaterThan(800);
  expect(Math.abs((title.y + film.y + film.height) / 2 - (centre - 6))).toBeLessThan(2);
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

test("homepage wordmark rises gently behind a video that is visible and stationary from first entry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1706, height: 897 });
  await page.route("https://stream.mux.com/**", (route) => route.abort());
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args);
      if (document.querySelector(".neue-home")?.dataset.heroIntro === "revealing") {
        animation.pause();
      }
      return animation;
    };
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const film = page.locator(".neue-hero-film");
  await expect(film).toHaveCSS("opacity", "1");
  await expect(film).toHaveCSS("translate", "none");
  const firstFilm = await film.boundingBox();
  await page.locator(".neue-video-source mux-player").evaluate((el) => {
    el.dataset.entranceIdentity = "original-player";
  });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "revealing");
  const durations = await page.evaluate(() => {
    window.heroEntrance = document.getAnimations().filter((a) => a.constructor === Animation);
    return window.heroEntrance.map((animation) => {
      animation.pause();
      return animation.effect.getComputedTiming().endTime;
    });
  });
  expect(Math.max(...durations)).toBe(900);
  const selectors = [
    ".neue-hero-medomics",
    ".neue-hero-lab",
    ".neue-hero-description",
    ".neue-hero-credit",
    ".liquid-nav-anchor",
    ".neue-hero-film",
  ];
  const positionsAt = (time) =>
    page.evaluate(
      ([selectors, time]) => {
        for (const animation of window.heroEntrance) animation.currentTime = time;
        return selectors.map((selector) => {
          const rect = document.querySelector(selector).getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        });
      },
      [selectors, time]
    );
  const initialPositions = await positionsAt(0);
  const reveal = [];
  for (const time of [150, 300, 450, 600, 750, 899]) reveal.push(await positionsAt(time));
  await page.evaluate(() => window.heroEntrance.forEach((animation) => animation.finish()));
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete");
  for (const [index, sample] of reveal.entries()) {
    const previous = index ? reveal[index - 1] : initialPositions;
    expect(sample[0].y).toBeLessThan(previous[0].y);
    expect(sample[5].x).toBeCloseTo(initialPositions[5].x, 0);
    expect(sample[5].y).toBeCloseTo(initialPositions[5].y, 0);
  }
  const bounds = await film.boundingBox();
  expect(Math.abs(bounds.x + bounds.width / 2 - 853)).toBeLessThan(12);
  const navigation = await page.locator(".liquid-nav-anchor").boundingBox();
  const bottom = await page.locator(".neue-hero-bottom").boundingBox();
  const centre = (navigation.y + navigation.height + bottom.y) / 2;
  const title = await page.locator("#home-heading").boundingBox();
  expect(Math.abs((title.y + bounds.y + bounds.height) / 2 - (centre - 6))).toBeLessThan(2);
  expect(bounds.width).toBeGreaterThan(800);
  expect(bounds.width).toBeCloseTo(firstFilm.width, 0);
  expect(bounds.height).toBeCloseTo(firstFilm.height, 0);
  const finalPositions = await page.evaluate(
    (selectors) =>
      selectors.map((selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { x: rect.x, y: rect.y };
      }),
    selectors
  );
  for (const i of [0, 1]) {
    expect(finalPositions[i].x).toBeCloseTo(initialPositions[i].x, 0);
    expect(finalPositions[i].y).toBeLessThan(initialPositions[i].y - 80);
  }
  expect(finalPositions[5].x).toBeCloseTo(initialPositions[5].x, 0);
  expect(finalPositions[5].y).toBeCloseTo(initialPositions[5].y, 0);
  expect(finalPositions[2].x).toBeGreaterThan(initialPositions[2].x + 80);
  expect(finalPositions[3].x).toBeLessThan(initialPositions[3].x - 80);
  for (const i of [2, 3]) expect(finalPositions[i].y).toBeCloseTo(initialPositions[i].y, 0);
  expect(finalPositions[4].y).toBeGreaterThan(initialPositions[4].y + 70);
  await expect(page.locator(".neue-video-source mux-player")).toHaveAttribute(
    "data-entrance-identity",
    "original-player"
  );
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(page.getByRole("link", { name: "GitHub", exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete");
  await expect(
    page.locator(".site-shortcuts").getByRole("link", { name: "GitHub Organization", exact: true })
  ).toBeVisible();
  await expect(page.locator(".neue-hero-medomics")).toHaveCSS("translate", "none");
});

test("homepage entrance can be skipped and is omitted for reduced motion", async ({ page }) => {
  await page.route("https://stream.mux.com/**", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.keyboard.press("Escape");
  await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".neue-home")).not.toHaveAttribute(
    "data-hero-intro",
    /waiting|revealing/
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

for (const width of [390, 1440]) {
  test(`the hero wordmark travels into the header and reverses cleanly at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.fonts.ready);
    const title = page.locator("#home-heading");
    const brand = page.getByRole("link", { name: "MEDomicsLab homepage", exact: true });
    const start = await title.boundingBox();
    await expect(brand).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 160));
    await expect
      .poll(async () => (await title.boundingBox()).width)
      .toBeLessThan(start.width * 0.8);
    const middle = await title.boundingBox();
    expect(middle.y).toBeLessThan(start.y);
    expect(middle.width).toBeGreaterThan(150);
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(page.locator(".neue-home-brand")).toHaveCSS("opacity", "1");
    const landed = await title.boundingBox();
    const destination = await page.locator(".site-brand-wordmark").boundingBox();
    expect(landed.x).toBeCloseTo(destination.x, 0);
    expect(landed.y).toBeCloseTo(destination.y, 0);
    expect(landed.width).toBeCloseTo(destination.width, 0);
    await expect(title.locator("span").first()).toHaveCSS("opacity", "0");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(brand).toBeHidden();
    await expect.poll(async () => (await title.boundingBox()).width).toBeCloseTo(start.width, 0);
    await expect(title.locator("span").first()).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => window.scrollTo(0, 160));
    await expect.poll(async () => (await title.boundingBox()).width).toBeCloseTo(start.width, 0);
  });
}
