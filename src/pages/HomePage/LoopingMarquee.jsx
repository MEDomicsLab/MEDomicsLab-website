export default function LoopingMarquee({
  className,
  trackClassName,
  setClassName,
  label,
  children,
}) {
  return (
    <div className={className} aria-label={label}>
      <div className={trackClassName}>
        {[false, true].map((duplicate) => (
          <div
            className={setClassName}
            key={String(duplicate)}
            aria-hidden={duplicate || undefined}
          >
            {children(duplicate)}
          </div>
        ))}
      </div>
    </div>
  );
}
