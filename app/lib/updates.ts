import { stat } from "node:fs/promises";
import path from "node:path";
import { writings } from "../writings";
import { getPublicTinyThoughts, type TinyThought } from "./tiny-thoughts";

export type UpdateItem =
  | {
      id: string;
      type: "writing";
      title: string;
      description: string;
      href: string;
      createdAt: string;
      eyebrow: string;
    }
  | {
      id: string;
      type: "tiny-thought";
      title: string;
      description: string;
      href: string;
      createdAt: string;
      eyebrow: string;
      thought: TinyThought;
    };

function summarizeThought(content: string) {
  const compact = content.replace(/\s+/g, " ").trim();

  if (compact.length <= 220) {
    return compact;
  }

  return `${compact.slice(0, 217).trimEnd()}...`;
}

export async function getWritingUpdates() {
  const items = await Promise.all(
    writings.map(async (writing) => {
      const filePath = path.join(process.cwd(), "public", "writings", `${writing.slug}.md`);
      const fileStat = await stat(filePath);

      return {
        id: `writing-${writing.slug}`,
        type: "writing" as const,
        title: writing.title,
        description: writing.description,
        href: `/writings/${writing.slug}`,
        createdAt: fileStat.mtime.toISOString(),
        eyebrow: "Writing",
      };
    }),
  );

  return items;
}

export async function getTinyThoughtUpdates(limit = 24) {
  const thoughts = await getPublicTinyThoughts(limit).catch(() => []);

  return thoughts.map((thought) => ({
    id: `tiny-thought-${thought.id}`,
    type: "tiny-thought" as const,
    title: summarizeThought(thought.content).slice(0, 88),
    description: summarizeThought(thought.content),
    href: `/#tiny-thought-${thought.id}`,
    createdAt: thought.createdAt,
    eyebrow: "Tiny Thought",
    thought,
  }));
}

export async function getSiteUpdates(limit = 32) {
  const [writingUpdates, tinyThoughtUpdates] = await Promise.all([
    getWritingUpdates(),
    getTinyThoughtUpdates(limit),
  ]);

  return [...writingUpdates, ...tinyThoughtUpdates]
    .sort((left, right) => +new Date(right.createdAt) - +new Date(left.createdAt))
    .slice(0, limit);
}
