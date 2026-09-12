"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LibraryIndex } from "@/components/LibraryIndex";
import { LibraryPage } from "@/components/LibraryPage";
import { librarySections } from "@/data/library";

export function Library({ onBack }: { onBack: () => void }) {
  const [activeChapter, setActiveChapter] = useState("profile");
  return (
    <section id="library" className="library">
      <header className="library-topline">
        <button className="back-button" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" /> 返回封面</button>
        <span className="edition">私人藏书 · 第一卷</span>
      </header>
      <div className="library-heading">
        <div><p className="eyebrow">知识、作品，以及成长的脚注</p><h2 id="library-title" tabIndex={-1}>SHUYING 的书房</h2></div>
        <span className="library-volume">藏于此，慢慢读。<br /><span>VOL. 01 / 2026</span></span>
      </div>
      <Tabs value={activeChapter} onValueChange={setActiveChapter} orientation="horizontal" className="book">
        <LibraryIndex sections={librarySections} activeChapter={activeChapter} />
        <div className="book-right">
          <div className="book-spine" aria-hidden="true" />
          <div className="book-ribbon" aria-hidden="true" />
          {librarySections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="book-panel">
              <LibraryPage section={section} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
      <div className="library-bottom"><span>四个章节，一个不断更新的我。</span><span>01 — 04</span></div>
    </section>
  );
}
