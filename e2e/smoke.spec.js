import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/research",
  "/publications",
  "/team",
  "/community/news",
  "/community/events",
  "/community/courses",
  "/community/contact",
  "/this-route-does-not-exist",
];

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ stargazers_count: 1, forks_count: 1, open_issues_count: 0 }),
    })
  );
});

for (const path of routes) {
  test(`renders ${path} without console errors`, async ({ page, baseURL }) => {
    const errors = [];
    const failed = [];
    const expectedStatus = path === "/this-route-does-not-exist" ? 404 : 200;
    const documentUrl = new URL(path, baseURL).href;
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (
        expectedStatus === 404 &&
        msg.location().url === documentUrl &&
        /^Failed to load resource:.*status of 404/.test(msg.text())
      )
        return;
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
    });
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response, `no response for ${path}`).not.toBeNull();
    expect(response.status(), path).toBe(expectedStatus);
    await expect(page.locator("body")).toBeVisible();
    expect(failed, `failed responses on ${path}: ${failed.join(" | ")}`).toEqual(
      expectedStatus === 404 ? [`404 ${documentUrl}`] : []
    );
    expect(errors, `console errors on ${path}: ${errors.join(" | ")}`).toEqual([]);
  });
}
