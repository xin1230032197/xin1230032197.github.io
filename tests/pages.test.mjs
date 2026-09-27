import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { preparePages } from "../scripts/prepare-pages.mjs";

test("Pages export supports deep links, Unicode tags and RSC navigation", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "codex-pages-"));
  try {
    await mkdir(path.join(root, "tags"));
    for (const file of ["index.html", "404.html", "tags.html", "tags/%E6%95%B0%E5%AD%A6.html", "tags/C%2B%2B.rsc"])
      await writeFile(path.join(root, file), file);
    await preparePages(root);
    assert.equal(await readFile(path.join(root, "tags/index.html"), "utf8"), "tags.html");
    assert.equal(await readFile(path.join(root, "tags/数学/index.html"), "utf8"), "tags/%E6%95%B0%E5%AD%A6.html");
    assert.equal(await readFile(path.join(root, "tags/C++.rsc"), "utf8"), "tags/C%2B%2B.rsc");
    assert.equal(await readFile(path.join(root, "404.html"), "utf8"), "404.html");
    assert.equal(await readFile(path.join(root, ".nojekyll"), "utf8"), "");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
