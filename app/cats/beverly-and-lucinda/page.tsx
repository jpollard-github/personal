import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RelatedSignals } from "../../RelatedSignals";
import { SectionHeading } from "../../SectionHeading";
import { beverlyAndLucindaPhotos } from "../../site-data";

export const metadata: Metadata = {
  title: "Beverly and Lucinda Cat Photos",
  description:
    "A photo room for Beverly and Lucinda, Jason Pollard's cats, from 2025 to current.",
  alternates: {
    canonical: "/cats/beverly-and-lucinda",
  },
  openGraph: {
    title: "Beverly and Lucinda Cat Photos",
    description: "A photo room for Beverly and Lucinda from 2025 to current.",
    url: "/cats/beverly-and-lucinda",
  },
};

const relatedSignals = [
  {
    href: "/cats/thomas-jones-missy-cass",
    title: "Thomas, Jones, Missy, and Cass",
    description:
      "The older memory room with a wider cat orbit, more years, and a little more grief in the wallpaper.",
    reason: "Because the current crew makes more sense beside the longer cat history.",
    cta: "Visit the memory room",
  },
  {
    href: "/writings/my-first-cat",
    title: "My First Cat",
    description:
      "An essay about Finnegan, first companionship, and the shape of goodbye when an animal changes your life.",
    reason: "Because cat photos and cat stories belong beside each other here.",
    cta: "Read the story",
  },
  {
    href: "/#tiny-thoughts",
    title: "Tiny Thoughts",
    description:
      "Smaller notes from the counter for the moments when a feeling or observation only needs a short form.",
    reason: "Because some cat-related emotions are quick sparks rather than full rooms.",
    cta: "Read smaller signals",
  },
];

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
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                className="cat-photo-image"
              />
            </figure>
          ))}
        </div>
        <RelatedSignals items={relatedSignals} title="A few neighboring cat signals." />
      </section>
    </main>
  );
}
