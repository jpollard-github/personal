import { jsonError, requireAdminJson } from "../../../../lib/admin-route";
import { hasBlobWriteAccess, putProjectBlob } from "../../../../lib/blob";
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
      label: "Project images",
    });

    if (!validation.ok) {
      return jsonError(validation.error, 400);
    }

    const file = validation.file;
    const buffer = await toUploadBuffer(file);
    const pathname = createImageUploadPath("projects", file);
    const blob = await putProjectBlob(pathname, buffer, {
      access: "public",
      contentType: file.type,
    });

    return Response.json({
      ok: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown project Blob upload error.";

    console.error("Project Blob upload failed", {
      message,
      error,
    });

    return jsonError(
      process.env.NODE_ENV === "production"
        ? "Project image could not be uploaded."
        : `Project image could not be uploaded. ${message}`,
      500,
    );
  }
}
