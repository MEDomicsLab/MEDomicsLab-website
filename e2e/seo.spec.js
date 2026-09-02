import { expect, test } from "@playwright/test";

const cases = [
  {
    path: "/",
    title: /MEDomicsLab \| Medical AI & Precision Medicine Research/,
    canonical: "https://medomicslab.com/",
    schemaType: "Organization",
  },
  {
    path: "/research/medomics-platform",
    title: /Development of the MEDomics platform \| MEDomicsLab/,
    canonical: "https://medomicslab.com/research/medomics-platform",
    schemaType: "ResearchProject",
  },
  {
    path: "/publications/medfl-a-collaborative-framework-for-federated-learning-in-medicine-2025",
    title: /MEDfl: A Collaborative Framework for Federated Learning in Medicine \| MEDomicsLab/,
    canonical:
      "https://medomicslab.com/publications/medfl-a-collaborative-framework-for-federated-learning-in-medicine-2025",
    schemaType: "ScholarlyArticle",
  },
];

for (const { path, title, canonical, schemaType } of cases) {
  test(`SEO metadata: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://medomicslab.com/images/homepage.jpg"
    );

    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(schema)).toMatchObject({ "@type": schemaType, url: canonical });
  });
}
