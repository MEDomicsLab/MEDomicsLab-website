const markdownFiles = import.meta.glob("/src/content/**/*.md", {
  query: "?raw",
  import: "default",
});

export const getMarkdownContent = async (markdownPath) => {
  if (!markdownPath) return null;

  const normalizedPath = markdownPath.startsWith("/src/")
    ? markdownPath
    : `/src/content/${markdownPath.replace(/^\.\/?/, "")}`;

  const loader = markdownFiles[normalizedPath];
  if (!loader) return null;

  return loader();
};
