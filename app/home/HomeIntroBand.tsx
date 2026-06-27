import Link from "next/link";

export function HomeIntroBand() {
  return (
    <section className="intro-band" aria-label="Site mood">
      <p>
        A living portfolio for software, writing, and strange little
        experiments. <Link href="/updates">Recent updates</Link>.{" "}
        <a href="/writings/rss.xml">Writing RSS</a>.{" "}
        <a href="/tiny-thoughts/rss.xml">Tiny Thoughts RSS</a>.{" "}
        <Link
          className="admin-cup-link"
          href="/admin"
          aria-label="Open Control Room"
          title="Control Room"
        >
          <span aria-hidden="true">☕</span>
          <span className="admin-cup-label">Control Room</span>
        </Link>
      </p>
    </section>
  );
}
