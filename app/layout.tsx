import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shuying — Personal Library",
  description:
    "Shuying's personal library for AI infrastructure, systems, software, and the journey in between.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
