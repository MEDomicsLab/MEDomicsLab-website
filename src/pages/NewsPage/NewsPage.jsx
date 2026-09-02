import newsData from "../../data/news.json";
import CommunityTimelinePage from "../CommunityTimelinePage/CommunityTimelinePage";

export default function NewsPage() {
  return <CommunityTimelinePage title="News" data={newsData} basePath="/community/news" />;
}
