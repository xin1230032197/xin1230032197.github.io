import { Reveal } from "@/components/Reveal";
import { siteContent } from "@/data/siteContent";

export function Work() {
  const { work } = siteContent;

  return (
    <Reveal className="page-section work-section" id="work">
      <div className="section-heading">
        <p className="section-label">{work.label}</p>
        <h2>{work.title}</h2>
      </div>

      <div className="work-list">
        {work.projects.map((project) => (
          <article className="work-item" key={project.number}>
            <span>{project.number}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <p className="work-tags">{project.tags}</p>
          </article>
        ))}
      </div>
    </Reveal>
  );
}
