import { Reveal } from "@/components/Reveal";
import { siteContent } from "@/data/siteContent";

export function Contact() {
  const { contact } = siteContent;

  return (
    <Reveal className="page-section contact-section" id="contact">
      <p className="section-label">{contact.label}</p>
      <h2>{contact.title}</h2>
      <div className="contact-links">
        <a href={contact.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={contact.email}>Email</a>
      </div>
    </Reveal>
  );
}
