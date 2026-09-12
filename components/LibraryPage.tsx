import type { LibrarySection } from "@/data/demoContent";
import { demoContent } from "@/data/demoContent";

export function LibraryPage({ section }: { section: LibrarySection }) {
  return (
    <article className="book-page page-enter">
      <header className="page-header">
        <div className="page-meta"><span>第 {section.number} 页 / 共 04 页</span></div>
        <p className="eyebrow">第 {section.number} 章</p>
        <h3>{section.title}</h3>
      </header>
      <div className="page-body">
        {section.id === "profile" && (
          <div className="profile-content">
            <div><h4>{demoContent.profile.intro}</h4><p className="body-copy">{demoContent.profile.body.map((line) => <span className="block" key={line}>{line}</span>)}</p></div>
            <div className="interests"><p className="small-label">{demoContent.profile.interestsLabel}</p><ul>{demoContent.profile.interests.map((interest) => <li key={interest}>{interest}</li>)}</ul></div>
          </div>
        )}
        {section.id === "projects" && (
          <div className="project-list">{demoContent.projects.map((project) => (
            <div key={project.number} className="project-row"><span className="chapter-number">{project.number}</span><div><h4>{project.title}</h4><p className="body-copy">{project.description}</p></div></div>
          ))}</div>
        )}
        {section.id === "notes" && (
          <div className="notes-list">{demoContent.notes.map((note, index) => (
            <div key={note} className="note-row"><span className="chapter-number">{String(index + 1).padStart(2, "0")}</span><h4>{note}</h4><span className="note-file">.md</span></div>
          ))}</div>
        )}
        {section.id === "journey" && (
          <div className="journey-list">{demoContent.journey.map((entry) => (
            <div key={entry.year} className="journey-row"><span>{entry.year}</span><div><h4>{entry.text}</h4></div></div>
          ))}</div>
        )}
      </div>
      <footer className="page-footer"><span>{section.file}</span></footer>
    </article>
  );
}
