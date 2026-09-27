import { content } from "@/data/content";
import { resolveContent, articleNeighbors } from "./content-model";
import type { ArticleRecord } from "./content-types";
export function articleHref(article: ArticleRecord) {
  return article.href;
}
export function resolvePath(path: string[] = []) {
  return resolveContent(content, path);
}
export function getArticleNeighbors(article: ArticleRecord) {
  return articleNeighbors(content, article);
}
