import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DetailNotFound from "../../components/DetailNotFound/DetailNotFound.jsx";
import { getSiteRoute } from "../../lib/seo.js";

export default function PublicationRedirect() {
  const { pathname } = useLocation();
  const destination = getSiteRoute(pathname)?.redirect;

  useEffect(() => {
    if (destination) window.location.replace(destination);
  }, [destination]);

  if (!destination) {
    return (
      <DetailNotFound title="Publication" to="/publications" linkLabel="Return to Publications" />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <a href={destination}>Continue to publication</a>
    </div>
  );
}
