"use client";
import { useEffect, useRef, useState } from "react";
export function CodeBlock({
  children,
  source,
  language,
}: {
  children: React.ReactNode;
  source: string;
  language: string;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [status, setStatus] = useState("Copy");
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setStatus("Copied");
    } catch {
      setStatus("请选择代码复制");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("Copy"), 2000);
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{language.toUpperCase()}</span>
        <button onClick={copy} aria-label="复制代码" aria-live="polite">
          {status}
        </button>
      </div>
      <pre tabIndex={0} aria-label={`${language} 代码，可横向滚动`}>
        {children}
      </pre>
    </div>
  );
}
