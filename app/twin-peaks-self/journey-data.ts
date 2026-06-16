export type LodgeProblem = {
  id: string;
  title: string;
  twinPeaksFrame: string;
  meaning: string;
  openingInsight: string;
};

export type JourneyChoice = {
  id: string;
  label: string;
  twinPeaksItem: string;
  meaning: string;
  guidance: string;
};

export type JourneyStep = {
  id: string;
  title: string;
  question: string;
  explanation: string;
  choices: JourneyChoice[];
};

export type JourneySelectionIds = Record<string, string>;

export type JourneyExportPathItem = {
  stepId: string;
  stepTitle: string;
  question: string;
  explanation: string;
  selectedChoiceId: string;
  selectedLabel: string;
  twinPeaksItem: string;
  meaning: string;
  guidance: string;
};

export type JourneyExportPayload = {
  schemaVersion: "lodges-within.v1";
  frameworkName: "The Lodges Within";
  generatedAt: string;
  purpose: "llm_tailored_reflection_prompt";
  safetyFrame: string;
  selectedProblem: LodgeProblem;
  path: JourneyExportPathItem[];
  llmInstructions: string[];
  suggestedOutputShape: string[];
};

export const lodgeProblems: LodgeProblem[] = [
  {
    id: "lost-in-the-woods",
    title: "Lost in the woods",
    twinPeaksFrame: "The Douglas firs and dark roads outside town",
    meaning:
      "You may feel directionless, uncertain, or unable to tell which path is real and which path is just familiar.",
    openingInsight:
      "Do not demand the whole map yet. Start by finding one tree, one sound, one signal that is actually present.",
  },
  {
    id: "black-lodge-loop",
    title: "Stuck in the Black Lodge",
    twinPeaksFrame: "The Red Room and the backward-feeling loop",
    meaning:
      "You may be caught in shame, fear, rumination, or a pattern that keeps repeating even after you understand it.",
    openingInsight:
      "A loop is not a life sentence. It is information asking to be read slowly.",
  },
  {
    id: "chasing-bob",
    title: "Chasing Bob",
    twinPeaksFrame: "Bob as the recurring destructive force",
    meaning:
      "You may be wrestling with compulsion, self-sabotage, anger, avoidance, or an impulse that arrives before wisdom does.",
    openingInsight:
      "The work is not to pretend the impulse is gone. The work is to notice it before it takes the wheel.",
  },
  {
    id: "laura-secret",
    title: "Avoiding Laura's secret",
    twinPeaksFrame: "Laura Palmer as the hidden truth at the center",
    meaning:
      "There may be something true, painful, or clarifying that you keep circling without looking at directly.",
    openingInsight:
      "The center is not there to punish you. It is there because some part of you still wants to be known.",
  },
  {
    id: "log-lady-signal",
    title: "Ignoring the Log Lady",
    twinPeaksFrame: "The Log Lady as intuition and subtle knowing",
    meaning:
      "You may already know something important, but it is arriving as a body signal, a strange feeling, or a quiet no.",
    openingInsight:
      "Inner knowing often sounds unreasonable before it sounds wise.",
  },
  {
    id: "cooper-case",
    title: "Following a clue",
    twinPeaksFrame: "Agent Cooper's attentive investigation",
    meaning:
      "You may not need a dramatic answer. You may need curiosity, evidence, attention, and one clean next question.",
    openingInsight:
      "Curiosity can be courage wearing a better suit.",
  },
  {
    id: "diner-regroup",
    title: "Drinking coffee and regrouping",
    twinPeaksFrame: "The Double R Diner as warmth, pause, and return",
    meaning:
      "You may be depleted, overstimulated, or in need of simple grounding before you solve anything.",
    openingInsight:
      "Sometimes the next brave act is breakfast, water, a walk, and not making meaning too quickly.",
  },
  {
    id: "blue-rose-case",
    title: "Holding a Blue Rose case",
    twinPeaksFrame: "A mystery that resists ordinary explanation",
    meaning:
      "You may be facing an old pattern that does not fit neat categories and needs symbolic thinking, patience, and care.",
    openingInsight:
      "Not every mystery yields to force. Some open when you stop reducing them.",
  },
  {
    id: "owls-watching",
    title: "The owls are not what they seem",
    twinPeaksFrame: "The owls as ambiguous signals",
    meaning:
      "You may be sensing danger, change, or hidden meaning, but cannot yet tell whether the signal is fear or wisdom.",
    openingInsight:
      "A signal deserves investigation before obedience.",
  },
  {
    id: "one-eyed-jacks",
    title: "Standing outside One Eyed Jack's",
    twinPeaksFrame: "A tempting room with a cost",
    meaning:
      "You may be drawn toward a shortcut, fantasy, old coping behavior, or situation that promises relief but asks too much.",
    openingInsight:
      "Temptation often borrows the voice of relief. Ask what it will invoice later.",
  },
  {
    id: "great-northern-hallway",
    title: "Walking the Great Northern hallway",
    twinPeaksFrame: "Polished surfaces, hidden rooms, and public roles",
    meaning:
      "You may be performing competence while privately feeling uncertain, lonely, or split between roles.",
    openingInsight:
      "The lobby is not the whole building. Your public self is allowed to have back rooms.",
  },
  {
    id: "sheriff-board",
    title: "Staring at the Sheriff's station board",
    twinPeaksFrame: "The evidence board full of clues",
    meaning:
      "You may have too many threads, tasks, and theories competing for attention.",
    openingInsight:
      "Overwhelm is sometimes a filing problem before it is a life problem.",
  },
  {
    id: "major-briggs-message",
    title: "Receiving Major Briggs' message",
    twinPeaksFrame: "Cosmic direction, duty, and deep values",
    meaning:
      "You may be trying to hear what your life is asking from you beneath noise, ambition, or fear.",
    openingInsight:
      "A calling does not always shout. Sometimes it repeats calmly until you stop running past it.",
  },
  {
    id: "palmer-house",
    title: "Standing in the Palmer house",
    twinPeaksFrame: "The home where truth and pain live together",
    meaning:
      "You may be facing family patterns, old grief, loyalty conflicts, or history that shaped your nervous system.",
    openingInsight:
      "You can honor what happened without letting it keep furnishing every room.",
  },
  {
    id: "audrey-hallway",
    title: "Audrey in the hallway",
    twinPeaksFrame: "Performance, longing, and being half-seen",
    meaning:
      "You may be trying to be noticed, chosen, or understood while hiding the need underneath style or bravado.",
    openingInsight:
      "Wanting to be seen is not vanity. It is a human signal asking for honest form.",
  },
  {
    id: "dougie-mode",
    title: "Moving through Dougie mode",
    twinPeaksFrame: "Autopilot, innocence, and delayed awareness",
    meaning:
      "You may be disconnected, under-functioning, or drifting while life carries you from room to room.",
    openingInsight:
      "Autopilot is not failure. It is a clue that attention needs gentler re-entry.",
  },
  {
    id: "convenience-store",
    title: "Above the convenience store",
    twinPeaksFrame: "A meeting place for strange forces",
    meaning:
      "You may be in the company of old habits, old voices, or old agreements that quietly shape your choices.",
    openingInsight:
      "Ask who is in the room before you agree to the meeting.",
  },
  {
    id: "night-drive",
    title: "Driving the dark road at night",
    twinPeaksFrame: "Headlights, trees, and not enough visibility",
    meaning:
      "You may be making decisions with limited information while anxious for certainty.",
    openingInsight:
      "Low visibility calls for slower speed, not harsher self-judgment.",
  },
  {
    id: "white-lodge-glimpse",
    title: "Glimpsing the White Lodge",
    twinPeaksFrame: "Wisdom, compassion, and integration",
    meaning:
      "You may know the direction you want to move, but struggle to practice it when pressure rises.",
    openingInsight:
      "The White Lodge is not perfection. It is the next honest step toward integration.",
  },
  {
    id: "fire-walk",
    title: "Walking with fire",
    twinPeaksFrame: "Intensity, desire, and danger mixed together",
    meaning:
      "You may be dealing with powerful emotion that can either illuminate or burn depending on how you carry it.",
    openingInsight:
      "Fire is not the enemy. The question is whether you are carrying it in a lantern or your hands.",
  },
];

