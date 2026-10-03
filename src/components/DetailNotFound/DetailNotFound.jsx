import { Link } from "react-router-dom";

export default function DetailNotFound({ title, to, linkLabel = "Return to Index" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-xl uppercase tracking-widest font-bold">{title} Not Found</h1>
      <Link to={to} className="text-primary hover:underline text-sm uppercase">
        {linkLabel}
      </Link>
    </div>
  );
}
