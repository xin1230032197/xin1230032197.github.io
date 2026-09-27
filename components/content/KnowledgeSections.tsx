import Link from "next/link";
import knowledge from "virtual:codex-knowledge";
export function KnowledgeSections({ href }: { href: string }) {
  const backlinks = knowledge.backlinks[href] || [];
  const related = knowledge.related[href] || [];
  return (
    <div className="knowledge-sections">
      <section aria-label="反向引用" className="knowledge-section">
        <h2 className="eyebrow">
          BACKLINKS <span className="meta">/ {backlinks.length}</span>
        </h2>
        {backlinks.length ? (
          <ul>
            {backlinks.map((note) => (
              <li key={note.href}>
                <Link href={note.href}>{note.title}</Link>
                <small className="meta">{note.path}</small>
                <p>{note.context}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="knowledge-empty">还没有文章引用这篇笔记。</p>
        )}
      </section>
      {related.length > 0 && (
        <section aria-label="相关笔记" className="knowledge-section">
          <h2 className="eyebrow">RELATED NOTES</h2>
          <ul>
            {related.map((note) => (
              <li key={note.href}>
                <Link href={note.href}>{note.title}</Link>
                <small className="meta">
                  {note.path} · {note.reason}
                </small>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
