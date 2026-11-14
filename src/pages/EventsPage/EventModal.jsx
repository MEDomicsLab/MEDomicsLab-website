import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import BrandName from "../../components/BrandName/BrandName.jsx";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";
import EventMetadata from "../../components/EventMetadata/EventMetadata.jsx";
import ResearcherList from "../../components/ResearcherList/ResearcherList.jsx";
import { getCachedMarkdown, getMarkdownContent } from "../../lib/markdown";
import { getPeopleByNames } from "../../lib/team";
import { splitEventMarkdown } from "./eventsCalendar";

const EASE_IN_OUT_QUART = "cubic-bezier(0.76, 0, 0.24, 1)";
const OPEN = { delay: 120, duration: 1100 };
const CLOSE = { delay: 240, duration: 760 };
const REVEAL_AT = OPEN.delay + OPEN.duration * 0.55;
const SWAP_MS = 320;
const WIDE_RATIO = 1.9;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isExternal = (href = "") => /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");

const frame = (rect, radius, color) => ({
  left: `${rect.left}px`,
  top: `${rect.top}px`,
  width: `${rect.width}px`,
  height: `${rect.height}px`,
  borderRadius: radius,
  backgroundColor: color,
});

const dressGhost = (ghost, card, rect) => {
  const copy = card.cloneNode(true);
  copy.querySelector(".evcal-card-people")?.remove();
  for (const image of copy.querySelectorAll("img")) image.loading = "eager";
  ghost.replaceChildren(...copy.childNodes);
  ghost.dataset.color = card.dataset.color;
  ghost.dataset.span = card.dataset.span;
  Object.assign(ghost.style, { width: `${rect.width}px`, height: `${rect.height}px` });
  return getComputedStyle(card);
};

function useEventMarkdown(path) {
  const [content, setContent] = useState(() => getCachedMarkdown(path) ?? null);
  useEffect(() => {
    let current = true;
    const cached = getCachedMarkdown(path);
    if (cached !== undefined) {
      setContent(cached);
      return undefined;
    }
    setContent(null);
    getMarkdownContent(path)
      .then((loaded) => current && setContent(loaded ?? ""))
      .catch(() => current && setContent(""));
    return () => {
      current = false;
    };
  }, [path]);
  return content;
}

