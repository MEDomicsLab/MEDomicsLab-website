import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function BackLink({ to, children }) {
  return (
    <Link to={to} className="interior-back transition-colors">
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      {children}
    </Link>
  );
}
