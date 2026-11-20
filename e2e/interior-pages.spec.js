import { expect, test } from "@playwright/test";
import teamData from "../src/data/team.json" with { type: "json" };
import publicationsData from "../src/data/publications.json" with { type: "json" };
import projectsData from "../src/data/research-projects.json" with { type: "json" };

const doctorateCount = projectsData.filter((project) => project.track === "Doctorate").length;

test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

// For Vision tests that need motion but not the WebGL banners: while the banners move they keep a software renderer
// (CI has no GPU) too busy to answer.
const withoutBanners = (page) =>
  page.route("**/vendor/landscape/landscape.mjs", (route) => route.abort());

test("publication listings and team profiles link directly to the source", async ({
  page,
  request,
}) => {
  const papers = publicationsData.flatMap((group) => group.items);
  await page.goto("/publications");
  const rows = page.locator(".publication-year .entry-row");
  await expect(rows).toHaveCount(papers.length);
  expect(
    await rows.evaluateAll((links) => links.map((link) => link.getAttribute("href")).sort())
  ).toEqual(papers.map((paper) => paper.link).sort());

  const paper = papers.find((item) => item.contributors[0] === "Martin Vallières");
  await page.goto("/team/martin-vallieres");
  await page.getByRole("button", { name: /^See more/ }).click();
  const activity = page.getByRole("link").filter({ hasText: paper.title });
  await expect(activity).toHaveAttribute("href", paper.link);

  const oldUrl = await request.get(`/publications/${paper.slug}`, { maxRedirects: 0 });
  expect(oldUrl.status()).toBe(308);
  expect(oldUrl.headers().location).toBe(paper.link);
});

