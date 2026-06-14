import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "../SectionHeading";
import { visualMedia } from "../site-data";

export const metadata: Metadata = {
  title: "Movies & TV | Neon Forest Personal Site",
  description: "Movies and TV shows that resonated, collected on their own page.",
};

export default function MoviesTvPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <a className="back-link" href="/">
        Back Home
      </a>
      <section className="content-section media-section collection-section">
        <SectionHeading eyebrow="Movies & TV" title="Movies & TV Shows.">
          Twin Peaks, Severance, horror, strange comedies, memory-loop movies,
          and other shows and films that stuck around.
        </SectionHeading>
        <div className="media-grid">
          {visualMedia.map((item) => (
            <article className="media-card" key={item.title}>
              <a
                className="media-image-link"
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.title} image source`}
              >
                <Image
                  src={item.image}
                  alt={`${item.title} poster or key art`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 20vw"
                  className={`media-image${item.fit === "contain" ? " contain" : ""}`}
                />
              </a>
              <div className="media-card-copy">
                <h3>
                  {item.itemUrl ? (
                    <a href={item.itemUrl} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
