import { ArrowUpRight, FileText, Folder } from "lucide-react";
import type { LibrarySection } from "@/data/library";
import { interests, journey, notes, projects } from "@/data/library";

type LibraryPageProps = {
  section: LibrarySection;
};

export function LibraryPage({ section }: LibraryPageProps) {
  return (
    <article key={section.id} className="page-enter flex h-full min-h-[600px] flex-col p-6 pt-16 sm:p-12 sm:pt-16 lg:p-16">
      <header className="mb-10 border-b border-[var(--rule)] pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted-ink)]">
          <span>{section.path}</span>
          <span>Page {section.number} / 04</span>
        </div>
        <p className="mt-9 font-mono text-xs uppercase tracking-[0.2em] text-[var(--mint-dark)]">Chapter {section.number}</p>
        <h3 className="font-editorial mt-2 text-4xl tracking-[-0.04em] sm:text-6xl">{section.title.toUpperCase()}</h3>
      </header>

      <div className="flex-1">
        {section.id === "profile" && <ProfileContent />}
        {section.id === "projects" && <ProjectsContent />}
        {section.id === "notes" && <NotesContent />}
        {section.id === "journey" && <JourneyContent />}
      </div>

      <footer className="mt-12 flex items-center justify-between border-t border-[var(--rule)] pt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted-ink)]">
        <span>{section.file}</span>
        <span>Shuying archive</span>
      </footer>
    </article>
  );
}

function ProfileContent() {
  return (
    <div className="grid gap-10 xl:grid-cols-[1.25fr_0.75fr]">
      <div>
        <p className="font-editorial text-2xl leading-snug tracking-[-0.025em] sm:text-3xl">Hello, I&apos;m Shuying.</p>
        <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted-ink)] sm:text-lg">A computer science student interested in AI Infrastructure, Systems and Software. I like turning difficult ideas into things that are clear, useful, and quietly well made.</p>
      </div>
      <div>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-ink)]">Interested in</p>
        <ul className="space-y-2">
          {interests.map((interest) => <li key={interest} className="border-b border-[var(--rule)] py-2 text-sm">{interest}</li>)}
        </ul>
      </div>
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
      {projects.map((project) => (
        <div key={project.number} className="group grid gap-3 py-6 sm:grid-cols-[52px_1fr_auto] sm:items-center">
          <span className="font-mono text-xs text-[var(--mint-dark)]">{project.number}</span>
          <div>
            <h4 className="font-editorial text-2xl tracking-[-0.025em]">{project.title}</h4>
            <p className="mt-1 max-w-lg text-sm leading-6 text-[var(--muted-ink)]">{project.description}</p>
          </div>
          <ArrowUpRight aria-hidden="true" className="hidden size-5 text-[var(--muted-ink)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
        </div>
      ))}
    </div>
  );
}

function NotesContent() {
  return (
    <div className="grid gap-px overflow-hidden border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2">
      {notes.map((note, index) => (
        <div key={note} className="group flex min-h-28 items-center gap-4 bg-[rgba(249,248,244,0.94)] p-5 transition-colors hover:bg-[rgba(220,238,232,0.72)]">
          {index % 2 === 0 ? <FileText aria-hidden="true" className="size-5 text-[var(--mint-dark)]" /> : <Folder aria-hidden="true" className="size-5 text-[var(--mint-dark)]" />}
          <div>
            <p className="font-editorial text-xl">{note}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted-ink)]">{String(index + 1).padStart(2, "0")}.md</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function JourneyContent() {
  return (
    <div className="relative space-y-0 before:absolute before:bottom-5 before:left-[2.72rem] before:top-5 before:w-px before:bg-[var(--rule)] sm:before:left-[4.22rem]">
      {journey.map((entry) => (
        <div key={entry.year} className="relative grid grid-cols-[70px_1fr] gap-6 py-7 sm:grid-cols-[110px_1fr] sm:gap-10">
          <span className="font-mono text-xs text-[var(--mint-dark)]">{entry.year}</span>
          <span className="absolute left-[2.48rem] top-[1.85rem] size-2 rounded-full border border-[var(--mint-dark)] bg-[var(--paper)] sm:left-[3.98rem]" />
          <div>
            <p className="font-editorial text-2xl tracking-[-0.025em]">{entry.text}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted-ink)]">Entry / {entry.year}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
