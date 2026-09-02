import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import courses from "./src/data/courses.json";
import events from "./src/data/events.json";
import news from "./src/data/news.json";
import publications from "./src/data/publications.json";
import researchProjects from "./src/data/research-projects.json";
import team from "./src/data/team.json";

const collectSlugs = (value) => {
  if (Array.isArray(value)) return value.flatMap(collectSlugs);
  if (!value || typeof value !== "object") return [];

  return [
    ...(typeof value.slug === "string" ? [value.slug] : []),
    ...Object.values(value).flatMap(collectSlugs),
  ];
};

const unique = (values) => [...new Set(values)];

const staticRoutes = [
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

const dynamicRoutes = [
  ...collectSlugs(researchProjects).map((slug) => `/research/${slug}`),
  ...collectSlugs(publications).map((slug) => `/publications/${slug}`),
  ...collectSlugs(team).map((slug) => `/team/${slug}`),
  ...collectSlugs(news).map((slug) => `/community/news/${slug}`),
  ...collectSlugs(events).map((slug) => `/community/events/${slug}`),
  ...collectSlugs(courses).map((slug) => `/community/courses/${slug}`),
];

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: "https://medomicslab.com",
      dynamicRoutes: unique([...staticRoutes, ...dynamicRoutes]),
      changefreq: {
        "*": "monthly",
        "/": "weekly",
        "/community/news": "weekly",
      },
      priority: {
        "*": 0.7,
        "/": 1,
        "/research": 0.9,
        "/publications": 0.9,
      },
      readable: true,
    }),
  ],
});
