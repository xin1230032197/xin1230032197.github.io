import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { Nodes, Root } from "mdast";
import type { ContentIndex } from "./content-types";
import type {
  KnowledgeIndex,
  NoteSummary,
  WikiLookup,
} from "./knowledge-types";
import { mdText, normalizeTerm, remarkWikiLinks } from "./wiki-links.ts";

export const tagHref = (tag: string) => `/tags/${encodeURIComponent(tag)}`;
function excerpt(value: string, label: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  const start = Math.max(0, clean.indexOf(label) - 45);
  return `${start ? "…" : ""}${clean.slice(start, start + 150)}${clean.length > start + 150 ? "…" : ""}`;
}
function keywords(value: string) {
  const stop = new Set([
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "一个",
    "可以",
    "使用",
    "进行",
    "我们",
    "以及",
    "这些",
    "没有",
    "需要",
    "不是",
    "通过",
    "因此",
    "如果",
  ]);
  return new Set(
    [
      ...new Intl.Segmenter("zh", { granularity: "word" }).segment(
        normalizeTerm(value),
      ),
    ]
      .filter(
        (s) => s.isWordLike && s.segment.length > 1 && !stop.has(s.segment),
      )
      .map((s) => s.segment),
  );
}
export function buildKnowledge(content: ContentIndex): KnowledgeIndex {
  const lookup: WikiLookup = Object.create(null);
  const summaries = new Map<string, NoteSummary>();
  for (const p of content.tree)
    for (const s of p.children)
      for (const a of s.articles) {
        summaries.set(a.href, {
          href: a.href,
          title: a.title,
          path: `${p.title} / ${s.title}`,
          updated: a.updated,
          description: a.description,
        });
        for (const value of [a.title, a.slug, ...(a.aliases || []), a.href]) {
          const key = normalizeTerm(value);
          lookup[key] ??= [];
          if (!lookup[key].includes(a.href)) lookup[key].push(a.href);
        }
      }
  const result: KnowledgeIndex = {
    lookup,
    backlinks: {},
    related: {},
    broken: [],
    tags: [],
    searchEntries: [],
  };
  const edges = new Map<string, Set<string>>();
  const articleSearch = new Map();
  const keywordIndex = new Map<string, Set<string>>();
  for (const a of content.articles) {
    result.backlinks[a.href] = [];
    edges.set(a.href, new Set());
  }
  for (const a of content.articles) {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkWikiLinks, {
        lookup,
        onBroken: (target, reason, line) =>
          result.broken.push({ source: a.href, target, reason, line }),
      });
    const tree = processor.runSync(processor.parse(a.body), a.body) as Root;
    const headings: string[] = [],
      prose: string[] = [];
    const definitions = new Map<string, string>();
    const collectDefinitions = (node: Nodes) => {
      if (node.type === "definition")
        definitions.set(node.identifier.toLowerCase(), node.url);
      if ("children" in node) node.children.forEach(collectDefinitions);
    };
    collectDefinitions(tree);
    const walk = (node: Nodes, context = "") => {
      if (node.type === "heading") headings.push(mdText(node));
      if (["paragraph", "heading", "tableCell"].includes(node.type))
        context = mdText(node);
      if (["paragraph", "code", "heading", "tableCell"].includes(node.type))
        prose.push(mdText(node));
      const url =
        node.type === "link"
          ? node.url
          : node.type === "linkReference"
            ? definitions.get(node.identifier.toLowerCase())
            : undefined;
      if (url && !/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) {
        let target = "";
        try {
          target = decodeURIComponent(
            new URL(url, `https://codex.invalid${a.href}`).pathname,
          ).replace(/\/$/, "");
        } catch {
          /* Invalid URLs remain ordinary text links. */
        }
        if (
          target !== a.href &&
          summaries.has(target) &&
          !edges.get(a.href)!.has(target)
        ) {
          edges.get(a.href)!.add(target);
          result.backlinks[target].push({
            ...summaries.get(a.href)!,
            context: excerpt(context, mdText(node)),
          });
        }
      }
      if ("children" in node)
        node.children.forEach((child) => walk(child, context));
    };
    walk(tree);
    const text = `${a.description} ${prose.join(" ")}`;
    articleSearch.set(a.href, {
      aliases: a.aliases || [],
      headings,
      text,
      breadcrumb: `Codex / ${summaries.get(a.href)!.path} / ${a.title}`,
    });
    keywordIndex.set(a.href, keywords(`${a.title} ${text}`));
  }
  for (const a of content.articles) {
    const terms = keywordIndex.get(a.href)!;
    result.backlinks[a.href].sort((a, b) => a.href.localeCompare(b.href));
    result.related[a.href] = content.articles
      .filter((b) => b.href !== a.href)
      .map((b) => {
        const linked = Number(
          edges.get(a.href)!.has(b.href) || edges.get(b.href)!.has(a.href),
        );
        const tags = a.tags.filter((t) =>
          b.tags.some((bt) => normalizeTerm(bt) === normalizeTerm(t)),
        ).length;
        const same = Number(
          a.primary === b.primary && a.secondary === b.secondary,
        );
        const other = keywordIndex.get(b.href)!;
        const shared = [...terms].filter((t) => other.has(t)).length;
        const relevance =
          shared < 2
            ? 0
            : shared / Math.sqrt(Math.max(1, terms.size * other.size));
        return {
          note: {
            ...summaries.get(b.href)!,
            reason: linked
              ? "链接关联"
              : tags
                ? "共同标签"
                : same
                  ? "同一分类"
                  : "内容相关",
          },
          rank: [linked, tags, same, relevance],
        };
      })
      .filter((r) => r.rank.some(Boolean))
      .sort((a, b) => {
        for (let i = 0; i < a.rank.length; i++)
          if (a.rank[i] !== b.rank[i]) return b.rank[i] - a.rank[i];
        return a.note.href.localeCompare(b.note.href);
      })
      .slice(0, 4)
      .map((r) => r.note);
  }
  const tags = new Map<string, NoteSummary[]>();
  for (const a of content.articles)
    for (const tag of a.tags) {
      if (!tags.has(tag)) tags.set(tag, []);
      tags.get(tag)!.push(summaries.get(a.href)!);
    }
  result.tags = [...tags]
    .sort(([a], [b]) => a.localeCompare(b, "zh-CN"))
    .map(([tag, articles]) => ({
      tag,
      href: tagHref(tag),
      articles: articles.sort(
        (a, b) =>
          b.updated.localeCompare(a.updated) || a.href.localeCompare(b.href),
      ),
    }));
  result.searchEntries = content.searchEntries.map((entry) => ({
    ...entry,
    breadcrumb:
      entry.kind === "书架"
        ? `Codex / ${entry.title}`
        : `Codex / ${entry.context} / ${entry.title}`,
    ...articleSearch.get(entry.href),
  }));
  return result;
}
