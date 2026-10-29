import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { buildContent } from "../lib/content-model.ts";
import { articleExplorer, buildExplorer } from "../lib/explorer-model.ts";
import { bubblePositions, zoomAt } from "../lib/explorer-camera.ts";

const config = [{ id: "study", slug: "study", title: "学习", children: [
  { id: "math", slug: "math", title: "数学" },
] }];
const source = body => `---\ntitle: 我的笔记\ndate: 2026-10-29\n---\n${body}`;
const content = body => buildContent(config, { "study/math/note.md": source(body) });

test("explorer follows configured directories, article order and empty library changes", () => {
  const index = content("记录。");
  const root = buildExplorer(index);
  const article = root.children[0].children[0].children[0];
  assert.equal(root.children[0].title, "学习");
  assert.equal(root.children[0].children[0].title, "数学");
  assert.equal(article.href, "/study/math/note");
  assert.equal(article.body, "记录。");
  assert.deepEqual(article.children, []);
  assert.deepEqual(buildExplorer(buildContent([], {})).children, []);
  assert.deepEqual(buildExplorer(buildContent(config, {})).children[0].children[0].children, []);
});

test("all heading levels drill into the correct section, ignoring fenced code and keeping parent prose", () => {
  const body = ["前言。", "# 大纲", "大纲说明。", "### 跳级", "此节正文。", "```md\n# 代码中的标题\n```", "###### 深层", "深层正文。", "## 同名", "第一处。", "## 同名", "第二处。", "Setext 标题\n---", "末节。"].join("\n\n");
  const article = articleExplorer(content(body).articles[0]);
  assert.equal(article.body, "前言。");
  const outline = article.children[0];
  assert.equal(outline.body, "大纲说明。");
  assert.equal(outline.children[0].title, "跳级");
  assert.match(outline.children[0].body, /# 代码中的标题/);
  assert.equal(outline.children[0].children[0].depth, 6);
  assert.equal(outline.children[0].children[0].body, "深层正文。");
  assert.notEqual(outline.children[1].id, outline.children[2].id);
  assert.equal(outline.children[1].body, "第一处。");
  assert.equal(outline.children[2].body, "第二处。");
  assert.equal(outline.children[3].title, "Setext 标题");
  assert.equal(outline.children[3].body, "末节。");
});

test("isolated leaf sections retain reference links, images and footnotes", () => {
  const article = articleExplorer(content("## 引用\n正文 [来源][ref]，注释[^one]。\n\n![图解][image]\n\n## 其他\n其他正文。\n\n[ref]: https://example.com\n[image]: /diagram.svg\n[^one]: 脚注内容。\n").articles[0]);
  const html = renderToStaticMarkup(createElement(Markdown, { remarkPlugins: [remarkGfm] }, article.children[0].body));
  assert.match(html, /href="https:\/\/example.com"/);
  assert.match(html, /src="\/diagram.svg"/);
  assert.match(html, /脚注内容/);
  assert.doesNotMatch(html, /其他正文/);
});

test("bubble titles preserve inline code and wiki display labels", () => {
  const article = articleExplorer(content("## 用 `softmax` 理解 [[稳定性|数值稳定]]\n笔记。").articles[0]);
  assert.equal(article.children[0].title, "用 softmax 理解 数值稳定");
});

test("pointer anchored zoom keeps the exact world coordinate under the cursor and respects limits", () => {
  const point = { x: 329, y: 217 };
  let camera = { x: -90, y: 40, k: 1.4 };
  const before = { x: (point.x - camera.x) / camera.k, y: (point.y - camera.y) / camera.k };
  camera = zoomAt(camera, point, -260);
  assert.ok(Math.abs((point.x - camera.x) / camera.k - before.x) < 1e-9);
  assert.ok(Math.abs((point.y - camera.y) / camera.k - before.y) < 1e-9);
  for (let i = 0; i < 50; i++) camera = zoomAt(camera, point, -900);
  assert.equal(camera.k, 3.5);
  for (let i = 0; i < 50; i++) camera = zoomAt(camera, point, 900);
  assert.equal(camera.k, .4);
});

test("large libraries have distinct reachable bubble positions on mobile and desktop", () => {
  for (const width of [320, 1200]) {
    const points = bubblePositions(250, width, 900);
    assert.equal(points.length, 250);
    assert.ok(points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)));
    assert.equal(new Set(points.map(p => `${p.x},${p.y}`)).size, 250);
    for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++)
      assert.ok(Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) > (width < 500 ? 100 : 124));
  }
});
