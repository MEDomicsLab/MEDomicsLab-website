import theme from "../../data/theme.json";
import { lazy, Suspense } from "react";
import PageLink from "../../components/PageLink/PageLink.jsx";
import "./StatusPage.css";

const TextTrail = lazy(() => import("../../components/TextTrail/TextTrail.jsx"));

export default function StatusPage({ artwork, title, children }) {
  return (
    <section className="status-page px-4 md:px-8" aria-labelledby="status-page-title">
      <div className="status-page-art" aria-hidden="true">
        {!import.meta.env.SSR && (
          <Suspense fallback={null}>
            <TextTrail
              text={artwork}
              fontFamily="PPnMTL"
              fontWeight="600"
              textColor={theme.cssVars["--tertiary"]}
              backgroundColor={theme.cssVars["--background"]}
              noiseFactor={1}
              noiseScale={0.0005}
              rgbPersistFactor={0.985}
              alphaPersistFactor={0.96}
              supersample={2}
            />
          </Suspense>
        )}
      </div>
      <div className="status-page-copy">
        <h1 id="status-page-title">{title}</h1>
        <p>{children}</p>
        <PageLink to="/" className="status-page-home" arrowSize="lg">
          Return home
        </PageLink>
      </div>
    </section>
  );
}
