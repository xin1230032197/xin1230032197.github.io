export type LibrarySection = {
  id: "profile" | "projects" | "notes" | "journey";
  number: string;
  title: string;
  path: string;
  file: string;
};

export const librarySections: LibrarySection[] = [
  { id: "profile", number: "01", title: "Profile", path: "~/library/profile", file: "profile.md" },
  { id: "projects", number: "02", title: "Projects", path: "~/library/projects", file: "projects/" },
  { id: "notes", number: "03", title: "Notes", path: "~/library/notes", file: "notes/" },
  { id: "journey", number: "04", title: "Journey", path: "~/library/journey", file: "journey.log" },
];

export const interests = ["AI Infrastructure", "Systems", "C++", "CUDA", "LLM Systems"];

export const projects = [
  { number: "01", title: "AI Agent", description: "Exploring useful agent workflows and tool-oriented systems." },
  { number: "02", title: "AI Infra Experiments", description: "Small studies in inference, performance, and reliable infrastructure." },
  { number: "03", title: "Personal Website", description: "A quiet digital archive for projects, notes, and the road ahead." },
];

export const notes = ["Algorithms", "Systems", "AI", "Mathematics"];

export const journey = [
  { year: "2026", text: "Preparing for graduate study." },
  { year: "2027", text: "Next chapter..." },
];
