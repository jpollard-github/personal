export const projectStatusLabels = new Map([
  ["active", "Active"],
  ["planning", "Planning"],
  ["paused", "Paused"],
  ["shipped", "Shipped"],
  ["archived", "Archived"],
]);

export function projectCta(href: string) {
  if (!href) {
    return "";
  }

  try {
    const url = new URL(href);

    return url.hostname === "github.com" ? "View Repo" : "Visit";
  } catch {
    return href.startsWith("/games/") ? "Play" : "Open";
  }
}

export function formatProjectDate(value: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
