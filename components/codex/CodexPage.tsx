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
      primary={primaryNavigation}
      secondary={secondaryNavigation}
      article={article ? { id: article.id } : undefined}
    >
      <div className="page-running-head" aria-hidden="true" />
      {!primary ? (
        <>
          <header className="preface-header" id="preface">
            <p className="eyebrow">
              <span className="accent">序 / 00</span>
              <span>AN OPEN-ENDED NOTEBOOK</span>
            </p>
            <h1>
              {site.name}
              <span className="name-period">.</span>
            </h1>
            <p className="discipline">Computer Science / AI Infrastructure</p>
            <p className="opening-lines">
              I build things,
              <br />
              study systems,
              <br />
              and write down what I learn.
            </p>
            <p className="chinese-intro">
              一座持续生长的私人图书馆。
              <br />
              记录所学、所想，以及沿途的风景。
            </p>
          </header>
          <section className="currently" id="currently">
            <h2 className="eyebrow">CURRENTLY</h2>
            <div>
              {site.interests.map((i) => (
                <Link key={i.title} href={i.href}>
                  {i.title}
                  <span>↗</span>
                </Link>
              ))}
            </div>
            <p>
              保持好奇，缓慢生长。
              <span className="growth-line" />
            </p>
          </section>
          <section className="recent-section" id="recent">
            <div className="section-heading">
              <h2 className="eyebrow">RECENTLY UPDATED</h2>
              <span className="meta">最近翻动的几页</span>
            </div>
            <div className="article-list">
              {recent.map((a, i) => (
                <Link className="article-row" key={a.id} href={articleHref(a)}>
                  <span className="row-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="row-main">
                    <strong>{a.title}</strong>
                    <small>
                      {navigation.find((p) => p.id === a.primary)?.title} /{" "}
                      {a.tags[0]}
                    </small>
                  </span>
                  <time dateTime={a.updated}>
                    {formatDate(a.updated).slice(0, 6)}
                  </time>
                  <span className="row-arrow">↗</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="index-section" id="index">
            <div className="section-heading">
              <h2 className="eyebrow">INDEX</h2>
              <span className="meta">
                书架 / {String(navigation.length).padStart(2, "0")}
              </span>
            </div>
            {navigation.map((p, i) => (
              <Link href={`/${p.slug}`} key={p.id} className="index-row">
                <span className="row-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p.title}</span>
                <span className="index-dots" />
                <span className="meta">{p.label}</span>
                <span className="row-arrow">↗</span>
              </Link>
            ))}
          </section>
        </>
      ) : article ? (
        <Article
          article={article}
          primary={primary}
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
                        {a.sample && " · 示例笔记"}
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
      <footer className="page-footer">
        <span>不是终点，是不断续写的页。</span>
        <span>
          {site.name} / CODEX <i>✳</i>
        </span>
      </footer>
    </ContentLayout>
  );
}
