import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shuying 的书房 · 个人档案",
  description:
    "Shuying 的个人数字书房，记录 AI 基础设施、系统、软件与成长旅程。",
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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
