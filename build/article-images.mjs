import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";

/** Generate derived assets only; source screenshots and Markdown stay untouched. */
export async function buildArticleImages(root) {
  const directory = path.join(root, "public/images/articles");
  const cache = path.join(root, "node_modules/.cache/codex-images-v1");
  const index = {}, assets = new Map();
  const stats = { originals: 0, originalBytes: 0, optimizedBytes: 0 };
  async function walk(folder) {
    let entries;
    try { entries = await fs.readdir(folder, { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") return; throw error; }
    for (const entry of entries) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) { await walk(file); continue; }
      if (!entry.isFile() || !/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) continue;
      const source = await fs.readFile(file);
      let meta;
      try { meta = await sharp(source, { animated: true }).metadata(); }
      catch { console.warn(`[Article images] Keep unreadable source unchanged: ${file}`); continue; }
      if (!meta.width || !meta.height) continue;
      const url = "/images/articles/" + path.relative(directory, file).split(path.sep).map(encodeURIComponent).join("/");
      const dimensions = meta.orientation > 4
        ? { width: meta.height, height: meta.width }
        : { width: meta.width, height: meta.pageHeight || meta.height };
      // Preserve animation; GIF frames must never be flattened into one screenshot.
      if ((meta.pages || 1) > 1 || (meta.orientation || 1) !== 1) { index[url] = { ...dimensions, src: url }; continue; }
      const hash = createHash("sha256").update(source).digest("hex").slice(0, 24);
      const widths = [...new Set([640, 1280, 1920, meta.width].filter(width => width <= meta.width))].sort((a, b) => a - b);
      const variants = [];
      for (const width of widths) {
        const name = `images/optimized/${hash}-${width}.webp`;
        let buffer = assets.get(name);
        if (!buffer) {
          const cached = path.join(cache, `${hash}-${width}.webp`);
          try { buffer = await fs.readFile(cached); }
          catch (error) {
            if (error.code !== "ENOENT") throw error;
            buffer = await sharp(source).resize({ width, withoutEnlargement: true }).webp({ lossless: true, effort: 4 }).toBuffer();
            await fs.mkdir(cache, { recursive: true });
            const temporary = cached + "." + randomUUID() + ".tmp";
            await fs.writeFile(temporary, buffer);
            await fs.rename(temporary, cached);
          }
          assets.set(name, buffer);
        }
        variants.push({ width, url: "/" + name, bytes: buffer.length });
      }
      const full = variants.at(-1);
      stats.originals++; stats.originalBytes += source.length;
      stats.optimizedBytes += Math.min(source.length, full.bytes);
      // Never replace a source with a larger full-size encoding.
      const choices = variants.filter(v => v.width < meta.width || v.bytes < source.length);
      if (!choices.some(v => v.width === meta.width)) choices.push({ width: meta.width, url });
      index[url] = {
        ...dimensions, src: full.bytes < source.length ? full.url : url,
        srcSet: choices.map(v => `${v.url} ${v.width}w`).join(", "),
        sizes: "(max-width: 760px) calc(100vw - 40px), (max-width: 1200px) calc(100vw - 360px), 800px",
      };
    }
  }
  await walk(directory);
  return { index, assets, stats };
}