export function buildJourneyExportPayload({
  problemId,
  selections,
  generatedAt = new Date().toISOString(),
}: {
  problemId: string;
  selections: JourneySelectionIds;
  generatedAt?: string;
}): JourneyExportPayload {
  const selectedProblem =
    lodgeProblems.find((problem) => problem.id === problemId) ?? lodgeProblems[0];
  const path = journeySteps.flatMap((step): JourneyExportPathItem[] => {
    const selectedChoiceId = selections[step.id];
    const selectedChoice = step.choices.find(
      (choice) => choice.id === selectedChoiceId,
    );

    if (!selectedChoice) {
      return [];
    }

    return [
      {
        stepId: step.id,
        stepTitle: step.title,
        question: step.question,
        explanation: step.explanation,
        selectedChoiceId: selectedChoice.id,
        selectedLabel: selectedChoice.label,
        twinPeaksItem: selectedChoice.twinPeaksItem,
        meaning: selectedChoice.meaning,
        guidance: selectedChoice.guidance,
      },
    ];
  });

  return {
    schemaVersion: "lodges-within.v1",
    frameworkName: "The Lodges Within",
    generatedAt,
    purpose: "llm_tailored_reflection_prompt",
    safetyFrame:
      "This is a self-reflection and meaning-making framework, not therapy, diagnosis, crisis care, or medical advice.",
    selectedProblem,
    path,
    llmInstructions: [
      "Use the selected Twin Peaks-inspired symbols as metaphors for self-reflection.",
      "Do not claim to diagnose or treat the user.",
      "Offer grounded, practical reflection prompts and one small next action.",
      "Explain the symbolism in plain language before giving advice.",
      "Keep the tone warm, curious, direct, and non-grandiose.",
      "If the user describes imminent harm, direct them to emergency or crisis support.",
    ],
    suggestedOutputShape: [
      "Brief reflection on the selected problem",
      "Pattern noticed across the selected path",
      "Three tailored journaling prompts",
      "One DBT-inspired or grounding skill",
      "One next action for the next 24 hours",
    ],
  };
}

