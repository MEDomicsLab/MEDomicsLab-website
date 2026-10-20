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
 * Only labels from the selected form delimit answers, in template order.
 * Other headings and fenced code remain part of the current answer.
 * Per-handler code maps labels onto schema fields.
 */
const NO_RESPONSE = "_No response_";

export class IssueFormParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "IssueFormParseError";
  }
}

export function parseIssueForm(body, fieldLabels) {
  if (!Array.isArray(fieldLabels) || !fieldLabels.length) {
    throw new TypeError("parseIssueForm requires the selected form's ordered field labels.");
  }
  if (!body || typeof body !== "string") return {};
  const positions = new Map(fieldLabels.map((label, index) => [label, index]));
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const fields = {};
  let currentLabel = null;
  let buffer = [];
  let lastPosition = -1;
  let fence = null;

  const flush = () => {
    if (currentLabel === null) return;
    const value = buffer.join("\n").trim();
    fields[currentLabel] = value === NO_RESPONSE ? "" : value;
    buffer = [];
  };

  for (const [index, line] of lines.entries()) {
    if (fence) {
      if (new RegExp(`^ {0,3}${fence.marker}{${fence.length},}[ \\t]*$`).test(line)) {
        fence = null;
      }
      if (currentLabel !== null) buffer.push(line);
      continue;
    }
    const openingFence = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (
      currentLabel !== null &&
      openingFence &&
      (openingFence[1][0] !== "`" || !openingFence[2].includes("`"))
    ) {
      fence = { marker: openingFence[1][0], length: openingFence[1].length, line: index + 1 };
      buffer.push(line);
      continue;
    }
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    const label = heading?.[1].trim();
    if (positions.has(label)) {
      const position = positions.get(label);
      if (Object.hasOwn(fields, label) || currentLabel === label) {
        throw new IssueFormParseError(
          `Duplicate form heading "${label}" at line ${index + 1}. Keep each form field once; rename any heading inside an answer that matches a form label, or use ## instead of ###.`
        );
      }
      if (position <= lastPosition) {
        throw new IssueFormParseError(
          `Form heading "${label}" is out of order at line ${index + 1}. Keep fields in the original form order; rename any heading inside an answer that matches a form label, or use ## instead of ###.`
        );
      }
      flush();
      currentLabel = label;
      lastPosition = position;
      continue;
    }
    if (currentLabel !== null) buffer.push(line);
  }
  if (fence) {
    throw new IssueFormParseError(
      `Unclosed code fence starting at line ${fence.line}. Close it with at least ${fence.length} ${fence.marker} characters before the next form field.`
    );
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
