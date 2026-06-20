import type { TinyThoughtCategory, TinyThoughtInspiredByCategory } from "./tiny-thoughts";

export const tinyThoughtCategoryLabels = new Map<TinyThoughtCategory, string>([
  ["lesson", "Lesson learned"],
  ["observation", "Observation"],
  ["funny", "Funny experience"],
  ["opinion", "Opinion"],
  ["arcade", "Arcade"],
  ["music", "Music"],
  ["cat", "Cat"],
  ["twin-peaks", "Twin Peaks"],
  ["other", "Other"],
]);

export const tinyThoughtInspiredByLabels = new Map<TinyThoughtInspiredByCategory, string>([
  ["article-link", "Article link"],
  ["song", "Song"],
  ["video", "Video"],
  ["conversation", "Conversation"],
  ["other", "Other"],
]);

export function getUrlHost(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

export function renderLinkedText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s<>"']+)/g);

  return parts.map((part, index) => {
    if (!/^https?:\/\//.test(part)) {
      return part;
    }

    try {
      const url = new URL(part);

      return (
        <a key={`${part}-${index}`} href={url.toString()} target="_blank" rel="noreferrer">
          {url.hostname.replace(/^www\./, "")}
        </a>
      );
    } catch {
      return part;
    }
  });
}

export function formatTinyThoughtDate(value: string, withTime = false) {
  return new Intl.DateTimeFormat(
    "en",
    withTime
      ? {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      : {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
  ).format(new Date(value));
}
