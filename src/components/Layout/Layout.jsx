import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { GlassFrame } from "../GlassSurface/GlassSurface.jsx";
import { cn } from "../../lib/utils";
import homeData from "../../data/home.json";
import layoutData from "../../data/layout.json";
import RollingText from "../RollingText/RollingText.jsx";
import { MotionHighlight, MotionHighlightItem } from "../MotionHighlight/MotionHighlight.jsx";
import SkeletonImage from "../SkeletonImage/SkeletonImage.jsx";
import Seo from "../Seo/Seo.jsx";
import { LIQUID_PARAMS } from "../../lib/liquidGlassParams";
import SiteShortcuts from "./SiteShortcuts.jsx";
import NavDropdown, {
  NAV_MENU_ITEM_CLASS,
  NAV_TEXT_CLASS,
  NAV_TRIGGER_CLOSE_DELAY,
  NAV_MENU_CLOSE_DELAY,
} from "./NavDropdown.jsx";
import { scrollToSection, scrollToTopNow } from "../../lib/lenis";
import Footer from "../Footer/Footer.jsx";
import "./Layout.css";
import "./InteriorPages.css";

export default function Layout() {
  const liquid = LIQUID_PARAMS;
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [homeScrolled, setHomeScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return undefined;
    const update = () => {
      setHomeScrolled(window.scrollY > 80);
      const lab = document.querySelector("#lab");
      setHeroBehindNav(
        !lab || lab.getBoundingClientRect().top > (window.innerWidth < 1100 ? 96 : 46)
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const communityTimeoutRef = useRef(null);
  const communityButtonRef = useRef(null);
  const communityMenuRef = useRef(null);
  const [shouldFocusCommunityMenu, setShouldFocusCommunityMenu] = useState(false);
  const clearCommunityFocusRequest = useCallback(() => setShouldFocusCommunityMenu(false), []);
  const [rollingTextIndex, setRollingTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [navTop, setNavTop] = useState(46);
  const [heroBehindNav, setHeroBehindNav] = useState(isHome);

  useLayoutEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth <= 767);
      setNavTop(window.innerWidth < 1100 ? 96 : 46);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    return () => {
      if (communityTimeoutRef.current) {
        clearTimeout(communityTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRollingTextIndex((index) => index + 1);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  // Reset every history entry, including back/forward. The next frame covers
  // restoration and animation work queued during the route commit.
  useLayoutEffect(() => {
    if (location.hash) return undefined;
    scrollToTopNow();
    const frame = requestAnimationFrame(scrollToTopNow);
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.hash]);

  useEffect(() => {
    if (!location.hash) return undefined;
    let cancelled = false;
    let frame;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        const section = document.getElementById(location.hash.slice(1));
        if (section) scrollToSection(section);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [location.key, location.hash]);

  const navItems = layoutData.navItems;

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans",
        isHome && "neue-home-layout",
        !isHome && "neue-interior-layout"
      )}
    >
      <Seo />
      <div
        className={cn(
          "site-brand fixed top-4 left-1/2 -translate-x-1/2 z-50 md:top-8 md:left-8 md:translate-x-0 text-white",
          isHome && "neue-home-brand",
          isHome && !homeScrolled && "is-hidden"
        )}
      >
        <Link
          to="/"
          className="text-xl font-bold tracking-tighter group relative flex items-center gap-2 justify-center md:justify-start"
          aria-label={`${homeData.brand.name} homepage`}
        >
          <span className="site-brand-wordmark">{homeData.brand.name}</span>
          {homeData.brand?.logoUrl && (
            <>
              <span className="text-white/60 inline-block transition-transform duration-200 group-hover:rotate-[24deg]">
                |
              </span>
              <SkeletonImage
                src={homeData.brand.logoUrl}
                alt={`${homeData.brand.name} logo`}
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

      <GlassFrame
        displacementScale={liquid.nav.displacementScale}
        blurAmount={liquid.nav.blurAmount}
        saturation={liquid.nav.saturation}
        aberrationIntensity={liquid.nav.aberrationIntensity}
        elasticity={liquid.nav.elasticity}
        cornerRadius={liquid.nav.cornerRadius}
        mode={liquid.nav.mode}
        overLight={liquid.nav.overLight}
        padding={isMobile ? (isHome ? "12px 8px" : "12px 16px") : "12px 24px"}
        surfaceClassName="liquid-nav-anchor"
        style={{
          position: "fixed",
          top: navTop,
          left: "50%",
          zIndex: 50,
        }}
      >
        <nav aria-label="Main navigation">
          <MotionHighlight
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
                  key={item.defaultLabel}
                  className="relative flex h-7 items-center md:h-8"
                  disabled={item.children.some((child) => location.pathname === child.path)}
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
                      }, NAV_TRIGGER_CLOSE_DELAY);
                    }}
                  >
                    <button
                      type="button"
                      ref={communityButtonRef}
                      className={cn(
                        NAV_TEXT_CLASS,
                        "inline-flex items-center uppercase whitespace-nowrap text-white transition-colors leading-none p-0 bg-transparent border-0 align-middle relative -top-px",
                        !isHome && "hover:text-primary"
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
                      {item.defaultLabel}
                    </button>
                  </div>
                </MotionHighlightItem>
              ) : item.disabled ? (
                <button
                  key={item.path}
                  type="button"
                  disabled
                  aria-disabled="true"
                  className={cn(NAV_TEXT_CLASS, "nav-disabled uppercase px-1.5 py-1")}
                >
                  {item.defaultLabel}
                </button>
              ) : (
                <MotionHighlightItem
                  key={item.path}
                  className="relative flex h-7 items-center md:h-8"
                  disabled={location.pathname === item.path}
                >
                  <Link
                    to={item.path}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                    className={cn(
                      NAV_TEXT_CLASS,
                      "inline-flex items-center uppercase whitespace-nowrap transition-colors relative leading-none px-1.5 py-1 rounded-full",
                      !isHome && "hover:text-primary",
                      location.pathname === item.path
                        ? "text-primary font-bold"
                        : "text-white font-semibold"
                    )}
                    style={
                      location.pathname === item.path
                        ? {
                            color: isHome && heroBehindNav ? "white" : "var(--primary)",
                            isolation: "isolate",
                            mixBlendMode: "normal",
                          }
                        : undefined
                    }
                  >
                    {item.defaultLabel}
                    {location.pathname === item.path && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-[1px] bg-primary"
                        style={{
                          backgroundColor: isHome && heroBehindNav ? "white" : "var(--primary)",
                        }}
                      />
                    )}
                  </Link>
                </MotionHighlightItem>
              )
            )}
          </MotionHighlight>
        </nav>
      </GlassFrame>

      <SiteShortcuts
        href={
          layoutData.footer.social.links.find((link) => link.href.startsWith("https://github.com/"))
            .href
        }
        liquid={liquid}
      />

      <main className={cn("min-h-screen md:pt-0", location.pathname === "/" ? "pt-0" : "pt-28")}>
        <Outlet />
      </main>

      <Footer key={location.pathname} />
      <NavDropdown
        id="community-navigation-menu"
        label="Community"
        open={isCommunityOpen}
        anchorRef={communityButtonRef}
        liquid={liquid}
        menuRef={communityMenuRef}
        focusFirstItem={shouldFocusCommunityMenu}
        onFocusedFirstItem={clearCommunityFocusRequest}
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
          }, NAV_MENU_CLOSE_DELAY);
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
            className={cn(NAV_MENU_ITEM_CLASS, "text-white")}
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
                  {child.rollingSuffix ? <span className="ml-1">{child.rollingSuffix}</span> : null}
                </span>
              </span>
            ) : (
              child.label
            )}
          </Link>
        ))}
      </NavDropdown>
    </div>
  );
}
