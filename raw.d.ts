declare module "*.md?raw" {
  const content: string;
  export default content;
}
declare module "virtual:codex-content" {
  const value: import("./lib/content-types").ContentIndex;
  export default value;
}
declare module "virtual:codex-navigation" {
  const value: import("./lib/content-types").PrimarySection[];
  export default value;
}
declare module "virtual:codex-search" {
  const value: import("./lib/content-types").SearchEntry[];
  export default value;
}
declare module "virtual:codex-knowledge" {
  const value: import("./lib/knowledge-types").KnowledgeIndex;
  export default value;
}
