import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LibrarySection } from "@/data/library";

type LibraryIndexProps = {
  sections: LibrarySection[];
  activeChapter: string;
};

export function LibraryIndex({ sections, activeChapter }: LibraryIndexProps) {
  return (
    <aside className="border-b border-[var(--rule)] p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-11">
      <div className="mb-8 flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted-ink)]">
        <span>Index</span>
        <span>01—04</span>
      </div>
      <TabsList variant="line" className="grid h-auto w-full gap-0 bg-transparent p-0">
        {sections.map((section) => (
          <TabsTrigger key={section.id} value={section.id} className="group h-auto w-full justify-start rounded-none border-0 border-t border-[var(--rule)] px-0 py-5 text-left shadow-none last:border-b hover:text-[var(--mint-dark)] data-[state=active]:bg-transparent data-[state=active]:text-[var(--ink)] data-[state=active]:shadow-none after:hidden">
            <span className="mr-5 font-mono text-xs text-[var(--muted-ink)] transition-colors group-data-[state=active]:text-[var(--mint-dark)]">{section.number}</span>
            <span className="font-editorial text-xl tracking-[-0.02em] sm:text-2xl">{section.title}</span>
            <span className={`ml-auto h-px transition-all duration-300 ${activeChapter === section.id ? "w-8 bg-[var(--mint-dark)]" : "w-0 bg-transparent"}`} />
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-10 hidden lg:block">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted-ink)]">Shelf mark</p>
        <p className="mt-2 font-mono text-xs text-[var(--mint-dark)]">DEV / SYS / 2026</p>
      </div>
    </aside>
  );
}
