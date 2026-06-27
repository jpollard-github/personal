import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  jsonError,
  parseJsonBody,
  requireAdminJson,
  routeFailure,
} from "../../../../lib/admin-route";
import {
  createWritingDraftPublishBundle,
  normalizeWritingDraftSlug,
  normalizeWritingDraftText,
} from "../../../../lib/writing-drafts";

export const runtime = "nodejs";

function normalizePublishDraft(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const title = normalizeWritingDraftText(candidate.title, 180);
  const slug = normalizeWritingDraftSlug(candidate.slug || candidate.title);
  const summary = normalizeWritingDraftText(candidate.summary, 400);
  const body = normalizeWritingDraftText(candidate.body, 16000);

  if (!title || !slug || !body) {
    return null;
  }

  return {
    title,
    slug,
    summary,
    body,
  };
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const draft = normalizePublishDraft(body.draft);
    const overwrite = body.overwrite === true;

    if (!draft) {
      return jsonError("Title, slug, and body are required before exporting a writing.", 400);
    }

    const markdownPath = path.join(process.cwd(), "public", "writings", `${draft.slug}.md`);
    const writingsFilePath = path.join(process.cwd(), "app", "writings.ts");
    const bundle = createWritingDraftPublishBundle(draft);

    const existingMarkdown = await readFile(markdownPath, "utf8").catch(() => "");

    if (existingMarkdown && !overwrite) {
      return jsonError(
        `A writing markdown file already exists at public/writings/${draft.slug}.md. Use overwrite if you want to replace it.`,
        409,
      );
    }

    await writeFile(markdownPath, bundle.markdown, "utf8");

    const writingsFile = await readFile(writingsFilePath, "utf8").catch(() => "");
    const entryExists =
      writingsFile.includes(`slug: "${draft.slug}"`) ||
      writingsFile.includes(`slug: '${draft.slug}'`);

    return Response.json({
      ok: true,
      slug: draft.slug,
      description: bundle.description,
      markdownPath: `public/writings/${draft.slug}.md`,
      metadataPath: "app/writings.ts",
      entrySnippet: bundle.entrySnippet,
      entryExists,
      overwritten: Boolean(existingMarkdown),
    });
  } catch (error) {
    return routeFailure(
      "Admin writing drafts publish POST failed",
      "Writing export could not be prepared.",
      error,
    );
  }
}
