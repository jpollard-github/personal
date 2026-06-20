import type { CSSProperties, ReactNode } from "react";

export type RankItem = {
  name: string;
  value: string;
  meta: string;
};

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
      {detail ? <p>{detail}</p> : null}
    </div>
  );
}

export function InsightHeading({
  children,
  eyebrow,
  id,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <div className="music-insight-heading">
      <p>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <span>{children}</span>
    </div>
  );
}

export function RankPanel({
  items,
  title,
}: {
  items: readonly RankItem[];
  title: string;
}) {
  return (
    <article className="music-rank-panel">
      <h3>{title}</h3>
      <ol>
        {items.map((item, index) => (
          <li key={`${title}-${item.name}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.name}</strong>
            <em>{item.value}</em>
            <small>{item.meta}</small>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatHours(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function maxHours(items: readonly { hours: number }[]) {
  return Math.max(...items.map((item) => item.hours), 1);
}

export function percent(value: number, max: number) {
  return `${Math.max((value / max) * 100, 2).toFixed(2)}%`;
}

export function barStyle(value: string): CSSProperties {
  return { "--value": value } as CSSProperties;
}

export function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
