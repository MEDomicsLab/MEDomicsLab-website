import newsData from "../../data/news.json";
import CommunityItemDetailPage from "../CommunityItemDetailPage/CommunityItemDetailPage";

export default function NewsDetailPage() {
  return <CommunityItemDetailPage title="News" data={newsData} backPath="/community/news" />;
}
