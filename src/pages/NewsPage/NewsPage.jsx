import newsData from "../../data/news.json";
import CommunityTimelinePage from "../CommunityTimelinePage/CommunityTimelinePage";

const CATEGORIES = [
  "Publications",
  "Thesis Defenses",
  "Awards",
  "Milestones",
  "Conferences",
  "Other",
];

export default function NewsPage() {
  return (
    <CommunityTimelinePage
      title="News"
      data={newsData}
      basePath="/community/news"
      categories={CATEGORIES}
    />
  );
}
