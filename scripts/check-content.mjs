import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { readContentSource } from "../build/content-source.ts";
import { buildContent } from "../lib/content-model.ts";
import { buildKnowledge } from "../lib/knowledge.ts";
const root = path.resolve(import.meta.dirname, "..");
const source = readContentSource(root);
const index = buildContent(source.config, source.files);
const knowledge = buildKnowledge(index);
const routes = new Set([
  ...index.routes,
  "/tags",
  ...knowledge.tags.map((tag) => tag.href),
]);
for (const broken of knowledge.broken)
  console.warn(
    `Wiki ${broken.reason}: ${broken.source}:${broken.line || "?"} → ${broken.target}`,
  );
let links = 0;
for (const a of index.articles) {
  for (const match of a.body.matchAll(/(!?)\[[^\]]*\]\((\/[^\s)]+)\)/g)) {
    const href = match[2].split(/[?#]/)[0];
    if (match[1])
      assert.ok(
        fs.existsSync(path.join(root, "public", href)),
        `${a.href}: missing image ${href}`,
      );
    else assert.ok(routes.has(href), `${a.href}: broken internal link ${href}`);
    links++;
  }
}
console.log(
  `Content OK: ${index.tree.length} shelves, ${routes.size} routes, ${index.articles.length} articles, ${links} internal references.`,
);
if (process.argv[2]) {
  const checks = [...routes].map((route) => ({ route, status: 200 }));
  checks.push(
    ...[
      "/missing-shelf",
      "/infra/missing-category",
      "/study/408/missing-article",
      "/infra/cuda/memory-hierarchy/extra",
      "/tags/not-existing-tag",
    ].map((route) => ({ route, status: 404 })),
  );
  for (let i = 0; i < checks.length; i += 5)
    await Promise.all(
      checks.slice(i, i + 5).map(async ({ route, status }) => {
        const response = await fetch(new URL(route, process.argv[2]));
        assert.equal(
          response.status,
          status,
          `${route}: unexpected HTTP status`,
        );
        assert.ok(
          (await response.text()).includes("<h1"),
          `${route}: missing server-rendered content`,
        );
      }),
    );
  console.log(`HTTP OK: ${routes.size} pages and ${checks.length - routes.size} invalid paths.`);
}
