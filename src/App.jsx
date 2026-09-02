import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Lenis from "lenis";
import Layout from "./components/Layout/Layout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ResearchPage from "./pages/ResearchPage/ResearchPage.jsx";
import ProjectDetail from "./pages/ProjectDetail/ProjectDetail.jsx";
import PublicationsPage from "./pages/PublicationsPage/PublicationsPage.jsx";
import PublicationDetailPage from "./pages/PublicationDetailPage/PublicationDetailPage.jsx";
import TeamPage from "./pages/TeamPage/TeamPage.jsx";
import TeamMemberDetail from "./pages/TeamMemberDetail/TeamMemberDetail.jsx";
import VisionsPage from "./pages/VisionsPage/VisionsPage.jsx";
import NewsPage from "./pages/NewsPage/NewsPage.jsx";
import EventsPage from "./pages/EventsPage/EventsPage.jsx";
import CommunityContactPage from "./pages/CommunityContactPage/CommunityContactPage.jsx";
import NewsDetailPage from "./pages/NewsDetailPage/NewsDetailPage.jsx";
import EventsDetailPage from "./pages/EventsDetailPage/EventsDetailPage.jsx";
import CoursesPage from "./pages/CoursesPage/CoursesPage.jsx";
import CoursesDetailPage from "./pages/CoursesDetailPage/CoursesDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08,
    });

    let rafId = 0;

    const onFrame = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(onFrame);
    };

    rafId = requestAnimationFrame(onFrame);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/visions" element={<VisionsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:slug" element={<ProjectDetail />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/publications/:slug" element={<PublicationDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/:slug" element={<TeamMemberDetail />} />
        <Route path="/community/news" element={<NewsPage />} />
        <Route path="/community/events" element={<EventsPage />} />
        <Route path="/community/courses" element={<CoursesPage />} />
        <Route path="/community/contact" element={<CommunityContactPage />} />
        <Route path="/community/news/:slug" element={<NewsDetailPage />} />
        <Route path="/community/events/:slug" element={<EventsDetailPage />} />
        <Route path="/community/courses/:slug" element={<CoursesDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
