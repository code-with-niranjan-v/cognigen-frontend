import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { FiExternalLink, FiYoutube, FiPlay } from "react-icons/fi";

export default function NotebookCell({ cell }) {
  const formatMarkdown = (content) => {
    if (!content) return "";

    let cleaned = content;
    cleaned = cleaned.replace(/\|/g, "\n");
    cleaned = cleaned.replace(/(^|\n)(#{1,6}\s)/g, "\n\n$2");
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    return cleaned.trim();
  };

  switch (cell.type) {
    case "markdown":
      return (
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:my-5 prose-li:my-2 prose-ul:pl-6 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:rounded">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {formatMarkdown(cell.content)}
          </ReactMarkdown>
        </div>
      );

    case "resource":
      if (!Array.isArray(cell.content)) return null;

      return (
        <div className="space-y-6">
          {cell.content.map((res, idx) => {
            const { url, source, title } = res;
            if (!url) return null;

            if (source === "youtube") {
              const videoId = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
              if (!videoId) return null;

              const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full aspect-video object-cover"
                  />
                  {title && (
                    <div className="p-4 bg-white font-semibold">{title}</div>
                  )}
                </a>
              );
            }

            return (
              <div
                key={idx}
                className="p-4 bg-gray-50 border rounded-lg hover:border-indigo-400 transition"
              >
                {title && <div className="font-medium mb-1">{title}</div>}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline break-all"
                >
                  <FiExternalLink className="inline mr-1" />
                  {url}
                </a>
              </div>
            );
          })}
        </div>
      );

    default:
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          Unknown cell type
        </div>
      );
  }
}
