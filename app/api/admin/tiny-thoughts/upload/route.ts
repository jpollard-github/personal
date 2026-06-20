import { jsonError, requireAdminJson } from "../../../../lib/admin-route";
import { hasBlobWriteAccess, putTinyThoughtBlob } from "../../../../lib/blob";
import {
  createImageUploadPath,
  toUploadBuffer,
  validateImageUpload,
} from "../../../../lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  if (!hasBlobWriteAccess()) {
    return jsonError("Blob storage is not configured for this environment.", 500);
  }

  try {
    const formData = await request.formData();
    const validation = validateImageUpload(formData.get("file"), {
      label: "Tiny Thoughts images",
    });

    if (!validation.ok) {
      return jsonError(validation.error, 400);
    }

    const file = validation.file;
    const buffer = await toUploadBuffer(file);
    const pathname = createImageUploadPath("tiny-thoughts", file);
    const blob = await putTinyThoughtBlob(pathname, buffer, {
      access: "public",
      contentType: file.type,
    });

    return Response.json({
      ok: true,
      attachment: {
        type: "image",
        url: blob.url,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Tiny Thoughts Blob upload error.";

    console.error("Tiny Thoughts Blob upload failed", {
      message,
      error,
    });

    return jsonError(
      process.env.NODE_ENV === "production"
        ? "Image could not be uploaded."
        : `Image could not be uploaded. ${message}`,
      500,
    );
  }
}
