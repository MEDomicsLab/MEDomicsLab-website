const markdownFiles = import.meta.glob(["/src/content/**/*.md", "!/src/content/_templates/**"], {
  query: "?raw",
  import: "default",
});

const cache = new Map();
const normalizePath = (markdownPath) =>
  markdownPath.startsWith("/src/")
    ? markdownPath
    : `/src/content/${markdownPath.replace(/^\.\/?/, "")}`;

export const getCachedMarkdown = (markdownPath) =>
  markdownPath ? cache.get(normalizePath(markdownPath)) : undefined;

export const cacheMarkdown = (markdownPath, content) => {
  cache.set(normalizePath(markdownPath), content);
};

export const getMarkdownContent = async (markdownPath) => {
  if (!markdownPath) return null;
  const cached = getCachedMarkdown(markdownPath);
  if (cached !== undefined) return cached;
  const loader = markdownFiles[normalizePath(markdownPath)];
  if (!loader) return null;

  const content = await loader();
  cacheMarkdown(markdownPath, content);
  return content;
};
