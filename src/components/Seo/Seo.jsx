import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import courses from "../../data/courses.json";
import events from "../../data/events.json";
import home from "../../data/home.json";
import news from "../../data/news.json";
import publications from "../../data/publications.json";
import researchProjects from "../../data/research-projects.json";
import team from "../../data/team.json";

const SITE_NAME = "MEDomicsLab";
const SITE_URL = "https://medomicslab.com";
const DEFAULT_DESCRIPTION =
  "MEDomicsLab develops reliable predictive models from heterogeneous medical data for precision medicine research.";
const DEFAULT_IMAGE = "/images/homepage.jpg";

const collectionMetadata = {
  "/visions": {
    title: "Vision & Mission",
    description:
      "Learn how MEDomicsLab advances reliable, open, and clinically meaningful artificial intelligence research.",
  },
  "/research": {
    title: "Research",
    description:
      "Explore MEDomicsLab research in medical imaging, radiomics, predictive modelling, and precision medicine.",
  },
  "/publications": {
    title: "Publications",
    description:
      "Browse MEDomicsLab publications, presentations, and open research in medical artificial intelligence.",
  },
  "/team": {
    title: "Team",
    description: "Meet the researchers, students, and collaborators of MEDomicsLab.",
  },
  "/community/news": {
    title: "News",
    description: "The latest MEDomicsLab research news, publications, awards, and milestones.",
  },
  "/community/events": {
    title: "Events",
    description: "Upcoming and past MEDomicsLab events, presentations, and community activities.",
  },
  "/community/courses": {
    title: "Courses",
    description:
      "MEDomicsLab courses in medical imaging, machine learning, and scientific programming.",
  },
  "/community/contact": {
    title: "Contact",
    description: "Get in touch with MEDomicsLab for research and collaboration enquiries.",
  },
};

function findBySlug(value, slug) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = findBySlug(item, slug);
      if (match) return match;
    }
    return null;
  }

  if (!value || typeof value !== "object") return null;
  if (value.slug === slug) return value;

  for (const item of Object.values(value)) {
    const match = findBySlug(item, slug);
    if (match) return match;
  }
  return null;
}

function absoluteUrl(path) {
  if (!path) return `${SITE_URL}${DEFAULT_IMAGE}`;
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

function getDetail(pathname) {
  const routes = [
    ["/research/", researchProjects, "ResearchProject"],
    ["/publications/", publications, "ScholarlyArticle"],
    ["/team/", team, "ProfilePage"],
    ["/community/news/", news, "NewsArticle"],
    ["/community/events/", events, "Event"],
    ["/community/courses/", courses, "Course"],
  ];
  const match = routes.find(([prefix]) => pathname.startsWith(prefix));
  if (!match) return null;

  const [, data, type] = match;
  const slug = pathname.split("/").filter(Boolean).at(-1);
  const record = findBySlug(data, slug);
  return record ? { record, type } : null;
}

function buildStructuredData({ pathname, canonicalUrl, detail, title, description, image }) {
  if (pathname === "/") {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: canonicalUrl,
      logo: absoluteUrl(home.brand?.logoUrl),
      description,
      sameAs: [
        "https://github.com/MEDomicsLab",
        "https://www.youtube.com/@MEDomicsLab",
        "https://scholar.google.com/citations?user=fRkjFK4AAAAJ",
      ],
    };
  }

  if (!detail) {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    };
  }

  const { record, type } = detail;
  const base = {
    "@context": "https://schema.org",
    "@type": type,
    name: record.name || record.title,
    headline: record.title,
    description,
    url: canonicalUrl,
    image,
  };

  if (type === "ScholarlyArticle") {
    base.datePublished = record.date;
    base.author = (record.contributors || []).map((name) => ({ "@type": "Person", name }));
    base.publisher = { "@type": "Organization", name: SITE_NAME };
  }
  if (type === "NewsArticle") {
    base.datePublished = /^\d{4}-\d{2}-\d{2}/.exec(record.slug)?.[0];
    base.publisher = { "@type": "Organization", name: SITE_NAME };
  }
  if (type === "ProfilePage") {
    base.mainEntity = {
      "@type": "Person",
      name: record.name,
      jobTitle: record.position,
      image,
    };
  }
  if (type === "Course") base.provider = { "@type": "Organization", name: SITE_NAME };

  return base;
}

export default function Seo() {
  const { pathname } = useLocation();
  const detail = getDetail(pathname);
  const page = collectionMetadata[pathname];
  const record = detail?.record;
  const rawTitle = record?.title || record?.name || page?.title || null;
  const title = rawTitle
    ? `${rawTitle} | ${SITE_NAME}`
    : `${SITE_NAME} | Medical AI & Precision Medicine Research`;
  const description =
    record?.summary || record?.position || page?.description || DEFAULT_DESCRIPTION;
  const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
  const image = absoluteUrl(record?.image || record?.featuredImage || DEFAULT_IMAGE);
  const structuredData = buildStructuredData({
    pathname,
    canonicalUrl,
    detail,
    title,
    description,
    image,
  });

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={detail?.type === "NewsArticle" ? "article" : "website"} />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
