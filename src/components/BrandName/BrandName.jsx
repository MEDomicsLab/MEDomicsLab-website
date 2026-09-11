const BRAND = "MEDomicsLab";
const BRAND_PATTERN = /medomicslab/gi;

/**
 * Renders text with every occurrence of the lab name
 * pinned to its canonical ``MEDomicsLab''
 */
export default function BrandName({ children }) {
  if (typeof children !== "string") return children;

  const segments = [];
  let cursor = 0;

  for (const match of children.matchAll(BRAND_PATTERN)) {
    if (match.index > cursor) segments.push(children.slice(cursor, match.index));
    segments.push(
      <span key={match.index} className="normal-case">
        {BRAND}
      </span>
    );
    cursor = match.index + match[0].length;
  }

  if (segments.length === 0) return children;
  if (cursor < children.length) segments.push(children.slice(cursor));

  return <>{segments}</>;
}
