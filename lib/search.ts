import type { SearchEntry } from "./content-types";
const normalize = (text: string) => text.normalize("NFKC").toLowerCase();
export function searchContent(entries: SearchEntry[], query: string) {
  const phrase = normalize(query).trim().replace(/\s+/g, " ");
  const words = phrase.split(/\s+/).filter(Boolean);
  if (!words.length) return entries;
  return entries
    .map((entry, index) => {
      const title = normalize(entry.title);
      const aliases = normalize((entry.aliases || []).join(" "));
      const tags = normalize(entry.tags.join(" "));
      const headings = normalize((entry.headings || []).join(" "));
      const text = normalize(`${entry.text} ${entry.context}`);
      const all = `${title} ${aliases} ${tags} ${headings} ${text}`;
      if (!words.every((word) => all.includes(word)))
        return { entry, index, score: 0 };
      const allIn = (field: string) =>
        words.every((word) => field.includes(word));
      const score =
        title === phrase
          ? 700
          : title.startsWith(phrase)
            ? 600
            : allIn(aliases)
              ? 500
              : allIn(title)
                ? 450
                : allIn(tags)
                  ? 400
                  : allIn(headings)
                    ? 300
                    : allIn(text)
                      ? 200
                      : 100;
      return { entry, index, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.entry);
}

/** NFKC matching with original-string offsets, including fullwidth text. */
export function highlightParts(value: string, query: string) {
  let normalized = "";
  const offsets: { start: number; end: number }[] = [];
  let cursor = 0;
  for (const char of value) {
    const expanded = normalize(char);
    normalized += expanded;
    for (let i = 0; i < expanded.length; i++)
      offsets.push({ start: cursor, end: cursor + char.length });
    cursor += char.length;
  }
  const ranges: [number, number][] = [];
  for (const word of normalize(query).trim().split(/\s+/).filter(Boolean)) {
    let from = 0;
    while (from < normalized.length) {
      const at = normalized.indexOf(word, from);
      if (at < 0) break;
      ranges.push([offsets[at].start, offsets[at + word.length - 1].end]);
      from = at + word.length;
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  const parts: { text: string; match: boolean }[] = [];
  cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor)
      parts.push({ text: value.slice(cursor, start), match: false });
    parts.push({ text: value.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < value.length)
    parts.push({ text: value.slice(cursor), match: false });
  return parts;
}
export function searchSnippet(entry: SearchEntry, query: string) {
  if (!query.trim()) return "";
  const fields = [
    ...(entry.aliases || []).map((s) => `别名：${s}`),
    ...entry.tags.map((s) => `#${s}`),
    ...(entry.headings || []).map((s) => `§ ${s}`),
    entry.text,
  ];
  for (const value of fields) {
    const parts = highlightParts(value, query);
    const first = parts.findIndex((p) => p.match);
    if (first < 0) continue;
    const at = parts.slice(0, first).reduce((n, p) => n + p.text.length, 0);
    const start = Math.max(0, at - 35);
    return `${start ? "…" : ""}${value.slice(start, start + 135)}${value.length > start + 135 ? "…" : ""}`;
  }
  return "";
}