test("detail pages share consistent missing-record states and return links", async ({ page }) => {
  for (const [collection, title, label] of [
    ["/research", "Project", "Return to Index"],
    ["/team", "Member", "Return to Team"],
    ["/publications", "Publication", "Return to Publications"],
    ["/community/news", "News", "Return to Index"],
    ["/community/events", "Events", "Return to Index"],
    ["/community/courses", "Course", "Return to Courses"],
  ]) {
    await page.goto(`${collection}/missing-record`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${title} Not Found`);
    const back = page.locator("main").getByRole("link", { name: label, exact: true });
    await expect(back).toHaveAttribute("href", collection);
    await back.click();
    await expect(page).toHaveURL(collection);
  }
});

test("research filters retain their results and project Markdown and metadata", async ({
  page,
}) => {
  await page.goto("/research");
  const shownProjects = page.locator(".research-project:visible");
  await expect(shownProjects).toHaveCount(projectsData.length);
  const doctorate = page.getByRole("button", { name: `Doctorate ${doctorateCount}`, exact: true });
  await expect(doctorate).toHaveCSS("cursor", "pointer");
  await doctorate.click();
  await expect(doctorate).toHaveCSS("background-color", "rgb(229, 218, 195)");
  await expect(doctorate).toHaveCSS("color", "rgb(26, 26, 26)");
  await expect(shownProjects).toHaveCount(doctorateCount);
  await expect(page.getByRole("button", { name: "Clear filters" })).toHaveCSS("cursor", "pointer");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(shownProjects).toHaveCount(projectsData.length);
  await page.locator('main a[href="/research/medomics-platform"]').click();
  await expect(page.locator(".project-markdown")).toContainText("In progress (2020-today)");
  await expect(
    page.locator(".project-metadata").getByRole("heading", { name: "Status", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Researchers", exact: true })).toBeVisible();
});

test("research filters sit midway between two rules and the slash key searches project titles", async ({
  page,
}) => {
  await page.goto("/research");
  const filters = page.locator(".filter-chips");
  await expect(filters).toHaveCSS("border-bottom-width", "0px");
  const gaps = await filters.evaluate((block) => {
    const ruleAbove =
      block.getBoundingClientRect().top + parseFloat(getComputedStyle(block).borderTopWidth);
    const ruleBelow = document.querySelector(".research-project").getBoundingClientRect().top;
    return {
      above: block.firstElementChild.getBoundingClientRect().top - ruleAbove,
      below: ruleBelow - block.lastElementChild.getBoundingClientRect().bottom,
    };
  });
  expect(Math.abs(gaps.above - gaps.below)).toBeLessThanOrEqual(1);

  const search = page.getByRole("searchbox", { name: "Search research projects by title" });
  const chips = page.getByRole("group", { name: "Filter research projects by tag" });
  const [searchBox, chipsBox] = [await search.boundingBox(), await chips.boundingBox()];
  expect(Math.abs(searchBox.y - chipsBox.y)).toBeLessThanOrEqual(1);
  expect(searchBox.x).toBeGreaterThan(chipsBox.x + chipsBox.width);

  await page.keyboard.press("/");
  await expect(search).toBeFocused();
  await page.keyboard.type("Radiomics");
  const matching = projectsData.filter((project) => /radiomics/i.test(project.title));
  const shownProjects = page.locator(".research-project:visible");
  await expect(shownProjects).toHaveCount(matching.length);
  await expect(filters.locator("[aria-live]")).toContainText(
    `Showing ${matching.length} of ${projectsData.length} projects`
  );
  await expect(shownProjects.first().locator(".tabular-nums")).toHaveText("01");

  await page.keyboard.type(" zzz");
  await expect(shownProjects).toHaveCount(0);
  await expect(page.locator(".research-empty")).toContainText("No project titles match");
  await page.keyboard.press("Escape");
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(shownProjects).toHaveCount(projectsData.length);
  await page.keyboard.press("Escape");
  await expect(search).not.toBeFocused();
});

test("profile Latest filters by type beside its heading and folds into one menu when narrow", async ({
  page,
}) => {
  const projectCount = projectsData.filter((project) =>
    project.researchers?.includes("martin-vallieres")
  ).length;
  const shownRows = page.locator(".member-detail .entry-row:visible");
  const toggle = page.locator(".reveal-list-toggle");

  await page.goto("/team/martin-vallieres");
  const filters = page.getByRole("group", { name: "Filter latest by type" });
  const heading = page.getByRole("heading", { name: "Latest", exact: true });
  const [filtersBox, headingBox] = [await filters.boundingBox(), await heading.boundingBox()];
  expect(
    Math.abs(filtersBox.y + filtersBox.height / 2 - (headingBox.y + headingBox.height / 2))
  ).toBeLessThanOrEqual(2);
  await expect(filters.getByRole("button", { name: /^All/ })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await filters.getByRole("button", { name: `Projects ${projectCount}`, exact: true }).click();
  await expect(filters.getByRole("button", { name: /^All/ })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  await expect(shownRows).toHaveCount(3);
  for (const row of await shownRows.all()) await expect(row).toContainText("Project");
  await expect(toggle).toHaveText(`See more (+${projectCount - 3})`);

  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/team/martin-vallieres");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
  const filterBox = await page.locator(".compact-filter").boundingBox();
  expect(filterBox.x + filterBox.width).toBeLessThanOrEqual(1024);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/team/martin-vallieres");
  await expect(page.getByRole("group", { name: "Filter latest by type" })).toHaveCount(0);
  const trigger = page.getByRole("button", { name: /Filter latest by type/ });
  await expect(trigger).toContainText("All");
  await trigger.click();
  const menu = page.getByRole("group", { name: "Filter latest by type" });
  const options = menu.getByRole("button");
  await expect(options.first()).toHaveText(/^All/);
  expect(
    await options.evaluateAll((items) => items.map((item) => item.getAttribute("aria-pressed")))
  ).toEqual(["true", ...Array(4).fill("false")]);
  await menu.getByRole("button", { name: /^Projects/ }).click();
  await expect(options.first()).toHaveAttribute("aria-pressed", "false");
  await expect(trigger).toContainText("Projects");
  await expect(toggle).toHaveText(`See more (+${projectCount - 3})`);
  await expect(shownRows).toHaveCount(3);
  for (const row of await shownRows.all()) await expect(row).toContainText("Project");
  const bounds = await menu.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(16);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(375 - 16);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("team keeps its cohort order and colour distinction with working profile links", async ({
  page,
}) => {
  await page.goto("/team");
  const labels = await page.locator(".team-divider > span").allTextContents();
  expect(labels.slice(0, 2)).toEqual(["Lab Principal Investigator", "Current"]);
  await expect(page.locator(".team-card-pi img")).toHaveCSS("filter", "none");
  const current = page.locator('[id="year-Current"] img').first();
  await expect(current).toHaveCSS("filter", "none");
  const formerCard = page.locator('[id="year-2025"] .team-card').first();
  await expect(formerCard.locator("img")).toHaveCSS("filter", "grayscale(1)");
  await formerCard.hover();
  await expect(formerCard.locator("img")).toHaveCSS("filter", "grayscale(0)");
  await formerCard.locator(".team-profile-link").click();
  await expect(page.locator(".member-detail h1")).toHaveText("Mariem Kallel");
  await expect(page.locator(".member-portrait img")).toHaveCSS("filter", "none");
});

test("profiles keep every cohort portrait in color and abbreviate Martin's department", async ({
  page,
}) => {
  for (const slug of ["martin-vallieres", "hakima-laribi", "mariem-kallel"]) {
    await page.goto(`/team/${slug}`);
    await expect(page.locator(".member-portrait img")).toHaveCSS("filter", "none");
  }
  await page.setViewportSize({ width: 1706, height: 1000 });
  await page.goto("/team/martin-vallieres");
  await page.evaluate(() => document.fonts.ready);
  const department = page.getByText("Dept. of Biomedical Engineering, McGill University", {
    exact: true,
  });
  await expect(department).toBeVisible();
  const affiliation = department.locator("..");
  expect(
    await affiliation.evaluate(
      (el) => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)
    )
  ).toBe(1);
});

test("affiliation links come from member JSON and open official destinations in a new tab", async ({
  page,
  context,
}) => {
  const member = teamData
    .flatMap((group) => group.members)
    .find((member) => member.slug === "martin-vallieres");
  await page.goto(`/team/${member.slug}`);
  const affiliations = page.locator(".member-affiliations");
  await expect(affiliations.getByRole("link")).toHaveCount(member.affiliations.length);
  for (const affiliation of member.affiliations) {
    const link = affiliations.getByRole("link", { name: affiliation.organization, exact: true });
    await expect(link).toHaveAttribute("href", affiliation.url);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
    await expect(link).toHaveCSS("text-decoration-line", "underline");
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await link.hover();
    await expect(link).toHaveCSS("color", "rgb(240, 231, 212)");
  }
  const destination = member.affiliations[0].url;
  await context.route(destination, (route) =>
    route.fulfill({ contentType: "text/html", body: "<title>Official affiliation</title>" })
  );
  const popupPromise = page.waitForEvent("popup");
  await affiliations.getByRole("link").first().click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(destination);
  await expect(page).toHaveURL(`/team/${member.slug}`);
  await popup.close();

  await page.goto("/team/hakima-laribi");
  await expect(page.locator(".member-affiliations")).toHaveCount(0);
});

test("member links use larger icons, wrap only when needed and keep missing links inert", async ({
  page,
}) => {
  await page.goto("/team/martin-vallieres");
  const socials = page.locator(".member-socials");
  await expect(socials.locator("svg")).toHaveCount(5);
  await expect(socials.getByRole("link")).toHaveCount(5);
  for (const icon of await socials.locator("svg").all()) {
    await expect(icon).toHaveCSS("width", "32px");
    await expect(icon).toHaveCSS("height", "32px");
  }
  for (const link of await socials.getByRole("link").all()) {
    await expect(link).toHaveCSS("width", "44px");
    await expect(link).toHaveCSS("height", "44px");
    await expect(link).toHaveCSS("cursor", "pointer");
  }
  await expect(
    socials.getByRole("link", { name: "Martin Vallières — GitHub", exact: true })
  ).toHaveAttribute("href", "https://github.com/mvallieres");
  await expect(
    socials.getByRole("link", { name: "Martin Vallières — Email", exact: true })
  ).toHaveAttribute("href", "mailto:martin.vallieres@mcgill.ca");
  await expect(page.getByRole("button", { name: "Copy email to clipboard" })).toHaveCSS(
    "cursor",
    "pointer"
  );
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const rows = await socials
      .locator("li")
      .evaluateAll((items) => new Set(items.map((item) => item.getBoundingClientRect().top)).size);
    expect(rows).toBe(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(1);
  }
  const missing = teamData
    .flatMap((group) => group.members)
    .find((member) => member.socials && !member.socials.github);
  await page.goto(`/team/${missing.slug}`);
  await expect(
    page.locator(".member-socials").getByRole("img", { name: /GitHub.*not available/ })
  ).toHaveCSS("cursor", "auto");
});

test("publications keeps the year sidebar visible and enlarges headings after scroll", async ({
  page,
}) => {
  await page.goto("/publications");
  const title = page.locator(".publication-year-title").first();
  await expect(title).toHaveCSS("font-weight", "600");
  const initialSize = await title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await page.locator(".section-ticks").getByRole("button", { name: "2024", exact: true }).click();
  await expect(page.locator(".section-ticks")).toHaveCSS("opacity", "1");
  await expect
    .poll(() => title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)))
    .toBeGreaterThan(initialSize);
  await page.getByRole("button", { name: /^Preprints/ }).click();
  await expect(page.getByRole("button", { name: /^Preprints/ })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page.locator(".entry-row").first()).toBeVisible();
});

test("shared footer, Vision and narrow layouts work across routes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/research",
    "/team",
    "/publications",
    "/research/medomics-platform",
    "/team/martin-vallieres",
    "/community/news",
  ]) {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(path);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveClass(/neue-footer/);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Vision", exact: true })
    ).toHaveAttribute("href", "/vision");
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
      .toBeLessThanOrEqual(1);
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Vision", exact: true })
    .click();
  await expect(page).toHaveURL("/vision");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vision", exact: true })).toBeVisible();
  await page.locator("summary").filter({ hasText: "Medical image analysis" }).click();
  await page.locator(".vision-axis").getByRole("link", { name: /^JA4:/ }).click();
  await expect(page).toHaveURL(/#paper-JA4$/);
  await expect(page.locator("#paper-JA4 a")).toHaveAttribute("href", /^https:\/\/doi.org\//);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  ).toBeLessThanOrEqual(1);
});

async function expectFullWidthDividers(page) {
  const dividers = page.locator(".vision-divider");
  await expect(dividers).toHaveCount(3);
  const bounds = await dividers.evaluateAll((nodes) => {
    const width = document.documentElement.clientWidth;
    return nodes.map((node) => {
      const { left, right, height } = node.getBoundingClientRect();
      return { left, rightGap: width - right, height };
    });
  });
  for (const { left, rightGap, height } of bounds) {
    expect(Math.abs(left)).toBeLessThanOrEqual(1);
    expect(Math.abs(rightGap)).toBeLessThanOrEqual(1);
    expect(height).toBeGreaterThan(0);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
  ).toBeLessThanOrEqual(1);
}

test("Vision figures stay inline and only reveal their captions on hover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vision");
  const figures = page.locator(".vision-page figure");
  await expect(figures).toHaveCount(3);
  await expect(figures.getByRole("button")).toHaveCount(0);
  for (const figure of await figures.all()) {
    await figure.scrollIntoViewIfNeeded();
    const caption = figure.locator("figcaption");
    await expect(caption.locator("b")).toHaveText(/\S/);
    await expect(caption).not.toContainText(/\bFig(?:ure)?\.?\s+\d/i);
    await page.mouse.move(1, 1);
    await expect(caption).toHaveCSS("opacity", "0");
    await figure.hover({ position: { x: 8, y: 8 } });
    await expect(caption).toHaveCSS("opacity", "1");
    const centreOffset = await figure.evaluate((node) => {
      const drawing = node
        .querySelector(".pf-stage, .cycle-art, .scope-stage")
        .getBoundingClientRect();
      const label = node.querySelector("figcaption").getBoundingClientRect();
      return Math.abs(drawing.left + drawing.width / 2 - (label.left + label.width / 2));
    });
    expect(centreOffset).toBeLessThan(1);
    await figure.click({ position: { x: 8, y: 8 } });
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }

  const longTerm = page.locator("#long-term-vision");
  await expect(longTerm.getByText(/^How can Agentic AI support/)).toHaveCount(1);
  await expect(page.locator("#progress").getByText(/^How can Agentic AI support/)).toHaveCount(0);
  // Best flow puts the question and its answer before the figure.
  expect(
    await longTerm.evaluate((section) => {
      const [figure] = section.querySelectorAll("figure");
      const question = section.querySelector(".vision-question");
      const answer = section.querySelector(".vision-approach-text");
      const follows = (a, b) =>
        Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      return follows(question, answer) && follows(answer, figure);
    })
  ).toBe(true);
  const approach = longTerm.locator(".vision-approach-text");
  await expect(approach).toHaveText(
    "For this purpose, we anchor our work on MEDomics (medomics.app), an open-source platform developed by our group."
  );
  await expect(approach.getByRole("link", { name: "MEDomics", exact: true })).toHaveAttribute(
    "href",
    "/research/medomics-platform"
  );
  await expect(approach.getByRole("link", { name: "medomics.app" })).toHaveAttribute(
    "href",
    "https://medomics.app/"
  );
  await expect(longTerm.locator("figcaption")).toHaveText(
    "MEDomics: A Collaborative Platform for Medical Data Modeling"
  );
  // Like a slide, the question needs no visible lead-in; screen readers still get one.
  await expect(longTerm.locator(".vision-question")).not.toContainText(":");
  await expect(longTerm.locator(".vision-question .sr-only")).toHaveText(
    "The core question that we are addressing"
  );
  // Current work gives the reason before the goal, as the statement does.
  const work = page.locator("#current-work");
  expect(
    await work.evaluate((section) => {
      const gaps = section.querySelector(".vision-gaps");
      const goal = section.querySelector(".vision-goal");
      return Boolean(gaps.compareDocumentPosition(goal) & Node.DOCUMENT_POSITION_FOLLOWING);
    })
  ).toBe(true);
  await expect(work.locator(".vision-gaps")).toContainText(/Main gaps in MEDomics\s*Despite/);

  const scope = page.getByRole("figure", { name: "Scope of the current research program" });
  const medomics = scope.getByRole("link", { name: "MEDomics website" });
  await expect(medomics).toHaveText("MEDomics");
  await expect(medomics).toHaveAttribute("href", "https://medomics.app/");
  const platformLinks = scope.getByRole("link", { name: /^MED.* website$/ });
  await expect(platformLinks).toHaveCount(4);
  for (const link of await platformLinks.all()) {
    await link.locator(".scope-app-link").hover();
    await expect(link.locator("svg")).toHaveCSS("rotate", "45deg");
  }
  const cites = scope.getByRole("link", { name: /^(JA|CP)\d+: / });
  await expect(cites).toHaveCount(13);
  for (const link of await cites.all()) {
    const target = await link.getAttribute("href");
    await expect(page.locator(target)).toHaveCount(1);
  }
});

test("the research context tells why before the premises, and every part has its subtitle", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vision");
  const program = page.locator("#program");
  // The opening argument comes first, the premises follow from it, then the long-term vision.
  expect(
    await program.evaluate((section) => {
      const opening = section.querySelector(".vision-opening");
      const premises = section.querySelector(".vision-premises");
      const longTerm = section.querySelector("#long-term-vision");
      const follows = (a, b) =>
        Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      return follows(opening, premises) && follows(premises, longTerm);
    })
  ).toBe(true);
  await expect(program.locator(".vision-opening p").first()).toHaveText(
    /^The potential to learn from the wealth of real-world health data/
  );
  await expect(program.locator(".vision-opening p").last()).toHaveText(/^In fact, /);
  await expect(page.locator(".vision-premise-list li")).toHaveCount(3);
  const premises = page.locator(".vision-premises");
  const heading = await premises.locator("h3").boundingBox();
  const list = await premises.locator("ul").boundingBox();
  expect(Math.abs(heading.y - list.y)).toBeLessThan(1);
  expect(heading.height).toBeLessThan(list.height);
  await expect(page.locator("#long-term-vision .vision-lede")).toHaveText(
    /^Guided by these premises, /
  );
  for (const name of [
    "Fundamental premises favoring clinical translation of computer science methods",
    "Research axes",
    "MEDomics platform",
    "Main gaps in MEDomics",
  ]) {
    await expect(page.getByRole("heading", { name, exact: true })).toHaveCount(1);
  }
  // Presentation copy: no colon lead-ins anywhere in the story.
  for (const text of await page
    .locator(".vision-page :is(.vision-lede, .vision-approach-text, .vision-subtitle)")
    .allTextContents()) {
    expect(text).not.toMatch(/:\s*$|: [A-Z]/);
  }
});

test("the premises heading stays beside the list and the active statement lights up", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await withoutBanners(page);
  await page.goto("/vision");
  const premises = page.locator(".vision-premise-list li");
  const bounds = await page.locator(".vision-premises").evaluate(async (section) => {
    await document.fonts.ready;
    const title = section.querySelector("h3");
    const list = section.querySelector("ul");
    const stickyTop = parseFloat(getComputedStyle(title).top);
    const start = list.getBoundingClientRect().top + scrollY - stickyTop;
    const travel = list.offsetHeight - title.offsetHeight;
    return [start - 15, start + travel / 2, start + travel + 15].map((position) => {
      scrollTo({ top: position, behavior: "instant" });
      const heading = title.getBoundingClientRect();
      const body = list.getBoundingClientRect();
      return { top: heading.top - body.top, bottom: body.bottom - heading.bottom, travel };
    });
  });
  expect(Math.abs(bounds[0].top)).toBeLessThan(1);
  expect(Math.abs(bounds[1].top - bounds[1].travel / 2)).toBeLessThan(1);
  expect(Math.abs(bounds[2].bottom)).toBeLessThan(1);
  await expect(page.locator(".vision-premise-list")).toHaveAttribute("data-spotlight", "");
  await premises
    .nth(1)
    .evaluate((row) => row.scrollIntoView({ block: "center", behavior: "instant" }));
  // The middle premise is lit; its neighbours wait in half light.
  await expect
    .poll(() =>
      premises.evaluateAll((rows) => {
        const [first, middle, last] = rows.map((row) => +getComputedStyle(row).opacity);
        return middle > 0.95 && first < 0.6 && last < 0.6;
      })
    )
    .toBe(true);
});

test("the figures' dots move once on screen and stand still when motion is reduced", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await withoutBanners(page);
  await page.goto("/vision");
  for (const stage of [".pf-stage", ".scope-stage"]) {
    const node = page.locator(stage);
    await node.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" })
    );
    await expect(node).toHaveAttribute("data-dots", "live");
    // The SVG pattern gives way to the field drawn under the drawing.
    await expect(node.locator(".dot-static").first()).toBeHidden();
    await expect(node.locator(".dot-canvas")).toHaveCSS("visibility", "visible");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const scope = page.locator(".scope-stage");
  await scope.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" })
  );
  await expect(scope).toHaveAttribute("data-dots", "still");
  await expect(page.locator(".vision-premise-list")).not.toHaveAttribute("data-spotlight");
});

for (const width of [1440, 390]) {
  test(`the research vision figure connects every arrow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/vision");
    const figure = page.getByRole("figure", { name: "The long-term research vision" });
    const art = figure.locator(".pf-art:visible");
    await expect(art).toHaveCount(1);
    await expect(art).toHaveAttribute("viewBox", "0 -44 1000 590");
    for (const label of [
      "Generalist AI",
      "Specialist AI",
      "Precision AI",
      "Foundation models",
      "Integrative models",
      "Causal models",
      "Reusable AI Agents",
      "Agentic AI Assistant",
      "Long-term research vision",
    ]) {
      await expect(art.getByText(label, { exact: true })).toHaveCount(1);
    }
    // Each connector must start and end on a node or on another connector, never in empty space.
    const loose = await art.evaluate((svg) => {
      const boxes = [...svg.querySelectorAll(".pf-box, .pf-tag")].map((node) => node.getBBox());
      const wires = [...svg.querySelectorAll(".pf-wire")];
      const samples = wires.map((wire) =>
        Array.from({ length: 80 }, (_, i) =>
          wire.getPointAtLength((wire.getTotalLength() * i) / 79)
        )
      );
      const nearBox = (p) =>
        boxes.some(({ x, y, width, height }) => {
          const dx = Math.max(x - p.x, 0, p.x - (x + width));
          const dy = Math.max(y - p.y, 0, p.y - (y + height));
          return Math.hypot(dx, dy) <= 12;
        });
      const nearWire = (p, own) =>
        samples.some(
          (points, i) => i !== own && points.some((q) => Math.hypot(q.x - p.x, q.y - p.y) <= 12)
        );
      return wires.flatMap((wire, i) => {
        const ends = [wire.getPointAtLength(0), wire.getPointAtLength(wire.getTotalLength())];
        return ends
          .filter((p) => !nearBox(p) && !nearWire(p, i))
          .map((p) => `${wire.getAttribute("d")} @ ${Math.round(p.x)},${Math.round(p.y)}`);
      });
    });
    expect(loose).toEqual([]);
  });
}

test("section links stay above the artwork, hide at the footer, and return on scroll back", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vision");
  await expectFullWidthDividers(page);
  const nav = page.getByRole("navigation", { name: "Vision page sections" });
  const links = nav.getByRole("link");
  const labels = [
    "Research context",
    "Long-term vision",
    "Recent progress",
    "Current work",
    "Selected publications",
  ];
  await expect(links).toHaveCount(labels.length);
  for (const label of labels) {
    await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await expect(nav.locator("[aria-current]")).toHaveCount(0);
  await page
    .locator("#program")
    .evaluate((section) => section.scrollIntoView({ block: "start", behavior: "instant" }));
  await expect(links.first()).toHaveAttribute("aria-current", "location");
  await expect(nav).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  expect(await nav.evaluate((element) => getComputedStyle(element, "::before").content)).toBe(
    "none"
  );
  expect(
    await nav.evaluate((element) => element.getBoundingClientRect().left > innerWidth / 2)
  ).toBe(true);
  const railSize = await nav.evaluate((element) => [element.offsetWidth, element.offsetHeight]);
  for (const link of await links.all()) {
    await link.hover();
    expect(await nav.evaluate((element) => [element.offsetWidth, element.offsetHeight])).toEqual(
      railSize
    );
  }

  const stops = page.locator(".vision-horizon, .vision-divider");
  for (const stop of await stops.all()) {
    await stop.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" })
    );
    await expect
      .poll(() =>
        links.evaluateAll((nodes) =>
          nodes.every((link) => {
            const { x, y, width, height } = link.getBoundingClientRect();
            return link.contains(document.elementFromPoint(x + width / 2, y + height / 2));
          })
        )
      )
      .toBe(true);
  }
  const footer = page.locator("footer");
  await footer.evaluate((element) =>
    element.scrollIntoView({ block: "start", behavior: "instant" })
  );
  await expect(nav).toBeHidden();
  await page
    .locator("#selected-publications")
    .evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  await expect(nav).toBeVisible();
  const vision = nav.getByRole("link", { name: "Long-term vision" });
  await vision.click();
  await expect(page).toHaveURL(/#long-term-vision$/);
  await expect(vision).toHaveAttribute("aria-current", "location");
  await expect(page.getByRole("heading", { name: "Long-term vision", exact: true })).toBeVisible();
  const progress = nav.getByRole("link", { name: "Recent progress" });
  await progress.click();
  await expect(page).toHaveURL(/#progress$/);
  await expect(progress).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".vision-program-figure .pf-art:visible")).toHaveCount(1);
});

