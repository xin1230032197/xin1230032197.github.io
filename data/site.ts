import navigation from "virtual:codex-navigation";
export const site = {
  name: "映疏星",
  subtitle: "PERSONAL CODEX",
  // Shortcuts follow the author's current directory names and configured order.
  interests: navigation.slice(0, 4).map(({ title, href }) => ({ title, href })),
};
