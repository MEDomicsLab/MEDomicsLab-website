import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { getCachedMarkdown, getMarkdownContent } from "../../lib/markdown";
import { cn } from "../../lib/utils";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import "./MarkdownContent.css";

const withoutFrontmatter = (content) => content.replace(/^---[\s\S]*?---\s*/, "");

export default function MarkdownContent({ markdownPath, className }) {
  const cached = getCachedMarkdown(markdownPath);
  const [status, setStatus] = useState(cached === undefined ? "idle" : "ready");
  const [content, setContent] = useState(() => withoutFrontmatter(cached ?? ""));

  useEffect(() => {
    let isMounted = true;

    if (!markdownPath) {
      setStatus("idle");
      setContent("");
      return undefined;
    }

    const cached = getCachedMarkdown(markdownPath);
    if (cached !== undefined) {
      setContent(withoutFrontmatter(cached));
      setStatus("ready");
      return undefined;
    }

    setStatus("loading");
    getMarkdownContent(markdownPath)
      .then((loaded) => {
        if (!isMounted) return;

        if (loaded) {
          setContent(withoutFrontmatter(loaded));
          setStatus("ready");
        } else {
          setContent("");
          setStatus("missing");
        }
      })
      .catch((error) => {
        console.error(`Could not load article: ${markdownPath}`, error);
        if (isMounted) setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [markdownPath]);

  if (!markdownPath) return null;

  if (status === "loading") {
    return <p className="mt-6 text-sm text-muted-foreground">Loading article...</p>;
  }

  if (status === "missing") {
    return <p className="mt-6 text-sm text-muted-foreground">Article file not found.</p>;
  }

  if (status === "error") {
    return (
      <p role="alert" className="mt-6 text-sm text-muted-foreground">
        Unable to load this article. Please reload the page.
      </p>
    );
  }

  return (
    <div className={cn("prose prose-invert max-w-none mt-6", className)}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node: _node, ...props }) => (
            <SkeletonImage
              {...props}
              className={cn("w-full", props.className)}
              imgClassName={cn("rounded-image", props.className)}
              skeletonClassName={cn("rounded-image", props.className)}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
