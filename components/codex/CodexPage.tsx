import Link from "next/link";
import { navigation, site } from "@/data/navigation";
import { articles, articlesIn, formatDate } from "@/data/articles";
import { articleHref, resolvePath } from "@/lib/content";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { Article } from "@/components/content/Article";
import { Breadcrumb } from "@/components/content/Breadcrumb";

export function CodexPage({ path = [] }: { path?: string[] }) {
  const { primary, secondary, article, breadcrumbs } = resolvePath(path);
  const primaryNavigation = navigation.find((p) => p.id === primary?.id);
  const secondaryNavigation = primaryNavigation?.children.find(
    (s) => s.id === secondary?.id,
  );
  const recent = [...articles]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, 4);
  return (
    <ContentLayout
      pageKey={primary ? undefined : "home"}
      primary={primaryNavigation}
      secondary={secondaryNavigation}
      article={article ? { id: article.id } : undefined}
    >
      {primary && !article && <div className="page-running-head" aria-hidden="true" />}
      {!primary ? (
        <>
          <header className="preface-header" id="preface">
            <h1>{site.name}</h1>
            <p className="preface-subtitle">个人笔记</p>
          </header>
          <section className="recent-section" id="recent">
            <div className="section-heading">
              <h2>最近更新</h2>
            </div>
            <div className="article-list">
              {!recent.length && <p className="collection-description">还没有发布的文章。</p>}
              {recent.map((a) => (
                <Link className="article-row" key={a.id} href={articleHref(a)}>
                  <span className="row-main">
                    <strong>{a.title}</strong>
                    <small>
                      {navigation.find((p) => p.id === a.primary)?.title}
                      {a.tags[0] && ` / ${a.tags[0]}`}
                    </small>
                  </span>
                  <time dateTime={a.updated}>
                    {a.updated.slice(5).replace("-", ".")}
                  </time>
                  <span className="row-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="index-section" id="index">
            <div className="section-heading">
              <h2>书架</h2>
            </div>
            {!navigation.length && <p className="collection-description">暂时没有目录。</p>}
            {navigation.map((p) => (
              <Link href={`/${p.slug}`} key={p.id} className="index-row">
                <span>{p.title}</span>
                <span className="index-dots" />
                <span className="meta">{articlesIn(p.id).length} 篇</span>
              </Link>
            ))}
          </section>
        </>
      ) : article ? (
        <Article
          article={article}
          secondary={secondary!}
          breadcrumbs={breadcrumbs}
        />
      ) : (
        <>
          <header className="collection-header">
            <Breadcrumb items={breadcrumbs} />
            <p className="eyebrow accent">
              {String(
                navigation.findIndex((p) => p.id === primary.id) + 1,
              ).padStart(2, "0")}{" "}
              / {primary.label}
            </p>
            <h1>{secondary?.title || primary.title}</h1>
            <p className="collection-description">
              {secondary?.description || primary.description}
            </p>
            <div className="collection-count meta">
              {secondary ? "NOTES" : "COLLECTIONS"} /{" "}
              {String(
                secondary
                  ? articlesIn(primary.id, secondary.id).length
                  : primary.children.length,
              ).padStart(2, "0")}
            </div>
          </header>
          {secondary ? (
            <div className="article-list collection-list">
              {articlesIn(primary.id, secondary.id).length ? (
                articlesIn(primary.id, secondary.id).map((a, i) => (
                  <Link
                    href={articleHref(a)}
                    key={a.id}
                    className="article-row detailed"
                  >
                    <span className="row-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="row-main">
                      <strong>{a.title}</strong>
                      <p>{a.description}</p>
                      <small>
                        {formatDate(a.updated)}
                      </small>
                    </span>
                    <span className="row-arrow">↗</span>
                  </Link>
                ))
              ) : (
                <div className="empty-shelf">
                  <span className="empty-mark">[ &nbsp; ]</span>
                  <h2>留一页，给未来的笔记。</h2>
                  <p>这个分类还没有文章。新的记录会从这里开始。</p>
                  <Link href={`/${primary.slug}`}>← 返回{primary.title}</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="shelf-list">
              {!primary.children.length && (
                <div className="empty-shelf">
                  <h2>这个目录还没有分类。</h2>
                  <p>分类和文章发布后会显示在这里。</p>
                </div>
              )}
              {primary.children.map((s, i) => (
                <Link
                  key={s.id}
                  href={`/${primary.slug}/${s.slug}`}
                  className="shelf-row"
                >
                  <span className="row-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2>{s.title}</h2>
                    {s.description && <p>{s.description}</p>}
                  </div>
                  <span className="meta">
                    {String(articlesIn(primary.id, s.id).length).padStart(
                      2,
                      "0",
                    )}
                    <span className="note-label"> NOTES</span>
                  </span>
                  <span className="row-arrow">↗</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </ContentLayout>
  );
}
