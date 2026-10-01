import BrandName from "../BrandName/BrandName.jsx";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

export default function EventMetadata({ item, heading = "Event details", showType = true }) {
  const details = [
    ...(showType ? [["Type", item.kind || item.category]] : []),
    ["Venue", item.venue],
  ].filter(([, value]) => value);

  return (
    <section aria-labelledby="event-details-heading" className="border-t border-border pt-6">
      <h2
        id="event-details-heading"
        className="text-xs uppercase tracking-widest text-muted-foreground mb-5"
      >
        {heading}
      </h2>
      <dl className="space-y-4 text-sm">
        {item.date && (
          <div>
            <dt className="text-muted-foreground mb-1">Date</dt>
            <dd>
              <time dateTime={item.date}>{formatDate(item.date)}</time>
              {item.endDate && item.endDate !== item.date && (
                <>
                  {" – "}
                  <time dateTime={item.endDate}>{formatDate(item.endDate)}</time>
                </>
              )}
            </dd>
          </div>
        )}
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground mb-1">{label}</dt>
            <dd className="break-words">
              <BrandName>{value}</BrandName>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
