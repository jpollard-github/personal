import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { putTinyThoughtBlob } from "../../../../lib/blob";

export const runtime = "nodejs";

const maxImageBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function fileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/")[1] || "image";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Admin login required." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured." },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Choose an image file to upload." }, { status: 400 });
    }

    if (!allowedImageTypes.has(file.type)) {
      return Response.json(
        { error: "Tiny Thoughts images must be PNG, JPG, GIF, or WebP." },
        { status: 400 },
      );
    }

    if (file.size > maxImageBytes) {
      return Response.json(
        { error: "Tiny Thoughts images must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const pathname = `tiny-thoughts/${randomUUID()}.${fileExtension(file)}`;
    const blob = await putTinyThoughtBlob(pathname, file, {
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
    console.error("Tiny Thoughts Blob upload failed", error);
    return Response.json(
      { error: "Image could not be uploaded." },
      { status: 500 },
    );
  }
}
