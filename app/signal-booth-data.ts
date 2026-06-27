export type SignalBoothOption = {
  title: string;
  prompt: string;
  action: string;
  image: string;
  tags: string[];
  modes: SignalBoothMode[];
};

export const signalBoothModes = [
  { value: "random", label: "Any Signal" },
  { value: "spooky", label: "Spooky" },
  { value: "funny", label: "Funny" },
  { value: "reflective", label: "Reflective" },
  { value: "career", label: "Career" },
  { value: "arcade", label: "Arcade" },
  { value: "cat", label: "Cat" },
  { value: "twin-peaks", label: "Twin Peaks" },
] as const;

export type SignalBoothMode = (typeof signalBoothModes)[number]["value"];

const signalImages = [
  "/images/signal-booth/radio-tower.webp",
  "/images/signal-booth/theater-lobby.webp",
  "/images/signal-booth/baseball-field.webp",
  "/images/signal-booth/road-trip.webp",
  "/images/signal-booth/jukebox.webp",
  "/images/signal-booth/kitten-motel.webp",
  "/images/signal-booth/cat-moon.webp",
  "/images/signal-booth/trivia-table.webp",
  "/images/signal-booth/idea-wall.webp",
  "/images/signal-booth/coding-cabin.webp",
];

const signalSeeds = [
  "a neon forest diner where the coffee knows which memory you need",
  "an arcade cabinet humming in a pine clearing after midnight",
  "a jukebox that plays the song you were avoiding",
  "Beverly and Lucinda debating the physics of a ping pong ball",
  "Finnegan rubbing his face against gratitude before touching the food",
  "Thomas waiting like a small familiar moon in the hallway",
  "a Little League runner on third holding one more ounce of hope",
  "a dusty backstop where a wild pitch becomes a life philosophy",
  "a road trip cassette labeled only with tomorrow's better joke",
  "a Twin Peaks-style red room translated into a kinder dream",
  "a coding desk where useful tools are allowed to have a pulse",
  "a trivia-night pencil that keeps guessing the emotional answer",
  "an old motel door glowing for a black cat in a cardboard box",
  "a rain-streaked windshield pointed toward the Blue Ridge dark",
  "a field guide to people who skip small talk without being rude",
  "a synthwave weather report for tenderness after midnight",
  "a diner counter where every project gets one strange button",
  "a quiet booth by the window for essays that needed a witness",
  "a game-room staircase leading away from art class and toward wonder",
  "a cabinet marquee that says nothing but still calls you over",
  "a Music League round where the right song changes the room",
  "a horror-movie porch light that looks scary until it waves you in",
  "a newsletter from the part of the internet that still feels handmade",
  "a notebook full of jokes with tiny fangs and good manners",
  "a humane AI terminal making room for the weirdest good idea",
  "a haunted map of North Carolina's Triad with friendly detours",
  "a cat treat negotiation conducted through meaningful eye contact",
  "a karaoke shower song performed for one highly qualified cat",
  "a childhood monkey bar moment before the comeback begins",
  "a quarter balanced on the glass of the next obsession",
  "a late-night conversation that finds your people by accident",
  "a red-shirt all-star team refusing to leave the story early",
  "a stack of longreads, arcade tokens, and half-finished plans",
  "a diner receipt with a project idea hiding between the totals",
  "a cabin laptop reflecting teal code onto a mug of coffee",
  "a strange idea that becomes useful because someone kept listening",
  "a roadside attraction for grief, jokes, cats, and stubborn hope",
  "a social profile that gave up and became a tiny museum instead",
  "a hopeful note found in a jacket pocket at exactly the right time",
  "a signal broadcast for anyone who suspects they are one of your people",
];

