import type { Metadata } from "next";
import { ThemeProvider, themeScript } from "@/components/theme/ThemeProvider";
import "katex/dist/katex.min.css";
import "./globals.css";
import "./font-subsets.css";
import "./codex-art-direction.css";
import "./theme-environments.css";
import "./article-experience.css";
import "./knowledge.css";
import { ThemeBackground } from "@/components/theme-backgrounds/ThemeBackground";

export const metadata: Metadata = {
  title: { default: "映疏星 · Personal Codex", template: "%s · 映疏星" },
  description:
    "一座持续生长的私人图书馆。关于计算机科学、AI Infrastructure、学习与生活的笔记。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeBackground />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
