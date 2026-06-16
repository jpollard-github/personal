import { randomUUID } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { arcadeGames, visualMedia } from "../site-data";
import { writings } from "../writings";
import { getGuestbookSql } from "./guestbook";
import { getContextRefreshProjects, projectPriorityOptions } from "./projects";
import {
  ensureTinyThoughtsTable,
  toTinyThought,
  type TinyThoughtRow,
} from "./tiny-thoughts";

export const contextRefreshVariants = [
  "concise",
  "full",
  "project",
  "dating-social",
  "dev-technical",
] as const;

export type ContextRefreshVariant = (typeof contextRefreshVariants)[number];

export type ContextRefreshExport = {
  id: string;
  filename: string;
  variant: ContextRefreshVariant;
  redacted: boolean;
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  savedAt: string;
};

export type ContextRefreshExportRow = {
  id: string;
  filename: string;
  variant: ContextRefreshVariant;
  redacted: boolean;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  saved_at: string | null;
};

type TinyThoughtForExport = {
  category: string;
  content: string;
  inspiredByCategory: string;
  inspiredBy: string;
  createdAt: string;
};

const variantLabels: Record<ContextRefreshVariant, string> = {
  concise: "Export concise context",
  full: "Export full context",
  project: "Export project-specific context",
  "dating-social": "Export dating/social context",
  "dev-technical": "Export dev/technical context",
};

const staticProfile = {
  name: "Jason Pollard",
  preferredName: "Jason",
  age: 53,
  region: "North Carolina Triad region",
  site: "ArcadeGhosts",
  githubRepo: "https://github.com/jpollard-github/personal",
};

const music = [
  "Reflective Resilience",
  "Arcode Ghosts After Midnight",
  "Love Me Tomorrow Radio",
  "The Mountain Radio",
  "Music League profile: https://app.musicleague.com/user/8e855be976294ae0aedf7a0820572ffb/",
];

const aboutSummary = [
  "Jason is a software developer, cat dad, music enthusiast, arcade wanderer, and lifelong collector of strange ideas.",
  "He built ArcadeGhosts because ordinary social profiles do not capture the interesting parts of life: late-night conversations, favorite songs, forgotten arcade cabinets, weird dreams, and sudden self-understanding.",
  "He spends time exploring technology, creativity, nostalgia, personal growth, AI, trivia nights, road trips, coding projects, horror movies, 80s music, and stories that blur reality.",
  "He tends to like Twin Peaks atmosphere, hidden meaning in songs and films, old arcades, deep conversations, learning for joy, cats, building things because they are interesting, and finding his people.",
  "A recurring theme: life gets more interesting when you stop trying to fit into the wrong crowd.",
];

const redactionNote =
  "Sensitive details are intentionally omitted or generalized: exact addresses, passwords, private names, financial details, medical details, API keys, and anything that should not be pasted into a chat.";

const currentPriorities = [
  "Finish ArcadeGhosts improvements",
  "Investigate creating my own therapy model like DBT",
  "Expand writing collection",
  "Meet more people and improve dating life",
  "Maintain health and work-life balance",
];

const currentChallenges = [
  "Tendency to start interesting projects faster than finishing them",
  "Wants meaningful social connection rather than high-volume socializing",
  "Balancing exploration with focus",
  "Avoiding overengineering when building products",
];

const recentDecisions = [
  {
    date: "2026-06-10",
    decisions: ["Decided to build Context Refresh Export into ArcadeGhosts"],
  },
  {
    date: "2026-06-05",
    decisions: ["SoftSignal should prioritize resonance before photos"],
  },
  {
    date: "2026-05-28",
    decisions: [
      "Focus on practical VS Code tooling instead of broader AI platform ideas",
    ],
  },
];

const commonIncorrectAssumptions = [
  "Not actively trying to become a startup founder",
  "Values interesting work over maximum income",
  "Likes AI as a tool, not as an identity",
  "Prefers thoughtful relationships over dating-app optimization",
  "Really looking to meet kindred spirits and dating partners",
];

