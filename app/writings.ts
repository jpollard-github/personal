import type { RelatedSignal } from "./RelatedSignals";

export type WritingEntry = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  related: RelatedSignal[];
};

export const writings: WritingEntry[] = [
  {
    slug: "it-aint-over-till-its-over",
    title: "Thank You Yogi",
    description:
      "A Little League comeback, an old baseball saying, and a message of hope that stayed.",
    icon: "⚾",
    related: [
      {
        href: "/twin-peaks-self",
        title: "The Lodges Within",
        description:
          "A symbolic reflection tool about naming the room you are in and finding one usable next step.",
        reason: "Because both pieces care about what people do with hope when the game looks finished.",
        cta: "Enter the lodges",
      },
      {
        href: "/#fun-and-games",
        title: "Fun & Games",
        description:
          "The playful side of the site: strange prompts, game-shaped paths, and interactive static.",
        reason: "Because comeback energy and playfulness belong near each other here.",
        cta: "Follow the strange signal",
      },
      {
        href: "/#now",
        title: "What I'm Building Now",
        description:
          "A live snapshot of the projects, ideas, and practical moves that are still glowing.",
        reason: "Because the site is partly about what it means to keep going in public.",
        cta: "See what's active",
      },
    ],
  },
  {
    slug: "my-first-cat",
    title: "My First Cat",
    description:
      "The story of Finnegan: a black shelter kitten, a first true cat friendship, and goodbye.",
    icon: "😹",
    related: [
      {
        href: "/cats/thomas-jones-missy-cass",
        title: "Thomas, Jones, Missy, and Cass",
        description:
          "A larger cat memory room with photos and a little orbit of companionship, change, and loss.",
        reason: "Because this room carries the longer arc of cat love, grief, and change.",
        cta: "Visit the memory room",
      },
      {
        href: "/cats/beverly-and-lucinda",
        title: "Beverly and Lucinda",
        description:
          "A newer cat room full of tiny chaos professionals, meaningful eye contact, and current-day signals.",
        reason: "Because the story of a first cat sits naturally beside the cats who came later.",
        cta: "Meet the current crew",
      },
      {
        href: "/#tiny-thoughts",
        title: "Tiny Thoughts",
        description:
          "Shorter notes from the counter when a feeling, lesson, or memory does not need to become a full essay.",
        reason: "Because some feelings echo better as shorter signals than full stories.",
        cta: "Read smaller signals",
      },
    ],
  },
];
