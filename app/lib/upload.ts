import { randomUUID } from "crypto";

const DEFAULT_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_ALLOWED_IMAGE_TYPES = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type ValidateImageUploadOptions = {
  allowedTypes?: ReadonlySet<string>;
  label: string;
  maxBytes?: number;
};

export function fileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/")[1] || "image";
}

export function createImageUploadPath(scope: string, file: File) {
  return `${scope}/${randomUUID()}.${fileExtension(file)}`;
}

export async function toUploadBuffer(file: File) {
  return Buffer.from(await file.arrayBuffer());
}

export function validateImageUpload(
  file: unknown,
  {
    allowedTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
    label,
    maxBytes = DEFAULT_MAX_IMAGE_BYTES,
  }: ValidateImageUploadOptions,
):
  | { ok: true; file: File }
  | { ok: false; error: string } {
  if (!(file instanceof File)) {
    return { ok: false, error: "Choose an image file to upload." };
  }

  if (!allowedTypes.has(file.type)) {
    return {
      ok: false,
      error: `${label} must be PNG, JPG, GIF, or WebP.`,
    };
  }

  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `${label} must be 5 MB or smaller.`,
    };
  }

  return { ok: true, file };
}
