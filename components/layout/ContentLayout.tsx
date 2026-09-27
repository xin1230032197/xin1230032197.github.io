"use client";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "radix-ui";
import {
  navigation,
  site,
  type PrimarySection,
  type SecondarySection,
} from "@/data/navigation";
import { type ArticleRecord } from "@/data/articles";
import { ThemeSwitcher } from "@/components/theme/ThemeProvider";
import { StarOrnament } from "@/components/theme-backgrounds/Ornaments";
import { CommandPalette } from "@/components/search/CommandPalette";
import { TableOfContents } from "@/components/content/TableOfContents";

export function ContentLayout({
  children,
  primary,
  secondary,
  article,
  pageKey,
}: {
  children: React.ReactNode;
  primary?: PrimarySection;
  secondary?: SecondarySection;
  article?: Pick<ArticleRecord, "id">;
  pageKey?: string;
}) {
  const [search, setSearch] = useState(false);
  const current = primary || navigation[0];
  const primaryLinks = (close?: () => void) => (
    <nav className="primary-links" aria-label="一级目录">
      {navigation.map((p, i) => (
        <Link
          key={p.id}
          href={p.href}
          onClick={close}
          aria-current={primary?.id === p.id ? "page" : undefined}
        >
          <span className="nav-number">{String(i + 1).padStart(2, "0")}</span>
          <span>{p.title}</span>
        </Link>
      ))}
    </nav>
  );
  const secondaryLinks = (close?: () => void) => (
    <nav
      className="secondary-links"
      aria-label={`${current?.title || "Codex"}的二级目录`}
    >
      {current?.children.map((s) => (
        <Link
          key={s.id}
          href={s.href}
          onClick={close}
          aria-current={secondary?.id === s.id ? "page" : undefined}
        >
          {s.title}
        </Link>
      ))}
    </nav>
  );
  const tools = (
    <div className="sidebar-tools">
      <button className="search-trigger" onClick={() => setSearch(true)}>
        <span>
          ⌕ <span>Search</span>
        </span>
        <kbd>Ctrl K</kbd>
      </button>
      <ThemeSwitcher />
    </div>
  );
  return (
    <div className={`codex-layout${article ? " reading-page" : ""}`}>
      <a className="skip-link" href="#main-content">
        跳转到正文
      </a>
      <aside className="primary-sidebar">
        <Link className="wordmark" href="/">
          {site.name}
          <StarOrnament className="wordmark-ornament" />
          <span>PERSONAL CODEX</span>
        </Link>
        <div className="nav-label eyebrow">THE LIBRARY</div>
        {primaryLinks()}
        {tools}
        <div className="sidebar-bottom">
          <span className="status-dot" /> A GARDEN IN PROGRESS
          <span className="sidebar-edition">
            EST. 2026<span>↳ 一页一世界</span>
          </span>
        </div>
      </aside>
      <header className="mobile-bar">
        <NavigationDrawer title="目录 / LIBRARY" trigger="☰ 目录">
          {(close) => (
            <>
              <Link className="wordmark" href="/" onClick={close}>
                {site.name}
                <span>PERSONAL CODEX</span>
              </Link>
              {primaryLinks(close)}
              <div className="drawer-secondary">
                <h2 className="eyebrow">{current?.label || "CODEX"}</h2>
                {secondaryLinks(close)}
              </div>
              {tools}
            </>
          )}
        </NavigationDrawer>
        <Link href="/">{site.name}</Link>
        <button onClick={() => setSearch(true)} aria-label="搜索">
          ⌕
        </button>
      </header>
      <div className="tablet-tools">
        <NavigationDrawer
          title={`${current?.title || "Codex"} / 目录`}
          trigger="分类 / 本页目录"
        >
          {(close) => (
            <>
              <h2 className="eyebrow">{current?.label || "CODEX"}</h2>
              {secondaryLinks(close)}
              <TableOfContents
                contentKey={
                  pageKey ||
                  article?.id ||
                  secondary?.href ||
                  primary?.href ||
                  "home"
                }
                onNavigate={close}
              />
            </>
          )}
        </NavigationDrawer>
      </div>
      <main id="main-content" tabIndex={-1} className="content-column">
        {children}
      </main>
      <aside className="secondary-sidebar">
        <div className="right-running-head meta">
          FIELD NOTES <span>↙</span>
        </div>
        <div className="secondary-heading">
          <span className="eyebrow">{current?.label || "CODEX"}</span>
          <span className="meta">
            {String(current?.children.length || 0).padStart(2, "0")}
          </span>
        </div>
        {secondaryLinks()}
        <TableOfContents
          contentKey={
            pageKey || article?.id || secondary?.href || primary?.href || "home"
          }
        />
        <div className="right-bottom meta">
          {article ? "READ SLOWLY." : "STAY CURIOUS."}
          <span>↓</span>
        </div>
      </aside>
      <CommandPalette open={search} setOpen={setSearch} />
    </div>
  );
}
function NavigationDrawer({
  title,
  trigger,
  children,
}: {
  title: string;
  trigger: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="drawer-trigger">{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="navigation-drawer"
          aria-describedby={undefined}
        >
          <div className="drawer-head">
            <Dialog.Title className="eyebrow">{title}</Dialog.Title>
            <Dialog.Close aria-label="关闭目录">×</Dialog.Close>
          </div>
          {children(() => setOpen(false))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
