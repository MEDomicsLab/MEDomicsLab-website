export function wavyFramePath(width, height, wavelength = 25, depth = 5) {
  const inset = Math.min(depth, width / 56, height / 56);
  const corner = inset * 2;
  const path = [`M ${corner} ${inset}`];
  const edge = (x, y, dx, dy, length) => {
    const count = Math.max(1, Math.round(length / wavelength));
    const step = length / count;
    const point = (along, outward = 0) =>
      `${(x + dx * along + dy * outward).toFixed(2)} ${(y + dy * along - dx * outward).toFixed(2)}`;
    for (let i = 0; i < count; i++) {
      const start = i * step;
      path.push(
        `C ${point(start + step / 6, inset)} ${point(start + step / 3, inset)} ${point(start + step / 2)}`,
        `C ${point(start + (step * 2) / 3, -inset)} ${point(start + (step * 5) / 6, -inset)} ${point(start + step)}`
      );
    }
  };
  edge(corner, inset, 1, 0, width - corner * 2);
  path.push(`Q ${width - inset} ${inset} ${width - inset} ${corner}`);
  edge(width - inset, corner, 0, 1, height - corner * 2);
  path.push(`Q ${width - inset} ${height - inset} ${width - corner} ${height - inset}`);
  edge(width - corner, height - inset, -1, 0, width - corner * 2);
  path.push(`Q ${inset} ${height - inset} ${inset} ${height - corner}`);
  edge(inset, height - corner, 0, -1, height - corner * 2);
  path.push(`Q ${inset} ${inset} ${corner} ${inset} Z`);
  return path.join(" ");
}