const datingAndSocialContext = [
  "Jason values emotional resonance, curiosity, direct but kind communication, and conversations that skip shallow performance.",
  "SoftSignal is an active dating-product idea centered on prompts, memory, writing, mood, and resonance before photos.",
  "Useful advice should balance warmth, clarity, self-respect, and realistic next steps.",
  "Avoid generic dating scripts; help preserve Jason's voice.",
  "Jason is actively trying to meet people, dating apps don't work very well but have produced the most dates",
  "Jason has liked the bars Empourium, Social Habit, Fair Witness. There is a girl he likes named Rebecca who sometimes shows up at Empourium.",
];

export function countContextRefreshWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function isContextRefreshVariant(
  value: string,
): value is ContextRefreshVariant {
  return contextRefreshVariants.includes(value as ContextRefreshVariant);
}

export function normalizeContextRefreshContent(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function contextRefreshFilename(date = new Date()) {
  const stamp = date.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[:]/g, "-");

  return `${stamp}_ChatGPTContextRefresh.md`;
}

export async function ensureContextRefreshExportsTable() {
  const sql = getGuestbookSql();

  await sql`
    CREATE TABLE IF NOT EXISTS context_refresh_exports (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      variant TEXT NOT NULL CHECK (
        variant IN ('concise', 'full', 'project', 'dating-social', 'dev-technical')
      ),
      redacted BOOLEAN NOT NULL DEFAULT true,
      content TEXT NOT NULL,
      word_count INTEGER NOT NULL DEFAULT 0,
      saved_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS context_refresh_exports_updated_at_idx
    ON context_refresh_exports (updated_at DESC)
  `;
}

export function toContextRefreshExport(
  row: ContextRefreshExportRow,
): ContextRefreshExport {
  return {
    id: row.id,
    filename: row.filename,
    variant: row.variant,
    redacted: row.redacted,
    content: row.content,
    wordCount: row.word_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    savedAt: row.saved_at ?? "",
  };
}

async function readWritingExcerpt(slug: string) {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "writings", `${slug}.md`),
      "utf8",
    );

    return file
      .replace(/\*\*/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 620);
  } catch {
    return "";
  }
}

async function loadWritingSummaries() {
  return Promise.all(
    writings.map(async (writing) => ({
      ...writing,
      excerpt: await readWritingExcerpt(writing.slug),
      link: `/writings/${writing.slug}`,
    })),
  );
}

async function loadTinyThoughts() {
  try {
    await ensureTinyThoughtsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      SELECT
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
      FROM tiny_thoughts
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return (rows as TinyThoughtRow[]).map(toTinyThought).map(
      (thought): TinyThoughtForExport => ({
        category: thought.category,
        content: thought.content,
        inspiredByCategory: thought.inspiredByCategory,
        inspiredBy: thought.inspiredBy,
        createdAt: thought.createdAt,
      }),
    );
  } catch {
    return [];
  }
}

