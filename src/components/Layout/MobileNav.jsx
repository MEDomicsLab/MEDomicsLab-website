import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { GithubIcon } from "../Icons/Icons.jsx";
import { imageSrcSet } from "../../lib/images.js";
import { cn } from "../../lib/utils";
import homeData from "../../data/home.json";
import layoutData from "../../data/layout.json";

export default function MobileNav({ githubHref }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState(null);
  const root = useRef(null);
  const bar = useRef(null);
  const burger = useRef(null);
  const medomics = homeData.sections.ecosystem.apps.find((app) => app.name === "MEDomics");

  useEffect(() => {
    setOpen(false);
  }, [location.key]);

  useEffect(() => {
    const host = root.current.parentElement;
    const phone = window.matchMedia("(max-width: 767px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hidden = false;
    let hide = 0;
    let travel = 0;
    let lastY = window.scrollY;
    let frame = 0;
    let last = 0;
    const step = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const goal = Number(hidden);
      const next = still.matches ? goal : hide + (goal - hide) * (1 - Math.exp(-6.5 * dt));
      hide = Math.abs(goal - next) < 0.001 ? goal : next;
      host.style.setProperty("--mobile-nav-hide", hide.toFixed(4));
      frame = hide === goal ? 0 : requestAnimationFrame(step);
      if (!frame) last = 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const reveal = () => {
      travel = 0;
      if (!hidden) return;
      hidden = false;
      kick();
    };
    const released = () => {
      const edge = bar.current.offsetTop + bar.current.offsetHeight;
      const anchor = document.querySelector("main [data-nav-release]");
      if (anchor) return anchor.getBoundingClientRect().top < edge + 96;
      const heading = [...document.querySelectorAll("main h1, main h2")].find(
        (node) => node.offsetHeight > 1
      );
      return !!heading && heading.getBoundingClientRect().bottom < edge;
    };
    const focused = () =>
      !!host.querySelector(".site-brand :focus-visible, .mobile-nav-bar :focus-visible");
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      if (!phone.matches || !released() || focused() || travel < -8) reveal();
      else if (travel > 8 && !hidden) {
        hidden = true;
        kick();
      }
    };
    const onFocus = () => {
      if (focused()) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    host.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      host.removeEventListener("focusin", onFocus);
      host.style.removeProperty("--mobile-nav-hide");
    };
  }, [location.key]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    const background = [...document.querySelectorAll("main, footer")];
    const previous = background.map((node) => node.inert);
    background.forEach((node) => {
      node.inert = true;
    });
    html.style.overflow = "hidden";
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        burger.current?.focus();
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...root.current.querySelectorAll("a[href], button:not([disabled])"),
      ].filter((node) => !node.closest("[inert]") && node.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      html.style.overflow = overflow;
      background.forEach((node, index) => {
        node.inert = previous[index];
      });
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={root} className="mobile-nav">
      <div ref={bar} className="mobile-nav-bar">
        <button
          type="button"
          ref={burger}
          className="mobile-nav-burger"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="mobile-nav-burger-glyph" aria-hidden="true" />
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Main navigation"
        className={cn("mobile-nav-menu", open && "is-open")}
        aria-hidden={!open}
        inert={open ? undefined : ""}
        style={{ "--menu-count": layoutData.navItems.length }}
      >
        <ul className="mobile-nav-list">
          {layoutData.navItems.map((item, index) => (
            <li
              key={item.defaultLabel}
              className="mobile-nav-row"
              style={{ "--menu-index": index }}
            >
              {item.children ? (
                <>
                  <button
                    type="button"
                    className="mobile-nav-link"
                    aria-expanded={group === index}
                    aria-controls={`mobile-navigation-group-${index}`}
                    onClick={() => setGroup(group === index ? null : index)}
                  >
                    {item.defaultLabel}
                    <ChevronDown size={18} className="mobile-nav-chevron" aria-hidden="true" />
                  </button>
                  <div
                    id={`mobile-navigation-group-${index}`}
                    className={cn("mobile-nav-group", group === index && "is-open")}
                    aria-hidden={group !== index}
                    inert={group === index ? undefined : ""}
                  >
                    <ul className="mobile-nav-children">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className="mobile-nav-child"
                            aria-current={location.pathname === child.path ? "page" : undefined}
                          >
                            <span>{child.label}</span>
                            <ArrowRight size={16} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : item.disabled ? (
                <button type="button" className="mobile-nav-link" disabled>
                  {item.defaultLabel}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="mobile-nav-link"
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  {item.defaultLabel}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mobile-nav-ctas">
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="mobile-nav-cta"
            onClick={() => setOpen(false)}
          >
            <GithubIcon className="mobile-nav-cta-icon" />
            <span>GitHub Organization</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <Link to="/#ecosystem" className="mobile-nav-cta is-primary">
            <img
              className="mobile-nav-cta-icon"
              src={medomics.logo}
              srcSet={imageSrcSet(medomics.logo, [80, 160], "webp")}
              sizes="20px"
              alt=""
            />
            <span>MEDomics Ecosystem</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
