import PageLink from "../PageLink/PageLink.jsx";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShinyText from "../ShinyText/ShinyText.jsx";
import { Link } from "react-router-dom";
import layoutData from "../../data/layout.json";
import homeData from "../../data/home.json";
import { scrollToTopNow } from "../../lib/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const { footer, navItems } = layoutData;
  const element = useRef(null);
  useLayoutEffect(() => {
    const footer = element.current;
    const word = footer.querySelector(".neue-footer-wordmark");
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      const context = document.createElement("canvas").getContext("2d");
      const font = getComputedStyle(word);
      context.font = `600 100px ${font.fontFamily}`;
      context.letterSpacing = "-4.5px";
      const metrics = context.measureText(homeData.brand.name);
      const width = footer.querySelector(".neue-footer-bottom").clientWidth;
      const size = (width / (metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight)) * 100;
      context.font = `600 ${size}px ${font.fontFamily}`;
      context.letterSpacing = `${size * -0.045}px`;
      footer.style.setProperty("--footer-word-size", `${size}px`);
      footer.style.setProperty(
        "--footer-ink-left",
        `${context.measureText(homeData.brand.name).actualBoundingBoxLeft}px`
      );
      ScrollTrigger.refresh();
    };
    fit();
    document.fonts.ready.then(fit);
    const resize = new ResizeObserver(fit);
    resize.observe(footer);
    return () => {
      disposed = true;
      resize.disconnect();
    };
  }, []);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const footerElement = element.current;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footerElement,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });
      timeline.fromTo(
        footerElement.querySelector(".neue-footer-grid"),
        { y: 50 },
        { y: 0, ease: "power2.out", duration: 1 },
        0
      );
      const columns = footerElement.querySelectorAll(".neue-footer-column");
      columns.forEach((column, index) => {
        timeline.fromTo(
          column,
          { y: [50, 100, 200, 300][index] },
          { y: 0, ease: "power2.out", duration: 1 },
          0
        );
      });
      timeline.fromTo(
        footerElement.querySelectorAll(".neue-footer-wordmark, .neue-footer-bottom"),
        { y: 50 },
        { y: 0, ease: "power2.out", duration: 1 },
        0
      );
      return () => {
        timeline.scrollTrigger?.kill();
        timeline.revert();
      };
    });
    return () => media.revert();
  }, []);
  return (
    <footer ref={element} className="neue-footer blue-paper">
      <div className="neue-footer-grid">
        <Link
          to="/"
          onClick={scrollToTopNow}
          aria-label={`${homeData.brand.name}, back to top`}
          className="neue-footer-logo"
        >
          <img src={homeData.brand.lightLogoUrl} alt="" />
        </Link>
        <div className="neue-footer-column">
          <h2>Navigation</h2>
          <div className="neue-footer-links">
            {navItems
              .filter((item) => !item.disabled)
              .flatMap((item) =>
                item.children
                  ? item.children.map((child) => ({
                      path: child.path,
                      label: child.footerLabel ?? child.label,
                    }))
                  : [{ path: item.path, label: item.defaultLabel }]
              )
              .map((item) => (
                <Link
                  to={item.path}
                  key={item.path}
                  onClick={item.path === "/" ? scrollToTopNow : undefined}
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
        <div className="neue-footer-column">
          <h2>Where to find us</h2>
          <div className="neue-footer-links">
            <p>
              {footer.contact.addressLines.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p className="neue-footer-office">{footer.contact.office}</p>
            <PageLink
              href={footer.contact.mapLink.href}
              target="_blank"
              rel="noreferrer"
              arrowSize="sm"
            >
              {footer.contact.mapLink.label}
            </PageLink>
          </div>
        </div>
        <div className="neue-footer-column">
          <h2>Socials</h2>
          <div className="neue-footer-links">
            {footer.social.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
            {footer.social.reachOutLinks.map((link) =>
              link.disabled ? (
                <span key={link.href} className="neue-footer-disabled" aria-disabled="true">
                  {link.label}
                </span>
              ) : (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
        <div className="neue-footer-column">
          <h2>Affiliations</h2>
          <div className="neue-footer-links">
            {footer.affiliations.map((affiliation) => (
              <a href={affiliation.href} target="_blank" rel="noreferrer" key={affiliation.href}>
                {affiliation.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="neue-footer-wordmark" aria-hidden="true">
        {homeData.brand.name}
      </div>
      <div className="neue-footer-bottom">
        <a href={homeData.brand.repositoryUrl} target="_blank" rel="noreferrer">
          Maintained by Lab members
        </a>
        <a href={footer.creditLink} target="_blank" rel="noreferrer">
          <ShinyText text={footer.credit} color="#1a1a1a" shineColor="#ffffff" speed={3} />
        </a>
      </div>
    </footer>
  );
}
