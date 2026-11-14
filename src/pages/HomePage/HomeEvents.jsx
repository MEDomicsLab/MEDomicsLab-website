import PageLink from "../../components/PageLink/PageLink.jsx";
import LabVideo from "./LabVideo.jsx";
import UpcomingEvents from "./UpcomingEvents.jsx";
import { upcomingEvents } from "../EventsPage/eventsCalendar";

function DotBorder() {
  return (
    <div className="neue-dot-border" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export default function HomeEvents() {
  const upcoming = upcomingEvents();
  return (
    <section className="neue-events" aria-labelledby="events-heading">
      <LabVideo />
      <DotBorder />
      <div className="neue-events-content">
        <h2 id="events-heading">
          Come to
          <br />
          our events<span>.</span>
        </h2>
        <div className={upcoming.length ? "neue-events-aside has-upcoming" : "neue-events-aside"}>
          {upcoming.length ? (
            <UpcomingEvents events={upcoming} />
          ) : (
            <span className="neue-events-dot blue-paper" aria-hidden="true" />
          )}
          <PageLink className="neue-visit" to="/community/events">
            Visit all events
          </PageLink>
        </div>
      </div>
      <DotBorder />
    </section>
  );
}
