import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import {
  markdownExperience,
  highlightedLines,
  nodeText,
} from "../lib/markdown-experience.ts";
import { readContentSource } from "../build/content-source.ts";
import { buildContent } from "../lib/content-model.ts";

test("the React Markdown pre hook receives an exact copy payload, separate from numbered tokens", () => {
  const source = 'const text = "中文";\n\n  // 保留缩进\n';
  let payload;
  renderToStaticMarkup(createElement(Markdown, {
    rehypePlugins: [markdownExperience],
    components: {pre: ({node, children}) => {
      payload = node.properties["data-source"];
      return createElement('pre', null, children);
    }},
  }, '```js {1}\n' + source + '```'));
  assert.equal(payload, source);
});

function render(body) {
  return renderToStaticMarkup(
    createElement(
      Markdown,
      {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex, rehypeSlug, markdownExperience],
      },
      body,
    ),
  );
}
test("fenced code retains exact source and multiline tokens, with bounded selected lines", () => {
  const raw = "/* 多行\n * 注释 */\nconst n = 42;\n";
  const code = {
    type: "element",
    tagName: "code",
    properties: { className: ["language-cpp"] },
    data: { meta: "{2-3,999999999-1000000000}" },
    children: [{ type: "text", value: raw }],
  };
  const pre = {
    type: "element",
    tagName: "pre",
    properties: {},
    children: [code],
  };
  markdownExperience()({ type: "root", children: [pre] });
  assert.equal(pre.properties["data-source"], raw);
  assert.equal(nodeText(code), raw.trimEnd());
  const lines = code.children.filter((n) => n.type === "element");
  assert.equal(lines.length, 3);
  assert.match(JSON.stringify(lines[1]), /hljs-comment/);
  assert.deepEqual(
    lines
      .filter((n) => n.properties.className.includes("is-highlighted"))
      .map((n) => n.properties["data-line"]),
    ["2", "3"],
  );
  assert.deepEqual([...highlightedLines("{0-2,4,8-5}", 4)], [1, 2, 4]);
});
test("unknown and unlabelled code safely fall back to numbered plain text", () => {
  const html = render(
    '```unknown {1}\n<script>alert("x")</script>\n```\n\n```\nplain\n```',
  );
  assert.match(html, /data-language="unknown"/);
  assert.match(html, /data-language="text"/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.equal((html.match(/class="code-line/g) || []).length, 2);
});
test("math, tables, footnotes and duplicate Unicode heading anchors coexist", () => {
  const html = render(
    "## 中文标题\n\n$e^x$\n\n$$\n\\frac{1}{2}\n$$\n\n## 中文标题\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n正文[^n]\n\n[^n]: 注释",
  );
  assert.match(html, /class="katex-display"/);
  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /id="中文标题-1"/);
  assert.match(html, /<table>/);
  assert.match(html, /data-footnote-backref/);
});
test("captions are valid figure siblings and all callout variants keep ordinary quotations", () => {
  const html = render(
    '![替代文字](/diagram.svg "图一：地址分布")\n\n正文 ![内联](/inline.svg)\n\n> 普通引用\n\n' +
      ["NOTE", "TIP", "WARNING", "IMPORTANT", "CAUTION"]
        .map((kind) => `> [!${kind}]\n> 提示正文`)
        .join("\n\n"),
  );
  assert.match(
    html,
    /<figure class="article-figure"><img[^>]*alt="替代文字"[^>]*\/><figcaption>图一：地址分布<\/figcaption><\/figure>/,
  );
  assert.doesNotMatch(html, /<p><figure/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /<blockquote>\n<p>普通引用/);
  assert.equal((html.match(/class="callout"/g) || []).length, 5);
});
test("three real Chinese articles exercise the complete Markdown pipeline", () => {
  // Regression examples are independent of the author's editable/deletable library.
  const source = readContentSource(
    fileURLToPath(new URL("./fixtures/article-experience/", import.meta.url)),
  );
  const index = buildContent(source.config, source.files);
  for (const slug of [
    "stable-softmax",
    "raii-resource-lifetime",
    "coalesced-access",
  ]) {
    const article = index.articles.find((a) => a.slug === slug);
    assert.ok(article, slug);
    const html = render(article.body);
    assert.doesNotMatch(html, /katex-error|Lorem Ipsum/i);
    assert.match(html, /hljs-/);
    assert.match(html, /is-highlighted/);
    assert.match(html, /data-footnote-backref/);
    assert.match(html, /<table>/);
    assert.match(html, /class="callout"/);
  }
});
