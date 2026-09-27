"use client";
import { useEffect, useState } from "react";
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
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".article-body h2[id], .article-body h3[id], main > section[id], .content-column section[id]",
      ),
    );
    const hs = nodes.map((n) => ({
      id: n.id,
      text: n.matches("section")
        ? n.querySelector("h2")?.textContent || n.id
        : n.textContent?.replace(/#$/, "").trim() || "",
      level: n.tagName === "H3" ? 3 : 2,
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
  return (
    <nav className="toc" aria-label="本页目录">
      <h2 className="eyebrow">ON THIS PAGE</h2>
      {headings.map((h) => (
        <a
          key={h.id}
          className={h.level === 3 ? "toc-nested" : ""}
          href={`#${h.id}`}
          aria-current={active === h.id ? "location" : undefined}
          onClick={() => {
            setActive(h.id);
            onNavigate?.();
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
