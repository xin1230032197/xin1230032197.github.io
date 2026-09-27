import navigation from "virtual:codex-navigation";
/** Homepage shortcuts refer to stable directory IDs, so renamed URLs follow the tree. */
const interests: { title: string; primary: string; secondary?: string }[] = [
  { title: "AI Infrastructure", primary: "infra" },
  { title: "Systems", primary: "study", secondary: "os" },
  { title: "C++", primary: "study", secondary: "cpp" },
  { title: "CUDA", primary: "infra", secondary: "cuda" },
];
export const site = {
  name: "映疏星",
  subtitle: "PERSONAL CODEX",
  interests: interests.flatMap((item) => {
    const primary = navigation.find((p) => p.id === item.primary);
    const target = item.secondary
      ? primary?.children.find((s) => s.id === item.secondary)
      : primary;
    return target ? [{ title: item.title, href: target.href }] : [];
  }),
};
