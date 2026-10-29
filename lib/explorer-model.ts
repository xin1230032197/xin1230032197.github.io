import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { mdText } from "./wiki-links.ts";
import type { ArticleRecord, ContentIndex } from "./content-types";
import type { ExplorerNode } from "./explorer-types";

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

/** Read the existing Markdown AST without changing content, routes or rendering. */
export function articleExplorer(article: ArticleRecord): ExplorerNode {
  const root: ExplorerNode = {
    id: article.href, title: article.title, href: article.href,
    kind: "article", body: "", children: [],
  };
  const ast = parser.parse(article.body);
  const definitions = ast.children.filter(n =>
    n.type === "definition" || n.type === "footnoteDefinition");
  const slice = (n: (typeof ast.children)[number]) =>
    article.body.slice(n.position!.start.offset, n.position!.end.offset);
  const stack: ExplorerNode[] = [root];
  const nodes = [root];
  for (const block of ast.children) {
    if (block.type === "definition" || block.type === "footnoteDefinition") continue;
    if (block.type === "heading") {
      while (stack.length > 1 && (stack.at(-1)!.depth || 0) >= block.depth) stack.pop();
      const node: ExplorerNode = {
        id: `${article.href}::${block.position!.start.offset}`,
        title: mdText(block).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => label || target),
        href: article.href, kind: "heading", depth: block.depth,
        body: "", children: [],
      };
      stack.at(-1)!.children.push(node);
      stack.push(node);
      nodes.push(node);
    } else {
      stack.at(-1)!.body += `${slice(block)}\n\n`;
    }
  }
  // Reference links and footnotes must still resolve when reading an isolated section.
  const references = definitions.map(slice).join("\n\n");
  for (const node of nodes) {
    node.body = node.body.trim();
    if (node.body && references) node.body += `\n\n${references}`;
  }
  return root;
}

export function buildExplorer(index: Pick<ContentIndex, "tree">): ExplorerNode {
  return {
    id: "codex-library", title: "我的知识库", kind: "library", body: "",
    children: index.tree.map(primary => ({
      id: primary.href, title: primary.title, kind: "primary", body: "",
      href: primary.href,
      children: primary.children.map(secondary => ({
        id: secondary.href, title: secondary.title, kind: "directory", body: "",
        href: secondary.href, children: secondary.articles.map(articleExplorer),
      })),
    })),
  };
}
