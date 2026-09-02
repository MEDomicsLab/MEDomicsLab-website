import eventsData from "../../data/events.json";
import CommunityItemDetailPage from "../CommunityItemDetailPage/CommunityItemDetailPage";

export default function EventsDetailPage() {
  return <CommunityItemDetailPage title="Events" data={eventsData} backPath="/community/events" />;
}
