import { del, put } from "@vercel/blob";

type PutBlobOptions = Parameters<typeof put>[2];

function withLocalReadWriteToken<T extends object>(options: T): T & { token?: string } {
  if (process.env.NODE_ENV !== "development" || !process.env.BLOB_READ_WRITE_TOKEN) {
    return options as T & { token?: string };
  }

  return {
    ...options,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  };
}

export function putTinyThoughtBlob(
  pathname: string,
  body: Parameters<typeof put>[1],
  options: PutBlobOptions,
) {
  return put(pathname, body, withLocalReadWriteToken(options));
}

export function deleteTinyThoughtBlobs(urls: string[]) {
  return del(urls, withLocalReadWriteToken({}));
}
