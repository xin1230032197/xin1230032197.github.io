import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Exercise the real client component's server-rendered fallback without a DOM.
const source = fs.readFileSync(new URL("../components/content/MarkdownTable.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
});
const component = { exports: {} };
new Function("require", "module", "exports", outputText)(createRequire(import.meta.url), component, component.exports);
const { MarkdownTable } = component.exports;

test("table viewer preserves complete GFM table content and accessibility before hydration", () => {
  const html = renderToStaticMarkup(createElement(Markdown, {
    remarkPlugins: [remarkGfm],
    components: { table: ({ children }) => createElement(MarkdownTable, null, children) },
  }, "| 段落 | 英文表达 |\n| :--- | ---: |\n| 第一段 | **Keep reading.** |\n| 第二段 | [参考](/notes) 与 `a < b` |"));
  assert.equal((html.match(/<table>/g) || []).length, 1);
  assert.match(html, /role="region" aria-label="表格，可横向滚动"/);
  assert.match(html, /<th style="text-align:left">段落/);
  assert.match(html, /<th style="text-align:right">英文表达/);
  assert.match(html, /<strong>Keep reading\.<\/strong>/);
  assert.match(html, /href="\/notes"/);
  assert.match(html, /<code>a &lt; b<\/code>/);
  assert.doesNotMatch(html, /role="dialog"|class="table-expand"/);
});
