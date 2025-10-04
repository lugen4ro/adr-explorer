"use client";

import { useMantineColorScheme } from "@mantine/core";
import mermaid from "mermaid";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { getHighlightStyles } from "@/lib/searchHighlight";
import type { ADR } from "@/types/adr";

// Proper types for react-markdown components
type CodeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type TableProps = React.DetailedHTMLProps<
  React.TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>;
type CellProps = React.DetailedHTMLProps<
  React.TdHTMLAttributes<HTMLTableDataCellElement>,
  HTMLTableDataCellElement
>;
type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;
type BlockquoteProps = React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;
type UListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;
type OListProps = React.DetailedHTMLProps<
  React.OlHTMLAttributes<HTMLOListElement>,
  HTMLOListElement
>;
type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;
type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

interface ADRRendererProps {
  adr: ADR;
  searchTerms?: string[];
}

const MermaidComponent: React.FC<{ children: string }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && children) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
      });

      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid
        .render(id, children)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        })
        .catch((error) => {
          console.error("Mermaid rendering error:", error);
          if (ref.current) {
            ref.current.innerHTML = `<div class="bg-red-50 border border-red-200 rounded p-4 text-red-800">
              <strong>Mermaid Diagram Error:</strong><br>
              <pre class="mt-2 text-sm">${children}</pre>
            </div>`;
          }
        });
    }
  }, [children]);

  return <div ref={ref} className="my-4 bg-white p-4 rounded border" />;
};

// Helper function to highlight search terms in text
const highlightSearchTerms = (
  text: string,
  searchTerms: string[] = [],
): React.ReactNode => {
  if (!searchTerms.length || !searchTerms.some((term) => term.trim())) {
    return text;
  }

  const filteredTerms = searchTerms.filter((term) => term.trim());

  if (!filteredTerms.length) {
    return text;
  }

  // Create regex pattern for all search terms (case-insensitive)
  const pattern = new RegExp(
    `(${filteredTerms
      .map(
        (term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Escape special regex characters
      )
      .join("|")})`,
    "gi",
  );

  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = filteredTerms.some(
      (term) => part.toLowerCase() === term.toLowerCase(),
    );

    return isMatch ? (
      <mark
        // biome-ignore lint/suspicious/noArrayIndexKey: Highlighting text parts need stable ordering
        key={index}
        style={getHighlightStyles()}
      >
        {part}
      </mark>
    ) : (
      part
    );
  });
};

