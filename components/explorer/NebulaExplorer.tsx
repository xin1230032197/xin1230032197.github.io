"use client";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import tree from "virtual:codex-explorer";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { highlightParts } from "@/lib/search";
import { bubblePositions, zoomAt } from "@/lib/explorer-camera";
import type { Camera, ExplorerNode } from "@/lib/explorer-types";
import "./nebula.css";

const MarkdownBody = memo(MarkdownContent);
const identity: Camera = { x: 0, y: 0, k: 1 };
const labels = { library: "知识库", primary: "书架", directory: "目录", article: "文章", heading: "标题" };
function Highlight({ text, query }: { text: string; query: string }) {
  return highlightParts(text, query).map((part, i) => part.match ? <mark key={i}>{part.text}</mark> : part.text);
}
function indexTree(root: ExplorerNode) {
  const nodes = new Map<string, { node: ExplorerNode; parent?: string; path: string[] }>();
  function visit(node: ExplorerNode, parent?: string, path: string[] = []) {
    nodes.set(node.id, { node, parent, path: [...path, node.title] });
    node.children.forEach(child => visit(child, node.id, [...path, node.title]));
  }
  visit(root);
  return nodes;
}

export default function NebulaExplorer({ onClose, onRestoreFocus }: {
  onClose: () => void;
  onRestoreFocus: () => void;
}) {
  const index = useMemo(() => indexTree(tree), []);
  const [current, setCurrent] = useState(tree.id);
  const entry = index.get(current)!;
  const node = entry.node;
  const [ownNote, setOwnNote] = useState(false);
  const reading = ownNote || (!node.children.length && (node.kind === "article" || node.kind === "heading"));
  const [camera, setCamera] = useState<Camera>(identity);
  const cameras = useRef(new Map<string, Camera>());
  const [size, setSize] = useState({ width: 1000, height: 800 });
  const [find, setFind] = useState(false);
  const [query, setQuery] = useState("");
  const [hit, setHit] = useState(0);
  const [bodyHits, setBodyHits] = useState(0);
  const [hint, setHint] = useState(true);
  const [dragging, setDragging] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const reader = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const drag = useRef<{ x: number; y: number; camera: Camera; moved: boolean } | null>(null);
  const marks = useRef<HTMLElement[]>([]);
  const points = useMemo(() => bubblePositions(node.children.length, size.width, size.height), [node.children.length, size]);
  const matches = useMemo(() => query.trim() ? node.children.filter(child => child.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) : [], [node, query]);
  const count = reading ? bodyHits : matches.length;
  const active = count ? ((hit % count) + count) % count : 0;

  useEffect(() => {
    const timer = setTimeout(() => setHint(false), 5500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setFind(true);
        requestAnimationFrame(() => { input.current?.focus(); input.current?.select(); });
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") event.preventDefault();
    };
    document.addEventListener("keydown", keys, true);
    return () => document.removeEventListener("keydown", keys, true);
  }, []);
  // Dialog portals mount after their owner. Attach canvas controls to the actual
  // DOM lifetime, including the canvas recreated when leaving the reader.
  const attachViewport = useCallback((element: HTMLDivElement | null) => {
    viewport.current = element;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize(previous => {
      const { width, height } = entry.contentRect;
      return previous.width === width && previous.height === height ? previous : { width, height };
    }));
    observer.observe(element);
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
      setCamera(previous => zoomAt(previous, { x: event.clientX - rect.left, y: event.clientY - rect.top }, delta));
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => {
      observer.disconnect();
      element.removeEventListener("wheel", wheel);
      viewport.current = null;
    };
  }, []);

  // Only mark rendered prose. Never search hidden source, code toolbar labels or KaTeX accessibility copies.
  useEffect(() => {
    if (!reading || !reader.current) return;
    const frame = requestAnimationFrame(() => {
      const element = reader.current!;
      const term = query.trim().toLocaleLowerCase();
      const found: HTMLElement[] = [];
      if (term) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
          acceptNode(text) {
            return text.parentElement?.closest("button, a.heading-anchor, .katex, .sr-only, .footnote-backref") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          },
        });
        const texts: Text[] = [];
        while (walker.nextNode()) texts.push(walker.currentNode as Text);
        for (const text of texts) {
          const value = text.data, lower = value.toLocaleLowerCase();
          let at = lower.indexOf(term), cursor = 0;
          if (at < 0) continue;
          const fragment = document.createDocumentFragment();
          while (at >= 0) {
            fragment.append(document.createTextNode(value.slice(cursor, at)));
            const mark = document.createElement("mark");
            mark.dataset.nebulaFind = "true";
            mark.textContent = value.slice(at, at + term.length);
            fragment.append(mark); found.push(mark);
            cursor = at + term.length;
            at = lower.indexOf(term, cursor);
          }
          fragment.append(document.createTextNode(value.slice(cursor)));
          text.replaceWith(fragment);
        }
      }
      marks.current = found;
      setBodyHits(found.length);
    });
    return () => {
      cancelAnimationFrame(frame);
      for (const mark of marks.current) {
        const parent = mark.parentNode;
        mark.replaceWith(document.createTextNode(mark.textContent || ""));
        parent?.normalize();
      }
      marks.current = [];
    };
  }, [reading, current, query]);

  useEffect(() => {
    if (!query.trim() || !count) return;
    if (reading) {
      marks.current.forEach((mark, i) => { mark.dataset.currentHit = String(i === active); });
      marks.current[active]?.scrollIntoView({ block: "center", behavior: "instant" });
    } else {
      const i = node.children.findIndex(child => child.id === matches[active]?.id);
      const point = points[i];
      if (!point) return;
      const frame = requestAnimationFrame(() => setCamera(previous => ({
        k: previous.k, x: size.width / 2 - point.x * previous.k,
        y: size.height / 2 - point.y * previous.k,
      })));
      return () => cancelAnimationFrame(frame);
    }
  }, [query, count, active, reading, matches, node.children, points, size]);

  function moveTo(id: string) {
    cameras.current.set(current, camera);
    setCurrent(id);
    setCamera(cameras.current.get(id) || identity);
    setOwnNote(false); setFind(false); setQuery(""); setHit(0);
    const element = world.current;
    if (element && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      element.animate([{ opacity: .2, filter: "blur(3px)" }, { opacity: 1, filter: "blur(0)" }], { duration: 240 });
    requestAnimationFrame(() => { viewport.current?.focus({ preventScroll: true }); reader.current?.focus({ preventScroll: true }); });
  }
  function up() {
    if (ownNote) {
      setOwnNote(false); setFind(false); setQuery("");
      requestAnimationFrame(() => viewport.current?.focus({ preventScroll: true }));
    }
    else if (entry.parent) moveTo(entry.parent);
  }
  function closeFind() { setFind(false); setQuery(""); setHit(0); }
  function openFind() { setFind(true); requestAnimationFrame(() => input.current?.focus()); }
  function step(direction: number) { setHit(value => value + direction); }

  return (
    <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="nebula-overlay" />
        <Dialog.Content id="codex-nebula" data-theme="aurora" aria-describedby={undefined}
          onCloseAutoFocus={event => { event.preventDefault(); onRestoreFocus(); }}
          onOpenAutoFocus={event => { event.preventDefault(); viewport.current?.focus(); }}
          onEscapeKeyDown={event => {
            if (find) { event.preventDefault(); closeFind(); }
            else if (reading) { event.preventDefault(); up(); }
          }}>
          <Dialog.Title className="sr-only">知识星云</Dialog.Title>
          <div className="m-atmosphere" aria-hidden="true"><div className="m-mist" />
            <svg className="m-stars" viewBox="0 0 1000 850" preserveAspectRatio="none">
              {Array.from({ length: 100 }, (_, i) => <circle key={i} cx={(i * 137.51) % 1000} cy={(i * 83.73) % 850} r={i % 9 === 0 ? 1.2 : .6} opacity={.12 + (i % 7) * .06} />)}
            </svg>
          </div>
          <nav className="m-hud" aria-label="星云导航">
            <div className="m-context">
              <button onClick={up} disabled={!entry.parent && !ownNote} aria-label="返回上一层" title="返回上一层">←</button>
              <span className="m-path" title={entry.path.join(" / ")}>{entry.path.join(" / ")}</span>
            </div>
            <div className="m-actions">
              <button onClick={openFind} aria-label="搜索当前层" title="搜索当前层 · Ctrl F">⌕</button>
              <Dialog.Close aria-label="退出星云漫游" title="退出星云 · Esc">×</Dialog.Close>
            </div>
          </nav>
          {find && <section className="m-find" aria-label="当前页面搜索">
            <input ref={input} type="search" value={query} onChange={event => { setQuery(event.target.value); setHit(0); }}
              aria-label="搜索当前层" placeholder={reading ? "搜索本节正文…" : "搜索当前层…"} autoComplete="off"
              onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); step(event.shiftKey ? -1 : 1); } }} />
            <span className="m-find-count" aria-live="polite">{count ? active + 1 : 0}/{count}</span>
            <button onClick={() => step(-1)} disabled={!count} aria-label="上一个匹配项">↑</button>
            <button onClick={() => step(1)} disabled={!count} aria-label="下一个匹配项">↓</button>
            <button onClick={closeFind} aria-label="关闭搜索">×</button>
          </section>}
          {reading ? <article ref={reader} tabIndex={-1} className="m-reader" key={current}
            onClick={event => {
              const href = (event.target as Element).closest("a")?.getAttribute("href");
              if (!href?.startsWith("#")) return;
              // Resolve section/footnote anchors inside this reader, even when the
              // underlying article has the same footnote IDs behind the dialog.
              try {
                const target = event.currentTarget.querySelector(`#${CSS.escape(decodeURIComponent(href.slice(1)))}`);
                if (target) { event.preventDefault(); target.scrollIntoView({ block: "center" }); }
              } catch { /* A malformed fragment remains an ordinary browser link. */ }
            }}>
            <div className="m-reading-page">
              <div className="m-reader-kind">{node.kind === "heading" ? `H${node.depth} / 本节笔记` : "文章"}</div>
              <h1>{node.title}</h1>
              <div className="article-body"><MarkdownBody body={node.body || "本节暂时没有正文。"} /></div>
            </div>
          </article> : <div ref={attachViewport} tabIndex={-1} className="m-viewport" data-dragging={dragging}
            aria-label="星云画布，拖动空白处移动，Ctrl 加滚轮在指针位置缩放"
            onPointerDown={event => {
              if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
              drag.current = { x: event.clientX, y: event.clientY, camera, moved: false };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={event => {
              const start = drag.current;
              if (!start) return;
              const dx = event.clientX - start.x, dy = event.clientY - start.y;
              if (Math.abs(dx) + Math.abs(dy) > 3) start.moved = true;
              if (start.moved) { setDragging(true); setCamera({ ...start.camera, x: start.camera.x + dx, y: start.camera.y + dy }); }
            }}
            onPointerUp={event => { drag.current = null; setDragging(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
            onPointerCancel={() => { drag.current = null; setDragging(false); }}>
            <div ref={world} className="m-world" style={{ transform: `translate(${camera.x}px,${camera.y}px) scale(${camera.k})` }}>
              <svg className="m-wires" aria-hidden="true">
                {points.map((p, i) => <path key={i} d={`M ${size.width / 2} ${size.height / 2} Q ${size.width / 2} ${p.y} ${p.x} ${p.y}`} />)}
              </svg>
              <button className="m-center" onClick={up} disabled={!entry.parent} title={node.title} aria-label={`${node.title}${entry.parent ? "，点击返回上一层" : ""}`}>
                <small>{entry.parent ? "← 上一层" : "知识库"}</small><strong>{node.title}</strong>
              </button>
              {node.children.map((child, i) => <button key={child.id} className="m-bubble" title={child.title} data-node-id={child.id}
                style={{ left: points[i].x, top: points[i].y }} onClick={() => moveTo(child.id)}
                data-found={query.trim() ? matches.some(n => n.id === child.id) : undefined}
                data-current-hit={query.trim() ? matches[active]?.id === child.id : undefined}>
                <span className="m-kind">{child.kind === "heading" ? `H${child.depth}` : labels[child.kind]}</span>
                <strong><Highlight text={child.title} query={query.trim()} /></strong>
                <small>{child.children.length ? `${child.children.length} 个分支` : child.kind === "directory" || child.kind === "primary" ? "暂无笔记" : "阅读笔记"}</small>
              </button>)}
            </div>
            {!node.children.length && <p className="m-empty">这里还没有笔记。新增内容发布后，会自动出现在星云中。</p>}
            {node.body && <button className="m-own-note" onClick={() => { setOwnNote(true); closeFind(); }}>本层笔记 ↗</button>}
          </div>}
          <div className="m-toast" role="status" data-show={hint}>按 Esc 退出星云 · Ctrl F 搜索 · Ctrl 滚轮缩放</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
