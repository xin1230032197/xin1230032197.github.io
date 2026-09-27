import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { preparePages } from "./prepare-pages.mjs";

process.env.GITHUB_PAGES = "true";
process.env.NEXT_PUBLIC_STATIC_EXPORT = "true";
const cli = new URL("../node_modules/vinext/dist/cli.js", import.meta.url);
const result = spawnSync(process.execPath, [fileURLToPath(cli), "build"], {
  stdio: "inherit",
  env: process.env,
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
await preparePages(fileURLToPath(new URL("../dist/client/", import.meta.url)));
