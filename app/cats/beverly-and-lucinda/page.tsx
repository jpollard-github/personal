import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../../SectionHeading";
import { beverlyAndLucindaPhotos } from "../../site-data";

export const metadata: Metadata = {
  title: "Beverly and Lucinda | Jason's Awesome 80s Site",
  description: "A photo room for Beverly and Lucinda from 2025 to current.",
};

export default function BeverlyAndLucindaPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/#cats">
        Back To Cats
      </Link>
      <section className="content-section cats-section collection-section">
        <SectionHeading
          eyebrow="Cats"
          title="Beverly and Lucinda from 2025 to current."
        >
          Beverly and Lucinda are beloved tiny chaos professionals who chase
          ping pong balls, get in the bed with me, eat lots of Churu, and
          practice suspiciously meaningful eye contact.
        </SectionHeading>
        <div className="cat-gallery" aria-label="Photos of Beverly and Lucinda">
          {beverlyAndLucindaPhotos.map((photo) => (
            <figure className="cat-photo" key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                className="cat-photo-image"
              />
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
