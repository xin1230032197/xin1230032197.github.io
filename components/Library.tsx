"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LibraryIndex } from "@/components/LibraryIndex";
import { LibraryPage } from "@/components/LibraryPage";
import { demoContent } from "@/data/demoContent";

export function Library({ onBack }: { onBack: () => void }) {
  const [activeChapter, setActiveChapter] = useState("profile");
  return (
    <section id="library" className="library">
      <header className="library-topline">
        <button id="back-to-cover" className="back-button" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" /> {demoContent.navigation.back}</button>
      </header>
      <Tabs value={activeChapter} onValueChange={setActiveChapter} orientation="horizontal" className="book">
        <LibraryIndex sections={demoContent.library.sections} activeChapter={activeChapter} />
        <div className="book-right">
          <div className="book-spine" aria-hidden="true" />
          <div className="book-ribbon" aria-hidden="true" />
          {demoContent.library.sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="book-panel">
              <LibraryPage section={section} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  );
}
