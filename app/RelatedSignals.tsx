import Link from "next/link";

export type RelatedSignal = {
  href: string;
  title: string;
  description: string;
  cta: string;
  reason?: string;
};

export function RelatedSignals({
  eyebrow = "Keep Wandering",
  title = "A few nearby signals.",
  items,
}: {
  eyebrow?: string;
  title?: string;
  items: RelatedSignal[];
}) {
  return (
    <section className="related-signals" aria-labelledby="related-signals-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id="related-signals-heading">{title}</h2>
      <div className="related-signals-grid">
        {items.map((item) => (
          <Link className="related-signal-card" href={item.href} key={item.href}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.reason ? <small>{item.reason}</small> : null}
            <span>{item.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
