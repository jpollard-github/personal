import { AdminHomeSpotlight } from "../../AdminHomeSpotlight";

export const metadata = {
  title: "Homepage Spotlight Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomeSpotlightAdminPage() {
  return <AdminHomeSpotlight />;
}
