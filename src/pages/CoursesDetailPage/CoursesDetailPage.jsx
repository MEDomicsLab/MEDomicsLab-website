import { useParams } from "react-router-dom";
import BackLink from "../../components/BackLink/BackLink.jsx";
import DetailNotFound from "../../components/DetailNotFound/DetailNotFound.jsx";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";
import coursesData from "../../data/courses.json";
import BrandName from "../../components/BrandName/BrandName.jsx";

export default function CoursesDetailPage() {
  const { slug } = useParams();
  const course = coursesData.find((entry) => entry.slug === slug);

  if (!course) {
    return <DetailNotFound title="Course" to="/community/courses" linkLabel="Return to Courses" />;
  }

  return (
    <div className="community-detail min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <BackLink to="/community/courses">Back to Courses</BackLink>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-3xl md:text-5xl font-bold normal-case tracking-tight leading-tight">
              <BrandName>{course.title}</BrandName>
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