test("phone layouts hide the section rail and center the full figures and reading columns", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vision");
  await expectFullWidthDividers(page);
  await expect(page.getByRole("navigation", { name: "Vision page sections" })).toBeHidden();
  await expect(page.locator(".scope-art .scope-topic:visible")).toHaveCount(6);
  await expect(page.locator(".scope-art .scope-arc-label:visible")).toHaveCount(3);
  await expect(page.locator(".vision-opening .vision-argument").first()).toHaveCSS(
    "text-align",
    "start"
  );
  const offsets = await page
    .locator(".vision-page :is(.vision-opening, .vision-figure, .vision-axis-list)")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const { left, right } = node.getBoundingClientRect();
        return Math.abs((left + right - document.documentElement.clientWidth) / 2);
      })
    );
  expect(Math.max(...offsets)).toBeLessThan(1);
});

test("the progress axes animate height and opacity on open, close and reversal", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await withoutBanners(page);
  await page.goto("/vision");
  const axis = page
    .locator(".vision-axis")
    .filter({ has: page.getByRole("heading", { name: "Medical image analysis" }) });
  await axis.scrollIntoViewIfNeeded();
  const samples = await axis.evaluate((details) => {
    const clip = details.querySelector(".vision-axis-clip");
    const summary = details.querySelector("summary");
    const read = () => [
      clip.getBoundingClientRect().height,
      Number(getComputedStyle(clip).opacity),
    ];
    function sample(progress) {
      // Seek the actual transitions to deterministic points, including a halfway reversal.
      const transitions = clip.getAnimations();
      for (const animation of transitions) {
        animation.pause();
        animation.currentTime = animation.effect.getTiming().duration * progress;
      }
      return read();
    }
    const closed = read();
    summary.click();
    const opening = sample(0.5);
    summary.click();
    const reversing = sample(0.5);
    summary.click();
    const reopened = sample(1);
    summary.click();
    const closing = sample(0.5);
    const end = sample(1);
    return { closed, opening, reversing, reopened, closing, end };
  });
  expect(samples.closed).toEqual([0, 0]);
  expect(samples.end).toEqual([0, 0]);
  expect(samples.reopened[1]).toBe(1);
  for (const i of [0, 1]) {
    expect(samples.opening[i]).toBeGreaterThan(0);
    expect(samples.opening[i]).toBeLessThan(samples.reopened[i]);
    expect(samples.reversing[i]).toBeLessThan(samples.opening[i]);
    expect(samples.closing[i]).toBeGreaterThan(0);
    expect(samples.closing[i]).toBeLessThan(samples.reopened[i]);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  const summary = axis.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(axis).toHaveAttribute("open", "");
  await expect(axis.locator(".vision-axis-clip")).toHaveCSS("transition-duration", "0s");
  await expect(axis.getByRole("link").first()).toBeVisible();
  await page.keyboard.press("Space");
  await expect(axis).not.toHaveAttribute("open", "");
  await expect(axis.locator(".vision-axis-clip")).toHaveCSS("opacity", "0");
});

