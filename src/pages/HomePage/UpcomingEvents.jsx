import { Link } from "react-router-dom";
import BrandName from "../../components/BrandName/BrandName.jsx";
import { PersonAvatar } from "../EventsPage/CalendarCard.jsx";
import { eventDateLabel, eventPeople } from "../EventsPage/eventsCalendar";
import "../EventsPage/EventsPage.css";

const STACK = 3;
function UpcomingCard({ event, depth, later }) {
  const people = eventPeople(event);
  return (
    <span className="neue-upcoming-card" data-color={event.color} data-depth={depth}>
      <span className="neue-upcoming-head">
        <span>{depth === 0 ? "Next event" : "Upcoming"}</span>
        <time dateTime={event.date}>
          {eventDateLabel(event)} {event.year}
        </time>
      </span>
      <span className="neue-upcoming-title">
        <BrandName>{event.title}</BrandName>
      </span>
      <span className="neue-upcoming-foot">
        <span className="evcal-card-people">
          {people.slice(0, 4).map((person) => (
            <span key={person.name} className="evcal-bubble">
              <PersonAvatar person={person} />
            </span>
          ))}
        </span>
        {later > 0 && <span className="neue-upcoming-more">+{later} more upcoming</span>}
      </span>
    </span>
  );
}

export default function UpcomingEvents({ events }) {
  const [next] = events;
  const stack = events.slice(0, STACK);
  const later = events.length - 1;
  return (
    <Link
      to={`/community/events/${next.slug}`}
      className="neue-upcoming"
      data-count={stack.length}
      aria-label={`Next event: ${next.title}, ${eventDateLabel(next)} ${next.year}`}
    >
      {stack
        .map((event, depth) => (
          <UpcomingCard key={event.slug} event={event} depth={depth} later={later} />
        ))
        .reverse()}
    </Link>
  );
}
