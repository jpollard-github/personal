export type AnalyticsValue = string | number | boolean | null;

export type AnalyticsProperties = Record<string, AnalyticsValue>;

function normalizeString(value: string) {
  return value.trim().slice(0, 255);
}

export function normalizeAnalyticsEventName(value: string) {
  return normalizeString(value) || "Unknown Event";
}

export function normalizeAnalyticsProperties(
  value: Record<string, unknown> | undefined,
  maxProperties = 2,
): AnalyticsProperties | undefined {
  if (!value) {
    return undefined;
  }

  const entries = Object.entries(value)
    .map(([key, propertyValue]) => {
      const normalizedKey = normalizeString(key);

      if (!normalizedKey) {
        return null;
      }

      if (
        typeof propertyValue === "string" ||
        typeof propertyValue === "number" ||
        typeof propertyValue === "boolean" ||
        propertyValue === null
      ) {
        return [
          normalizedKey,
          typeof propertyValue === "string"
            ? normalizeString(propertyValue)
            : propertyValue,
        ] as const;
      }

      return null;
    })
    .filter((entry): entry is readonly [string, AnalyticsValue] => Boolean(entry));

  return entries.length ? Object.fromEntries(entries.slice(0, maxProperties)) : undefined;
}
