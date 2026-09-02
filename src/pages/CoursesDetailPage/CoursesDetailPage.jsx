import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "../../lib/translations";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";
import coursesData from "../../data/courses.json";

export default function CoursesDetailPage() {
  const { t } = useTranslations();
  const { slug } = useParams();
  const course = coursesData.find((entry) => entry.slug === slug);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-xl uppercase tracking-widest font-bold">Course Not Found</div>
        <Link to="/community/courses" className="text-primary hover:underline text-sm uppercase">
          Return to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 pt-24">
        <Link
          to="/community/courses"
          className="inline-flex items-center text-xs uppercase tracking-widest text-primary mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("community.back", "Back to Courses")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
              {course.title}
            </h1>
            {course.markdown ? (
              <MarkdownContent markdownPath={course.markdown} />
            ) : (
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Full course details coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
