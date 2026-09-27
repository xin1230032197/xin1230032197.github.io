import type { Root, Nodes, Parents, PhrasingContent, Text } from "mdast";
import type { VFile } from "vfile";
import type { WikiLookup } from "./knowledge-types";

export const normalizeTerm = (value: string) =>
  value.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
export function resolveWiki(lookup: WikiLookup, target: string) {
  const key = normalizeTerm(target);
  const candidates = Object.hasOwn(lookup, key) ? lookup[key] : [];
  return candidates.length === 1
    ? { href: candidates[0] }
    : {
        reason: candidates.length
          ? ("ambiguous" as const)
          : ("missing" as const),
      };
}
export function mdText(node: Nodes): string {
  if (node.type === "image" || node.type === "imageReference")
    return node.alt || "";
  if ("value" in node) return node.value;
  return "children" in node ? node.children.map(mdText).join("") : "";
}
type Options = {
  lookup: WikiLookup;
  development?: boolean;
  onBroken?: (
    target: string,
    reason: "missing" | "ambiguous",
    line?: number,
  ) => void;
};
/** Operate only on prose text nodes: code, math, existing links and HTML stay intact. */
export function remarkWikiLinks(options: Options) {
  return (tree: Root, file: VFile) => {
    const source = String(file);
    const walk = (parent: Parents) => {
      if (
        ["link", "linkReference", "image", "imageReference"].includes(
          parent.type,
        )
      )
        return;
      const children: Nodes[] = [];
      for (const node of parent.children) {
        if (node.type !== "text") {
          if ("children" in node) walk(node);
          children.push(node);
          continue;
        }
        const raw = source.slice(
          node.position?.start.offset,
          node.position?.end.offset,
        );
        const rawMatches = [
          ...raw.matchAll(/(?<!\\)(?:\\\\)*\\?\[\[[^\]\n]+\]\]/g),
        ];
        let cursor = 0,
          occurrence = 0;
        for (const match of node.value.matchAll(/\[\[([^\]\n]+)\]\]/g)) {
          const rawMatch = rawMatches[occurrence++]?.[0] || "";
          if (/^\\\[\[/.test(rawMatch)) continue;
          const [target, ...labelParts] = match[1].split("|");
          const label = labelParts.length
            ? labelParts.join("|").trim()
            : target.trim();
          if (!target.trim() || !label) continue;
          children.push({
            type: "text",
            value: node.value.slice(cursor, match.index),
          } as Text);
          const resolved = resolveWiki(options.lookup, target);
          if (resolved.href)
            children.push({
              type: "link",
              url: resolved.href,
              children: [{ type: "text", value: label }],
            });
          else {
            const reason = resolved.reason!;
            options.onBroken?.(
              target.trim(),
              reason,
              node.position?.start.line,
            );
            children.push({
              type: "text",
              value: label,
              data: {
                hName: "span",
                hProperties: {
                  className: [
                    options.development ? "wiki-broken" : "wiki-unresolved",
                  ],
                  ...(options.development
                    ? {
                        title: `${reason === "ambiguous" ? "链接目标有歧义" : "未找到文章"}：${target.trim()}`,
                        "data-broken-link": reason,
                        tabIndex: 0,
                      }
                    : {}),
                },
              },
            } as PhrasingContent);
          }
          cursor = match.index + match[0].length;
        }
        children.push({ ...node, value: node.value.slice(cursor) });
      }
      // Replacements preserve the original parent's content category.
      parent.children = children as typeof parent.children;
    };
    walk(tree);
  };
}
