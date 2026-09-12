"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LibraryIndex } from "@/components/LibraryIndex";
import { LibraryPage } from "@/components/LibraryPage";
import { librarySections } from "@/data/library";

export function Library() {
  const [activeChapter, setActiveChapter] = useState("profile");

  return (
    <section id="library" className="scroll-mt-0 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-[var(--ink)] pb-5 sm:mb-14">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--mint-dark)]">Open collection · Vol. 01</p>
            <h2 className="font-editorial text-4xl tracking-[-0.045em] sm:text-6xl">SHUYING&apos;S LIBRARY</h2>
          </div>
          <p className="hidden font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-ink)] sm:block">Archive / Index / Notes</p>
        </div>

        <Tabs value={activeChapter} onValueChange={setActiveChapter} orientation="vertical" className="relative grid min-h-[600px] gap-0 overflow-hidden rounded-sm border border-[rgba(32,35,31,0.2)] bg-[rgba(249,248,244,0.76)] shadow-[0_30px_80px_rgba(32,35,31,0.09)] lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.7fr)]">
          <LibraryIndex sections={librarySections} activeChapter={activeChapter} />
          <div className="relative min-w-0 bg-[rgba(255,255,255,0.28)]">
            <div className="absolute inset-y-0 left-0 hidden w-5 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(32,35,31,0.07),transparent)] lg:block" />
            {librarySections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="h-full">
                <LibraryPage section={section} />
              </TabsContent>
            ))}
          </div>
          <div className="absolute right-8 top-0 h-24 w-8 bg-[var(--mint)] shadow-sm after:absolute after:bottom-0 after:border-x-[16px] after:border-b-[12px] after:border-x-transparent after:border-b-[rgba(249,248,244,0.95)] after:content-[''] sm:right-12" aria-hidden="true" />
        </Tabs>
      </div>
    </section>
  );
}
