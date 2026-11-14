export const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;

export const EVENT_THUMB_WIDTH = 640;

export const markdownImages = (markdown) =>
  [...(markdown ?? "").matchAll(MARKDOWN_IMAGE)].map(([, alt, src]) => ({ alt, src }));
