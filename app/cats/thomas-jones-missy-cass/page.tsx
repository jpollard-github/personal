import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RelatedSignals } from "../../RelatedSignals";
import { SectionHeading } from "../../SectionHeading";
import { thomasJonesMissyCassPhotos } from "../../site-data";

export const metadata: Metadata = {
  title: "Thomas, Jones, Missy, and Cass Cat Photos",
  description:
    "A photo room for Thomas, Jones, Missy, and Cass, Jason Pollard's cats from 2016 to 2025.",
  alternates: {
    canonical: "/cats/thomas-jones-missy-cass",
  },
  openGraph: {
    title: "Thomas, Jones, Missy, and Cass Cat Photos",
    description: "A photo room for Thomas, Jones, Missy, and Cass from 2016 to 2025.",
    url: "/cats/thomas-jones-missy-cass",
  },
};

const relatedSignals = [
  {
    href: "/writings/my-first-cat",
    title: "My First Cat",
    description:
      "An essay about Finnegan, first cat friendship, and the kind of loss that quietly rearranges a life.",
    reason: "Because this memory room and that story are speaking to the same part of the heart.",
    cta: "Read the story",
  },
  {
    href: "/cats/beverly-and-lucinda",
    title: "Beverly and Lucinda",
    description:
      "The newer cat room, full of present-tense chaos, Churu, and current-day companionship.",
    reason: "Because the older orbit of cats sits naturally beside the current one.",
    cta: "Meet the current crew",
  },
  {
    href: "/#tiny-thoughts",
    title: "Tiny Thoughts",
    description:
      "Shorter notes from the counter when grief, humor, or memory only needs a few lines to arrive.",
    reason: "Because not every cat feeling wants to become a full essay.",
    cta: "Read smaller signals",
  },
];

export default function ThomasJonesMissyCassPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/#cats">
        Back To Cats
      </Link>
      <section className="content-section cats-section collection-section">
        <SectionHeading eyebrow="Cats" title="Thomas, Jones, Missy, and Cass.">
          Thomas was my buddy for 17 years and passed in 2025. Missy looks like
          Thomas, and both Missy and Jones were rehomed in 2024. Jones died
          unexpectedly shortly thereafter. Cass belonged to my ex but got along
          with Thomas.
        </SectionHeading>
        <div
          className="cat-gallery"
          aria-label="Photos of Thomas, Jones, Missy, and Cass"
        >
          {thomasJonesMissyCassPhotos.map((photo) => (
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
