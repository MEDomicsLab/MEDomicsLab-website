import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import layout from "../src/data/layout.json" with { type: "json" };

const path = "/community/contact";
const emailHref = layout.footer.social.reachOutLinks.find((link) =>
  link.href.startsWith("mailto:")
).href;
const email = emailHref.slice("mailto:".length);

test.use({ viewport: { width: 1440, height: 1000 } });

test.beforeEach(async ({ page }) => {
  await page.route("https://www.google.com/maps?**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html lang='en'><title>Location map</title></html>",
    })
  );
});

test("minimal contact page keeps the welcome, email, address and map in the new theme", async ({
  page,
}) => {
  await page.goto(path);
  await expect(page).toHaveTitle("Contact | MEDomicsLab");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `https://medomicslab.com${path}`
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contact us");
  await expect(page.locator(".contact-header > p")).toContainText("PhD, MSc, BSc");
  await expect(page.locator(".neue-interior-layout")).toHaveCSS(
    "background-color",
    "rgb(26, 26, 26)"
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "font-family",
    '"Homepage Neue Montreal", sans-serif'
  );
  await expect(
    page.locator(".contact-page").getByRole("link", { name: email, exact: true })
  ).toHaveAttribute("href", emailHref);
  const address = page.locator(".contact-page address");
  await address.scrollIntoViewIfNeeded();
  for (const line of layout.footer.contact.addressLines) {
    await expect(address).toContainText(line.replace(/,$/, ""));
  }
  const google = page.getByRole("link", { name: "Google Maps", exact: true });
  const apple = page.getByRole("link", { name: "Apple Maps", exact: true });
  await expect(google).toHaveAttribute("href", layout.footer.contact.mapLink.href);
  const appleUrl = new URL(await apple.getAttribute("href"));
  expect(appleUrl.origin).toBe("https://maps.apple.com");
  expect(appleUrl.searchParams.get("q")).toContain("1001 boul. Décarie");
  expect(appleUrl.searchParams.get("q")).not.toContain("Office:");
  for (const link of [google, apple]) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }
  const map = page.getByTitle("MEDomicsLab location map", { exact: true });
  await expect(map).toHaveAttribute("loading", "lazy");
  const mapUrl = new URL(await map.getAttribute("src"));
  expect(mapUrl.origin).toBe("https://www.google.com");
  expect(mapUrl.searchParams.get("q")).toBe(appleUrl.searchParams.get("q"));
  expect(mapUrl.searchParams.get("output")).toBe("embed");
  await expect(
    page.locator(".contact-page form, .contact-conversations, .contact-connection")
  ).toHaveCount(0);
  await expect(page.locator("footer.neue-footer")).toHaveCount(1);
});

test("copying the email reports success only after the clipboard write completes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.copiedEmail = null;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (value) =>
          new Promise((resolve) => {
            window.finishCopy = () => {
              window.copiedEmail = value;
              resolve();
            };
          }),
      },
    });
  });
  await page.goto(path);
  const copy = page.getByRole("button", { name: "Copy email address", exact: true });
  await copy.click();
  await expect(copy).toBeDisabled();
  await expect(copy).toHaveText("Copying...");
  await expect(page.getByRole("status")).toBeEmpty();
  await page.evaluate(() => window.finishCopy());
  await expect(copy).toBeEnabled();
  await expect(copy).toHaveText("Copied");
  await expect(page.getByRole("status")).toHaveText("Email address copied.");
  expect(await page.evaluate(() => window.copiedEmail)).toBe(email);
});

for (const mode of ["denied", "unavailable"]) {
  test(`clipboard ${mode} shows a useful error, keeps the email usable and allows retry`, async ({
    page,
  }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value:
          mode === "unavailable"
            ? undefined
            : {
                writeText: async () => {
                  throw new DOMException("Clipboard permission denied", "NotAllowedError");
                },
              },
      });
    }, mode);
    await page.goto(path);
    const copy = page.getByRole("button", { name: "Copy email address", exact: true });
    await copy.click();
    await expect(page.getByRole("status")).toHaveText(
      "Couldn't copy. Select the address or use the email link."
    );
    await expect(copy).toBeEnabled();
    await expect(copy).toHaveText("Copy email");
    await expect(page).toHaveURL(path);
    await expect(
      page.locator(".contact-page").getByRole("link", { name: email, exact: true })
    ).toHaveAttribute("href", emailHref);
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => {} },
      });
    });
    await copy.click();
    await expect(page.getByRole("status")).toHaveText("Email address copied.");
  });
}

test("keyboard navigation reaches the email and copy action with visible focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.locator(".contact-page").getByRole("link", { name: email, exact: true }).focus();
  await page.keyboard.press("Tab");
  const copy = page.getByRole("button", { name: "Copy email address", exact: true });
  await expect(copy).toBeFocused();
  await expect(copy).toHaveCSS("outline-style", "solid");
  await expect(copy).toHaveCSS("cursor", "pointer");
});

test("contact layout fits mobile, tablet and desktop with reduced-motion support", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
      .toBeLessThanOrEqual(1);
    await expect(page.locator(".contact-copy")).toHaveCSS("transition-duration", "0s");
    for (const locator of [
      page.getByRole("button", { name: "Copy email address", exact: true }),
      page.getByRole("link", { name: "Google Maps", exact: true }),
      page.getByRole("link", { name: "Apple Maps", exact: true }),
    ]) {
      const box = await locator.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
  }
});

test("contact content has no WCAG A/AA accessibility violations, including contrast", async ({
  page,
}) => {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page })
    .include(".contact-page")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