function listItems(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function numberedItems(items: string[]) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function yamlList(label: string, items: string[]) {
  return [label, ...items.map((item) => `  - ${item}`)];
}

function projectBlockerLines(value: string) {
  const blockers = value
    .split("\n")
    .map((blocker) => blocker.trim())
    .filter(Boolean);

  if (!blockers.length) {
    return ["- Blockers: None listed"];
  }

  return ["- Blockers:", ...blockers.map((blocker) => `  - ${blocker}`)];
}

function projectPriorityLabel(value: number) {
  return (
    projectPriorityOptions.find((priority) => priority.value === value)?.label ??
    `Priority ${value}`
  );
}

function frontMatter({
  generatedAt,
  variant,
  redacted,
}: {
  generatedAt: Date;
  variant: ContextRefreshVariant;
  redacted: boolean;
}) {
  return [
    "---",
    `generated_at: ${generatedAt.toISOString()}`,
    `user: ${staticProfile.name}`,
    `preferred_name: ${staticProfile.preferredName}`,
    `purpose: ChatGPT context refresh`,
    `privacy_level: ${redacted ? "personal_redacted" : "personal"}`,
    `export_type: ${variant}`,
    `redacted: ${redacted}`,
    ...yamlList("current_focus:", ["ArcadeGhosts", "SoftSignal"]),
    ...yamlList("active_projects:", [
      "ArcadeGhosts",
      "SoftSignal",
      "Between Two Lodges",
    ]),
    ...yamlList("interests:", [
      "Cats",
      "80s Music",
      "Twin Peaks",
      "Arcade Games",
      "Writing",
    ]),
    ...yamlList("conversation_style:", ["Practical", "Curious", "Direct"]),
    "---",
  ].join("\n");
}

function variantGuidance(variant: ContextRefreshVariant) {
  switch (variant) {
    case "project":
      return "Use this export primarily for project planning, product thinking, writing, implementation help, and continuity across active work.";
    case "dating-social":
      return "Use this export primarily for dating, social advice, communication style, self-understanding, and emotional pattern recognition.";
    case "dev-technical":
      return "Use this export primarily for coding help, architecture, repo context, implementation decisions, and developer workflow.";
    case "full":
      return "Use this export when a deep context refresh is useful and the conversation can absorb richer background.";
    case "concise":
    default:
      return "Use this export as the default lightweight refresh before advice, writing, planning, or technical help.";
  }
}

function includeForVariant(
  variant: ContextRefreshVariant,
  section: "projects" | "dating" | "technical" | "creative" | "favorites",
) {
  if (variant === "full") {
    return true;
  }

  if (variant === "concise") {
    return true;
  }

  if (variant === "project") {
    return section === "projects" || section === "technical" || section === "creative";
  }

  if (variant === "dating-social") {
    return section === "dating" || section === "creative" || section === "favorites";
  }

  return section === "technical" || section === "projects";
}

export async function buildContextRefreshContent({
  variant,
  redacted,
}: {
  variant: ContextRefreshVariant;
  redacted: boolean;
}) {
  const generatedAt = new Date();
  const writingSummaries = await loadWritingSummaries();
  const tinyThoughts = await loadTinyThoughts();
  const projects = await getContextRefreshProjects();
  const lines: string[] = [
    frontMatter({ generatedAt, variant, redacted }),
    "",
    "# Context Refresh Export",
    "",
    `Generated for ${staticProfile.preferredName} from ArcadeGhosts. Export mode: ${variantLabels[variant]}.`,
    "",
    "## What changed since last export",
    "- Fill this in after editing. Include new projects, decisions, life updates, preferences, or anything ChatGPT should stop assuming.",
    "",
    "## Current priorities (June 2026)",
    numberedItems(currentPriorities),
    "",
    "## Current challenges",
    listItems(currentChallenges),
    "",
    "## Recent decisions",
    ...recentDecisions.flatMap((entry) => [
      entry.date,
      ...entry.decisions.map((decision) => `- ${decision}`),
      "",
    ]),
    "## Common incorrect assumptions",
    listItems(commonIncorrectAssumptions),
    "",
    "## How to use this",
    `- ${variantGuidance(variant)}`,
    "- Treat this as user-authored context, but ask before relying on anything sensitive or ambiguous.",
    "- Prefer specific, practical help with a warm, curious style.",
    "",
    "## Profile",
    `- Name: ${staticProfile.name}`,
    `- Preferred name: ${staticProfile.preferredName}`,
    `- Age: ${staticProfile.age}`,
    `- General region: ${redacted ? staticProfile.region : staticProfile.region}`,
    `- Personal site/project hub: ${staticProfile.site}`,
    "",
    "## Privacy and redaction",
    `- Redaction enabled: ${redacted ? "yes" : "no"}`,
    `- ${redacted ? redactionNote : "This export may include personal context. Do not include passwords, API keys, private addresses, or details that should not be pasted into a chat."}`,
    "",
    "## About Jason",
    listItems(aboutSummary),
    "",
    "## Dating and social context",
    listItems(datingAndSocialContext),
    "",
  ];

  if (includeForVariant(variant, "favorites")) {
    lines.push(
      "## Favorites and recurring interests",
      "",
      "### Arcade games",
      listItems(arcadeGames.map((game) => game.title)),
      "",
      "### Movies and TV shows",
      listItems(visualMedia.map((item) => item.title)),
      "",
      "### Music signals",
      listItems(music),
      "",
    );
  }

  if (includeForVariant(variant, "projects")) {
    lines.push(
      "## Ongoing projects",
      "",
      ...projects.flatMap((project) => [
        `### ${project.title}`,
        `- Type: ${project.type}`,
        `- Description: ${project.description}`,
        `- Project Status: ${project.status}`,
        `- Project Priority: ${projectPriorityLabel(project.priority)}`,
        `- Current Phase: ${project.phase || "Not specified"}`,
        `- Next Action: ${project.nextAction || "Not specified"}`,
        ...projectBlockerLines(project.blockers),
        project.href ? `- Link: ${project.href}` : "",
        "",
      ].filter((line): line is string => Boolean(line))),
    );
  }

  if (includeForVariant(variant, "technical")) {
    lines.push(
      "## Technical context",
      "- Stack: Next.js App Router, React, TypeScript, Neon Postgres, Vercel Blob, Resend, Vercel hosting.",
      `- Main repo: ${staticProfile.githubRepo}`,
      "- Current site admin tools include Guestbook moderation, Tiny Thoughts publishing, and this Context Refresh Export editor.",
      "- Preference: pragmatic implementation, close fit with existing code patterns, careful verification, and useful automation without overbuilding.",
      "",
    );
  }

  if (includeForVariant(variant, "creative")) {
    lines.push(
      "## Writing excerpts",
      "",
      ...writingSummaries.flatMap((writing) => [
        `### ${writing.title}`,
        `- Description: ${writing.description}`,
        `- Link: ${writing.link}`,
        writing.excerpt ? `- Excerpt: ${writing.excerpt}${writing.excerpt.length >= 620 ? "..." : ""}` : "",
        "",
      ]),
    );
  }

  if (tinyThoughts.length && variant !== "dating-social") {
    lines.push(
      "## Recent Tiny Thoughts",
      "",
      ...tinyThoughts.flatMap((thought) => [
        `- ${thought.content}`,
        thought.inspiredBy
          ? `  Inspired by ${thought.inspiredByCategory}: ${thought.inspiredBy}`
          : "",
      ].filter(Boolean)),
      "",
    );
  }

  lines.push(
    "## Conversation guidance",
    "- Do: be warm, specific, thoughtful, practical, and willing to ask sharp clarifying questions.",
    "- Do: preserve Jason's voice when helping with writing, dating messages, product ideas, and code.",
    "- Do: notice patterns across projects, music, nostalgia, cats, technology, and personal growth.",
    "- Avoid: bland motivational filler, overconfident assumptions, generic advice, and flattening weird or personal details into something ordinary.",
    "- Assume: Jason appreciates curiosity, emotional nuance, humor with a little bite, and technical competence.",
    "- Ask me when: stakes are personal, details are missing, privacy matters, or there are multiple plausible directions.",
    "",
    "## Open editing notes",
    "- Add project-specific status and open questions.",
    "- Add anything important that is not represented on the public website.",
  );

  return lines.filter((line, index, all) => {
    return !(line === "" && all[index - 1] === "" && all[index - 2] === "");
  }).join("\n");
}

export async function createContextRefreshExport({
  variant,
  redacted,
}: {
  variant: ContextRefreshVariant;
  redacted: boolean;
}) {
  const content = await buildContextRefreshContent({ variant, redacted });
  const sql = getGuestbookSql();
  const rows = await sql`
    INSERT INTO context_refresh_exports (
      id,
      filename,
      variant,
      redacted,
      content,
      word_count
    )
    VALUES (
      ${randomUUID()},
      ${contextRefreshFilename()},
      ${variant},
      ${redacted},
      ${content},
      ${countContextRefreshWords(content)}
    )
    RETURNING
      id,
      filename,
      variant,
      redacted,
      content,
      word_count,
      created_at,
      updated_at,
      saved_at
  `;

  return toContextRefreshExport((rows as ContextRefreshExportRow[])[0]);
}
