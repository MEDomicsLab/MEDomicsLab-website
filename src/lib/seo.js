import courses from "../data/courses.json" with { type: "json" };
import events from "../data/events.json" with { type: "json" };
import home from "../data/home.json" with { type: "json" };
import layout from "../data/layout.json" with { type: "json" };
import news from "../data/news.json" with { type: "json" };
import publications from "../data/publications.json" with { type: "json" };
import research from "../data/research-projects.json" with { type: "json" };
import team from "../data/team.json" with { type: "json" };
import seo from "../data/seo.json" with { type: "json" };
import { hasPublicationLink } from "./publications.js";
import { imageVariant } from "./images.js";

export const siteUrl = home.brand.siteUrl;

function records(value) {
  if (Array.isArray(value)) return value.flatMap(records);
  if (!value || typeof value !== "object") return [];
  return value.slug ? [value] : Object.values(value).flatMap(records);
}

const details = [
  ["/research", research, "ResearchProject"],
  ["/publications", publications, "ScholarlyArticle"],
  ["/team", team, "ProfilePage"],
  ["/community/news", news, "NewsArticle"],
  ["/community/events", events, "Event"],
  ["/community/courses", courses, "Course"],
].flatMap(([prefix, data, type]) =>
  records(data).map((record) => ({
    path: `${prefix}/${record.slug}`,
    section: prefix,
    type,
    record,
    redirect:
      type === "ScholarlyArticle" && record.redirect && hasPublicationLink(record)
        ? record.link
        : null,
  }))
);

export const siteRoutes = [
  ...Object.entries(seo.pages).map(([path, page]) => ({ path, ...page })),
  ...details,
];
const routeMap = new Map(siteRoutes.map((route) => [route.path, route]));
if (routeMap.size !== siteRoutes.length)
  throw new Error("Duplicate public page URL in content data.");

export const redirects = details.filter((route) => route.redirect);

export const indexableRoutes = siteRoutes.filter((route) => !route.redirect);
const titleCounts = new Map();
for (const route of indexableRoutes) {
  const title = route.record?.title || route.record?.name || route.title;
  titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
}

export function getSiteRoute(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return routeMap.get(path) ?? null;
}

function absoluteUrl(path) {
  return new URL(path, `${siteUrl}/`).href;
}

function descriptionFor(route) {
  const { record, type } = route;
  if (!record) return route.description || seo.description;
  if (type === "Course") {
    return [record.title, record.summary, record.institution].filter(Boolean).join(". ");
  }
  if (record.summary) return record.summary;
  if (type === "ProfilePage") {
    return `${record.name} — ${record.position || home.brand.name}.`;
  }
  return [record.title, record.journal || record.category, record.contributors?.join(", ")]
    .filter(Boolean)
    .join(". ");
}

function structuredDataFor(route, canonicalUrl, description, image) {
  const organization = { "@type": "Organization", name: home.brand.name, url: `${siteUrl}/` };
  const base = {
    "@context": "https://schema.org",
    "@type": route.type || "CollectionPage",
    name: route.record?.name || route.record?.title || route.title,
    description,
    url: canonicalUrl,
    image,
  };
  if (route.path === "/") {
    return {
      ...base,
      ...organization,
      logo: absoluteUrl(home.brand.logoUrl),
      sameAs: layout.footer.social.links.map((link) => link.href),
    };
  }
  if (!route.record) {
    if (route.path === "/community/contact") base["@type"] = "ContactPage";
    base.isPartOf = { "@type": "WebSite", name: home.brand.name, url: `${siteUrl}/` };
    return base;
  }
  const { record, type } = route;
  if (type === "ScholarlyArticle") {
    base.headline = record.title;
    base.datePublished = record.date;
    base.author = (record.contributors || []).map((name) => ({ "@type": "Person", name }));
    if (record.journal) base.isPartOf = { "@type": "Periodical", name: record.journal };
    if (hasPublicationLink(record)) base.sameAs = record.link;
  }
  if (type === "NewsArticle") {
    base.headline = record.title;
    base.datePublished = /^\d{4}-\d{2}-\d{2}/.exec(record.slug)?.[0];
    base.publisher = organization;
    base.about = (record.contributors || []).map((name) => ({ "@type": "Person", name }));
  }
  if (type === "ProfilePage") {
    base.mainEntity = {
      "@type": "Person",
      name: record.name,
      url: canonicalUrl,
      jobTitle: record.position?.split("|")[0].trim(),
      image,
    };
  }
  if (type === "Event" && record.date) base.startDate = record.date;
  if (type === "Course" && record.institution) {
    base.provider = { "@type": "Organization", name: record.institution };
  }
  return base;
}

export function getPageMetadata(pathname) {
  const route = getSiteRoute(pathname);
  const record = route?.record;
  const indexable = Boolean(route && !route.redirect);
  let rawTitle = route?.redirect
    ? "Page moved"
    : record?.title || record?.name || route?.title || "Page not found";
  if (indexable && titleCounts.get(rawTitle) > 1) {
    const context = [seo.pages[route.section]?.title, record?.date].filter(Boolean).join(", ");
    rawTitle += ` (${context})`;
  }
  const title = `${rawTitle} | ${home.brand.name}`;
  const canonicalUrl = route ? absoluteUrl(route.redirect || route.path) : null;
  const description = indexable
    ? descriptionFor(route).replace(/\s+/g, " ").trim()
    : route
      ? "This page has moved. Follow the link to its new address."
      : "The requested page could not be found.";
  const portrait =
    route?.type === "ProfilePage" && record.image
      ? imageVariant(record.image, 256, "webp")
      : record?.image;
  const image = absoluteUrl(record?.coverImage?.url || portrait || seo.image);
  return {
    title,
    shareTitle: route?.path === "/" ? `${home.brand.name} | ${seo.tagline}` : title,
    siteName: home.brand.name,
    description,
    canonicalUrl,
    image,
    imageAlt: record?.coverImage?.alt || record?.name || record?.title || home.brand.name,
    indexable,
    redirect: route?.redirect,
    ogType: ["NewsArticle", "ScholarlyArticle"].includes(route?.type)
      ? "article"
      : route?.type === "ProfilePage"
        ? "profile"
        : "website",
    schema: indexable ? structuredDataFor(route, canonicalUrl, description, image) : null,
  };
}
