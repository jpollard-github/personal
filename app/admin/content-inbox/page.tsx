import { readFile } from "node:fs/promises";
import path from "node:path";
import { AdminContentInbox } from "../../AdminContentInbox";

export const metadata = {
  title: "Content Inbox Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ContentInboxAdminPage() {
  const instructionsMarkdown = await readFile(
    path.join(process.cwd(), "docs", "low-friction-content-flow.md"),
    "utf8",
  ).catch(() => "");
  const editorialGuideMarkdown = await readFile(
    path.join(process.cwd(), "docs", "EDITORIAL-GUIDE.md"),
    "utf8",
  ).catch(() => "");

  return (
    <AdminContentInbox
      instructionsMarkdown={instructionsMarkdown}
      editorialGuideMarkdown={editorialGuideMarkdown}
    />
  );
}
