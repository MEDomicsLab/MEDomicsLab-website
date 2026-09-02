/**
 * Parse the body that GitHub renders from an Issue Form.
 *
 * GitHub serialises form submissions as Markdown of the form:
 *
 *     ### Field label
 *
 *     value lines (may be multi-paragraph)
 *
 *     ### Other field
 *
 *     ...
 *
 * For dropdowns the value is the chosen option (verbatim).
 * For checkbox lists the value is a series of `- [x] Option` / `- [ ] Option` lines.
 * Empty fields render as `_No response_`.
 *
 * We parse the body into a `{ [label]: rawValue }` map keyed by the heading text.
 * Per-handler code maps labels onto schema fields.
 */
const NO_RESPONSE = "_No response_";

export function parseIssueForm(body) {
  if (!body || typeof body !== "string") return {};
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const fields = {};
  let currentLabel = null;
  let buffer = [];

  const flush = () => {
    if (currentLabel === null) return;
    const value = buffer.join("\n").trim();
    fields[currentLabel] = value === NO_RESPONSE ? "" : value;
    buffer = [];
  };

  for (const line of lines) {
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      currentLabel = heading[1].trim();
      continue;
    }
    if (currentLabel !== null) buffer.push(line);
  }
  flush();
  return fields;
}

/**
 * Split a comma-separated free-text field into a trimmed array.
 * Filters empty strings.
 */
export function splitList(value) {
  if (!value) return [];
  return value
    .split(/\s*,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Extract checked options from a `- [x] Option` block.
 */
export function parseChecklist(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => /^[-*]\s+\[x\]\s+(.+?)\s*$/i.exec(line))
    .filter(Boolean)
    .map((m) => m[1].trim());
}
