import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodexPage } from "@/components/codex/CodexPage";
import { resolvePath } from "@/lib/content";
import { content } from "@/data/content";
export function generateStaticParams() {
  return content.routes.filter((route) => route !== "/").map((route) => ({
    path: route.split("/").filter(Boolean),
  }));
}
type Props = { params: Promise<{ path: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const r = resolvePath(path);
  return {
    title:
      r.article?.title ||
      r.secondary?.title ||
      r.primary?.title ||
      "未找到这一页",
    description:
      r.article?.description ||
      r.secondary?.description ||
      r.primary?.description,
  };
}
export default async function Page({ params }: Props) {
  const { path } = await params;
  if (!resolvePath(path).valid) notFound();
  return <CodexPage path={path} />;
}
