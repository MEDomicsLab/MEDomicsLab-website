import { cn } from "../../lib/utils";

/**
 * Split "Role | Unit, Institution" into display spans.
 * `stacked` separates the role; `unitPerLine` also separates each unit.
 */
export default function PositionText({
  position,
  stacked = false,
  unitPerLine = false,
  className,
  roleClassName,
}) {
  if (!position) return null;
  const [role, organisation] = position.split(" | ");
  if (!organisation) return <span className={className}>{position}</span>;
  const units = organisation.split(", ").filter(Boolean);

  const unitList = units.map((unit, index) => (
    <span key={unit}>
      <span className="whitespace-nowrap">
        {unit}
        {index < units.length - 1 ? "," : ""}
      </span>{" "}
    </span>
  ));

  if (unitPerLine) {
    return (
      <span className={cn("block", className)}>
        <span className={cn("block", roleClassName)}>{role}</span>
        {units.map((unit, index) => (
          <span key={unit} className="block">
            {unit}
            {index < units.length - 1 ? "," : ""}
          </span>
        ))}
      </span>
    );
  }

  if (stacked) {
    return (
      <span className={cn("block", className)}>
        <span className={cn("block", roleClassName)}>{role}</span>
        <span className="block">{unitList}</span>
      </span>
    );
  }

  return (
    <span className={className}>
      <span className={cn("whitespace-nowrap", roleClassName)}>{role}</span>
      <span aria-hidden="true" className="mx-2 opacity-50">
        |
      </span>
      <span className="sr-only">, </span>
      {unitList}
    </span>
  );
}
