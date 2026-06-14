import type { Metadata } from "next";
import { SiteLogo } from "./SiteLogo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jason's Awesome 80s Site",
  description:
    "A warm, weird, funny, slightly spooky personal website about projects, writing, music, cats, and guestbook signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteLogo />
        {children}
      </body>
    </html>
  );
}
