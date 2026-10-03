import PageLink from "../../components/PageLink/PageLink.jsx";
import { Link } from "react-router-dom";
import newsData from "../../data/news.json";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";

const latestNews = newsData
  .flatMap((year) => year.months.flatMap((month) => month.items))
  .sort((a, b) => b.slug.localeCompare(a.slug))
  .slice(0, 3);

export default function LatestNews() {
  return (
    <section className="neue-news" aria-labelledby="news-heading">
      <div className="neue-section-top">
        <h2 id="news-heading">
          Come check out
          <br />
          our latest news
        </h2>
        <PageLink className="neue-visit" to="/community/news">
          Visit all news
        </PageLink>
      </div>
      <div className="neue-news-list">
        {latestNews.map((news) => (
          <Link to={`/community/news/${news.slug}`} key={news.slug} className="neue-news-row group">
            <time dateTime={news.slug.slice(0, 10)}>
              {new Date(`${news.slug.slice(0, 10)}T12:00:00`).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </time>
            <div>
              <span>{news.category}</span>
              <h3>{news.title}</h3>
            </div>
            <HoverArrow size="lg" />
          </Link>
        ))}
      </div>
    </section>
  );
}
