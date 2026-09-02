import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { getMarkdownContent } from "../../lib/markdown";
import { cn } from "../../lib/utils";
import EventGallery from "../EventGallery/EventGallery";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import "./MarkdownContent.css";

export default function MarkdownContent({ markdownPath, className }) {
  const [status, setStatus] = useState("idle");
  const [content, setContent] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!markdownPath) {
      setStatus("idle");
      setContent("");
      return undefined;
    }

    setStatus("loading");

    getMarkdownContent(markdownPath).then((loaded) => {
      if (!isMounted) return;

      if (loaded) {
        const sanitized = loaded.replace(/^---[\s\S]*?---\s*/, "");
        setContent(sanitized);
        setStatus("ready");
      } else {
        setContent("");
        setStatus("missing");
      }
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

  return (
    <div className={cn("prose prose-invert max-w-none mt-6", className)}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          "dome-gallery": ({ node, ...props }) => (
            <EventGallery album={props.album ?? props["data-album"]} />
          ),
          img: ({ node, ...props }) => (
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
