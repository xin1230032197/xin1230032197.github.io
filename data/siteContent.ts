export const siteContent = {
  hero: {
    title: "Hi I'm SHUYING.",
  },
  navigation: [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "WORK", href: "#work" },
    { label: "CONTACT", href: "#contact" },
  ],
  about: {
    label: "ABOUT",
    title: "Computer Science Student",
    body: "Interested in AI infrastructure, systems, and software. I enjoy turning complex ideas into clear and useful things.",
  },
  work: {
    label: "WORK",
    title: "Selected projects",
    projects: [
      {
        number: "01",
        title: "AI Agent",
        description: "Exploring agent workflows and intelligent systems.",
        tags: "Python / LLM / Tools",
      },
      {
        number: "02",
        title: "AI Infra Experiments",
        description: "Experiments around inference, systems, and performance.",
        tags: "C++ / CUDA / PyTorch",
      },
      {
        number: "03",
        title: "Personal Website",
        description: "A focused space for projects and ongoing experiments.",
        tags: "Next.js / TypeScript",
      },
    ],
  },
  contact: {
    label: "CONTACT",
    title: "Let's talk.",
    email: "mailto:",
    github: "https://github.com/",
  },
} as const;
