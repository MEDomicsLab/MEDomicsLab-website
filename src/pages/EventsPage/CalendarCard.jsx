import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import AvatarImage from "../../components/AvatarImage/AvatarImage.jsx";
import BrandName from "../../components/BrandName/BrandName.jsx";
import LabAvatar from "../../components/LabAvatar/LabAvatar.jsx";
import { LAYOUT_TRANSITION, eventDateLabel, eventPeople } from "./eventsCalendar";

const MAX_BUBBLES = 4;
const BUBBLE_SIZE = 30;
const OVERLAP = 8;
const GAP = 4;
const SPREAD_SPRING = { type: "spring", stiffness: 150, damping: 22, mass: 0.9 };

const lastSpans = new Map();

function PersonAvatar({ person }) {
  if (person.member?.image) {
    return (
      <AvatarImage
        src={person.member.image}
        alt=""
        size={BUBBLE_SIZE}
        className="evcal-avatar"
        loading="lazy"
      />
    );
  }
  return <LabAvatar size={BUBBLE_SIZE} className="evcal-avatar" />;
}

function CardPeople({ people, open }) {
  const reduced = useReducedMotion();
  const shown = people.slice(0, people.length > MAX_BUBBLES ? MAX_BUBBLES - 1 : MAX_BUBBLES);
  const extra = people.length - shown.length;
  const count = shown.length + (extra > 0 ? 1 : 0);
  const step = open ? OVERLAP + GAP : 0;
  const transition = (index) =>
    reduced
      ? { duration: 0 }
      : { ...SPREAD_SPRING, delay: (open ? index : count - 1 - index) * 0.035 };
  const bubbles = [
    ...shown.map((person) => ({ key: person.name, content: <PersonAvatar person={person} /> })),
    ...(extra > 0 ? [{ key: "extra", count: true, content: `+${extra}` }] : []),
  ];
  return (
    <motion.span
      className="evcal-card-people"
      initial={false}
      animate={{ "--trail": `${(count - 1) * step}px` }}
      transition={transition(count - 1)}
      aria-hidden="true"
    >
      {bubbles.map((bubble, index) => (
        <motion.span
          key={bubble.key}
          className={bubble.count ? "evcal-bubble is-count" : "evcal-bubble"}
          initial={false}
          animate={{ x: index * step }}
          transition={transition(index)}
        >
          {bubble.content}
        </motion.span>
      ))}
    </motion.span>
  );
}

function CardPrints({ prints, late }) {
  return (
    <span className="evcal-card-media" data-count={prints.length} data-late={late || undefined}>
      {prints.map((print) => (
        <span
          key={print.src}
          className="evcal-print"
          style={{ "--ratio": print.width && print.height ? print.width / print.height : 1.5 }}
        >
          <img
            src={print.thumb ?? print.src}
            alt=""
            width={print.width}
            height={print.height}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </span>
      ))}
    </span>
  );
}

function CalendarCard({ event, lane, row, span, seen, hidden, registerCard }) {
  const people = eventPeople(event);
  const dateTime = event.date ?? `${event.year}-${String(event.monthIndex + 1).padStart(2, "0")}`;
  const [open, setOpen] = useState(false);
  const previous = lastSpans.get(event.slug);
  const late = previous !== undefined && previous !== span;
  useEffect(() => {
    lastSpans.set(event.slug, span);
  }, [event.slug, span]);

  return (
    <motion.div
      layoutId={`event-${event.slug}`}
      transition={LAYOUT_TRANSITION}
      className="evcal-card-wrap"
      style={{ gridColumn: lane, gridRow: `${row} / span ${span}` }}
    >
      <Link
        ref={(element) => registerCard(event.slug, element)}
        to={`/community/events/${event.slug}`}
        state={{ fromCalendar: true }}
        className="evcal-card"
        data-color={event.color}
        data-span={span}
        data-seen={seen || undefined}
        data-hidden={hidden || undefined}
        draggable={false}
        onPointerEnter={(pointer) => pointer.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={(focus) => focus.currentTarget.matches(":focus-visible") && setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <motion.span layout="position" transition={LAYOUT_TRANSITION} className="evcal-card-text">
          <span className="evcal-card-title">
            <BrandName>{event.title}</BrandName>
          </span>
          <time className="evcal-card-date" dateTime={dateTime}>
            {eventDateLabel(event)}
          </time>
        </motion.span>
        {span > 1 && <CardPrints prints={event.prints} late={late} />}
        {span === 1 && event.banner && (
          <img
            className="evcal-card-banner"
            data-late={late || undefined}
            src={event.banner.thumb ?? event.banner.src}
            alt=""
            width={event.banner.width}
            height={event.banner.height}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}
        {people.length > 0 && <CardPeople people={people} open={open} />}
      </Link>
    </motion.div>
  );
}

export default memo(CalendarCard);
