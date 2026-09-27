import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 / A MISSING PAGE</p>
      <h1>这一页，尚未写下。</h1>
      <p>它可能已被移到另一个书架。</p>
      <Link href="/">← 回到 Codex 的前言</Link>
    </main>
  );
}
