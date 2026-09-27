import { createElement, type ReactNode } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { markdownExperience } from "@/lib/markdown-experience";
import { CodeBlock } from "./CodeBlock";
import knowledge from "virtual:codex-knowledge";
import { remarkWikiLinks } from "@/lib/wiki-links";

function Heading({
  level,
  id,
  children,
}: {
  level: number;
  id?: string;
  children?: ReactNode;
}) {
  return createElement(
    `h${level}`,
    { id },
    children,
    <a className="heading-anchor" href={`#${id}`} aria-label="链接到本节">
      #
    </a>,
  );
}
export function MarkdownContent({ body }: { body: string }) {
  return (
    <Markdown
      remarkPlugins={[
        remarkGfm,
        remarkMath,
        [
          remarkWikiLinks,
          {
            lookup: knowledge.lookup,
            development: process.env.NODE_ENV !== "production",
          },
        ],
      ]}
      remarkRehypeOptions={{
        footnoteLabel: "注释",
        footnoteBackLabel: "返回正文",
      }}
      rehypePlugins={[rehypeKatex, rehypeSlug, markdownExperience]}
      components={{
        pre: ({ node, children }) => (
          <CodeBlock
            source={String(node?.properties["data-source"] || "")}
            language={String(node?.properties["data-language"] || "text")}
          >
            {children}
          </CodeBlock>
        ),
        table: ({ children }) => (
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="表格，可横向滚动"
          >
            <table>{children}</table>
          </div>
        ),
        a: ({ node: _node, href, children, ...props }) => {
          void _node;
          const external = /^(https?:)?\/\//.test(href || "");
          return href?.startsWith("/") && !external ? (
            <Link href={href} {...props}>
              {children}
            </Link>
          ) : (
            <a
              href={href}
              {...props}
              {...(external
                ? {
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: `${props.className || ""} external-link`,
                  }
                : {})}
            >
              {children}
              {external && (
                <>
                  <span className="external-link-icon" aria-hidden="true">
                    ↗
                  </span>
                  <span className="sr-only">（在新标签页打开）</span>
                </>
              )}
            </a>
          );
        },
        h1: (props) => <Heading level={1} {...props} />,
        h2: (props) => <Heading level={2} {...props} />,
        h3: (props) => <Heading level={3} {...props} />,
        h4: (props) => <Heading level={4} {...props} />,
        h5: (props) => <Heading level={5} {...props} />,
        h6: (props) => <Heading level={6} {...props} />,
      }}
    >
      {body}
    </Markdown>
  );
}
