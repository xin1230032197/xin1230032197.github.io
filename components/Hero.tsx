"use client";

import { ArrowUpRight } from "lucide-react";
import { CharacterStage } from "@/components/CharacterStage";
import { demoContent } from "@/data/demoContent";

export function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="hero">
      <div className="hero-layout hero-enter">
        <div className="hero-copy">
          <h1>{demoContent.hero.name}<span>{demoContent.hero.subtitle}</span></h1>
          <div className="hero-intro">
            <p>{demoContent.hero.field1}</p>
            <p>{demoContent.hero.field2}</p>
            <blockquote>{demoContent.hero.quote}</blockquote>
          </div>
          <button id="enter-library" className="enter-button" onClick={onEnter}>
            <span>{demoContent.hero.button}</span><ArrowUpRight size={19} aria-hidden="true" />
          </button>
        </div>
        <CharacterStage />
      </div>
    </section>
  );
}
