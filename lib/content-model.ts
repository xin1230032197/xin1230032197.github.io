import { parseDocument } from "yaml";
import { z } from "zod";
import type {
  ArticleRecord,
  ContentIndex,
  ContentSection,
  SearchEntry,
} from "./content-types";

const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "use lowercase letters, digits and hyphens",
  );
const title = z.string().trim().min(1);
const directory = z.object({
  id: title,
  title,
  slug,
  description: z.string().default(""),
  order: z.number().finite().default(0),
});
const directories = z.array(
  directory.extend({
    label: title.optional(),
    children: z.array(directory).default([]),
  }),
);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      Number.isFinite(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  }, "invalid calendar date");
const frontmatter = z
  .object({
    title,
    description: z.string().default(""),
    date,
    updated: date.optional(),
    tags: z.array(title).default([]),
    aliases: z.array(title).default([]),
    order: z.number().finite().default(0),
    sample: z.boolean().optional(),
  })
  .strict();

function unique(values: string[], context: string) {
  if (new Set(values).size !== values.length)
    throw new Error(`${context}: duplicate identifier or slug`);
}
function byOrder<T extends { order: number; slug: string }>(a: T, b: T) {
  return a.order - b.order || a.slug.localeCompare(b.slug, "en");
}
/** Strip markup for the search payload, retaining prose, code, labels and formulas. */
export function plainText(markdown: string) {
  return markdown
    .replace(/```[^\n]*\n/g, " ")
    .replace(/```/g, " ")
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^[\s>#*+-]+/gm, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
/** Pure builder shared by the Vite loader and content checks; no browser or filesystem access. */
export function buildContent(
  config: unknown,
  files: Record<string, string>,
): ContentIndex {
  const parsed = directories.parse(config);
  unique(
    parsed.map((p) => p.id),
    "primary ids",
  );
  unique(
    parsed.map((p) => p.slug),
    "primary slugs",
  );
  const tree: ContentSection[] = parsed.sort(byOrder).map((p) => {
    unique(
      p.children.map((s) => s.id),
      `${p.slug} secondary ids`,
    );
    unique(
      p.children.map((s) => s.slug),
      `${p.slug} secondary slugs`,
    );
    return {
      ...p,
      href: `/${p.slug}`,
      label: p.label || p.title,
      children: p.children
        .sort(byOrder)
        .map((s) => ({ ...s, href: `/${p.slug}/${s.slug}`, articles: [] })),
    };
  });
  const routeSet = new Set([
    "/",
    ...tree.flatMap((p) => [p.href, ...p.children.map((s) => s.href)]),
  ]);
  for (const [file, raw] of Object.entries(files).sort(([a], [b]) =>
    a.localeCompare(b, "en"),
  )) {
    try {
      const match = file
        .replaceAll("\\", "/")
        .match(/^([^/]+)\/([^/]+)\/([^/]+)\.md$/);
      if (!match) throw new Error("expected primary/secondary/article.md");
      const [, primarySlug, secondarySlug, articleSlug] = match;
      slug.parse(articleSlug);
      const p = tree.find((p) => p.slug === primarySlug);
      const s = p?.children.find((s) => s.slug === secondarySlug);
      if (!p || !s)
        throw new Error(
          "parent directory missing from content/directories.json",
        );
      const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
      const envelope = normalized.match(
        /^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/,
      );
      if (!envelope) throw new Error("missing YAML frontmatter delimiters");
      const doc = parseDocument(envelope[1], { uniqueKeys: true });
      if (doc.errors.length)
        throw new Error(doc.errors.map((e) => e.message).join("; "));
      const meta = frontmatter.parse(doc.toJS({ maxAliasCount: 20 }));
      const body = envelope[2].trim();
      if (!body) throw new Error("article body is empty");
      if (meta.updated && meta.updated < meta.date)
        throw new Error("updated cannot precede date");
      const href = `${s.href}/${articleSlug}`;
      if (routeSet.has(href)) throw new Error(`duplicate route ${href}`);
      routeSet.add(href);
      s.articles.push({
        ...meta,
        updated: meta.updated || meta.date,
        tags: [...new Set(meta.tags)],
        id: href,
        href,
        slug: articleSlug,
        primary: p.id,
        secondary: s.id,
        body,
        text: plainText(body),
      });
    } catch (error) {
      throw new Error(
        `${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  tree.forEach((p) => p.children.forEach((s) => s.articles.sort(byOrder)));
  const articles = tree.flatMap((p) => p.children.flatMap((s) => s.articles));
  const navigation = tree.map((p) => ({
    ...p,
    children: p.children.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      href: s.href,
      description: s.description,
      order: s.order,
    })),
  }));
  const searchEntries: SearchEntry[] = tree.flatMap(
    (p) =>
      [
        {
          href: p.href,
          title: p.title,
          context: `一级目录 / ${p.label}`,
          tags: [],
          text: p.description,
          kind: "书架",
        },
        ...p.children.flatMap((s) => [
          {
            href: s.href,
            title: s.title,
            context: p.title,
            tags: [],
            text: s.description,
            kind: "分类",
          },
          ...s.articles.map((a) => ({
            href: a.href,
            title: a.title,
            context: `${p.title} / ${s.title}`,
            tags: a.tags,
            text: `${a.description} ${a.text}`,
            kind: "笔记" as const,
          })),
        ]),
      ] as SearchEntry[],
  );
  return { tree, navigation, articles, searchEntries, routes: [...routeSet] };
}

export function resolveContent(index: ContentIndex, path: string[] = []) {
  const primary = index.tree.find((p) => p.slug === path[0]);
  const secondary = primary?.children.find((s) => s.slug === path[1]);
  const article = secondary?.articles.find((a) => a.slug === path[2]);
  const valid =
    path.length === 0 ||
    (path.length === 1 && !!primary) ||
    (path.length === 2 && !!secondary) ||
    (path.length === 3 && !!article);
  const breadcrumbs = [
    { title: "Codex", href: "/" },
    ...(primary ? [{ title: primary.title, href: primary.href }] : []),
    ...(secondary ? [{ title: secondary.title, href: secondary.href }] : []),
    ...(article ? [{ title: article.title, href: article.href }] : []),
  ];
  return { primary, secondary, article, valid, breadcrumbs };
}
export function articleNeighbors(index: ContentIndex, article: ArticleRecord) {
  const siblings =
    index.tree
      .find((p) => p.id === article.primary)
      ?.children.find((s) => s.id === article.secondary)?.articles || [];
  const position = siblings.findIndex((a) => a.id === article.id);
  return {
    previous: position > 0 ? siblings[position - 1] : undefined,
    next: position >= 0 ? siblings[position + 1] : undefined,
  };
}
