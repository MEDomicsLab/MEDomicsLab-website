import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation } from "react-router-dom";
import LiquidGlass from "liquid-glass-react";
import { useTranslations } from "../../lib/translations";
import { cn } from "../../lib/utils";
import homeData from "../../data/home.json";
import layoutData from "../../data/layout.json";
import RollingText from "../RollingText/RollingText.jsx";
import FlipWords from "../FlipWords/FlipWords.jsx";
import { MotionHighlight, MotionHighlightItem } from "../MotionHighlight/MotionHighlight.jsx";
import ShinyText from "../ShinyText/ShinyText.jsx";
import SkeletonImage from "../SkeletonImage/SkeletonImage.jsx";
import Seo from "../Seo/Seo.jsx";
import { LIQUID_PARAMS } from "../../lib/liquidGlassParams";
import "./Layout.css";

export default function Layout() {
  const { t } = useTranslations();
  const liquid = LIQUID_PARAMS;
  const location = useLocation();
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const communityTimeoutRef = useRef(null);
  const communityButtonRef = useRef(null);
  const communityMenuRef = useRef(null);
  const [communityDropdownPos, setCommunityDropdownPos] = useState(null);
  const [shouldFocusCommunityMenu, setShouldFocusCommunityMenu] = useState(false);
  const [rollingTextIndex, setRollingTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [navLeft, setNavLeft] = useState(() =>
    window.innerWidth <= 767 ? window.innerWidth / 2 : window.innerWidth - 200
  );

  useEffect(() => {
    const update = () => {
      const el = document.querySelector(".liquid-nav-anchor");
      const w = el?.getBoundingClientRect().width ?? 0;
      setNavLeft(window.innerWidth <= 767 ? window.innerWidth / 2 : window.innerWidth - w / 2 - 32);
    };
    const id = window.setTimeout(update, 0);
    const ro = new ResizeObserver(update);
    const el = document.querySelector(".liquid-nav-anchor");
    if (el) ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(id);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (communityTimeoutRef.current) {
        clearTimeout(communityTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isCommunityOpen || !communityButtonRef.current) return;
    const rect = communityButtonRef.current.getBoundingClientRect();
    const dropdownHalfH = 55;
    const gap = 16;
    setCommunityDropdownPos({
      top: rect.bottom + gap + dropdownHalfH,
      left: rect.left + rect.width / 2,
    });
  }, [isCommunityOpen]);

  useEffect(() => {
    if (!shouldFocusCommunityMenu || !isCommunityOpen || !communityDropdownPos) return;

    communityMenuRef.current?.querySelector("a")?.focus();
    setShouldFocusCommunityMenu(false);
  }, [communityDropdownPos, isCommunityOpen, shouldFocusCommunityMenu]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRollingTextIndex((index) => index + 1);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = layoutData.navItems;
  const footer = layoutData.footer;
  const footerAddress = footer.contact.addressLines.join("\n");
  const getNavLabel = (item) =>
    item.labelKey ? t(item.labelKey, item.defaultLabel) : item.defaultLabel;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      <Seo />
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 text-center md:top-8 md:left-8 md:translate-x-0 md:text-left text-white">
        <Link
          to="/"
          className="text-xl font-bold tracking-tighter uppercase group relative flex items-center gap-2 justify-center md:justify-start"
          aria-label="MEDomicsLab homepage"
        >
          {t("brand.name", "MEDomicsLab")}
          {homeData.brand?.logoUrl && (
            <>
              <span className="text-white/60 inline-block transition-transform duration-200 group-hover:rotate-[24deg]">
                |
              </span>
              <SkeletonImage
                src={homeData.brand.logoUrl}
                alt="MEDomicsLab logo"
                className="h-5 w-5"
                imgClassName="h-full w-full object-contain"
                skeletonClassName="rounded"
                sizes="20px"
                variantSizes={[80, 128]}
                fallbackSrc={homeData.brand.logoUrl}
                formats={[]}
              />
            </>
          )}
        </Link>
      </div>

      <LiquidGlass
        displacementScale={liquid.nav.displacementScale}
        blurAmount={liquid.nav.blurAmount}
        saturation={liquid.nav.saturation}
        aberrationIntensity={liquid.nav.aberrationIntensity}
        elasticity={liquid.nav.elasticity}
        cornerRadius={liquid.nav.cornerRadius}
        mode={liquid.nav.mode}
        overLight={liquid.nav.overLight}
        padding={isMobile ? "12px 16px" : "12px 24px"}
        className="liquid-nav-anchor"
        style={{
          position: "fixed",
          top: isMobile ? 96 : 46,
          left: navLeft,
          zIndex: 50,
        }}
      >
        <nav aria-label="Main navigation">
          <MotionHighlight
            mode="parent"
            hover
            controlledItems
            className="!bg-transparent overflow-hidden"
            style={{
              backdropFilter: `blur(${liquid.tabHighlight.blurAmount}px) saturate(${liquid.tabHighlight.saturation}%)`,
              WebkitBackdropFilter: `blur(${liquid.tabHighlight.blurAmount}px) saturate(${liquid.tabHighlight.saturation}%)`,
              backgroundColor: `rgba(255, 255, 255, ${liquid.tabHighlight.tintOpacity * liquid.tabHighlight.opacity})`,
              borderRadius: `${liquid.tabHighlight.cornerRadius}px`,
              boxShadow: [
                `0 0 0 0.5px rgba(255, 255, 255, ${liquid.tabHighlight.borderOpacity * liquid.tabHighlight.opacity}) inset`,
                `0 1px 2px rgba(255, 255, 255, ${liquid.tabHighlight.innerHighlightOpacity * liquid.tabHighlight.opacity}) inset`,
                `0 4px 14px rgba(0, 0, 0, ${liquid.tabHighlight.shadowOpacity * liquid.tabHighlight.opacity})`,
              ].join(", "),
            }}
            containerClassName="relative flex flex-nowrap items-center gap-x-1 md:gap-x-6"
            boundsOffset={
              isMobile
                ? { top: -7, left: -6, width: 12, height: 16 }
                : { top: -6, left: -10, width: 20, height: 12 }
            }
          >
            {navItems.map((item) =>
              item.children ? (
                <MotionHighlightItem
                  key={item.default}
                  className="relative flex h-7 items-center md:h-8"
                  disabled={
                    location.pathname === "/community/news" ||
                    location.pathname === "/community/events" ||
                    location.pathname === "/community/courses" ||
                    location.pathname === "/community/contact"
                  }
                >
                  <div
                    className="relative px-2 py-1 rounded-full"
                    onMouseEnter={() => {
                      if (communityTimeoutRef.current) {
                        clearTimeout(communityTimeoutRef.current);
                        communityTimeoutRef.current = null;
                      }
                      setIsCommunityOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (communityTimeoutRef.current) {
                        clearTimeout(communityTimeoutRef.current);
                      }
                      communityTimeoutRef.current = setTimeout(() => {
                        setIsCommunityOpen(false);
                      }, 1000);
                    }}
                  >
                    <button
                      type="button"
                      ref={communityButtonRef}
                      className={cn(
                        "inline-flex items-center text-[8px] md:text-xs font-semibold uppercase tracking-tighter whitespace-nowrap text-white hover:text-primary transition-colors leading-none p-0 bg-transparent border-0 align-middle relative -top-px"
                      )}
                      aria-haspopup="true"
                      aria-expanded={isCommunityOpen}
                      aria-controls="community-navigation-menu"
                      onClick={() => {
                        if (communityTimeoutRef.current) {
                          clearTimeout(communityTimeoutRef.current);
                          communityTimeoutRef.current = null;
                        }
                        setIsCommunityOpen((isOpen) => !isOpen);
                        setShouldFocusCommunityMenu(false);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setIsCommunityOpen(false);
                          setShouldFocusCommunityMenu(false);
                          return;
                        }

                        if (["Enter", " ", "ArrowDown"].includes(event.key)) {
                          event.preventDefault();
                          if (communityTimeoutRef.current) {
                            clearTimeout(communityTimeoutRef.current);
                            communityTimeoutRef.current = null;
                          }
                          setIsCommunityOpen(true);
                          setShouldFocusCommunityMenu(true);
                        }
                      }}
                    >
                      {getNavLabel(item)}
                    </button>
                  </div>
                </MotionHighlightItem>
              ) : (
                <MotionHighlightItem
                  key={item.path}
                  className="relative flex h-7 items-center md:h-8"
                  disabled={location.pathname === item.path}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "inline-flex items-center text-[8px] md:text-xs uppercase tracking-tighter whitespace-nowrap hover:text-primary transition-colors relative leading-none px-1.5 py-1 rounded-full",
                      location.pathname === item.path
                        ? "text-primary font-bold"
                        : "text-white font-semibold"
                    )}
                    style={
                      location.pathname === item.path
                        ? {
                            color: "var(--primary)",
                            isolation: "isolate",
                            mixBlendMode: "normal",
                          }
                        : undefined
                    }
                  >
                    {getNavLabel(item)}
                    {location.pathname === item.path && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-[1px] bg-primary"
                        style={{ backgroundColor: "var(--primary)" }}
                      />
                    )}
                  </Link>
                </MotionHighlightItem>
              )
            )}
          </MotionHighlight>
        </nav>
      </LiquidGlass>

      <main className={cn("min-h-screen md:pt-0", location.pathname === "/" ? "pt-0" : "pt-28")}>
        <Outlet />
      </main>

      <footer className="border-t border-border mt-0 bg-background relative z-10">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left justify-items-center md:justify-items-start">
            <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
              <a
                href={footer.unitLink.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-widest text-muted-foreground mb-3 inline-block hover:text-primary transition-colors"
              >
                {footer.unitLink.label}
              </a>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6 leading-none">
                <span className="block">Advancing</span>
                <FlipWords
                  words={[
                    "precision",
                    "multimodal",
                    "imaging",
                    "radiomics",
                    "distributed",
                    "privacy",
                    "open-source",
                  ]}
                  className="px-0 text-primary"
                  exitScale={1.15}
                />
                <span className="block">Medicine</span>
              </h2>
            </div>

            <div className="space-y-4 flex flex-col items-center md:items-start">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                {t(footer.contact.labelKey, footer.contact.labelDefault)}
              </h3>
              <p className="text-sm whitespace-pre-line">{footerAddress}</p>
              <a
                href={footer.contact.mapLink.href}
                className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                {footer.contact.mapLink.label}
              </a>
            </div>

            <div className="space-y-4 flex flex-col items-center md:items-start">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                {t(footer.social.labelKey, footer.social.labelDefault)}
              </h3>
              <div className="flex flex-col space-y-2 text-sm">
                {footer.social.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="pt-4 border-t border-border/60">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  {footer.social.reachOutLabel}
                </h4>
                <div className="flex flex-col space-y-2 text-sm">
                  {footer.social.reachOutLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground uppercase tracking-widest">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-2 transition-colors hover:text-foreground"
              aria-label="Back to the MEDomicsLab homepage"
            >
              © {new Date().getFullYear()} MEDomicsLab
              {homeData.brand?.logoUrl && (
                <>
                  <span className="inline-block text-white/30 transition-transform duration-200 group-hover:rotate-[24deg]">
                    |
                  </span>
                  <SkeletonImage
                    src={homeData.brand.logoUrl}
                    alt="MEDomicsLab logo"
                    className="h-4 w-4"
                    imgClassName="h-full w-full object-contain"
                    skeletonClassName="rounded"
                    sizes="16px"
                    formats={[]}
                  />
                </>
              )}
            </Link>
            <a
              className="text-[10px] md:text-[11px] tracking-widest uppercase opacity-65 transition-opacity hover:opacity-100"
              href={footer.creditLink}
              target="_blank"
              rel="noreferrer"
            >
              <ShinyText text={footer.credit} color="#9ca3af" shineColor="#ffffff" speed={3} />
            </a>
          </div>
        </div>
      </footer>
      {isCommunityOpen &&
        communityDropdownPos &&
        createPortal(
          <div className="community-modal-portal">
            <LiquidGlass
              displacementScale={liquid.communityModal.displacementScale}
              blurAmount={liquid.communityModal.blurAmount}
              saturation={liquid.communityModal.saturation}
              aberrationIntensity={liquid.communityModal.aberrationIntensity}
              elasticity={liquid.communityModal.elasticity}
              cornerRadius={liquid.communityModal.cornerRadius}
              mode={liquid.communityModal.mode}
              overLight={liquid.communityModal.overLight}
              padding="12px 24px"
              className="community-modal-glass"
              style={{
                position: "fixed",
                top: communityDropdownPos.top,
                left: communityDropdownPos.left,
                zIndex: 60,
              }}
            >
              <div
                id="community-navigation-menu"
                ref={communityMenuRef}
                role="menu"
                tabIndex={-1}
                className="flex flex-col gap-2"
                onMouseEnter={() => {
                  if (communityTimeoutRef.current) {
                    clearTimeout(communityTimeoutRef.current);
                    communityTimeoutRef.current = null;
                  }
                  setIsCommunityOpen(true);
                }}
                onMouseLeave={() => {
                  if (communityTimeoutRef.current) {
                    clearTimeout(communityTimeoutRef.current);
                  }
                  communityTimeoutRef.current = setTimeout(() => {
                    setIsCommunityOpen(false);
                  }, 400);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setIsCommunityOpen(false);
                    setShouldFocusCommunityMenu(false);
                    communityButtonRef.current?.focus();
                  }
                }}
              >
                {(layoutData.navItems.find((n) => n.children)?.children ?? []).map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    role="menuitem"
                    className="inline-flex items-center whitespace-nowrap text-[10px] md:text-xs uppercase tracking-tighter text-white hover:text-primary transition-colors leading-none"
                  >
                    {child.rollingText?.length ? (
                      <span className="relative inline-flex items-center">
                        <span className="invisible">
                          {child.rollingText.reduce((a, b) => (a.length >= b.length ? a : b))}
                          {child.rollingSuffix ?? ""}
                        </span>
                        <span className="absolute inset-0 inline-flex items-center">
                          <RollingText
                            key={child.rollingText[rollingTextIndex % child.rollingText.length]}
                            text={child.rollingText[rollingTextIndex % child.rollingText.length]}
                            className="inline-flex"
                          />
                          {child.rollingSuffix ? (
                            <span className="ml-1">{child.rollingSuffix}</span>
                          ) : null}
                        </span>
                      </span>
                    ) : (
                      child.label
                    )}
                  </Link>
                ))}
              </div>
            </LiquidGlass>
          </div>,
          document.body
        )}
    </div>
  );
}