const signalLenses = [
  {
    titlePrefix: "Transmit",
    promptPrefix: "Send a dispatch about",
    actionPrefix: "Write three lines from the point of view of",
    tags: ["dispatch", "writing"],
  },
  {
    titlePrefix: "Build",
    promptPrefix: "Invent a tiny interactive project inspired by",
    actionPrefix: "Name the core mechanic and the one detail that gives it a heartbeat:",
    tags: ["project", "software"],
  },
  {
    titlePrefix: "Cue",
    promptPrefix: "Pick the imaginary opening track for",
    actionPrefix: "Describe the sound, the weather, and the first lyric you wish existed:",
    tags: ["music", "mood"],
  },
  {
    titlePrefix: "Decode",
    promptPrefix: "Find the hidden message inside",
    actionPrefix: "Explain what it is trying to tell future-you in one clean sentence:",
    tags: ["reflection", "meaning"],
  },
  {
    titlePrefix: "Invite",
    promptPrefix: "Use this as a beacon for someone who would understand",
    actionPrefix: "Draft the invitation you would leave taped to the diner door:",
    tags: ["connection", "signal"],
  },
];

function toTitle(seed: string) {
  return seed
    .replace(/^a |^an |^the /, "")
    .split(" ")
    .slice(0, 6)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function modeKeywords(option: Omit<SignalBoothOption, "modes">) {
  return `${option.title} ${option.prompt} ${option.action} ${option.tags.join(" ")}`
    .toLowerCase();
}

export function detectSignalBoothModes(
  option: Omit<SignalBoothOption, "modes">,
): SignalBoothMode[] {
  const text = modeKeywords(option);
  const modes = new Set<SignalBoothMode>();

  if (
    text.includes("haunted") ||
    text.includes("horror") ||
    text.includes("ghost") ||
    text.includes("midnight") ||
    text.includes("red room") ||
    text.includes("fangs")
  ) {
    modes.add("spooky");
  }

  if (
    text.includes("joke") ||
    text.includes("karaoke") ||
    text.includes("funny") ||
    text.includes("qualified cat") ||
    text.includes("ping pong ball") ||
    text.includes("trivia")
  ) {
    modes.add("funny");
  }

  if (
    text.includes("reflection") ||
    text.includes("meaning") ||
    text.includes("future-you") ||
    text.includes("hope") ||
    text.includes("gratitude") ||
    text.includes("witness")
  ) {
    modes.add("reflective");
  }

  if (
    text.includes("software") ||
    text.includes("project") ||
    text.includes("coding") ||
    text.includes("tool") ||
    text.includes("ai") ||
    text.includes("interactive")
  ) {
    modes.add("career");
  }

  if (
    text.includes("arcade") ||
    text.includes("cabinet") ||
    text.includes("quarter") ||
    text.includes("game-room") ||
    text.includes("arcadeghosts")
  ) {
    modes.add("arcade");
  }

  if (
    text.includes("cat") ||
    text.includes("kitten") ||
    text.includes("beverly") ||
    text.includes("lucinda") ||
    text.includes("finnegan") ||
    text.includes("thomas")
  ) {
    modes.add("cat");
  }

  if (
    text.includes("twin peaks") ||
    text.includes("red room") ||
    text.includes("diner") ||
    text.includes("pine") ||
    text.includes("lodge")
  ) {
    modes.add("twin-peaks");
  }

  return Array.from(modes);
}

export const signalBoothOptions: SignalBoothOption[] = signalSeeds.flatMap(
  (seed, seedIndex) =>
    signalLenses.map((lens, lensIndex) => {
      const option = {
        title: `${lens.titlePrefix}: ${toTitle(seed)}`,
        prompt: `${lens.promptPrefix} ${seed}.`,
        action: `${lens.actionPrefix} ${seed}.`,
        image: signalImages[(seedIndex + lensIndex) % signalImages.length],
        tags: [...lens.tags, seedIndex % 2 === 0 ? "arcadeghosts" : "night-kitchen"],
      };

      return {
        ...option,
        modes: detectSignalBoothModes(option),
      };
    }),
);

export function getSignalBoothOptionsForMode(mode: SignalBoothMode) {
  if (mode === "random") {
    return signalBoothOptions;
  }

  return signalBoothOptions.filter((option) => option.modes.includes(mode));
}
