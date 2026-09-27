import path from "node:path";
import type { Plugin } from "vite";
import { readContentSource } from "./content-source";
import { buildContent } from "../lib/content-model";
import { buildKnowledge } from "../lib/knowledge";
import type { ContentIndex } from "../lib/content-types";

/** Build-time filesystem ingestion; published Workers and browsers never read files. */
export function codexContent(): Plugin {
  let root = "";
  let cached: ContentIndex | undefined;
  let knowledge: ReturnType<typeof buildKnowledge> | undefined;
  let development = false;
  const ids = [
    "virtual:codex-content",
    "virtual:codex-navigation",
    "virtual:codex-search",
    "virtual:codex-knowledge",
  ];
  const getIndex = () => {
    if (!cached) {
      const source = readContentSource(root);
      cached = buildContent(source.config, source.files);
      knowledge = buildKnowledge(cached);
      if (development)
        for (const issue of knowledge.broken) {
          console.warn(
            `[Wiki link: ${issue.reason}] ${issue.source}:${issue.line || "?"} → [[${issue.target}]]`,
          );
        }
    }
    return cached;
  };
  return {
    name: "codex-content",
    configResolved(config) {
      root = config.root;
      development = config.command === "serve";
    },
    buildStart() {
      getIndex();
    },
    resolveId(id) {
      if (ids.includes(id)) return "\0" + id;
    },
    load(id) {
      if (!ids.some((name) => id === "\0" + name)) return;
      const index = getIndex();
      if (id === "\0virtual:codex-navigation")
        return `export default ${JSON.stringify(index.navigation)};`;
      if (id === "\0virtual:codex-search")
        return `export default ${JSON.stringify(knowledge!.searchEntries)};`;
      if (id === "\0virtual:codex-knowledge")
        return `export default JSON.parse(${JSON.stringify(JSON.stringify({ ...knowledge, searchEntries: [] }))});`;
      return `const tree = ${JSON.stringify(index.tree)}; export default {tree, navigation:${JSON.stringify(index.navigation)}, articles:tree.flatMap(p=>p.children.flatMap(s=>s.articles)), searchEntries:[], routes:${JSON.stringify(index.routes)}};`;
    },
    configureServer(server) {
      const contentRoot = path.join(root, "content");
      server.watcher.add(contentRoot);
      let timer: ReturnType<typeof setTimeout>;
      const changed = (file: string) => {
        const relative = path.relative(contentRoot, file);
        if (relative.startsWith("..") || path.isAbsolute(relative)) return;
        cached = undefined;
        clearTimeout(timer);
        timer = setTimeout(() => {
          for (const environment of Object.values(server.environments))
            environment.moduleGraph.invalidateAll();
          server.ws.send({ type: "full-reload" });
        }, 80);
      };
      server.watcher
        .on("add", changed)
        .on("change", changed)
        .on("unlink", changed);
      server.httpServer?.once("close", () => {
        clearTimeout(timer);
        server.watcher
          .off("add", changed)
          .off("change", changed)
          .off("unlink", changed);
      });
    },
  };
}
