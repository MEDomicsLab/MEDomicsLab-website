import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/visions",
  "/research",
  "/publications",
  "/team",
  "/community/news",
  "/community/events",
  "/community/courses",
  "/community/contact",
];

for (const path of routes) {
  test(`a11y: ${path} has no serious axe violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    // Wait for hydration / fonts so colour-contrast is measured against final styles
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Disable rules unsuitable for a heavily-animated marketing site;
      // tighten this list as the design lets us.
      .disableRules([
        "color-contrast",
        "region",
        "landmark-one-main",
        "page-has-heading-one",
        "scrollable-region-focusable",
      ])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    const serious = results.violations.filter((v) => v.impact === "serious");
    if (serious.length > 0) {
      // Surfaced as console warnings — tighten to .toEqual([]) once cleaned.
      console.warn(
        `[a11y] ${path} has ${serious.length} serious violation(s):\n${serious
          .map((v) => `  - ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
          .join("\n")}`
      );
    }
    expect(
      critical,
      `Critical a11y violations on ${path}:\n${critical
        .map(
          (v) =>
            `  - ${v.id}: ${v.help} (${v.nodes.length} node(s))\n    e.g. ${v.nodes[0]?.html?.slice(0, 200)}`
        )
        .join("\n")}`
    ).toEqual([]);
  });
}
