import theme from "../../data/theme.json";
import TextTrail from "../../components/TextTrail/TextTrail.jsx";
import PageLink from "../../components/PageLink/PageLink.jsx";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <section className="not-found px-4 md:px-8" aria-labelledby="not-found-title">
      <div className="not-found-art" aria-hidden="true">
        <TextTrail
          text="404"
          fontFamily="Homepage Neue Montreal"
          fontWeight="600"
          textColor={theme.cssVars["--tertiary"]}
          backgroundColor={theme.cssVars["--background"]}
          noiseFactor={1}
          noiseScale={0.0005}
          rgbPersistFactor={0.985}
          alphaPersistFactor={0.96}
          supersample={2}
        />
      </div>
      <div className="not-found-copy">
        <h1 id="not-found-title">Page not found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <PageLink to="/" className="not-found-home" arrowSize="lg">
          Return home
        </PageLink>
      </div>
    </section>
  );
}
