import { Reveal } from "@/components/Reveal";
import { siteContent } from "@/data/siteContent";

export function About() {
  const { about } = siteContent;

  return (
    <Reveal className="page-section about-section" id="about">
      <p className="section-label">{about.label}</p>
      <div className="section-content">
        <h2>{about.title}</h2>
        <p>{about.body}</p>
      </div>
    </Reveal>
  );
}