test("the platform ring turns with the page and its posters open their websites", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await withoutBanners(page);
  await page.route("https://api.github.com/repos/**", (route) =>
    route.fulfill({ json: { stargazers_count: 42 } })
  );
  await page.addInitScript(() => {
    window.open = (url) => {
      document.documentElement.dataset.openedPoster = url;
      return null;
    };
  });
  await page.goto("/vision");
  const ring = page.locator(".vision-ring");
  await expect(ring).toHaveAttribute("data-gallery", "orbit");
  await expect(ring.getByRole("button")).toHaveCount(0);
  await expect(ring.getByRole("dialog")).toHaveCount(0);
  const site = ring.locator(".vision-ring-details").getByRole("link", { name: / website$/ });
  const stars = ring.locator(".vision-ring-details .vision-ring-stars");
  const canvas = ring.locator(".vision-ring-viewport canvas");
  const { top, travel } = await ring.locator(".vision-ring-track").evaluate((track) => ({
    top: track.getBoundingClientRect().top + scrollY,
    travel: track.offsetHeight - innerHeight,
  }));
  await page.evaluate((y) => scrollTo(0, y), top);
  await expect(ring).toHaveAttribute("data-ready", "");
  await expect(ring.locator(".vision-ring-details .vision-ring-name")).toHaveText(
    "And more is coming."
  );
  await expect(site).toHaveAccessibleName("MEDomics website");
  await expect(site).toHaveAttribute("href", "https://medomics.app/");
  await expect(stars).toHaveText(/42 GitHub stars/);
  await expect(ring.locator('a[href*="github.com"]')).toHaveCount(0);
  const captionBox = await ring.locator(".vision-ring-details").boundingBox();
  expect(captionBox.y + captionBox.height).toBeLessThan(page.viewportSize().height);
  await expect
    .poll(async () => {
      await canvas.hover();
      return canvas.evaluate((el) => el.style.cursor);
    })
    .toBe("pointer");
  await canvas.click();
  await expect(page.locator("html")).toHaveAttribute("data-opened-poster", "https://medomics.app/");
  // The research statement's order: MEDomics, then MED3pa, MEDiml and MEDfl.
  await page.evaluate(({ y, step }) => scrollTo(0, y + step), { y: top, step: travel / 3 });
  await expect(site).toHaveAccessibleName("MED3pa website");
  await canvas.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-opened-poster",
    "https://www.med3pa.app/"
  );
  await page.evaluate((y) => scrollTo(0, y), top + travel);
  await expect(site).toHaveAccessibleName("MEDfl website");
  await expect(site).toHaveAttribute("href", "https://www.medfl.app/");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  ).toBeLessThanOrEqual(1);
});

