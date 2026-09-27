import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildContent,
  resolveContent,
  articleNeighbors,
} from "../lib/content-model.ts";
import { searchContent } from "../lib/search.ts";
import { buildKnowledge } from "../lib/knowledge.ts";
const config = [
  {
    id: "study",
    slug: "study",
    title: "学习",
    order: 20,
    children: [{ id: "cs408", slug: "408", title: "408", order: 10 }],
  },
];
const note = (title, order = 10) =>
  `---\ntitle: ${title}\ndescription: "简介: 带冒号"\ndate: 2026-09-01\nupdated: 2026-09-03\ntags:\n  - CUDA\n  - 内存\norder: ${order}\n---\n\n## 第一节\n\n只有正文包含的关键词：访存合并。\n\n### 子节\n`;
const files = {
  "study/408/cache.md": note("Cache", 20),
  "study/408/pipeline.md": note("Pipeline", 10),
};

test("empty libraries and entirely custom directories have no required demo content", () => {
  const empty = buildContent([], {});
  assert.deepEqual(empty.articles, []);
  assert.deepEqual(empty.navigation, []);
  assert.ok(resolveContent(empty, []).valid);
  assert.deepEqual(buildKnowledge(empty).tags, []);
  assert.deepEqual(searchContent(empty.searchEntries, "缓存"), []);
  const custom = buildContent([
    { id: "myself", slug: "myself", title: "我", children: [] },
    { id: "diary", slug: "kao-yan-ri-ji", title: "考研日记", children: [
      { id: "records", slug: "suo-sui-ji-lu", title: "琐碎记录" },
    ] },
  ], { "kao-yan-ri-ji/suo-sui-ji-lu/today.md": "---\ntitle: 今天的记录\ndate: 2026-09-27\n---\n\n记录自己的学习进度。" });
  assert.ok(resolveContent(custom, ["myself"]).valid);
  assert.equal(custom.articles.length, 1);
  assert.equal(custom.articles[0].title, "今天的记录");
  for (const oldPath of [["infra"], ["study", "408", "cache"]])
    assert.equal(resolveContent(custom, oldPath).valid, false);
  assert.deepEqual(articleNeighbors(custom, custom.articles[0]), { previous: undefined, next: undefined });
});
test("discovers nested Markdown; frontmatter drives hierarchy, stable routes and sorting", () => {
  const content = buildContent(config, files);
  assert.equal(content.articles[0].title, "Pipeline");
  assert.equal(content.articles[1].description, "简介: 带冒号");
  assert.equal(
    resolveContent(content, ["study", "408", "cache"]).article.href,
    "/study/408/cache",
  );
  assert.equal(
    resolveContent(content, ["study", "408", "cache", "extra"]).valid,
    false,
  );
  assert.equal(
    resolveContent(content, ["study", "wrong", "cache"]).valid,
    false,
  );
  assert.deepEqual(
    resolveContent(content, ["study", "408", "cache"]).breadcrumbs.map(
      (b) => b.title,
    ),
    ["Codex", "学习", "408", "Cache"],
  );
});
test("config changes add, rename, reorder and remove directories without component edits", () => {
  const edited = structuredClone(config);
  edited[0].title = "学习笔记";
  edited[0].children[0].title = "计算机基础";
  edited.unshift({
    id: "infra",
    slug: "infra",
    title: "AI Infra",
    order: 1,
    children: [{ id: "cuda", slug: "cuda", title: "CUDA", order: 1 }],
  });
  const content = buildContent(edited, {
    ...files,
    "infra/cuda/kernel.md": note("Kernel"),
  });
  assert.equal(content.tree[0].slug, "infra");
  assert.equal(content.navigation[1].children[0].title, "计算机基础");
  assert.equal(
    resolveContent(content, ["infra", "cuda", "kernel"]).valid,
    true,
  );
  assert.equal(buildContent(edited.slice(1), files).tree.length, 1);
  assert.equal(buildContent([], {}).routes.length, 1);
});
test("article additions/deletions and order control previous/next without wrapping", () => {
  const content = buildContent(config, files);
  const [first, last] = content.articles;
  assert.equal(articleNeighbors(content, first).previous, undefined);
  assert.equal(articleNeighbors(content, first).next.id, last.id);
  assert.equal(articleNeighbors(content, last).next, undefined);
  assert.equal(articleNeighbors(content, last).previous.id, first.id);
  const single = buildContent(config, {
    "study/408/cache.md": files["study/408/cache.md"],
  });
  assert.equal(single.articles.length, 1);
  assert.deepEqual(articleNeighbors(single, single.articles[0]), {
    previous: undefined,
    next: undefined,
  });
});
test("search matches directory titles, article titles, tags and body; titles rank first", () => {
  const index = buildContent(config, files).searchEntries;
  assert.equal(searchContent(index, "学习")[0].kind, "书架");
  assert.equal(searchContent(index, "cache")[0].title, "Cache");
  assert.equal(searchContent(index, "ＣＡＣＨＥ")[0].title, "Cache");
  assert.equal(searchContent(index, "cuda 访存合并").length, 2);
  assert.equal(searchContent(index, "内存").length, 2);
  assert.equal(searchContent(index, "no-match").length, 0);
});
test("rejects malformed metadata, real invalid dates, orphan paths and duplicate directories", () => {
  assert.throws(
    () => buildContent(config, { "study/408/cache.md": "no frontmatter" }),
    /frontmatter/,
  );
  assert.throws(
    () =>
      buildContent(config, {
        "study/408/cache.md": note("Bad").replace("2026-09-01", "2026-02-30"),
      }),
    /calendar/,
  );
  assert.throws(
    () =>
      buildContent(config, {
        "study/408/cache.md": note("Bad").replace("2026-09-03", "2026-08-01"),
      }),
    /precede/,
  );
  assert.throws(
    () => buildContent(config, { "missing/408/cache.md": note("Bad") }),
    /parent directory/,
  );
  assert.throws(() => buildContent([...config, ...config], {}), /duplicate/);
  assert.throws(
    () =>
      buildContent(config, {
        "study/408/cache.md": note("Bad").replace(
          "title: Bad",
          "title: Bad\ntitle: duplicate",
        ),
      }),
    /unique|unique key|Map keys/i,
  );
  assert.throws(
    () =>
      buildContent(config, {
        "study/408/cache.md": note("Bad").replace("order: 10", "order: bad"),
      }),
    /number/,
  );
});
