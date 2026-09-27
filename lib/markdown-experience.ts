import { common, createLowlight } from "lowlight";
import type { Root, Element, ElementContent, Nodes } from "hast";

const highlighter = createLowlight(common);
highlighter.registerAlias({ cpp: ["cuda", "c++"] });
const text = (value: string): ElementContent => ({ type: "text", value });
const element = (
  tagName: string,
  children: ElementContent[],
  properties: Element["properties"] = {},
): Element => ({ type: "element", tagName, properties, children });
export function nodeText(node: Nodes): string {
  return node.type === "text"
    ? node.value
    : "children" in node
      ? node.children.map(nodeText).join("")
      : "";
}

/** Split token trees, preserving multiline comment/string colors across lines. */
function tokenLines(nodes: ElementContent[]): ElementContent[][] {
  const lines: ElementContent[][] = [[]];
  for (const node of nodes) {
    const parts =
      node.type === "text"
        ? node.value.split("\n").map((value) => [text(value)])
        : node.type === "element"
          ? tokenLines(node.children).map((children) => [{ ...node, children }])
          : [[]];
    parts.forEach((part, index) => {
      if (index) lines.push([]);
      lines[lines.length - 1].push(...part);
    });
  }
  return lines;
}

export function highlightedLines(meta: string, count: number) {
  const selected = new Set<number>();
  const spec = meta.match(/\{([\d,\s-]+)\}/)?.[1] || "";
  for (const token of spec.split(",")) {
    const match = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) continue;
    const start = Math.max(1, Number(match[1]));
    const end = Math.min(count, Number(match[2] || match[1]));
    for (let line = start; line <= end; line++) selected.add(line);
  }
  return selected;
}

/** Runs on the server, after KaTeX and slug generation; never accepts raw HTML. */
export function markdownExperience() {
  return (tree: Root) => {
    const walk = (parent: Root | Element) => {
      for (const node of parent.children) {
        if (node.type !== "element") continue;
        if (
          Array.isArray(node.properties.className) &&
          node.properties.className.includes("katex-display")
        ) {
          node.properties.tabIndex = 0;
          node.properties.role = "region";
          node.properties.ariaLabel = "数学公式，可横向滚动";
        }
        if (node.tagName === "pre") {
          const code = node.children.find(
            (n): n is Element => n.type === "element" && n.tagName === "code",
          );
          if (code) {
            const raw = nodeText(code);
            const language =
              String(code.properties.className || "").match(
                /language-([^\s,]+)/,
              )?.[1] || "text";
            const source = raw.replace(/\n$/, "");
            const tokens = highlighter.registered(language)
              ? highlighter.highlight(language, source).children
              : [text(source)];
            const lines = tokenLines(tokens as ElementContent[]);
            const highlights = highlightedLines(
              String(code.data?.meta || ""),
              lines.length,
            );
            node.properties["data-source"] = raw;
            node.properties["data-language"] = language;
            code.children = lines.flatMap((children, i) => [
              element("span", children, {
                className: [
                  "code-line",
                  ...(highlights.has(i + 1) ? ["is-highlighted"] : []),
                ],
                "data-line": String(i + 1),
              }),
              ...(i < lines.length - 1 ? [text("\n")] : []),
            ]);
          }
          continue;
        }
        if (node.tagName === "blockquote") {
          const first = node.children.find(
            (n): n is Element => n.type === "element" && n.tagName === "p",
          )?.children[0];
          if (first?.type === "text") {
            const match = first.value.match(
              /^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\](?:\s|$)/,
            );
            if (match) {
              first.value = first.value.slice(match[0].length);
              node.properties.className = ["callout"];
              node.properties["data-kind"] = match[1].toLowerCase();
              node.children.unshift(
                element("div", [text(match[1])], {
                  className: ["callout-label"],
                }),
              );
            }
          }
        }
        if (node.tagName === "p") {
          const content = node.children.filter(
            (n) => n.type !== "text" || n.value.trim(),
          );
          const image =
            content.length === 1 &&
            content[0].type === "element" &&
            content[0].tagName === "img"
              ? content[0]
              : undefined;
          if (image) {
            node.tagName = "figure";
            node.properties.className = ["article-figure"];
            if (image.properties.title) {
              node.children.push(
                element("figcaption", [text(String(image.properties.title))]),
              );
              delete image.properties.title;
            }
          }
        }
        if (node.tagName === "img") {
          node.properties.loading = "lazy";
          node.properties.decoding = "async";
        }
        walk(node);
      }
    };
    walk(tree);
  };
}
