export type LibrarySection = {
  id: "profile" | "projects" | "notes" | "journey";
  number: string;
  title: string;
  file: string;
};

export const demoContent = {
  hero: {
    name: "SHUYING",
    subtitle: "写代码，也写下沿途的风景。",
    field1: "计算机科学",
    field2: "人工智能 / 系统 / 基础设施",
    quote: "「在构建中学习，在记录中前行。」",
    button: "进入书房",
  },
  navigation: {
    back: "返回封面",
  },
  library: {
    sections: [
      { id: "profile", number: "01", title: "关于我", file: "profile.md" },
      { id: "projects", number: "02", title: "项目集", file: "projects/" },
      { id: "notes", number: "03", title: "学习笔记", file: "notes/" },
      { id: "journey", number: "04", title: "成长旅程", file: "journey.log" },
    ] satisfies LibrarySection[],
  },
  profile: {
    intro: "你好，我是 Shuying。",
    body: [
      "一名计算机科学专业的学生。",
      "对 AI 基础设施、系统与软件充满好奇，喜欢把复杂的想法，慢慢变成清晰、实用的东西。",
    ],
    interestsLabel: "正在探索",
    interests: ["AI 基础设施", "系统设计", "C++", "CUDA", "大语言模型系统"],
  },
  projects: [
    { number: "01", title: "AI 智能体", description: "探索实用的智能体工作流，以及工具协作的可能性。" },
    { number: "02", title: "AI 基础设施实验", description: "围绕模型推理、性能优化与可靠系统的小型实验。" },
    { number: "03", title: "个人网站", description: "为项目、笔记与未来的故事，搭建一个安静的数字书房。" },
  ],
  notes: ["算法", "计算机系统", "人工智能", "数学"],
  journey: [
    { year: "2026", text: "为研究生阶段的学习做准备。" },
    { year: "2027", text: "下一章，未完待续……" },
  ],
} as const;
