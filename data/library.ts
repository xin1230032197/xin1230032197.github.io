export type LibrarySection = {
  id: "profile" | "projects" | "notes" | "journey";
  number: string;
  title: string;
  path: string;
  file: string;
};

export const librarySections: LibrarySection[] = [
  { id: "profile", number: "01", title: "关于我", path: "~/library/profile", file: "profile.md" },
  { id: "projects", number: "02", title: "项目集", path: "~/library/projects", file: "projects/" },
  { id: "notes", number: "03", title: "学习笔记", path: "~/library/notes", file: "notes/" },
  { id: "journey", number: "04", title: "成长旅程", path: "~/library/journey", file: "journey.log" },
];
export const interests = ["AI 基础设施", "系统设计", "C++", "CUDA", "大语言模型系统"];
export const projects = [
  { number: "01", title: "AI 智能体", description: "探索实用的智能体工作流，以及工具协作的可能性。" },
  { number: "02", title: "AI 基础设施实验", description: "围绕模型推理、性能优化与可靠系统的小型实验。" },
  { number: "03", title: "个人网站", description: "为项目、笔记与未来的故事，搭建一个安静的数字书房。" },
];
export const notes = ["算法", "计算机系统", "人工智能", "数学"];
export const journey = [
  { year: "2026", text: "为研究生阶段的学习做准备。" },
  { year: "2027", text: "下一章，未完待续……" },
];
