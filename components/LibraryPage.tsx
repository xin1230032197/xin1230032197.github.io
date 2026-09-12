import type { LibrarySection } from "@/data/library";
import { interests, journey, notes, projects } from "@/data/library";

export function LibraryPage({ section }: { section: LibrarySection }) {
  return (
    <article className="book-page page-enter">
      <header className="page-header">
        <div className="page-meta"><span>{section.path}</span><span>第 {section.number} 页 / 共 04 页</span></div>
        <p className="eyebrow">第 {section.number} 章</p>
        <h3>{section.title}</h3>
      </header>
      <div className="page-body">
        {section.id === "profile" && (
          <div className="profile-content">
            <div><h4>你好，我是 Shuying。</h4><p className="body-copy">一名计算机科学专业的学生。<br />对 AI 基础设施、系统与软件充满好奇，喜欢把复杂的想法，慢慢变成清晰、实用的东西。</p></div>
            <div className="interests"><p className="small-label">正在探索</p><ul>{interests.map((interest) => <li key={interest}>{interest}</li>)}</ul></div>
          </div>
        )}
        {section.id === "projects" && (
          <div className="project-list">{projects.map((project) => (
            <div key={project.number} className="project-row"><span className="chapter-number">{project.number}</span><div><h4>{project.title}</h4><p className="body-copy">{project.description}</p></div></div>
          ))}</div>
        )}
        {section.id === "notes" && (
          <div><p className="body-copy notes-intro">把学过的知识，整理成可以再次翻开的笔记。</p><div className="notes-list">{notes.map((note, index) => (
            <div key={note} className="note-row"><span className="chapter-number">{String(index + 1).padStart(2, "0")}</span><h4>{note}</h4><span className="note-file">.md</span></div>
          ))}</div></div>
        )}
        {section.id === "journey" && (
          <div className="journey-list">{journey.map((entry) => (
            <div key={entry.year} className="journey-row"><span>{entry.year}</span><div><h4>{entry.text}</h4><p className="small-label">{entry.year === "2026" ? "此刻 · 认真准备，也保持好奇" : "未来 · 等待新的故事"}</p></div></div>
          ))}</div>
        )}
      </div>
      <footer className="page-footer"><span>{section.file}</span><span>SHUYING · 私人档案</span></footer>
    </article>
  );
}