const ArrowIcon = ({ direction }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d={direction < 0 ? "M8.5 3 4.5 7l4 4" : "M5.5 3l4 4-4 4"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M 10 2 L 2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 2 2 L 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ratioOf = (picture) =>
  picture.width && picture.height ? picture.width / picture.height : 4 / 3;

const arrangeGallery = (pictures) => {
  const unique = pictures.filter(
    (picture, index) => pictures.findIndex((other) => other.src === picture.src) === index
  );
  const wide = unique.filter((picture) => ratioOf(picture) >= WIDE_RATIO);
  const [hero, ...rest] = unique.filter((picture) => ratioOf(picture) < WIDE_RATIO);
  return { wide, hero, rest };
};

function PictureLink({ picture }) {
  return (
    <a
      href={picture.src}
      target="_blank"
      rel="noopener noreferrer"
      className="evm-picture"
      style={{ aspectRatio: ratioOf(picture) }}
      aria-label={`Open ${picture.alt || "picture"} in a new tab`}
    >
      <img
        src={picture.thumb ?? picture.src}
        alt={picture.alt}
        width={picture.width}
        height={picture.height}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

function MarkdownBody({ body }) {
  return (
    <div className="evm-prose prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node: _node, href = "", children, ...props }) =>
            isExternal(href) || href.startsWith("#") ? (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            ) : (
              <Link to={href} {...props}>
                {children}
              </Link>
            ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

function EventDetails({ event }) {
  const markdown = useEventMarkdown(event.markdown);
  const { links, body } = useMemo(() => splitEventMarkdown(markdown), [markdown]);
  const pictures = event.media;
  const gallery = useMemo(() => arrangeGallery(event.media), [event.media]);
  const people = useMemo(() => getPeopleByNames(event.contributors), [event.contributors]);

  return (
    <>
      <aside className="evm-side" data-lenis-prevent aria-label="Event information">
        <div className="evm-side-card">
          <div className="evm-reveal" style={{ "--line": 1 }}>
            <EventMetadata item={event} />
          </div>
          <div className="evm-reveal" style={{ "--line": 2 }}>
            <ResearcherList people={people} />
          </div>
          {links.length > 0 && (
            <section
              className="evm-reveal evm-section"
              style={{ "--line": 3 }}
              aria-labelledby="evm-links-heading"
            >
              <h3 id="evm-links-heading" className="evm-section-title">
                Links
              </h3>
              <ul className="evm-links">
                {links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      className="group"
                      {...(isExternal(link.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span>
                        <BrandName>{link.label}</BrandName>
                      </span>
                      <HoverArrow />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {pictures.length > 0 && (
            <section
              className="evm-reveal evm-section"
              style={{ "--line": 4 }}
              aria-labelledby="evm-pictures-heading"
            >
              <h3 id="evm-pictures-heading" className="evm-section-title">
                Pictures
              </h3>
              <div className="evm-pictures">
                {gallery.wide.map((picture) => (
                  <PictureLink key={picture.src} picture={picture} />
                ))}
                {gallery.hero && <PictureLink picture={gallery.hero} />}
                {gallery.rest.length > 0 && (
                  <div className="evm-picture-columns">
                    {gallery.rest.map((picture) => (
                      <PictureLink key={picture.src} picture={picture} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </aside>
      <article className="evm-main" data-lenis-prevent>
        <div className="evm-title-line">
          <h1 id="evm-title" className="evm-title">
            <BrandName>{event.title}</BrandName>
          </h1>
        </div>
        {markdown === null ? (
          <p className="evm-note">Loading event…</p>
        ) : body ? (
          <MarkdownBody body={body} />
        ) : (
          <p className="evm-note">Full event details coming soon.</p>
        )}
      </article>
    </>
  );
}

export default function EventModal({
  event,
  landed,
  closing,
  getCard,
  onRequestClose,
  onClosed,
  onStep,
  hasPrevious,
  hasNext,
}) {
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const flightRef = useRef(null);
  const ghostRef = useRef(null);
  const panelRef = useRef(null);
  const shownRef = useRef(event);
  const [shown, setShown] = useState(event);
  const [phase, setPhase] = useState(landed ? "static" : "hidden");

  const opening = useRef({ landed, slug: event.slug });
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const flight = flightRef.current;
    const ghost = ghostRef.current;
    panel.focus({ preventScroll: true });
    if (opening.current.landed) return undefined;
    const card = getCard(opening.current.slug);
    if (!card || prefersReducedMotion()) {
      setPhase("revealed");
      const fade = rootRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 220,
        easing: "ease-out",
      });
      return () => fade.cancel();
    }
    const from = card.getBoundingClientRect();
    const to = flight.getBoundingClientRect();
    const target = getComputedStyle(flight);
    const cardStyle = dressGhost(ghost, card, from);
    const flying = flight.animate(
      [
        frame(from, cardStyle.borderTopLeftRadius, cardStyle.backgroundColor),
        frame(to, target.borderTopLeftRadius, target.backgroundColor),
      ],
      { ...OPEN, easing: EASE_IN_OUT_QUART, fill: "both" }
    );
    const fading = ghost.animate([{ opacity: 1 }, { opacity: 0 }], {
      delay: OPEN.delay + 80,
      duration: 300,
      easing: "ease-out",
      fill: "both",
    });
    const reveal = window.setTimeout(() => setPhase("revealed"), REVEAL_AT);
    flying.finished.then(
      () => {
        flying.cancel();
        fading.cancel();
        ghost.replaceChildren();
      },
      () => {}
    );
    return () => {
      window.clearTimeout(reveal);
      flying.cancel();
      fading.cancel();
    };
  }, [getCard]);

  useEffect(() => {
    if (!closing) return undefined;
    setPhase("leaving");
    const flight = flightRef.current;
    const ghost = ghostRef.current;
    const card = getCard(shownRef.current.slug);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onClosed();
    };
    if (!card || prefersReducedMotion()) {
      const fade = rootRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        easing: "ease-in",
        fill: "forwards",
      });
      fade.finished.then(finish, () => {});
      return () => fade.cancel();
    }
    const from = flight.getBoundingClientRect();
    const to = card.getBoundingClientRect();
    const current = getComputedStyle(flight);
    const cardStyle = dressGhost(ghost, card, to);
    const returning = flight.animate(
      [
        frame(from, current.borderTopLeftRadius, current.backgroundColor),
        frame(to, cardStyle.borderTopLeftRadius, cardStyle.backgroundColor),
      ],
      { ...CLOSE, easing: EASE_IN_OUT_QUART, fill: "both" }
    );
    const ghostIn = ghost.animate([{ opacity: 0 }, { opacity: 1 }], {
      delay: CLOSE.delay + CLOSE.duration * 0.72,
      duration: CLOSE.duration * 0.28,
      easing: "ease-in",
      fill: "both",
    });
    const backdropOut = backdropRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
      delay: CLOSE.delay + CLOSE.duration * 0.3,
      duration: CLOSE.duration * 0.7,
      easing: "ease",
      fill: "both",
    });
    returning.finished.then(finish, () => {});
    return () => {
      returning.cancel();
      ghostIn.cancel();
      backdropOut.cancel();
    };
  }, [closing, getCard, onClosed]);

  useEffect(() => {
    if (closing || event.slug === shownRef.current.slug) return undefined;
    let frameId = 0;
    setPhase("leaving");
    const timer = window.setTimeout(() => {
      shownRef.current = event;
      setShown(event);
      setPhase("hidden");
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => setPhase("revealed"));
      });
    }, SWAP_MS);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, [event, closing]);

  useEffect(() => {
    if (closing) return undefined;
    const onKeyDown = (keyEvent) => {
      const panel = panelRef.current;
      if (keyEvent.key === "Escape") {
        keyEvent.preventDefault();
        onRequestClose();
        return;
      }
      if (
        (keyEvent.key === "ArrowLeft" || keyEvent.key === "ArrowRight") &&
        !keyEvent.altKey &&
        !keyEvent.metaKey &&
        !keyEvent.ctrlKey &&
        !keyEvent.shiftKey
      ) {
        keyEvent.preventDefault();
        onStep(keyEvent.key === "ArrowLeft" ? -1 : 1);
        return;
      }
      if (keyEvent.key !== "Tab" || !panel) return;
      const focusable = [
        ...panel.querySelectorAll(
          'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
        ),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      const active = document.activeElement;
      if (!panel.contains(active)) {
        keyEvent.preventDefault();
        first.focus();
      } else if (keyEvent.shiftKey && (active === first || active === panel)) {
        keyEvent.preventDefault();
        last.focus();
      } else if (!keyEvent.shiftKey && active === last) {
        keyEvent.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closing, onRequestClose, onStep]);

  return (
    <div ref={rootRef} className="evm" data-closing={closing || undefined}>
      <div
        ref={backdropRef}
        className={landed ? "evm-backdrop is-static" : "evm-backdrop"}
        onClick={onRequestClose}
        aria-hidden="true"
      />
      <div ref={flightRef} className="evm-flight" aria-hidden="true">
        <div ref={ghostRef} className="evm-ghost evcal-card" />
      </div>
      <div
        ref={panelRef}
        className={`evm-panel is-${phase}`}
        data-color={shown.color}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evm-title"
        tabIndex={-1}
      >
        <div className="evm-actions">
          <button
            type="button"
            className="evm-action"
            onClick={() => onStep(-1)}
            disabled={!hasPrevious}
            aria-label="Previous event"
          >
            <ArrowIcon direction={-1} />
          </button>
          <button
            type="button"
            className="evm-action"
            onClick={() => onStep(1)}
            disabled={!hasNext}
            aria-label="Next event"
          >
            <ArrowIcon direction={1} />
          </button>
          <button type="button" className="evm-action" onClick={onRequestClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <EventDetails key={shown.slug} event={shown} />
      </div>
    </div>
  );
}
