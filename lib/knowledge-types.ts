import type { SearchEntry } from "./content-types";
export type WikiLookup = Record<string, string[]>;
export interface NoteSummary {
  href: string;
  title: string;
  path: string;
  updated: string;
  description: string;
}
export interface Backlink extends NoteSummary {
  context: string;
}
export interface RelatedNote extends NoteSummary {
  reason: string;
}
export interface BrokenLink {
  source: string;
  target: string;
  reason: "missing" | "ambiguous";
  line?: number;
}
export interface TagGroup {
  tag: string;
  href: string;
  articles: NoteSummary[];
}
export interface KnowledgeIndex {
  lookup: WikiLookup;
  backlinks: Record<string, Backlink[]>;
  related: Record<string, RelatedNote[]>;
  broken: BrokenLink[];
  tags: TagGroup[];
  searchEntries: SearchEntry[];
}
