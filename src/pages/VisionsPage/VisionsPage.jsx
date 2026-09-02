import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import visionsDataRaw from "../../data/visions.json";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal.jsx";
import ScrambledText from "../../components/ScrambledText/ScrambledText.jsx";
import ShimmeringText from "../../components/ShimmeringText/ShimmeringText.jsx";
import SkeletonImage from "../../components/SkeletonImage/SkeletonImage.jsx";
import ResearchAxis from "../../components/ResearchAxis/ResearchAxis.jsx";
import ScrollHint from "../../components/ScrollHint/ScrollHint.jsx";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";
import SectionTicks from "../../components/SectionTicks/SectionTicks.jsx";
import { PageTitle } from "../../components/PageShell/PageShell.jsx";

import "./VisionsPage.css";

const SECTIONS = [
  { id: "context", label: "Context" },
  { id: "mission", label: "Mission" },
  { id: "research-axis", label: "Research Axis" },
  { id: "whats-next", label: "What's Next" },
];

export default function VisionsPage() {
  const hero = visionsDataRaw?.hero;
  const context = visionsDataRaw?.context;
  const mission = visionsDataRaw?.mission;
  const visions = visionsDataRaw?.visions ?? [];

  const visionsData = useMemo(
    () =>
      visions.map((v, i) => ({
        ...v,
        imageUrl: v.imageUrl || `/images/albums/visions/axis_${i + 1}.png`,
      })),
    [visions]
  );

  const [scrollHintOpacity, setScrollHintOpacity] = useState(1);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const scrollHintTimeoutRef = useRef(null);
  const missionPointsRef = useRef(null);
  const isMissionPointsInView = useInView(missionPointsRef, { once: true, margin: "-20% 0px" });

  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollHintOpacity(0.1);
      if (scrollHintTimeoutRef.current) {
        window.clearTimeout(scrollHintTimeoutRef.current);
      }
      scrollHintTimeoutRef.current = window.setTimeout(() => {
        setScrollHintOpacity(1);
      }, 450);

      let current = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
            current = section.id;
          }
        }
      }
      setActiveSection((prev) => (prev === current ? prev : current));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollHintTimeoutRef.current) {
        window.clearTimeout(scrollHintTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const heroImage = hero?.imageUrl || "/images/albums/visions/main_context.png";

  const heroTitle = hero?.title || "Visions";
  const heroSubtitle =
    hero?.subtitle ||
    "The MEDomicsLab research laboratory focuses on the development of predictive models with heterogeneous medical data.";

  const missionImage = hero?.missionImageUrl || "/images/albums/visions/mission.png";

  const contextLabel = context?.label || "Context";
  const contextText = context?.text || "";

  const missionLabel = mission?.label || "Mission";
  const missionLead = mission?.lead || "";
  const missionPoints = mission?.points ?? [];
  const missionClosing = mission?.closing || "";

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 md:px-8 pt-24 flex relative">
        <SectionTicks
          variant="team"
          items={SECTIONS}
          activeId={activeSection}
          onSelect={(id) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" })}
          labelClassName="whitespace-nowrap"
        />

        <div className="w-full lg:pl-32">
          <section>
            <div className="max-w-5xl">
              <PageTitle className="mb-6">{heroTitle}</PageTitle>

              <p className="text-lg md:text-2xl text-muted-foreground max-w-5xl">{heroSubtitle}</p>

              <div className="mt-12">
                <div className="relative overflow-hidden">
                  <div className="relative w-full aspect-[16/7]">
                    <SkeletonImage
                      src={heroImage}
                      alt={`${heroTitle} figure`}
                      className="absolute inset-0"
                      imgClassName="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      fill
                    />
                    <div className="absolute inset-0 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="context"
            ref={(element) => {
              sectionRefs.current.context = element;
            }}
            className="py-16 md:py-24 scroll-mt-32"
          >
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/55">{contextLabel}</p>

            {isDesktop ? (
              <ScrollReveal
                baseOpacity={0.12}
                enableBlur
                baseRotation={2.5}
                blurStrength={5}
                rotationEnd="bottom center"
                wordAnimationEnd="bottom center"
                containerClassName="max-w-5xl"
                textClassName="text-white/90"
              >
                {contextText}
              </ScrollReveal>
            ) : (
              <p className="text-white/90 max-w-5xl">{contextText}</p>
            )}
          </section>

          <section
            id="mission"
            ref={(element) => {
              sectionRefs.current.mission = element;
            }}
            className="py-8 mission-section scroll-mt-32"
          >
            <div className="max-w-6xl space-y-8">
              <p className="text-xs uppercase tracking-[0.35em] text-white/55">{missionLabel}</p>
              <div className="mission-grid">
                <div className="mission-content">
                  {isDesktop ? (
                    <ScrambledText
                      className="scrambled-text-demo"
                      radius={100}
                      duration={1.2}
                      speed={0.5}
                      scrambleChars=".:"
                    >
                      {missionLead}
                    </ScrambledText>
                  ) : (
                    <p className="scrambled-text-demo">{missionLead}</p>
                  )}

                  {!!missionClosing && <p className="text-muted-foreground">{missionClosing}</p>}
                </div>

                {missionPoints.length > 0 && (
                  <div className="mission-points" ref={missionPointsRef}>
                    {missionPoints.map((p, idx) => (
                      <div className="mission-point" key={p}>
                        <span className="mission-point-label">({idx === 0 ? "i" : "ii"})</span>
                        <p>
                          <ShimmeringText
                            text={p}
                            duration={1.2}
                            shimmeringColor="var(--color-neutral-200)"
                            color="var(--color-neutral-500)"
                            inView={isMissionPointsInView}
                            inViewOnce
                            animate={isDesktop}
                          />
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="vision-figure">
                <div className="vision-figure-frame">
                  <SkeletonImage
                    src={missionImage}
                    alt="MEDomicsLab mission framework"
                    className="absolute inset-0"
                    imgClassName="vision-figure-image"
                    loading="lazy"
                    decoding="async"
                    fill
                  />
                  <div className="vision-figure-overlay" aria-hidden="true" />
                </div>
              </div>
            </div>
          </section>
          <section
            id="research-axis"
            ref={(element) => {
              sectionRefs.current["research-axis"] = element;
            }}
            className="pt-8 pb-12 scroll-mt-32"
          >
            <ResearchAxis items={visionsData} eyebrow="Research Axis" />
          </section>

          <section
            id="whats-next"
            ref={(element) => {
              sectionRefs.current["whats-next"] = element;
            }}
            className="py-16 scroll-mt-32"
          >
            <div className="next-section space-y-6">
              <h2 className="open-source-title">What&apos;s Next?</h2>
              <p className="open-source-body text-muted-foreground">
                Explore what&apos;s ahead for MEDomicsLab and our community.
              </p>
            </div>

            <div className="explore-links">
              {[
                {
                  label: "Explore MEDomicsLab's Open-Source Best Practices",
                  path: "https://github.com/MEDomicsLab",
                  external: true,
                },
                { label: "Explore MEDomicsLab's Current Research Projects", path: "/research" },
                { label: "Explore MEDomicsLab's Team", path: "/team" },
                { label: "Explore MEDomicsLab's Publications", path: "/publications" },
                { label: "Explore MEDomicsLab's News", path: "/community/news" },
                { label: "Explore MEDomicsLab's Events", path: "/community/events" },
              ].map((item) =>
                item.external ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noreferrer"
                    className="group explore-link"
                  >
                    {item.label} <HoverArrow className="w-4 h-4" />
                  </a>
                ) : (
                  <Link key={item.path} to={item.path} className="group explore-link">
                    {item.label} <HoverArrow className="w-4 h-4" />
                  </Link>
                )
              )}
            </div>
          </section>
        </div>
      </div>

      <div
        className="vision-scroll-down"
        style={{ opacity: isFooterVisible ? 0 : scrollHintOpacity }}
      >
        <ScrollHint label="Scroll Down" bounce />
      </div>
    </div>
  );
}
