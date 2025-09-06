"use client";

import mermaid from "mermaid";
import type React from "react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ADR } from "@/types/adr";

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface TableProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface CellProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface HeadingProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface BlockquoteProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface ListProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface ImageProps {
  src?: string;
  alt?: string;
  loading?: "lazy" | "eager";
  [key: string]: any;
}

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
      const { inline, className, children } = props;
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (!inline && language === "mermaid") {
        return (
          <MermaidComponent>
            {String(children).replace(/\n$/, "")}
          </MermaidComponent>
        );
      }

      return (
        <code
          className={`${className || ""} ${
            inline
              ? "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
              : "block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"
          }`}
          {...props}
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
      <img
        className="max-w-full h-auto rounded-lg shadow-lg my-4"
        loading="lazy"
        alt={props.alt || ""}
        {...props}
      />
    ),
    h1: (props: HeadingProps) => (
      <h1
        className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4"
        {...props}
      />
    ),
    h2: (props: HeadingProps) => (
      <h2
        className="text-3xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-200"
        {...props}
      />
    ),
    h3: (props: HeadingProps) => (
      <h3
        className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200"
        {...props}
      />
    ),
    blockquote: (props: BlockquoteProps) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
        {...props}
      />
    ),
    ul: (props: ListProps) => (
      <ul className="list-disc ml-6 my-4 space-y-2" {...props} />
    ),
    ol: (props: ListProps) => (
      <ol className="list-decimal ml-6 my-4 space-y-2" {...props} />
    ),
  };

  return (
    <article className="max-w-5xl mx-auto px-8 py-8">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components as any}
        >
          {adr.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};
