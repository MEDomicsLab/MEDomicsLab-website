const BRANDS = ["MEDomicsLab", "MEDomics", "MEDprofiles", "MEDiml", "MED3pa", "MEDfl"];
const CANONICAL = new Map(BRANDS.map((brand) => [brand.toLowerCase(), brand]));
const BRAND_PATTERN = new RegExp(`\\b(${BRANDS.join("|")})\\b`, "gi");

export default function BrandName({ children }) {
  if (typeof children !== "string") return children;

  const segments = [];
  let cursor = 0;

  for (const match of children.matchAll(BRAND_PATTERN)) {
    if (match.index > cursor) segments.push(children.slice(cursor, match.index));
    segments.push(
      <span key={match.index} className="normal-case">
        {CANONICAL.get(match[0].toLowerCase())}
      </span>
    );
    cursor = match.index + match[0].length;
  }

  if (segments.length === 0) return children;
  if (cursor < children.length) segments.push(children.slice(cursor));

  return <>{segments}</>;
}
