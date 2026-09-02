import { test, expect } from "@playwright/test";

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
  "/this-route-does-not-exist",
];

for (const path of routes) {
  test(`renders ${path} without console errors`, async ({ page }) => {
    const errors = [];
    const failed = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
    });
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response, `no response for ${path}`).not.toBeNull();
    await expect(page.locator("body")).toBeVisible();
    expect(failed, `failed responses on ${path}: ${failed.join(" | ")}`).toEqual([]);
    expect(errors, `console errors on ${path}: ${errors.join(" | ")}`).toEqual([]);
  });
}
