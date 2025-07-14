"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";

// Default rendering options for rich text
const defaultOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-2">{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-2xl font-bold mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-xl font-semibold mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-lg font-medium mb-2">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc ml-6 mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal ml-6 mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="mb-1">{children}</li>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
  },
};

export function RichText({ content, options = {}, className = "" }) {
  // If content is already a string, just render it
  if (typeof content === "string") {
    return <div className={className}>{content}</div>;
  }

  // If content is null or undefined, return nothing
  if (!content) {
    return null;
  }

  // Merge custom options with defaults
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    return (
      <div className={className}>
        {documentToReactComponents(content, mergedOptions)}
      </div>
    );
  } catch (error) {
    console.error("Error rendering rich text:", error);
    // Fallback to plain text if rendering fails
    return <div className={className}>{content.toString()}</div>;
  }
}

// Utility function to convert rich text to plain text (for use in components)
export function richTextToPlainText(richText) {
  if (!richText || typeof richText === "string") {
    return richText || "";
  }

  if (richText.nodeType === "document" && richText.content) {
    return richText.content
      .map((node) => {
        if (node.nodeType === "paragraph" && node.content) {
          return node.content
            .map((textNode) =>
              textNode.nodeType === "text" ? textNode.value : ""
            )
            .join("");
        }
        return "";
      })
      .join(" ");
  }

  return "";
}
