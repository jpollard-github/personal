import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neon Forest Personal Site",
  description:
    "A warm, weird, funny, slightly spooky personal website about projects, writing, music, cats, and contact.",
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
