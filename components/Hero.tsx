"use client";

import { ArrowUpRight, BookOpen } from "lucide-react";
import { CharacterStage } from "@/components/CharacterStage";

export function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="hero">
      <header className="topline">
        <div className="brand"><span className="brand-seal">S</span><span>SHUYING <b>的个人空间</b></span></div>
        <span className="edition">个人档案 · 第一卷</span>
      </header>
      <div className="hero-layout hero-enter">
        <div className="hero-copy">
          <p className="eyebrow"><BookOpen size={15} aria-hidden="true" /> 一个正在慢慢生长的数字书房</p>
          <h1>SHUYING<span>写代码，也写下沿途的风景。</span></h1>
          <div className="hero-intro">
            <p>计算机科学</p>
            <p>人工智能 / 系统 / 基础设施</p>
            <blockquote>「在构建中学习，在记录中前行。」</blockquote>
          </div>
          <button id="enter-library" className="enter-button" onClick={onEnter}>
            <span>进入书房</span><ArrowUpRight size={19} aria-hidden="true" />
          </button>
          <p className="cover-note">翻开这一页，认识我和我正在做的事。</p>
        </div>
        <CharacterStage />
      </div>
      <div className="cover-bottom"><span>序章 / 关于好奇心的一切</span><span>2026 — 持续更新中</span></div>
    </section>
  );
}
