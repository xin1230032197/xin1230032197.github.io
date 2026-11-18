import Link from "next/link";
import { MarkdownContent } from "./MarkdownContent";
import { type ArticleRecord } from "@/data/articles";
import { type SecondarySection } from "@/data/navigation";
import { ArticleCover } from "./ArticleCover";

import { articleHref, getArticleNeighbors } from "@/lib/content";
import { Breadcrumb } from "./Breadcrumb";
import { KnowledgeSections } from "./KnowledgeSections";
import type { BreadcrumbItem } from "@/lib/content-types";
export function Article({
  article: a,
  secondary,
  breadcrumbs,
}: {
  article: ArticleRecord;
  secondary: SecondarySection;
  breadcrumbs: BreadcrumbItem[];
}) {
  const { previous, next } = getArticleNeighbors(a);
  return (
    <article>
      <header className="article-header">
        <Breadcrumb items={breadcrumbs} />
        <ArticleCover title={a.title} cover={a.cover} />
        {a.description && <p className="article-summary">{a.description}</p>}
        <div className="article-meta meta">
          <span>
            发布于 <time dateTime={a.date}>{a.date}</time>
          </span>
          {a.updated !== a.date && <span>更新于 <time dateTime={a.updated}>{a.updated}</time></span>}
        </div>
        <div className="tags">
          {a.tags.map((t) => (
            <Link key={t} href={`/tags/${encodeURIComponent(t)}`}>
              # {t}
            </Link>
          ))}
        </div>
      </header>
      <div className="article-body">
        <MarkdownContent body={a.body} />
      </div>
      <div className="article-end">
        <nav className="article-pagination" aria-label="文章翻页">
          {previous && (
            <Link rel="prev" href={articleHref(previous)}>
              上一篇 / {previous.title}
            </Link>
          )}
          {next && (
            <Link rel="next" href={articleHref(next)}>
              下一篇 / {next.title}
            </Link>
          )}
        </nav>
        <Link href={secondary.href}>← 返回 {secondary.title}</Link>
      </div>
      <KnowledgeSections href={a.href} />
    </article>
  );
}
