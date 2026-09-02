import eventsData from "../../data/events.json";
import CommunityTimelinePage from "../CommunityTimelinePage/CommunityTimelinePage";

export default function EventsPage() {
  return <CommunityTimelinePage title="Events" data={eventsData} basePath="/community/events" />;
}
