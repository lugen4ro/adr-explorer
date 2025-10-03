"use client";

import mermaid from "mermaid";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

export const ADRRenderer: React.FC<ADRRendererProps> = ({ adr }) => {
  const components = {
    code: (props: CodeProps) => {
      const { inline, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      // Detect inline code: no className and no newlines in content
      const isInline =
        inline === true || (!className && !String(children).includes("\n"));

      console.log("Code component props:", {
        inline,
        className,
        children: String(children),
        isInline,
      });

      if (!isInline && language === "mermaid") {
        return (
          <MermaidComponent>
            {String(children).replace(/\n$/, "")}
          </MermaidComponent>
        );
      }

      if (isInline) {
        console.log("Rendering inline code:", String(children));
        return (
          <code
            className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-1 py-0.5 rounded text-sm font-medium"
            {...rest}
          >
            {children}
          </code>
        );
      }

      console.log("Rendering block code:", String(children));
      return (
        <code
          className={`${className || ""} block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto`}
          {...rest}
        >
          {children}
        </code>
      );
    },
    table: (props: TableProps) => (
      <div className="overflow-x-auto my-4">
        <table
          className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
          {...props}
        />
      </div>
    ),
    th: (props: CellProps) => (
      <th
        className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left font-semibold"
        {...props}
      />
    ),
    td: (props: CellProps) => (
      <td
        className="border border-gray-300 dark:border-gray-600 px-4 py-2"
        {...props}
      />
    ),
    img: (props: ImageProps) => (
      <div className="my-4">
        <Image
          className="rounded-lg shadow-lg"
          src={typeof props.src === "string" ? props.src : ""}
          alt={props.alt || ""}
          width={800}
          height={400}
          style={{ width: "auto", height: "auto", maxWidth: "100%" }}
        />
      </div>
    ),
    h1: (props: HeadingProps) => (
      <h1
        className="text-4xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
        style={{ color: "var(--mantine-color-text)" }}
        {...props}
      />
    ),
    h2: (props: HeadingProps) => (
      <h2
        className="text-3xl font-semibold mt-8 mb-4"
        style={{ color: "var(--mantine-color-text)" }}
        {...props}
      />
    ),
    h3: (props: HeadingProps) => (
      <h3
        className="text-2xl font-semibold mt-6 mb-3"
        style={{ color: "var(--mantine-color-text)" }}
        {...props}
      />
    ),
    blockquote: (props: BlockquoteProps) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
        {...props}
      />
    ),
    ul: (props: UListProps) => (
      <ul className="list-disc ml-6 my-4 space-y-2" {...props} />
    ),
    ol: (props: OListProps) => (
      <ol className="list-decimal ml-6 my-4 space-y-2" {...props} />
    ),
    a: (props: AnchorProps) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:no-underline transition-colors duration-200"
        {...props}
      />
    ),
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
