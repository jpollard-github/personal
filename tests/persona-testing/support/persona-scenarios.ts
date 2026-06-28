export type JourneyScenarioId =
  | "first-visit"
  | "looking-for-trust"
  | "looking-for-something-specific"
  | "deciding-whether-to-return"
  | "low-attention-visit"
  | "deep-browse"
  | "returning-after-time-away";

export type JourneyScenarioGoal =
  | "Build orientation"
  | "Build confidence"
  | "Complete task"
  | "Assess freshness"
  | "Avoid bounce"
  | "Reward curiosity"
  | "Discover change";

export type JourneyExitState =
  | "leave"
  | "bookmark"
  | "contact"
  | "subscribe"
  | "return-later"
  | "continue-exploring";

export type JourneySuccessCondition = {
  label: string;
  allOf?: string[];
  anyOf?: string[];
};

export type JourneyScenarioDefinition = {
  id: JourneyScenarioId;
  label: string;
  description: string;
  goal: JourneyScenarioGoal;
  defaultStartSurfaceId: string;
  targetPages: number;
  maxPages: number;
  prefersSearch: boolean;
  trustFocused: boolean;
  returnFocused: boolean;
  lowAttention: boolean;
  deepBrowse: boolean;
  successConditions: JourneySuccessCondition[];
  successExitState: JourneyExitState;
  fallbackExitState: JourneyExitState;
};

export const journeyScenarioDefinitions: JourneyScenarioDefinition[] = [
  {
    id: "first-visit",
    label: "First Visit",
    description: "A new visitor trying to understand what the site is and where to go next.",
    goal: "Build orientation",
    defaultStartSurfaceId: "home",
    targetPages: 5,
    maxPages: 7,
    prefersSearch: false,
    trustFocused: false,
    returnFocused: false,
    lowAttention: false,
    deepBrowse: false,
    successConditions: [
      {
        label: "Orientation established",
        allOf: ["home"],
        anyOf: ["about", "updates", "search", "writings", "work-with-me"],
      },
    ],
    successExitState: "continue-exploring",
    fallbackExitState: "leave",
  },
  {
    id: "looking-for-trust",
    label: "Looking For A Reason To Trust",
    description: "A visitor trying to decide whether the site and the person behind it feel credible and worth more time.",
    goal: "Build confidence",
    defaultStartSurfaceId: "home",
    targetPages: 5,
    maxPages: 7,
    prefersSearch: false,
    trustFocused: true,
    returnFocused: false,
    lowAttention: false,
    deepBrowse: false,
    successConditions: [
      {
        label: "About plus proof visited",
        allOf: ["about"],
        anyOf: ["build-log", "work-with-me", "writings", "updates"],
      },
      {
        label: "Build log plus work-with-me visited",
        allOf: ["build-log", "work-with-me"],
      },
    ],
    successExitState: "bookmark",
    fallbackExitState: "leave",
  },
  {
    id: "looking-for-something-specific",
    label: "Looking For Something Specific",
    description: "A goal-driven visit that rewards direct routes, search, and clear labels.",
    goal: "Complete task",
    defaultStartSurfaceId: "home",
    targetPages: 4,
    maxPages: 6,
    prefersSearch: true,
    trustFocused: false,
    returnFocused: false,
    lowAttention: false,
    deepBrowse: false,
    successConditions: [
      {
        label: "Search or direct proof path reached",
        anyOf: ["search", "work-with-me", "build-log"],
      },
    ],
    successExitState: "contact",
    fallbackExitState: "leave",
  },
  {
    id: "deciding-whether-to-return",
    label: "Deciding Whether To Return",
    description: "A visit focused on freshness, update loops, and whether the site still feels alive.",
    goal: "Assess freshness",
    defaultStartSurfaceId: "updates",
    targetPages: 4,
    maxPages: 6,
    prefersSearch: false,
    trustFocused: false,
    returnFocused: true,
    lowAttention: false,
    deepBrowse: false,
    successConditions: [
      {
        label: "Updates plus one living room",
        allOf: ["updates"],
        anyOf: ["tiny-thoughts", "writings", "build-log", "music"],
      },
    ],
    successExitState: "return-later",
    fallbackExitState: "leave",
  },
  {
    id: "low-attention-visit",
    label: "Low Attention Visit",
    description: "A short visit with low patience that needs quick orientation or it risks bouncing.",
    goal: "Avoid bounce",
    defaultStartSurfaceId: "home",
    targetPages: 4,
    maxPages: 5,
    prefersSearch: true,
    trustFocused: false,
    returnFocused: false,
    lowAttention: true,
    deepBrowse: false,
    successConditions: [
      {
        label: "Fast orientation path found",
        anyOf: ["about", "search", "work-with-me", "updates"],
      },
    ],
    successExitState: "bookmark",
    fallbackExitState: "leave",
  },
  {
    id: "deep-browse",
    label: "Deep Browse",
    description: "A longer, more patient visit where the user is willing to reward the site for depth.",
    goal: "Reward curiosity",
    defaultStartSurfaceId: "home",
    targetPages: 7,
    maxPages: 9,
    prefersSearch: false,
    trustFocused: false,
    returnFocused: false,
    lowAttention: false,
    deepBrowse: true,
    successConditions: [
      {
        label: "Curiosity rewarded across multiple rooms",
        anyOf: ["writings", "music", "tiny-thoughts", "twin-peaks-self", "arcade", "games-between-two-lodges"],
      },
      {
        label: "Depth plus authorship",
        allOf: ["about"],
        anyOf: ["writings", "build-log", "music", "tiny-thoughts"],
      },
    ],
    successExitState: "continue-exploring",
    fallbackExitState: "leave",
  },
  {
    id: "returning-after-time-away",
    label: "Returning After Time Away",
    description: "A returning visitor checking what changed since the last visit.",
    goal: "Discover change",
    defaultStartSurfaceId: "updates",
    targetPages: 5,
    maxPages: 7,
    prefersSearch: false,
    trustFocused: false,
    returnFocused: true,
    lowAttention: false,
    deepBrowse: false,
    successConditions: [
      {
        label: "Fresh signals discovered",
        allOf: ["updates"],
        anyOf: ["build-log", "tiny-thoughts", "writings", "music"],
      },
    ],
    successExitState: "return-later",
    fallbackExitState: "leave",
  },
];

export function getJourneyScenarioDefinition(id: JourneyScenarioId) {
  const scenario = journeyScenarioDefinitions.find((entry) => entry.id === id);

  if (!scenario) {
    throw new Error(`Unknown journey scenario: ${id}`);
  }

  return scenario;
}
