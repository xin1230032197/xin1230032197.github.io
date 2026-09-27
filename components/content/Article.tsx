import Link from "next/link";
import { MarkdownContent } from "./MarkdownContent";
import { articlesIn, formatDate, type ArticleRecord } from "@/data/articles";
import { type PrimarySection, type SecondarySection } from "@/data/navigation";

import { articleHref, getArticleNeighbors } from "@/lib/content";
import { Breadcrumb } from "./Breadcrumb";
import { KnowledgeSections } from "./KnowledgeSections";
import type { BreadcrumbItem } from "@/lib/content-types";
export function Article({
  article: a,
  primary,
  secondary,
  breadcrumbs,
}: {
  article: ArticleRecord;
  primary: PrimarySection;
  secondary: SecondarySection;
  breadcrumbs: BreadcrumbItem[];
}) {
  const siblings = articlesIn(primary.id, secondary.id);
  const { previous, next } = getArticleNeighbors(a);
  return (
    <article>
      <header className="article-header">
        <Breadcrumb items={breadcrumbs} />
        <p className="eyebrow accent">
          {String(siblings.indexOf(a) + 1).padStart(2, "0")} / FIELD NOTE
        </p>
        <h1>{a.title}</h1>
        <p className="article-summary">{a.description}</p>
        <div className="article-meta meta">
          <span>
            PUBLISHED / <time dateTime={a.date}>{formatDate(a.date)}</time>
          </span>
          <span>
            UPDATED / <time dateTime={a.updated}>{formatDate(a.updated)}</time>
          </span>
          <span>{Math.max(1, Math.ceil(a.body.length / 650))} MIN READ</span>
          {a.sample && <span className="sample-label">示例笔记</span>}
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
        <span className="end-mark">✳</span>
        <p>这页笔记还会继续生长。</p>
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
