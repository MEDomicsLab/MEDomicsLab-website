import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getPageMetadata } from "../../lib/seo.js";
import theme from "../../data/theme.json";

export default function Seo() {
  const { pathname } = useLocation();
  const meta = getPageMetadata(pathname);
  return (
    <Helmet>
      <html lang="en" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta
        name="theme-color"
        content={theme.cssVars[pathname === "/" ? "--tertiary" : "--background"]}
      />
      <meta name="robots" content={meta.indexable ? "index, follow" : "noindex, follow"} />
      {meta.canonicalUrl && <link rel="canonical" href={meta.canonicalUrl} />}
      {meta.redirect && <meta httpEquiv="refresh" content={`0;url=${meta.redirect}`} />}
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:title" content={meta.shareTitle} />
      <meta property="og:description" content={meta.description} />
      {meta.canonicalUrl && <meta property="og:url" content={meta.canonicalUrl} />}
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:alt" content={meta.imageAlt} />
      <meta
        name="twitter:card"
        content={meta.ogType === "profile" ? "summary" : "summary_large_image"}
      />
      <meta name="twitter:title" content={meta.shareTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <meta name="twitter:image:alt" content={meta.imageAlt} />
      {meta.schema && (
        <script type="application/ld+json">
          {JSON.stringify(meta.schema).replace(/</g, "\\u003c")}
        </script>
      )}
    </Helmet>
  );
}
