import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import knowledge from "virtual:codex-knowledge";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { Breadcrumb } from "@/components/content/Breadcrumb";
import { formatDate } from "@/data/articles";
type Props = { params: Promise<{ tag: string }> };
export function generateStaticParams() {
  return knowledge.tags.map(({ tag }) => ({ tag }));
}
function findTag(value: string) {
  // vinext may preserve URL encoding in dynamic params; Next may decode it.
  return knowledge.tags.find(
    (group) => group.tag === value || group.href === `/tags/${value}`,
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${findTag(tag)?.tag || tag} · 标签` };
}
export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const group = findTag(tag);
  if (!group) notFound();
  return (
    <ContentLayout pageKey={group.href}>
      <header className="collection-header">
        <Breadcrumb
          items={[
            { title: "Codex", href: "/" },
            { title: "标签", href: "/tags" },
            { title: `#${group.tag}`, href: group.href },
          ]}
        />
        <p className="eyebrow accent">TAG / {group.articles.length} NOTES</p>
        <h1>#{group.tag}</h1>
        <p className="collection-description">
          跨越书架，沿着同一个主题继续阅读。
        </p>
      </header>
      <div className="article-list collection-list">
        {group.articles.map((note, i) => (
          <Link
            key={note.href}
            href={note.href}
            className="article-row detailed"
          >
            <span className="row-number">{String(i + 1).padStart(2, "0")}</span>
            <span className="row-main">
              <strong>{note.title}</strong>
              <p>{note.description}</p>
              <small>
                {note.path} · 更新于{" "}
                <time dateTime={note.updated}>{formatDate(note.updated)}</time>
              </small>
            </span>
            <span className="row-arrow">↗</span>
          </Link>
        ))}
      </div>
    </ContentLayout>
  );
}
