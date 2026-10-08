"use client";
import { useEffect, useId, useState } from "react";
type Heading = { id: string; text: string; level: number };
export function TableOfContents({
  contentKey,
  onNavigate,
}: {
  contentKey: string;
  onNavigate?: () => void;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");
  const listId = useId();
  useEffect(() => {
    const body = document.querySelector(".article-body");
    const nodes = Array.from(
      body
        ? body.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
        : document.querySelectorAll<HTMLElement>("main > section[id], .content-column section[id]"),
    ).filter((node) => !node.closest("[data-footnotes]"));
    const hs = nodes.map((n) => ({
      id: n.id,
      text: n.matches("section")
        ? n.querySelector("h2")?.textContent || n.id
        : headingText(n),
      level: n.matches("section") ? 2 : Number(n.tagName.slice(1)),
    }));
    // Publish headings after the rendered Markdown has completed this frame.
    const headingFrame = requestAnimationFrame(() => {
      setHeadings(hs);
      setActive(hs[0]?.id || "");
    });
    if (!nodes.length) return () => cancelAnimationFrame(headingFrame);
    let observer: IntersectionObserver | undefined;
    let endObserver: IntersectionObserver | undefined;
    let atEnd = false;
    let disposed = false;
    let frame = 0;
    const update = () => {
      let id = hs[0].id;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= 150) id = node.id;
        else break;
      }
      if (atEnd) id = hs[hs.length - 1].id;
      setActive((previous) => (previous === id ? previous : id));
    };
    const observe = () => {
      if (disposed) return;
      observer?.disconnect();
      endObserver?.disconnect();
      atEnd = false;
      // Extend the observed area through the document: even a large scroll jump
      // crosses the reading line and triggers an observer callback.
      observer = new IntersectionObserver(update, {
        rootMargin: `-140px 0px ${document.documentElement.scrollHeight}px 0px`,
        threshold: 0,
      });
      nodes.forEach((node) => observer!.observe(node));
      const end = document.querySelector(".article-end");
      if (end) {
        endObserver = new IntersectionObserver((entries) => {
          atEnd = entries.some((entry) => entry.isIntersecting);
          update();
        });
        endObserver.observe(end);
      }
      update();
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observe);
    };
    const resize = new ResizeObserver(schedule);
    const main = document.querySelector("main");
    if (main) resize.observe(main);
    observe();
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(() => {
      if (!disposed) schedule();
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(headingFrame);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      endObserver?.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [contentKey]);
  if (!headings.length) return null;
  const baseLevel = Math.min(...headings.map((h) => h.level));
  return (
    <nav className="toc" aria-label="本页目录">
      <details key={contentKey} className="toc-disclosure" open={onNavigate ? true : undefined}>
        <summary className="toc-toggle" aria-controls={listId}>
          <span className="eyebrow">文章目录</span>
          <span className="toc-count">{headings.length} 节</span>
          <span className="toc-chevron" aria-hidden="true">⌄</span>
        </summary>
        <div id={listId} className="toc-items">
          {headings.map((h) => (
            <a
              key={h.id}
              className={h.level > baseLevel ? "toc-nested" : ""}
              style={{ paddingInlineStart: `${(h.level - baseLevel) * 12}px` }}
              href={`#${encodeURIComponent(h.id)}`}
              aria-current={active === h.id ? "location" : undefined}
              onClick={() => {
                setActive(h.id);
                onNavigate?.();
              }}
            >
              {h.text}
            </a>
          ))}
        </div>
      </details>
    </nav>
  );
}

function headingText(node: HTMLElement) {
  const copy = node.cloneNode(true) as HTMLElement;
  copy.querySelectorAll(".heading-anchor, .katex-mathml").forEach((item) => item.remove());
  return copy.textContent?.trim() || node.id;
}
