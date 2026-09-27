import fs from "node:fs";
import path from "node:path";
export function readContentSource(root: string) {
  const directory = path.join(root, "content");
  const files: Record<string, string> = {};
  function walk(folder: string) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const absolute = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.name.endsWith(".md"))
        files[path.relative(directory, absolute).replaceAll("\\", "/")] =
          fs.readFileSync(absolute, "utf8");
      else if (entry.name.endsWith(".mdx"))
        throw new Error(
          `${absolute}: this pipeline supports Markdown (.md); MDX/JSX execution is not enabled`,
        );
    }
  }
  walk(directory);
  return {
    config: JSON.parse(
      fs.readFileSync(path.join(directory, "directories.json"), "utf8"),
    ),
    files,
  };
}