test("with reduced motion each platform poster links to its site and shows its star count", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://api.github.com/repos/**", (route) => route.abort());
  await page.goto("/vision");
  const ring = page.locator(".vision-ring");
  await expect(ring.locator(".vision-platform-lead p")).toHaveText(
    "Today, it is also powered by the standalone sub-applications MED3pa, MEDiml and MEDfl."
  );
  await expect(ring).toHaveAttribute("data-gallery", "static");
  const cards = ring.locator(".vision-ring-card:visible");
  await expect(cards.locator(".vision-ring-name")).toHaveText([
    "And more is coming.",
    "MED3pa",
    "MEDiml",
    "MEDfl",
  ]);
  for (const card of await cards.all()) {
    await expect(card.locator("img")).toHaveAttribute("alt", /card: /);
    const site = card.getByRole("link", { name: / website$/ });
    const href = await site.getAttribute("href");
    expect(href).toMatch(/^https:\/\//);
    await expect(card.getByRole("link", { name: / website from poster$/ })).toHaveAttribute(
      "href",
      href
    );
    await expect(card.locator(".vision-ring-stars")).toHaveText(/\d+ GitHub stars/);
  }
  await expect(ring.locator('a[href*="github.com"]')).toHaveCount(0);
  const link = cards.first().getByRole("link", { name: "MEDomics website", exact: true });
  await link.hover();
  await expect(link.locator("svg")).toHaveCSS("rotate", "45deg");
});

test("the retired DOCX link opens the final Vision flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/vision?story=docx");
  await expect(page.getByRole("navigation", { name: "Vision story order" })).toHaveCount(0);
  await expect(page.locator(".vision-page > header + figure + #program h2")).toHaveText(
    "Research context"
  );
  await expect(page.locator("#long-term-vision .vision-cycle-figure")).toHaveCount(1);
  await expect(page.locator("#progress .vision-scope-figure")).toHaveCount(1);
  await expect(
    page.locator("#current-work ~ .vision-ring ~ #selected-publications li a")
  ).toHaveCount(13);
  const axisThree = page.locator(".vision-axis").last();
  await axisThree.locator("summary").click();
  await expect(axisThree).toContainText(
    "Version 1.0 of the MEDomics platform was launched in 2024."
  );
  await expect(axisThree).toContainText(
    "clinical researchers and computer scientists work together"
  );
});
