import Link from "next/link";

export function HomeIntroBand() {
  return (
    <section className="intro-band" aria-label="Site mood">
      <p>
        A living portfolio for software, writing, experiments, personal
        mythology, and the kind of ideas that keep tapping on the glass.{" "}
        <Link
          className="admin-cup-link"
          href="/admin"
          aria-label="Open admin dashboard"
          title="Admin dashboard"
        >
          ☕
        </Link>
      </p>
    </section>
  );
}
