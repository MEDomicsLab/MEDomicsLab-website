export const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;

export const HTML_IMAGE = /<img\b[^>]*>/gi;

export const EVENT_THUMB_WIDTH = 640;

const attribute = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i").exec(tag)?.[1];

export const markdownImages = (markdown) =>
  [...(markdown ?? "").matchAll(new RegExp(`${MARKDOWN_IMAGE.source}|${HTML_IMAGE.source}`, "gi"))]
    .map(([match, alt, src]) =>
      src ? { alt, src } : { alt: attribute(match, "alt") ?? "", src: attribute(match, "src") }
    )
    .filter((picture) => picture.src);
