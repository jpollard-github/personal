import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedSignals } from "../../RelatedSignals";
import { writings } from "../../writings";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getWriting(slug: string) {
  return writings.find((writing) => writing.slug === slug);
}

async function getMarkdown(slug: string) {
  const writing = getWriting(slug);

  if (!writing) {
    notFound();
  }

  return readFile(
    path.join(process.cwd(), "public", "writings", `${writing.slug}.md`),
    "utf8",
  );
}

function parseMarkdown(markdown: string, fallbackTitle: string) {
  const normalized = markdown.trim().replace(/\r\n/g, "\n");
  const titleMatch = normalized.match(/^\*\*(.+?)\*\*\s*\n/);
  const title = titleMatch?.[1] ?? fallbackTitle;
  const body = titleMatch ? normalized.slice(titleMatch[0].length).trim() : normalized;

  return {
    title,
    blocks: body.split(/\n{2,}/).map((block) => block.trim()),
  };
}

function renderInline(text: string) {
  const cleanText = text.replace(/\\([*\\-])/g, "$1");
  const parts = cleanText.split(/(?<!\\)\*([^*]+)(?<!\\)\*/g);

  return parts.map((part, index) =>
    index % 2 === 1 ? <em key={`${part}-${index}`}>{part}</em> : part,
  );
}

export function generateStaticParams() {
  return writings.map((writing) => ({
    slug: writing.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWriting(slug);

  if (!writing) {
    return {
      title: "Writing",
      description: "Essays and short writing from Jason Pollard on ArcadeGhosts.",
    };
  }

  return {
    title: writing.title,
    description: writing.description,
    alternates: {
      canonical: `/writings/${writing.slug}`,
    },
    openGraph: {
      type: "article",
      title: writing.title,
      description: writing.description,
      url: `/writings/${writing.slug}`,
      authors: ["Jason Pollard"],
    },
  };
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const writing = getWriting(slug);

  if (!writing) {
    notFound();
  }

  const markdown = await getMarkdown(slug);
  const article = parseMarkdown(markdown, writing.title);

  return (
    <main className="writing-page">
      <article className="writing-article">
        <Link className="back-link" href="/#writing">
          Back to Writing
        </Link>
        <p className="eyebrow">
          <span aria-hidden="true">{writing.icon}</span> Writing
        </p>
        <h1>{article.title}</h1>
        <div className="writing-body">
          {article.blocks.map((block) => {
            if (block.startsWith(">")) {
              const quote = block
                .split("\n")
                .map((line) => line.replace(/^>\s?/, ""))
                .join(" ");

              return <blockquote key={block}>{renderInline(quote)}</blockquote>;
            }

            return <p key={block}>{renderInline(block.replace(/\n/g, " "))}</p>;
          })}
        </div>
        <RelatedSignals items={writing.related} />
      </article>
    </main>
  );
}
