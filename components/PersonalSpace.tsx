"use client";

import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/Hero";
import { Library } from "@/components/Library";
import { StatusBar } from "@/components/StatusBar";
import { dissolveCover } from "@/components/SceneTransition";

export function PersonalSpace() {
  const [scene, setScene] = useState<"cover" | "library">("cover");
  const [busy, setBusy] = useState(false);
  const cover = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const shell = useRef<HTMLElement>(null);
  const locked = useRef(false);
  const cleanup = useRef<(() => void) | null>(null);
  const didNavigate = useRef(false);

  useEffect(() => {
    const updateVisibility = () => {
      shell.current?.setAttribute("data-paused", String(document.hidden));
    };
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      cleanup.current?.();
    };
  }, []);

  useEffect(() => {
    if (!busy && didNavigate.current) {
      shell.current?.querySelector<HTMLElement>(
        scene === "library" ? "#library-title" : "#enter-library",
      )?.focus({ preventScroll: true });
    }
  }, [scene, busy]);

  const enter = () => {
    if (locked.current) return;
    locked.current = true;
    didNavigate.current = true;
    if (
      !cover.current || !overlay.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setScene("library");
      locked.current = false;
      return;
    }
    setBusy(true);
    // Capture the current DOM only during navigation; no canvas, WebGL or render loop.
    const transition = dissolveCover(cover.current, overlay.current);
    cleanup.current = transition.cancel;
    setScene("library");
    void transition.finished.finally(() => {
      cleanup.current = null;
      locked.current = false;
      setBusy(false);
    });
  };

  return (
    <main ref={shell} className="personal-space" aria-busy={busy}>
      <div className="ambient" aria-hidden="true">
        <div className="ambient-halo" />
        {Array.from({ length: 8 }, (_, index) => (
          <i key={index} style={{
            left: `${9 + ((index * 13) % 84)}%`,
            top: `${12 + ((index * 23) % 74)}%`,
            animationDelay: `-${index * 2.7}s`,
            animationDuration: `${18 + index * 2}s`,
          }} />
        ))}
      </div>
      {scene === "cover" ? (
        <div ref={cover} className="scene cover-scene">
          <Hero onEnter={enter} />
          <StatusBar />
        </div>
      ) : (
        <div className="scene library-scene" inert={busy}>
          <Library onBack={() => {
            if (locked.current) return;
            didNavigate.current = true;
            setScene("cover");
          }} />
          <StatusBar />
        </div>
      )}
      <div ref={overlay} className="fragment-overlay" aria-hidden="true" inert />
      <span className="sr-only" role="status">{busy ? "正在打开书房" : scene === "library" ? "已进入书房" : ""}</span>
    </main>
  );
}
