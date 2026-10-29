export interface ExplorerNode {
  id: string;
  title: string;
  kind: "library" | "primary" | "directory" | "article" | "heading";
  depth?: number;
  href?: string;
  body: string;
  children: ExplorerNode[];
}
export interface Camera { x: number; y: number; k: number }
