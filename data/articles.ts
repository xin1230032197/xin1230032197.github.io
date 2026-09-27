import { content } from "./content";
export type { ArticleRecord } from "@/lib/content-types";
export const articles = content.articles;
export function articlesIn(primary: string, secondary?: string) {
  return articles.filter(
    (a) => a.primary === primary && (!secondary || a.secondary === secondary),
  );
}
export function formatDate(date: string) {
  return new Date(date + "T00:00:00Z")
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}
