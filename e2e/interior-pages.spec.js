import { expect, test } from "@playwright/test";
import teamData from "../src/data/team.json" with { type: "json" };
import publicationsData from "../src/data/publications.json" with { type: "json" };

test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

test("publication authors retain their order and use shared team profile lookup", async ({
  page,
}) => {
  const publication = publicationsData
    .flatMap((group) => group.items)
    .find(
      (item) => !item.redirect && item.contributors?.includes("Martin Vallières") && item.markdown
    );
  await page.goto(`/publications/${publication.slug}`);
  const authors = page.locator(".publication-detail h1 + p");
  await expect(authors).toHaveText(publication.contributors.join(", "));
  await expect(
    authors.getByRole("link", { name: "Martin Vallières", exact: true })
  ).toHaveAttribute("href", "/team/martin-vallieres");
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
  await expect(page.locator(".research-project")).toHaveCount(14);
  const doctorate = page.getByRole("button", { name: "Doctorate 2", exact: true });
  await expect(doctorate).toHaveCSS("cursor", "pointer");
  await doctorate.click();
  await expect(doctorate).toHaveCSS("background-color", "rgb(229, 218, 195)");
  await expect(doctorate).toHaveCSS("color", "rgb(26, 26, 26)");
  await expect(page.locator(".research-project")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Clear filters" })).toHaveCSS("cursor", "pointer");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".research-project")).toHaveCount(14);
  await page.locator('main a[href="/research/medomics-platform"]').click();
  await expect(page.locator(".project-markdown")).toContainText("In progress (2020-today)");
  await expect(
    page.locator(".project-metadata").getByRole("heading", { name: "Status", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Researchers", exact: true })).toBeVisible();
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
  await expect(socials.locator("svg")).toHaveCount(6);
  await expect(socials.getByRole("link")).toHaveCount(5);
  await expect(socials.getByRole("img", { name: /ResearchGate.*not available/ })).toHaveCSS(
    "cursor",
    "auto"
  );
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
    expect(rows).toBe(width === 320 ? 2 : 1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(1);
  }
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

test("shared footer, disabled Vision and narrow layouts work across routes", async ({ page }) => {
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
    await expect(page.getByRole("button", { name: "Visions", exact: true })).toBeDisabled();
    await expect(page.locator('a[href="/visions"]')).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
      .toBeLessThanOrEqual(1);
  }
  await page.goto("/visions");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
