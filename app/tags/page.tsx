import Link from "next/link";
import knowledge from "virtual:codex-knowledge";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { Breadcrumb } from "@/components/content/Breadcrumb";
export const metadata = { title: "标签" };
export default function TagsPage() {
  return (
    <ContentLayout pageKey="/tags">
      <header className="collection-header">
        <Breadcrumb
          items={[
            { title: "Codex", href: "/" },
            { title: "标签", href: "/tags" },
          ]}
        />
        <p className="eyebrow accent">TAGS / {knowledge.tags.length}</p>
        <h1>标签</h1>
      </header>
      <div className="tag-index">
        {!knowledge.tags.length && <p className="collection-description">还没有标签。</p>}
        {knowledge.tags.map((group) => (
          <Link key={group.tag} href={group.href}>
            #{group.tag}
            <span className="meta">{group.articles.length}</span>
          </Link>
        ))}
      </div>
    </ContentLayout>
  );
}
