import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RelatedSignals } from "../RelatedSignals";
import { TwinPeaksSelfJourney } from "./TwinPeaksSelfJourney";

export const metadata: Metadata = {
  title: "The Lodges Within: Twin Peaks-Inspired Self Reflection",
  description:
    "A Twin Peaks-inspired self-guided reflection journey through symbolic rooms, personal mythology, clues, prompts, and usable next steps.",
  alternates: {
    canonical: "/twin-peaks-self",
  },
  openGraph: {
    title: "The Lodges Within",
    description:
      "A Twin Peaks-inspired, self-guided reflection journey through symbolic rooms, clues, prompts, and next steps.",
    url: "/twin-peaks-self",
  },
};

const relatedSignals = [
  {
    href: "/movies-tv",
    title: "Movies & TV",
    description:
      "The larger screen-signal room where Twin Peaks sits beside other strange, resonant obsessions.",
    reason: "Because this project came from the same symbolic weather as the media that shaped it.",
    cta: "Browse screen signals",
  },
  {
    href: "/#fun-and-games",
    title: "Fun & Games",
    description:
      "Interactive rooms, strange prompts, and game-shaped paths through the same neon forest.",
    reason: "Because this reflection tool belongs beside the site's more playful experiments.",
    cta: "Return to the playful side",
  },
  {
    href: "/writings/it-aint-over-till-its-over",
    title: "Thank You Yogi",
    description:
      "A writing piece about holding onto hope when the shape of the game says otherwise.",
    reason: "Because both pieces ask what kind of story helps a person continue.",
    cta: "Read the essay",
  },
];

export default function TwinPeaksSelfPage() {
  return (
    <main className="lodge-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/">
        Back Home
      </Link>

      <section className="lodge-hero">
        <Image
          src="/images/neon-forest-diner.png"
          alt="A neon-lit diner at the edge of a misty evergreen forest"
          fill
          priority
          sizes="100vw"
          className="lodge-hero-image"
        />
        <div className="lodge-hero-scrim" />
        <div className="lodge-hero-copy">
          <p className="eyebrow">A personal mythology framework</p>
          <h1>The Lodges Within</h1>
          <p>
            A Twin Peaks-inspired, self-guided journey for naming the room you
            are in, understanding the symbol in front of you, and leaving with
            one usable next step.
          </p>
        </div>
      </section>

      <section className="content-section lodge-intro">
        <div>
          <p className="eyebrow">Not therapy. A map.</p>
          <h2>A mythology of the psyche.</h2>
          <p>
            The Black Lodge can stand for fear, avoidance, shame, and destructive
            loops. The White Lodge can stand for wisdom, compassion, integration,
            authenticity, and connection. Bob becomes the recurring impulse. The
            Log Lady becomes intuition. Cooper becomes brave attention. Laura
            Palmer becomes the hidden truth at the center.
          </p>
          <p>
            This first version is static and symbolic. Later, it could become
            dynamic: an LLM or agent could adapt prompts, remember prior paths,
            and shape the journey around the person without pretending to be a
            clinician.
          </p>
          <p className="lodge-disclaimer">
            The Lodges Within is an unofficial fan-inspired reflection tool. It is
            not affiliated with Twin Peaks, David Lynch, Mark Frost, Lynch/Frost
            Productions, or any rights holders.
          </p>
        </div>
      </section>

      <TwinPeaksSelfJourney />
      <section className="content-section">
        <RelatedSignals items={relatedSignals} title="A few neighboring rooms." />
      </section>
    </main>
  );
}
