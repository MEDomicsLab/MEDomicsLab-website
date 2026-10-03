import { Link } from "react-router-dom";
import HoverArrow from "../HoverArrow/HoverArrow.jsx";
import { cn } from "../../lib/utils";

export default function PageLink({ to, href, children, className, arrowSize = "lg", ...props }) {
  const Component = to ? Link : "a";
  return (
    <Component {...(to ? { to } : { href })} {...props} className={cn("group", className)}>
      {children} <HoverArrow size={arrowSize} />
    </Component>
  );
}
