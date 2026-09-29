import eventsData from "../../data/events.json";
import CommunityTimelinePage from "../CommunityTimelinePage/CommunityTimelinePage";

const CATEGORIES = [
  "Presentations",
  "Thesis Defenses",
  "Symposiums",
  "Workshops",
  "Seminars",
  "Lab Life",
  "Outreach",
  "Other",
];

export default function EventsPage() {
  return (
    <CommunityTimelinePage
      title="Events"
      data={eventsData}
      basePath="/community/events"
      categories={CATEGORIES}
    />
  );
}
