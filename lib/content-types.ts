export interface ArticleRecord {
  id: string;
  href: string;
  primary: string;
  secondary: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  aliases?: string[];
  order: number;
  body: string;
  text: string;
  sample?: boolean;
}
export interface SecondarySection {
  id: string;
  title: string;
  slug: string;
  href: string;
  description: string;
  order: number;
}
export interface PrimarySection extends SecondarySection {
  label: string;
  children: SecondarySection[];
}
export interface ContentSection extends Omit<PrimarySection, "children"> {
  children: (SecondarySection & { articles: ArticleRecord[] })[];
}
export interface SearchEntry {
  href: string;
  title: string;
  context: string;
  tags: string[];
  text: string;
  kind: "书架" | "分类" | "笔记";
  aliases?: string[];
  headings?: string[];
  breadcrumb?: string;
}
export interface ContentIndex {
  tree: ContentSection[];
  navigation: PrimarySection[];
  articles: ArticleRecord[];
  searchEntries: SearchEntry[];
  routes: string[];
}
export interface BreadcrumbItem {
  title: string;
  href: string;
}
