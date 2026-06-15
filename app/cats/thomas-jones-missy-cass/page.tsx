import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../../SectionHeading";
import { thomasJonesMissyCassPhotos } from "../../site-data";

export const metadata: Metadata = {
  title: "Thomas, Jones, Missy, and Cass | Jason's Awesome 80s Site",
  description: "A photo room for Thomas, Jones, Missy, and Cass from 2016 to 2025.",
};

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