export function buildJourneyLlmPrompt(payload: JourneyExportPayload) {
  return [
    "You are helping with The Lodges Within, a Twin Peaks-inspired self-reflection and meaning-making framework.",
    "",
    "Important safety frame:",
    payload.safetyFrame,
    "",
    "Selected starting problem:",
    `${payload.selectedProblem.title} — ${payload.selectedProblem.meaning}`,
    "",
    "Selected path:",
    ...payload.path.map(
      (item, index) =>
        `${index + 1}. ${item.stepTitle}: ${item.selectedLabel} (${item.twinPeaksItem}) — ${item.meaning} Guidance: ${item.guidance}`,
    ),
    "",
    "Please generate:",
    ...payload.suggestedOutputShape.map((item) => `- ${item}`),
    "",
    "Instructions:",
    ...payload.llmInstructions.map((item) => `- ${item}`),
  ].join("\n");
}

export const journeySteps: JourneyStep[] = [
  {
    id: "where",
    title: "Where are you right now?",
    question: "Choose the place that feels most true in this moment.",
    explanation:
      "In this framework, location is emotional weather. You are not diagnosing yourself. You are finding the room you are in.",
    choices: [
      {
        id: "woods",
        label: "Lost in the woods",
        twinPeaksItem: "The woods",
        meaning: "Confusion, uncertainty, and the feeling that everything looks similar.",
        guidance: "Name what you know for sure, even if it is small.",
      },
      {
        id: "black-lodge",
        label: "Stuck in the Black Lodge",
        twinPeaksItem: "The Black Lodge",
        meaning: "Fear, avoidance, shame, and self-deception asking to be faced.",
        guidance: "Move slowly. Loops become less powerful when you can describe them.",
      },
      {
        id: "diner",
        label: "Drinking coffee and regrouping",
        twinPeaksItem: "The Double R Diner",
        meaning: "Restoration, warmth, and the need to return to basic care.",
        guidance: "Regulation before revelation. Settle before solving.",
      },
    ],
  },
  {
    id: "guide",
    title: "Who is your guide?",
    question: "Which inner ally should lead the investigation?",
    explanation:
      "A guide is the part of you that knows how to move through this terrain without becoming it.",
    choices: [
      {
        id: "cooper",
        label: "Cooper",
        twinPeaksItem: "Agent Cooper",
        meaning: "Curiosity, courage, attention, and principled investigation.",
        guidance: "Ask better questions before reaching for dramatic answers.",
      },
      {
        id: "log-lady",
        label: "The Log Lady",
        twinPeaksItem: "The Log Lady",
        meaning: "Intuition, subtle signals, and knowing that arrives indirectly.",
        guidance: "Listen for the small truth beneath the loud explanation.",
      },
      {
        id: "major-briggs",
        label: "Major Briggs",
        twinPeaksItem: "Major Briggs",
        meaning: "Values, devotion, patience, and a larger frame.",
        guidance: "Remember what kind of person you are trying to become.",
      },
    ],
  },
  {
    id: "shadow",
    title: "What keeps returning?",
    question: "Which recurring force is most active?",
    explanation:
      "The point is not to label something evil. The point is to see the repeated pattern clearly enough to interrupt it.",
    choices: [
      {
        id: "bob",
        label: "Bob at the edge of the room",
        twinPeaksItem: "Bob",
        meaning: "Compulsion, self-sabotage, and destructive impulse.",
        guidance: "Notice the moment before the pattern takes over.",
      },
      {
        id: "red-room",
        label: "The Red Room loop",
        twinPeaksItem: "The Red Room",
        meaning: "Rumination, repetition, and speaking in circles to yourself.",
        guidance: "Write the loop down in plain language. Then write one sentence that breaks it.",
      },
      {
        id: "mask",
        label: "A polished public mask",
        twinPeaksItem: "The Great Northern",
        meaning: "Looking composed while hiding the real need.",
        guidance: "Ask what you are protecting by appearing fine.",
      },
    ],
  },
  {
    id: "truth",
    title: "What truth is in the center?",
    question: "Which Laura Palmer truth might you be circling?",
    explanation:
      "Laura represents the hidden truth at the center: not a puzzle to solve, but a reality that wants honest witness.",
    choices: [
      {
        id: "need",
        label: "I need something I have not admitted",
        twinPeaksItem: "Laura's secret",
        meaning: "A real need has been disguised as mood, frustration, or distraction.",
        guidance: "Name the need without immediately judging whether it is convenient.",
      },
      {
        id: "hurt",
        label: "Something hurt more than I let on",
        twinPeaksItem: "The Palmer house",
        meaning: "Old pain may still be shaping present reactions.",
        guidance: "Separate what happened then from what is happening now.",
      },
      {
        id: "desire",
        label: "I want a different life shape",
        twinPeaksItem: "A secret diary",
        meaning: "Desire is trying to become information.",
        guidance: "Let yourself want it clearly before negotiating it down.",
      },
    ],
  },
  {
    id: "signal",
    title: "What signal have you ignored?",
    question: "Which quiet message deserves attention?",
    explanation:
      "The Log Lady signal is the thing you noticed before you had language for it.",
    choices: [
      {
        id: "body",
        label: "A body signal",
        twinPeaksItem: "The log's warning",
        meaning: "Tension, fatigue, dread, or relief may be carrying useful data.",
        guidance: "Ask your body what it has been voting against.",
      },
      {
        id: "pattern",
        label: "A repeated pattern",
        twinPeaksItem: "The owls",
        meaning: "A symbol keeps appearing in different clothes.",
        guidance: "Look for the shared structure, not the newest costume.",
      },
      {
        id: "longing",
        label: "A longing",
        twinPeaksItem: "Audrey's hallway",
        meaning: "Wanting to be seen, met, or chosen is a clue, not a flaw.",
        guidance: "Treat longing as information about direction.",
      },
    ],
  },
  {
    id: "lodge",
    title: "Which direction helps?",
    question: "What White Lodge quality would move this forward?",
    explanation:
      "The White Lodge is not perfection. It is a direction: wisdom, compassion, integration, authenticity, connection.",
    choices: [
      {
        id: "compassion",
        label: "Compassion",
        twinPeaksItem: "The White Lodge",
        meaning: "A kinder relationship to the part of you that is struggling.",
        guidance: "Speak to yourself like someone you are responsible for helping.",
      },
      {
        id: "authenticity",
        label: "Authenticity",
        twinPeaksItem: "Cooper's honest attention",
        meaning: "Less performance, more congruence.",
        guidance: "Tell the truth at the smallest useful scale.",
      },
      {
        id: "connection",
        label: "Connection",
        twinPeaksItem: "The Double R counter",
        meaning: "Warmth, witness, repair, and not doing everything alone.",
        guidance: "Choose one person or place where your nervous system softens.",
      },
    ],
  },
  {
    id: "skill",
    title: "Which skill belongs here?",
    question: "Choose a practice for the next difficult moment.",
    explanation:
      "These are DBT-inspired and self-reflection oriented: grounding, opposite action, wise mind, and values-based choice.",
    choices: [
      {
        id: "wise-mind",
        label: "Find Wise Mind",
        twinPeaksItem: "Cooper's tape recorder",
        meaning: "Emotion and reason both get a seat, neither gets the whole car.",
        guidance: "Write: emotion says, reason says, wise mind says.",
      },
      {
        id: "opposite-action",
        label: "Use opposite action",
        twinPeaksItem: "Leaving the Black Lodge",
        meaning: "When an urge deepens the pattern, do the small opposite.",
        guidance: "Choose one behavior that points toward the White Lodge instead.",
      },
      {
        id: "grounding",
        label: "Ground in the room",
        twinPeaksItem: "Coffee, pie, and the booth",
        meaning: "Return to the present through senses and simple care.",
        guidance: "Name five concrete details before making the next decision.",
      },
    ],
  },
  {
    id: "boundary",
    title: "What boundary or permission is needed?",
    question: "What must be protected so change can happen?",
    explanation:
      "A boundary is not a wall against life. It is a shape that lets something healthier survive.",
    choices: [
      {
        id: "no",
        label: "A clean no",
        twinPeaksItem: "The sheriff's line",
        meaning: "A limit that makes reality less blurry.",
        guidance: "Say no to one thing that keeps feeding the loop.",
      },
      {
        id: "time",
        label: "Protected time",
        twinPeaksItem: "A case file on the desk",
        meaning: "Attention needs an appointment, not just intention.",
        guidance: "Put the next step somewhere on the calendar.",
      },
      {
        id: "permission",
        label: "Permission to want more",
        twinPeaksItem: "The open road",
        meaning: "A life can be decent and still need to change.",
        guidance: "Allow desire to speak before logistics interrupt.",
      },
    ],
  },
  {
    id: "relationship",
    title: "Who else is in the room?",
    question: "What relational pattern is part of this?",
    explanation:
      "Twin Peaks is full of hidden rooms because inner work is rarely only inner. Other people echo through the hallways.",
    choices: [
      {
        id: "witness",
        label: "I need a witness",
        twinPeaksItem: "The Sheriff's station",
        meaning: "A trusted person could help you hold the facts.",
        guidance: "Tell one safe person the simple version.",
      },
      {
        id: "distance",
        label: "I need distance",
        twinPeaksItem: "The road out of town",
        meaning: "Proximity may be making the signal harder to read.",
        guidance: "Create enough space for your own mind to return.",
      },
      {
        id: "repair",
        label: "I need repair",
        twinPeaksItem: "A late-night diner conversation",
        meaning: "Something honest might need to be said kindly.",
        guidance: "Use one sentence that owns your part without erasing your need.",
      },
    ],
  },
  {
    id: "question",
    title: "What question opens the case?",
    question: "Choose the question you will journal from.",
    explanation:
      "The right question is a lantern. It does not solve the woods. It makes the next few feet visible.",
    choices: [
      {
        id: "avoid",
        label: "What am I avoiding because I already know it matters?",
        twinPeaksItem: "Laura's center",
        meaning: "Avoidance often guards the important thing.",
        guidance: "Write for seven minutes without arguing with the answer.",
      },
      {
        id: "pattern-cost",
        label: "What is this pattern costing me?",
        twinPeaksItem: "Bob's return",
        meaning: "Cost creates clarity where drama creates fog.",
        guidance: "Name the cost in time, intimacy, energy, and self-trust.",
      },
      {
        id: "white-direction",
        label: "What would move me one inch toward the White Lodge?",
        twinPeaksItem: "The White Lodge",
        meaning: "Small movement counts when it points the right way.",
        guidance: "Make the answer physical, visible, and doable today.",
      },
    ],
  },
  {
    id: "ritual",
    title: "What is the next ritual?",
    question: "Choose a concrete action for the next 24 hours.",
    explanation:
      "A ritual is a symbolic action with practical feet. It turns insight into motion.",
    choices: [
      {
        id: "write",
        label: "Write the case note",
        twinPeaksItem: "Cooper's recorder",
        meaning: "A short honest record of what you learned.",
        guidance: "Write three bullets: clue, pattern, next move.",
      },
      {
        id: "care",
        label: "Return to the diner",
        twinPeaksItem: "Coffee and pie",
        meaning: "Basic care as a doorway back to agency.",
        guidance: "Eat, hydrate, shower, walk, sleep, or clean one surface.",
      },
      {
        id: "reach",
        label: "Send the signal",
        twinPeaksItem: "A message from town",
        meaning: "Connection turns private fog into shared weather.",
        guidance: "Send one honest, low-drama message to a safe person.",
      },
    ],
  },
  {
    id: "insight",
    title: "What do you carry out?",
    question: "Pick the final wisdom you are willing to practice.",
    explanation:
      "The last step is not a cure. It is the line you carry out of the woods.",
    choices: [
      {
        id: "attention",
        label: "Attention is an act of care.",
        twinPeaksItem: "Cooper",
        meaning: "What you attend to can become workable.",
        guidance: "Your next step is to give the pattern ten honest minutes without turning it into your whole identity.",
      },
      {
        id: "integration",
        label: "The shadow wants integration, not exile.",
        twinPeaksItem: "The Lodges",
        meaning: "Rejected parts often return louder.",
        guidance: "Your next step is to ask what the unwanted part is trying to protect, then choose a cleaner method.",
      },
      {
        id: "signal",
        label: "The signal was already there.",
        twinPeaksItem: "The Log Lady",
        meaning: "You may have known before you knew you knew.",
        guidance: "Your next step is to respect one subtle signal enough to test it in real life.",
      },
    ],
  },
];
