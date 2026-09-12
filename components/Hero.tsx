"use client";

import { ArrowDown, BookOpen } from "lucide-react";
import { CharacterStage } from "@/components/CharacterStage";

export function Hero() {
  const enterLibrary = () => {
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100svh] px-5 pb-10 pt-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between border-b border-[var(--rule)] pb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted-ink)] sm:text-xs">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full border border-[var(--ink)] font-semibold text-[var(--ink)]">S</span>
          <span>Personal archive</span>
        </div>
        <div className="hidden items-center gap-6 sm:flex">
          <span>File 001</span>
          <span className="flex items-center gap-2"><i className="size-1.5 rounded-full bg-[var(--mint-dark)]" /> Online</span>
        </div>
      </div>

      <div className="hero-enter mx-auto grid min-h-[calc(100svh-74px)] max-w-[1320px] items-center gap-12 py-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16 lg:py-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[var(--mint-dark)]">
            <BookOpen aria-hidden="true" className="size-4" />
            <span>Volume I · 2026</span>
          </div>
          <h1 className="font-editorial text-[clamp(4.5rem,11vw,9.5rem)] leading-[0.76] tracking-[-0.075em]">SHUYING</h1>
          <div className="mt-8 border-l-2 border-[var(--mint)] pl-5 sm:mt-10 sm:pl-7">
            <p className="text-xl font-medium leading-relaxed tracking-[-0.02em] sm:text-2xl">Computer Science<br />AI / Systems / Infrastructure</p>
            <p className="mt-5 max-w-md text-base leading-7 text-[var(--muted-ink)] sm:text-lg">“Building, learning, and documenting the journey.”</p>
          </div>
          <button type="button" onClick={enterLibrary} className="group mt-10 inline-flex min-h-12 items-center gap-4 border-b border-[var(--ink)] pb-2 font-mono text-sm font-semibold tracking-[0.08em] transition-colors hover:border-[var(--mint-dark)] hover:text-[var(--mint-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mint-dark)]">
            ENTER LIBRARY
            <ArrowDown aria-hidden="true" className="size-4 transition-transform group-hover:translate-y-1" />
          </button>
        </div>
        <CharacterStage />
      </div>
    </section>
  );
}
