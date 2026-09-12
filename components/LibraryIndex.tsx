import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LibrarySection } from "@/data/demoContent";

type LibraryIndexProps = { sections: readonly LibrarySection[]; activeChapter: string };

export function LibraryIndex({ sections, activeChapter }: LibraryIndexProps) {
  return (
    <aside className="book-index">
      <div className="index-heading"><span>目录</span></div>
      <TabsList aria-label="书房章节" variant="line" className="chapter-list">
        {sections.map((section) => (
          <TabsTrigger key={section.id} value={section.id} className="chapter-tab">
            <span className="chapter-number">{section.number}</span>
            <span className="chapter-label">{section.title}<small>{section.file}</small></span>
            <span className={activeChapter === section.id ? "chapter-marker active" : "chapter-marker"} />
          </TabsTrigger>
        ))}
      </TabsList>
    </aside>
  );
}
