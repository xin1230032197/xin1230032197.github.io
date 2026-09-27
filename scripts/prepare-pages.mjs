import { readdir, mkdir, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

// vinext exports URL-encoded filenames. Static hosts decode request paths before
// looking up files; materialize Unicode names and directory indexes for Pages.
export async function preparePages(root) {
  const files = await readdir(root, { recursive: true });
  for (const file of files) {
    if (!/\.(html|rsc)$/.test(file)) continue;
    const decoded = decodeURIComponent(file);
    const source = path.join(root, file);
    const target = path.join(root, decoded);
    if (source !== target) {
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(source, target);
    }
    if (!file.endsWith(".html") || ["index.html", "404.html"].includes(path.basename(file))) continue;
    const index = path.join(root, decoded.slice(0, -5), "index.html");
    await mkdir(path.dirname(index), { recursive: true });
    await copyFile(source, index);
  }
  await writeFile(path.join(root, ".nojekyll"), "");
}
