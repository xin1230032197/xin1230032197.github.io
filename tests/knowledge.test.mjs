import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import { buildContent } from "../lib/content-model.ts";
import { buildKnowledge } from "../lib/knowledge.ts";
import { remarkWikiLinks, resolveWiki } from "../lib/wiki-links.ts";
import { searchContent, highlightParts, searchSnippet } from "../lib/search.ts";

const config = [
  {
    id: "study",
    slug: "study",
    title: "学习",
    children: [
      { id: "systems", slug: "systems", title: "系统" },
      { id: "math", slug: "math", title: "数学" },
    ],
  },
];
const note = (title, body, aliases = [], tags = [], updated = "2026-09-27") =>
  `---\ntitle: ${title}\ndate: 2026-09-01\nupdated: ${updated}\naliases: ${JSON.stringify(aliases)}\ntags: ${JSON.stringify(tags)}\n---\n${body}`;
const files = {
  "study/systems/cache.md": note(
    "Cache",
    "## 地址拆分\n缓存比较。",
    ["缓存", "CPU Cache"],
    ["C++", "内存"],
  ),
  "study/systems/source.md": note(
    "来源",
    "关于 [[缓存|缓存映射]] 的具体上下文。\n\n[再次引用](/study/systems/cache#地址拆分)\n\n[引用][ref]\n\n[ref]: cache\n\n[[source]]",
    [],
    ["内存"],
  ),
  "study/math/other.md": note("Other", "普通数学笔记。", [], ["数学"]),
};
const build = (input = files) => buildKnowledge(buildContent(config, input));
test("wiki targets resolve by normalized title, slug, alias and qualified path; ambiguity never guesses", () => {
  const index = build();
  for (const target of [
    "ＣＡＣＨＥ",
    "cache",
    "缓存",
    "cpu cache",
    "/study/systems/cache",
  ])
    assert.equal(
      resolveWiki(index.lookup, target).href,
      "/study/systems/cache",
    );
  const ambiguous = build({
    ...files,
    "study/math/cache.md": note("Cache", "重名", ["缓存"]),
  });
  assert.equal(resolveWiki(ambiguous.lookup, "缓存").reason, "ambiguous");
  assert.equal(resolveWiki(ambiguous.lookup, "cache").reason, "ambiguous");
  assert.equal(
    resolveWiki(ambiguous.lookup, "/study/systems/cache").href,
    "/study/systems/cache",
  );
});
test("wiki rendering skips code, formulas, escaped syntax and existing links; display text stays safe", () => {
  const index = build();
  const html = renderToStaticMarkup(
    createElement(
      Markdown,
      {
        remarkPlugins: [
          remarkMath,
          [remarkWikiLinks, { lookup: index.lookup }],
        ],
      },
      "[[缓存|显示文字]]\n\n`[[缓存]]`\n\n```txt\n[[缓存]]\n```\n\n$[[缓存]]$\n\n\\[[缓存]]\n\n[已有 [[缓存]]](https://example.com)\n\n[[缓存|&lt;script&gt;]]",
    ),
  );
  assert.equal((html.match(/href="\/study\/systems\/cache"/g) || []).length, 2);
  assert.match(html, />显示文字<\/a>/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});
test("broken wiki links report missing/ambiguous without failing index or rendering production", () => {
  const input = {
    ...files,
    "study/math/cache.md": note("Cache", "[[失踪|待写的笔记]] [[cache]]"),
  };
  const index = build(input);
  assert.ok(
    index.broken.some((b) => b.target === "失踪" && b.reason === "missing"),
  );
  assert.ok(
    index.broken.some((b) => b.target === "cache" && b.reason === "ambiguous"),
  );
  for (const development of [true, false]) {
    const html = renderToStaticMarkup(
      createElement(
        Markdown,
        {
          remarkPlugins: [
            [remarkWikiLinks, { lookup: index.lookup, development }],
          ],
        },
        "[[失踪|待写的笔记]]",
      ),
    );
    assert.match(html, /待写的笔记/);
    assert.doesNotMatch(html, /<a /);
    assert.equal(html.includes('data-broken-link="missing"'), development);
  }
});
test("backlinks merge wiki, Markdown and reference links, omit self-links and retain source context", () => {
  const index = build();
  assert.equal(index.backlinks["/study/systems/cache"].length, 1);
  assert.equal(index.backlinks["/study/systems/cache"][0].title, "来源");
  assert.equal(index.backlinks["/study/systems/cache"][0].path, "学习 / 系统");
  assert.match(
    index.backlinks["/study/systems/cache"][0].context,
    /关于 缓存映射 的具体上下文/,
  );
  assert.equal(index.backlinks["/study/systems/source"].length, 0);
  const edited = { ...files };
  delete edited["study/systems/source.md"];
  assert.equal(build(edited).backlinks["/study/systems/cache"].length, 0);
});
test("related notes prioritize bidirectional explicit links, tags, category, then keywords; stable top four", () => {
  const input = {
    "study/systems/root.md": note(
      "Root",
      "缓存 性能 分析 独特关键词。 [[edge]]",
      [],
      ["A", "B"],
    ),
    "study/math/edge.md": note("Edge", "外部分类的显式引用。"),
    "study/math/tagged.md": note("Tagged", "无关描述。", [], ["A", "B"]),
    "study/systems/sibling.md": note("Sibling", "不同主题描述。"),
    "study/math/words.md": note("Words", "缓存 性能 分析 独特关键词。"),
    "study/math/empty.md": note("Empty", "完全不同。"),
  };
  const index = build(input);
  assert.deepEqual(
    index.related["/study/systems/root"].map((n) => n.title),
    ["Edge", "Tagged", "Sibling", "Words"],
  );
  assert.equal(index.related["/study/math/edge"][0].title, "Root");
  assert.deepEqual(
    index.related,
    build(Object.fromEntries(Object.entries(input).reverse())).related,
  );
});
test("tag aggregation encodes special/Chinese tags and exposes hierarchy and updated order", () => {
  const index = build({
    ...files,
    "study/math/new.md": note("New", "新笔记。", [], ["C++"], "2026-09-28"),
  });
  const group = index.tags.find((t) => t.tag === "C++");
  assert.equal(group.href, "/tags/C%2B%2B");
  assert.deepEqual(
    group.articles.map((n) => n.title),
    ["New", "Cache"],
  );
  assert.equal(group.articles[0].path, "学习 / 数学");
  assert.equal(
    index.tags.find((t) => t.tag === "内存").href,
    "/tags/%E5%86%85%E5%AD%98",
  );
});
test("search ranks whole exact title > prefix > alias > tag > heading > body with AND filtering", () => {
  const query = "GPU Cache";
  const entry = (title, extras = {}) => ({
    href: `/${title}`,
    title,
    context: "分类",
    tags: [],
    text: "",
    kind: "笔记",
    ...extras,
  });
  const entries = [
    entry("Body", { text: query }),
    entry("Heading", { headings: [query] }),
    entry("Tag", { tags: [query] }),
    entry("Alias", { aliases: [query] }),
    entry("GPU Cache guide"),
    entry(query),
  ];
  assert.deepEqual(
    searchContent(entries, query).map((e) => e.title),
    [query, "GPU Cache guide", "Alias", "Tag", "Heading", "Body"],
  );
  assert.equal(searchContent(entries, "ＧＰＵ ＣＡＣＨＥ")[0].title, query);
  assert.equal(searchContent(entries, "GPU nonexistent").length, 0);
  const parts = highlightParts("中文 ＣＡＣＨＥ & <script>", "cache");
  assert.deepEqual(
    parts.filter((p) => p.match).map((p) => p.text),
    ["ＣＡＣＨＥ"],
  );
  assert.equal(parts.map((p) => p.text).join(""), "中文 ＣＡＣＨＥ & <script>");
  assert.match(searchSnippet(entries[0], query), /GPU Cache/);
  assert.match(
    build().searchEntries.find((e) => e.title === "Cache").breadcrumb,
    /Codex \/ 学习 \/ 系统 \/ Cache/,
  );
});
