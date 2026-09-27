"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { Command } from "cmdk";
import entries from "virtual:codex-search";
import { searchContent, highlightParts, searchSnippet } from "@/lib/search";
function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightParts(text, query).map((part, i) =>
        part.match ? <mark key={i}>{part.text}</mark> : part.text,
      )}
    </>
  );
}
export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, setOpen]);
  const results = searchContent(entries, query);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQuery("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="command-dialog"
          aria-describedby="search-description"
        >
          <Dialog.Title className="sr-only">搜索 Codex</Dialog.Title>
          <Dialog.Description id="search-description" className="sr-only">
            搜索目录、文章、标签与正文，使用上下方向键选择，回车打开。
          </Dialog.Description>
          <Command shouldFilter={false} loop>
            <div className="command-input-row">
              <span aria-hidden="true">&gt;</span>
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="search_"
                aria-label="搜索目录、文章与正文"
              />
              <Dialog.Close className="escape-key">ESC</Dialog.Close>
            </div>
            <div className="search-caption meta">
              {query
                ? `${results.length} RESULTS / 搜索结果`
                : "EXPLORE THE LIBRARY / 从一个词开始"}
            </div>
            <Command.List className="command-results">
              <Command.Empty className="search-empty">
                没有找到相关内容。试试其他标题、标签或正文关键词。
              </Command.Empty>
              {results.map((e) => (
                <Command.Item
                  key={e.href}
                  value={e.href}
                  onSelect={() => {
                    setOpen(false);
                    setQuery("");
                    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true")
                      window.location.assign(e.href);
                    else router.push(e.href);
                  }}
                >
                  <div>
                    <strong>
                      <Highlight text={e.title} query={query} />
                    </strong>
                    <small>
                      <Highlight
                        text={e.breadcrumb || e.context}
                        query={query}
                      />
                    </small>
                    {query.trim() && (
                      <p className="search-snippet">
                        <Highlight
                          text={searchSnippet(e, query)}
                          query={query}
                        />
                      </p>
                    )}
                  </div>
                  <span className="meta">{e.kind} ↵</span>
                </Command.Item>
              ))}
            </Command.List>
            <div className="command-footer meta">
              <span>↑ ↓ 选择　↵ 打开</span>
              <span>目录 · 标签 · 全文</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
