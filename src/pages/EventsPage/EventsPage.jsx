import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DetailNotFound from "../../components/DetailNotFound/DetailNotFound.jsx";
import { getLenis } from "../../lib/lenis";
import CalendarCard from "./CalendarCard.jsx";
import EventModal from "./EventModal.jsx";
import TypeFilter from "./TypeFilter.jsx";
import ZoomBar from "./ZoomBar.jsx";
import {
  DAYS,
  LAYOUT_TRANSITION,
  buildColumns,
  calendarEvents,
  eventsBySlug,
} from "./eventsCalendar";
import "./EventsPage.css";

const SEEN_KEY = "medomicslab:events-seen";
const WHEEL_LERP = 0.14;

const initialScroll = (scroller, columnId) => {
  const column = columnId && document.getElementById(`evcal-col-${columnId}`);
  scroller.scrollLeft = column
    ? column.offsetLeft - (scroller.clientWidth - column.offsetWidth) / 2
    : scroller.scrollWidth;
};

const initialScrollScript = (columnId) =>
  `(function(){var s=document.getElementById("evcal-scroller");if(!s)return;var c=${JSON.stringify(
    columnId ?? ""
  )};c=c&&document.getElementById("evcal-col-"+c);s.scrollLeft=c?c.offsetLeft-(s.clientWidth-c.offsetWidth)/2:s.scrollWidth})()`;

function useSeenEvents() {
  const [seen, setSeen] = useState(() => new Set());
  useEffect(() => {
    try {
      setSeen(new Set(JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? "[]")));
    } catch {
      setSeen(new Set());
    }
  }, []);
  const markSeen = useCallback((slug) => {
    setSeen((previous) => {
      if (previous.has(slug)) return previous;
      const next = new Set(previous).add(slug);
      try {
        window.localStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
      } catch {
        return next;
      }
      return next;
    });
  }, []);
  return [seen, markSeen];
}

function useTimelineScroll(scrollerRef, locked) {
  const glide = useRef({ target: 0, frame: 0 });
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  const scrollTo = useCallback(
    (x, { immediate = false } = {}) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const state = glide.current;
      const max = scroller.scrollWidth - scroller.clientWidth;
      state.target = Math.max(0, Math.min(max, x));
      const instant = immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (instant) {
        cancelAnimationFrame(state.frame);
        state.frame = 0;
        scroller.scrollLeft = state.target;
        return;
      }
      if (state.frame) return;
      const step = () => {
        const current = scroller.scrollLeft;
        const next = current + (state.target - current) * WHEEL_LERP;
        if (Math.abs(state.target - next) < 0.5) {
          scroller.scrollLeft = state.target;
          state.frame = 0;
          return;
        }
        scroller.scrollLeft = next;
        state.frame = requestAnimationFrame(step);
      };
      state.frame = requestAnimationFrame(step);
    },
    [scrollerRef]
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    const state = glide.current;
    const onWheel = (event) => {
      if (event.ctrlKey || lockedRef.current || window.scrollY > 1) return;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const unit = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? scroller.clientWidth : 1;
      const delta = (horizontal ? event.deltaX : event.deltaY) * unit;
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (!state.frame) state.target = scroller.scrollLeft;
      if (!delta || (delta > 0 && state.target >= max - 1) || (delta < 0 && state.target <= 1)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      scrollTo(state.target + delta);
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      scroller.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(state.frame);
      state.frame = 0;
    };
  }, [scrollerRef, scrollTo]);

  return scrollTo;
}

