export interface ArticleImage {
  src: string;
  width: number;
  height: number;
  srcSet?: string;
  sizes?: string;
}
export function articleImage(index: Record<string, ArticleImage>, src: string) {
  if (!src.startsWith("/images/articles/")) return undefined;
  const base = src.split(/[?#]/)[0];
  let key: string;
  try { key = base.split("/").map(part => encodeURIComponent(decodeURIComponent(part))).join("/"); }
  catch { return undefined; }
  if (!Object.hasOwn(index, key)) return undefined;
  const image = index[key];
  return { ...image, src: image.src + src.slice(base.length) };
}
