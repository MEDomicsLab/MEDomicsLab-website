import eventsData from "../../data/events.json";
import { MARKDOWN_IMAGE } from "../../lib/markdownImages";
import { getMemberByName } from "../../lib/team";

const eventMedia = import.meta.glob("/src/content/community/events/*.md", {
  eager: true,
  query: "?media",
  import: "default",
});

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const ZOOM_LEVELS = ["Years", "Months", "Days"];
const YEARS = 0;
export const DAYS = ZOOM_LEVELS.length - 1;

export const LAYOUT_TRANSITION = { layout: { duration: 0.45, ease: [0.4, 0, 0.1, 1] } };

const ROWS = 4;
const BANNER_RATIO = 2.2;
const MAX_PRINTS = 3;

export const CATEGORY_COLORS = {
  Presentations: "blue",
  "Thesis Defenses": "purple",
  Symposiums: "orange",
  Workshops: "green",
  Seminars: "yellow",
  "Lab Life": "pink",
  Outreach: "red",
  Other: "gray",
};

const pad = (value) => String(value).padStart(2, "0");
const isBanner = (picture) => picture.width / picture.height >= BANNER_RATIO;

export const calendarEvents = eventsData
  .flatMap((group) =>
    group.months.flatMap((monthGroup) =>
      monthGroup.items.map((item) => {
        const [year, month, day] = item.date
          ? item.date.split("-").map(Number)
          : [Number(group.year), MONTHS.indexOf(monthGroup.month) + 1, null];
        const media = eventMedia[`/src/content/${item.markdown}`] ?? [];
        return {
          ...item,
          year,
          monthIndex: month - 1,
          day,
          color: CATEGORY_COLORS[item.category] ?? "gray",
          sortKey: item.date ?? `${year}-${pad(month)}-00`,
          media,
          prints: media.filter((picture) => !isBanner(picture)).slice(0, MAX_PRINTS),
          banner: media.find(isBanner) ?? null,
        };
      })
    )
  )
  .map((event, index) => ({ event, index }))
  .sort((a, b) => a.event.sortKey.localeCompare(b.event.sortKey) || a.index - b.index)
  .map(({ event }) => event);

export const calendarCategories = Object.keys(CATEGORY_COLORS).filter((category) =>
  calendarEvents.some((event) => event.category === category)
);

export const eventsBySlug = new Map(calendarEvents.map((event) => [event.slug, event]));

const columnKey = (event, zoom) => {
  if (zoom === YEARS) return String(event.year);
  if (zoom === 1 || !event.day) return `${event.year}-${pad(event.monthIndex + 1)}`;
  return event.date;
};

const columnHeading = (event, zoom) => {
  const month = MONTHS[event.monthIndex];
  if (zoom === YEARS) return { label: String(event.year), dateTime: String(event.year) };
  const dateTime = `${event.year}-${pad(event.monthIndex + 1)}`;
  if (zoom === 1 || !event.day) return { label: month, sub: String(event.year), dateTime };
  return {
    label: `${month.slice(0, 3)} ${event.day}`,
    sub: String(event.year),
    dateTime: event.date,
  };
};

const fillLanes = (events, zoom) => {
  const lanes = [];
  if (zoom === YEARS) {
    const count = Math.ceil(events.length / ROWS);
    let start = 0;
    for (let lane = 0; lane < count; lane++) {
      const size = Math.ceil((events.length - start) / (count - lane));
      const cards = events.slice(start, start + size).map((event) => ({ event, span: 1 }));
      let spare = ROWS - cards.length;
      for (const card of cards) {
        if (spare > 0 && card.event.prints.length) {
          card.span = 2;
          spare -= 1;
        }
      }
      lanes.push(cards);
      start += size;
    }
    return lanes;
  }
  let used = ROWS;
  for (const event of events) {
    const span = event.prints.length ? 2 : 1;
    if (used + span > ROWS) {
      lanes.push([]);
      used = 0;
    }
    lanes.at(-1).push({ event, span });
    used += span;
  }
  return lanes;
};

const preferredRow = (event, zoom) => {
  if (zoom === YEARS) return Math.floor(event.monthIndex / 3) + 1;
  if (!event.day) return 1;
  return Math.min(ROWS, Math.floor((event.day - 1) / 7) + 1);
};

const placeLane = (cards, lane, zoom) => {
  let next = 1;
  let remaining = cards.reduce((sum, card) => sum + card.span, 0);
  return cards.map(({ event, span }) => {
    const latest = ROWS - remaining + 1;
    const preferred = Math.min(preferredRow(event, zoom), ROWS - span + 1);
    const row = Math.min(Math.max(preferred, next), latest);
    next = row + span;
    remaining -= span;
    return { event, lane: lane + 1, row, span };
  });
};

export const buildColumns = (zoom, events = calendarEvents) => {
  const columns = [];
  for (const event of events) {
    const key = columnKey(event, zoom);
    const last = columns.at(-1);
    if (last?.key === key) last.events.push(event);
    else columns.push({ key, heading: columnHeading(event, zoom), events: [event] });
  }
  return columns.map(({ key, heading, events }) => {
    const lanes = fillLanes(events, zoom);
    return {
      key,
      heading,
      id: events[0].slug,
      lanes: lanes.length,
      cards: lanes.flatMap((cards, lane) => placeLane(cards, lane, zoom)),
    };
  });
};

export const eventDateLabel = (event) => {
  const month = MONTHS[event.monthIndex];
  if (!event.day) return `${month} ${event.year}`;
  if (!event.endDate || event.endDate === event.date) return `${event.day} ${month}`;
  const [, endMonth, endDay] = event.endDate.split("-").map(Number);
  if (endMonth - 1 === event.monthIndex) return `${event.day}–${endDay} ${month}`;
  return `${event.day} ${month.slice(0, 3)} – ${endDay} ${MONTHS[endMonth - 1].slice(0, 3)}`;
};

export const eventPeople = (event) =>
  (event.contributors ?? []).map((name) => {
    const member = getMemberByName(name);
    return member ? { name: member.name, member } : { name: name.trim() };
  });

export const splitEventMarkdown = (raw) => {
  const links = [];
  const body = (raw ?? "")
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(MARKDOWN_IMAGE, "")
    .replace(/^##\s+Links\s*$([\s\S]*?)(?=^#{1,6}\s|(?![\s\S]))/m, (_, section) => {
      for (const [, label, href] of section.matchAll(/\[([^\]]+)\]\(\s*([^)\s]+)\s*\)/g)) {
        links.push({ label, href });
      }
      return "";
    });
  return { links, body: body.replace(/\n{3,}/g, "\n\n").trim() };
};