function EventsCalendar({ activeSlug }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [zoom, setZoom] = useState(DAYS);
  const [types, setTypes] = useState([]);
  const shownEvents = useMemo(
    () =>
      types.length
        ? calendarEvents.filter((event) => types.includes(event.category))
        : calendarEvents,
    [types]
  );
  const columns = useMemo(() => buildColumns(zoom, shownEvents), [zoom, shownEvents]);
  const sectionRef = useRef(null);
  const [away, setAway] = useState(false);
  const scrollerRef = useRef(null);
  const cards = useRef(new Map());
  const anchor = useRef(null);
  const sessions = useRef(0);
  const [seen, markSeen] = useSeenEvents();
  const [modal, setModal] = useState(() =>
    activeSlug ? { slug: activeSlug, landed: true, id: 0 } : null
  );
  const scrollTo = useTimelineScroll(scrollerRef, Boolean(modal));
  const [firstColumn] = useState(() =>
    activeSlug
      ? columns.find((column) => column.cards.some(({ event }) => event.slug === activeSlug))
      : null
  );

  const registerCard = useCallback((slug, element) => {
    if (element) cards.current.set(slug, element);
    else cards.current.delete(slug);
  }, []);
  const getCard = useCallback((slug) => cards.current.get(slug) ?? null, []);

  useLayoutEffect(() => {
    if (scrollerRef.current) initialScroll(scrollerRef.current, firstColumn?.id);
  }, [firstColumn]);

  useLayoutEffect(() => {
    setModal((current) => {
      if (activeSlug) {
        if (current && !current.closing) {
          return current.slug === activeSlug ? current : { ...current, slug: activeSlug };
        }
        sessions.current += 1;
        return { slug: activeSlug, landed: false, id: sessions.current };
      }
      return current && !current.closing ? { ...current, closing: true } : current;
    });
  }, [activeSlug]);

  const modalSlug = modal?.slug;
  const modalOpen = Boolean(modal);

  useEffect(() => {
    if (modalSlug) markSeen(modalSlug);
  }, [modalSlug, markSeen]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const column = modalSlug && getCard(modalSlug)?.closest("[data-column]");
    if (!scroller || !column) return;
    const left = column.offsetLeft;
    const right = left + column.offsetWidth;
    if (left < scroller.scrollLeft || right > scroller.scrollLeft + scroller.clientWidth) {
      scrollTo(left - (scroller.clientWidth - column.offsetWidth) / 2, { immediate: true });
    }
  }, [modalSlug, getCard, scrollTo]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.classList.add("evm-open");
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("evm-open");
    };
  }, [modalOpen]);

  const closeModal = useCallback(() => {
    if (location.state?.fromCalendar && window.history.length > 1) navigate(-1);
    else navigate("/community/events", { replace: true });
  }, [location.state, navigate]);

  const handleClosed = useCallback(() => {
    setModal((current) => (current?.closing ? null : current));
  }, []);

  const lastOpened = useRef(null);
  useEffect(() => {
    if (modalSlug) {
      lastOpened.current = modalSlug;
    } else if (lastOpened.current) {
      getCard(lastOpened.current)?.focus({ preventScroll: true });
      lastOpened.current = null;
    }
  }, [modalSlug, getCard]);

  const index = modalSlug ? shownEvents.findIndex((event) => event.slug === modalSlug) : -1;
  const step = useCallback(
    (direction) => {
      const target = shownEvents[index + direction];
      if (!target) return;
      navigate(`/community/events/${target.slug}`, { replace: true, state: location.state });
    },
    [index, shownEvents, location.state, navigate]
  );

  const keepCenter = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
      const box = scroller.getBoundingClientRect();
      const middle = box.left + box.width / 2;
      let nearest = null;
      for (const column of scroller.querySelectorAll("[data-column]")) {
        const rect = column.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - middle);
        if (!nearest || distance < nearest.distance) {
          nearest = { distance, slug: column.dataset.first, offset: rect.left - box.left };
        }
      }
      anchor.current = nearest;
    }
  }, []);

  const changeZoom = useCallback(
    (next) => {
      keepCenter();
      setZoom(next);
    },
    [keepCenter]
  );

  const changeTypes = useCallback(
    (next) => {
      keepCenter();
      setTypes(next);
    },
    [keepCenter]
  );

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const kept = anchor.current;
    anchor.current = null;
    const column = kept && getCard(kept.slug)?.closest("[data-column]");
    if (scroller && column) scrollTo(column.offsetLeft - kept.offset, { immediate: true });
  }, [columns, getCard, scrollTo]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const footer = sectionRef.current?.closest("main")?.nextElementSibling;
      setAway(Boolean(footer) && footer.getBoundingClientRect().top < window.innerHeight - 80);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const activeEvent = modalSlug ? eventsBySlug.get(modalSlug) : null;
  const CalendarHeading = activeEvent ? "h2" : "h1";

  return (
    <section ref={sectionRef} className="evcal" aria-labelledby="evcal-title">
      <CalendarHeading id="evcal-title" className="sr-only">
        Events
      </CalendarHeading>
      <div
        id="evcal-scroller"
        ref={scrollerRef}
        className="evcal-timeline"
        role="region"
        aria-label="Events calendar"
        tabIndex={-1}
      >
        <LayoutGroup>
          <div className="evcal-grid">
            {columns.map((column) => (
              <motion.div
                key={column.id}
                id={`evcal-col-${column.id}`}
                layout
                transition={LAYOUT_TRANSITION}
                className="evcal-column"
                style={{ "--lanes": column.lanes }}
                data-column=""
                data-first={column.id}
              >
                <div className="evcal-date">
                  <time className="evcal-date-inner" dateTime={column.heading.dateTime}>
                    <span>{column.heading.label}</span>
                    {column.heading.sub && <small>{column.heading.sub}</small>}
                  </time>
                </div>
                <div className="evcal-events">
                  {column.cards.map(({ event, lane, row, span }) => (
                    <CalendarCard
                      key={event.slug}
                      event={event}
                      lane={lane}
                      row={row}
                      span={span}
                      seen={seen.has(event.slug)}
                      hidden={modalSlug === event.slug}
                      registerCard={registerCard}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <script dangerouslySetInnerHTML={{ __html: initialScrollScript(firstColumn?.id) }} />

      <div
        className="evcal-dock"
        data-modal={modalOpen || undefined}
        data-away={away || undefined}
        inert={away ? "" : undefined}
      >
        <div className="evcal-dock-slide">
          <ZoomBar
            scrollerRef={scrollerRef}
            scrollTo={scrollTo}
            zoom={zoom}
            onZoom={changeZoom}
            layoutKey={columns}
          />
          <TypeFilter selected={types} onChange={changeTypes} hidden={away || modalOpen} />
        </div>
      </div>

      {modal && activeEvent && (
        <EventModal
          key={modal.id}
          event={activeEvent}
          landed={modal.landed}
          closing={Boolean(modal.closing)}
          getCard={getCard}
          onRequestClose={closeModal}
          onClosed={handleClosed}
          onStep={step}
          hasPrevious={index > 0}
          hasNext={index >= 0 && index < shownEvents.length - 1}
        />
      )}
    </section>
  );
}

export default function EventsPage() {
  const { slug } = useParams();
  if (slug && !eventsBySlug.has(slug)) {
    return <DetailNotFound title="Events" to="/community/events" />;
  }
  return <EventsCalendar activeSlug={slug ?? null} />;
}