export const ADRRenderer: React.FC<ADRRendererProps> = ({
  adr,
  searchTerms = [],
}) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const [isClientSide, setIsClientSide] = useState(false);

  // Ensure highlighting only happens on client-side to avoid hydration errors
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Only apply search highlighting after client-side hydration
  const shouldHighlight = isClientSide && searchTerms.length > 0;

  const components = {
    code: (props: CodeProps) => {
      const { inline, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      // Detect inline code: no className and no newlines in content
      const isInline =
        inline === true || (!className && !String(children).includes("\n"));

      if (!isInline && language === "mermaid") {
        return (
          <MermaidComponent>
            {String(children).replace(/\n$/, "")}
          </MermaidComponent>
        );
      }

      if (isInline) {
        console.debug("Rendering inline code:", String(children));
        return (
          <code
            className={`px-1 py-0.5 rounded text-sm font-medium ${
              isDark
                ? "bg-slate-700 text-slate-200"
                : "bg-gray-100 text-gray-700"
            }`}
            {...rest}
          >
            {children}
          </code>
        );
      }

      console.debug("Rendering block code:", String(children));
      return (
        <SyntaxHighlighter
          language={language || "text"}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: "1.5rem 0",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
            },
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    },
    table: (props: TableProps) => (
      <div className="overflow-x-auto my-6">
        <table
          className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
          {...props}
        />
      </div>
    ),
    th: (props: CellProps) => (
      <th
        className={`border px-4 py-2 text-left font-semibold ${
          isDark
            ? "border-gray-600 bg-gray-800 text-gray-200"
            : "border-gray-300 bg-gray-50 text-gray-700"
        }`}
        {...props}
      />
    ),
    td: (props: CellProps) => (
      <td
        className="border border-gray-300 dark:border-gray-600 px-4 py-2"
        {...props}
      />
    ),
    img: (props: ImageProps) => {
      return (
        <span className="block my-4">
          <Image
            className="rounded-lg shadow-lg"
            src={typeof props.src === "string" ? props.src : ""}
            alt={props.alt || ""}
            width={800}
            height={400}
            style={{ width: "auto", height: "auto", maxWidth: "100%" }}
          />
        </span>
      );
    },
    h1: (props: HeadingProps) => {
      if (typeof props.children === "string" && shouldHighlight) {
        return (
          <h1
            className="text-4xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
            style={{ color: "var(--mantine-color-text)" }}
            {...props}
          >
            {highlightSearchTerms(props.children, searchTerms)}
          </h1>
        );
      }

      return (
        <h1
          className="text-4xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
          style={{ color: "var(--mantine-color-text)" }}
          {...props}
        />
      );
    },
    h2: (props: HeadingProps) => {
      if (typeof props.children === "string" && shouldHighlight) {
        return (
          <h2
            className="text-3xl font-semibold mt-8 mb-4 pb-3 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-600/25 dark:to-transparent px-4 py-2 rounded-r-lg border-l-4 border-blue-500 dark:border-blue-400"
            style={{ color: "var(--mantine-color-text)" }}
            {...props}
          >
            {highlightSearchTerms(props.children, searchTerms)}
          </h2>
        );
      }

      return (
        <h2
          className="text-3xl font-semibold mt-8 mb-4 pb-3 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-600/25 dark:to-transparent px-4 py-2 rounded-r-lg border-l-4 border-blue-500 dark:border-blue-400"
          style={{ color: "var(--mantine-color-text)" }}
          {...props}
        />
      );
    },
    h3: (props: HeadingProps) => {
      if (typeof props.children === "string" && shouldHighlight) {
        return (
          <h3
            className="text-2xl font-semibold mt-6 mb-3"
            style={{ color: "var(--mantine-color-text)" }}
            {...props}
          >
            {highlightSearchTerms(props.children, searchTerms)}
          </h3>
        );
      }

      return (
        <h3
          className="text-2xl font-semibold mt-6 mb-3"
          style={{ color: "var(--mantine-color-text)" }}
          {...props}
        />
      );
    },
    blockquote: (props: BlockquoteProps) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
        {...props}
      />
    ),
    ul: (props: UListProps) => (
      <ul className="list-disc ml-6 my-4 [&_ul]:my-1 [&_ol]:my-1" {...props} />
    ),
    ol: (props: OListProps) => (
      <ol
        className="list-decimal ml-6 my-4 [&_ul]:my-1 [&_ol]:my-1"
        {...props}
      />
    ),
    a: (props: AnchorProps) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:no-underline transition-colors duration-200"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    p: (
      props: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >,
    ) => {
      if (typeof props.children === "string" && shouldHighlight) {
        return (
          <p className="my-4 leading-relaxed" {...props}>
            {highlightSearchTerms(props.children, searchTerms)}
          </p>
        );
      }

      return <p className="my-4 leading-relaxed" {...props} />;
    },
    li: (
      props: React.DetailedHTMLProps<
        React.LiHTMLAttributes<HTMLLIElement>,
        HTMLLIElement
      >,
    ) => {
      if (typeof props.children === "string" && shouldHighlight) {
        return (
          <li {...props}>
            {highlightSearchTerms(props.children, searchTerms)}
          </li>
        );
      }

      return <li {...props} />;
    },
  };

  return (
    <article className="max-w-5xl px-8 py-8">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {adr.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};
