import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LibrarySection } from "@/data/library";

type LibraryIndexProps = { sections: LibrarySection[]; activeChapter: string };

export function LibraryIndex({ sections, activeChapter }: LibraryIndexProps) {
  return (
    <aside className="book-index">
      <div className="index-heading"><span>目录</span><span>INDEX</span></div>
      <TabsList aria-label="书房章节" variant="line" className="chapter-list">
        {sections.map((section) => (
          <TabsTrigger key={section.id} value={section.id} className="chapter-tab">
            <span className="chapter-number">{section.number}</span>
            <span className="chapter-label">{section.title}<small>{section.file}</small></span>
            <span className={activeChapter === section.id ? "chapter-marker active" : "chapter-marker"} />
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="index-bottom"><span className="index-quote">保持好奇，<br />慢慢积累。</span><p>DEV / SYS / 2026</p></div>
    </aside>
  );
}
