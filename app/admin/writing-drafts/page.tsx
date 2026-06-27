import { AdminWritingDrafts } from "../../AdminWritingDrafts";

export const metadata = {
  title: "Writing Drafts Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WritingDraftsAdminPage() {
  return <AdminWritingDrafts />;
}
