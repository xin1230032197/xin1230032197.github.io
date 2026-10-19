"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";

export function MarkdownTable({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [open, setOpen] = useState(false);
  const [savedView, setSavedView] = useState({ height: 0, left: 0, theme: "ink" });

  useEffect(() => {
    const scroll = viewport.current;
    const table = scroll?.querySelector("table");
    if (open || !scroll || !table) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      setOverflow(
        table.scrollWidth > scroll.clientWidth + 1 ||
        table.offsetHeight > Math.max(360, window.innerHeight * 0.75),
      );
    };
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(scroll);
    observer.observe(table);
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [children, open]);

  useEffect(() => {
    if (!open && viewport.current) viewport.current.scrollLeft = savedView.left;
  }, [open, savedView.left]);

  function changeOpen(next: boolean) {
    if (next && viewport.current) {
      const scroll = viewport.current;
      setSavedView({
        height: scroll.getBoundingClientRect().height,
        left: scroll.scrollLeft,
        // Studio previews can use a different theme from the surrounding app.
        theme: scroll.closest<HTMLElement>("[data-theme]")?.dataset.theme || "ink",
      });
    }
    setOpen(next);
  }

  return (
    <div className="markdown-table">
      <Dialog.Root open={open} onOpenChange={changeOpen}>
        {overflow && (
          <div className="table-actions">
            <Dialog.Trigger className="table-expand" aria-label="全屏查看表格">
              <span aria-hidden="true">⛶</span> 全屏查看
            </Dialog.Trigger>
          </div>
        )}
        <div
          ref={viewport}
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="表格，可横向滚动"
          style={open ? { height: savedView.height } : undefined}
          aria-hidden={open || undefined}
        >
          {/* Keep the inline space and one copy of the table's IDs while open. */}
          {!open && <table>{children}</table>}
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="table-viewer-overlay" />
          <Dialog.Content className="table-viewer" data-theme={savedView.theme}>
            <header className="table-viewer-header">
              <div>
                <Dialog.Title>表格全屏查看</Dialog.Title>
                <Dialog.Description>可横向、纵向滚动阅读 · 按 Esc 退出</Dialog.Description>
              </div>
              <Dialog.Close className="table-viewer-close" aria-label="关闭全屏表格">
                <span aria-hidden="true">×</span> 关闭
              </Dialog.Close>
            </header>
            <div className="article-body table-viewer-body">
              <div className="table-scroll" tabIndex={0} role="region" aria-label="全屏表格，可横向和纵向滚动">
                {open && <table>{children}</table>}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
