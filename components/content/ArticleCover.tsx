"use client";

import { useState } from "react";
import images from "virtual:codex-images";
import { articleImage } from "@/lib/article-image";

export function ArticleCover({ title, cover }: { title: string; cover?: string }) {
  const [failed, setFailed] = useState("");
  const custom = cover && cover !== failed && /^(?:\/(?![\\/])|https?:\/\/)/i.test(cover);
  const optimized = custom ? articleImage(images, cover) : undefined;
  return (
    <div className="article-cover">
      {custom && (
        // eslint-disable-next-line @next/next/no-img-element -- Pages serves build-time image variants.
        <img alt="" src={cover} {...optimized} onError={() => setFailed(cover)} />
      )}
      <h1>{title}</h1>
    </div>
  );
}
