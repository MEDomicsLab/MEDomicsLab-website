import { useParams } from "react-router-dom";
import BackLink from "../../components/BackLink/BackLink.jsx";
import DetailNotFound from "../../components/DetailNotFound/DetailNotFound.jsx";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";
import BrandName from "../../components/BrandName/BrandName.jsx";
import ResearcherList from "../../components/ResearcherList/ResearcherList.jsx";
import { getPeopleByNames } from "../../lib/team";

export default function CommunityItemDetailPage({ title, data, backPath }) {
  const { slug } = useParams();

  const item =
    data
      .flatMap((group) => group.months)
      .flatMap((monthGroup) => monthGroup.items)
      .find((entry) => entry.slug === slug) ?? null;

  if (!item) {
    return <DetailNotFound title={title} to={backPath} />;
  }

  return (
    <div className="community-detail min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <BackLink to={backPath}>Back to {title}</BackLink>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-3xl md:text-5xl font-bold normal-case tracking-tight leading-tight">
              <BrandName>{item.title}</BrandName>
            </h1>
            {item.markdown ? (
              <MarkdownContent markdownPath={item.markdown} />
            ) : (
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Full article details coming soon.
              </p>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32 h-fit">
            <ResearcherList people={getPeopleByNames(item.contributors)} />
          </div>
        </div>
      </div>
    </div>
  );
}
