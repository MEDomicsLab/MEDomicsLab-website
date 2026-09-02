import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "../../lib/translations";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";

export default function CommunityItemDetailPage({ title, data, backPath }) {
  const { t } = useTranslations();
  const { slug } = useParams();

  const item =
    data
      .flatMap((group) => group.months)
      .flatMap((monthGroup) => monthGroup.items)
      .find((entry) => entry.slug === slug) ?? null;

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-xl uppercase tracking-widest font-bold">{title} Not Found</div>
        <Link to={backPath} className="text-primary hover:underline text-sm uppercase">
          Return to Index
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 pt-24">
        <Link
          to={backPath}
          className="inline-flex items-center text-xs uppercase tracking-widest text-primary mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("community.back", `Back to ${title}`)}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
              {item.title}
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
            <div className="border-t border-border pt-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Contributors
              </h3>
              <p className="text-sm text-foreground/80">{item.contributors.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
