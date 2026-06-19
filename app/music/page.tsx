import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../SectionHeading";
import { music } from "../music-data";
import { musicInsights } from "../music-insights-data";

export const metadata: Metadata = {
  title: "Music, Playlists, and Music League",
  description:
    "Jason Pollard's listening room: synths, late-night tenderness, Spotify playlists, Music League, and songs for fluorescent weather.",
  alternates: {
    canonical: "/music",
  },
  openGraph: {
    title: "Music, Playlists, and Music League",
    description:
      "Synths, late-night tenderness, Spotify playlists, Music League, and songs for fluorescent weather.",
    url: "/music",
  },
};

export default function MusicPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/#about">
        Back Home
      </Link>
      <section className="content-section music-section collection-section">
        <SectionHeading eyebrow="Music" title="Songs for fluorescent weather.">
          Synths, small rituals, late-night tenderness, and melodies that look
          directly at the void before asking whether it wants fries.
        </SectionHeading>
        <section className="music-console" aria-labelledby="music-console-title">
          <div className="music-console-copy">
            <p className="music-console-kicker">Listening Memory Console</p>
            <h3 id="music-console-title">A private archive, tuned into public weather.</h3>
            <p>
              {formatHours(musicInsights.summary.totalHours)} hours across{" "}
              {formatNumber(musicInsights.summary.totalStreams)} plays from{" "}
              {musicInsights.sourceRange}. The rankings below favor time spent,
              so long obsessions get the gravity they deserve.
            </p>
          </div>
          <dl className="music-stat-grid" aria-label="Spotify listening summary">
            <StatCard label="Total hours" value={formatHours(musicInsights.summary.totalHours)} />
            <StatCard label="Total plays" value={formatNumber(musicInsights.summary.totalStreams)} />
            <StatCard
              label="Peak year"
              value={`${musicInsights.summary.peakYear}`}
              detail={`${formatHours(musicInsights.summary.peakYearHours)}h`}
            />
            <StatCard
              label="Genre matches"
              value={`${musicInsights.summary.genreMatches}/${musicInsights.summary.genreCandidates}`}
            />
          </dl>
        </section>

        <section className="music-insight-band" aria-labelledby="music-current-title">
          <InsightHeading
            eyebrow="Current Signal"
            id="music-current-title"
            title="The recent room is brighter, glossier, and still carrying a little voltage."
          >
            Top artists, songs, and albums from {formatShortDate(musicInsights.recentWindow.start)} to{" "}
            {formatShortDate(musicInsights.recentWindow.end)}, ranked by play count with time as the tie-breaker.
          </InsightHeading>
          <div className="music-rank-grid">
            <RankPanel title="Artists" items={musicInsights.recentRankings.artists} />
            <RankPanel title="Songs" items={musicInsights.recentRankings.songs} />
            <RankPanel title="Albums" items={musicInsights.recentRankings.albums} />
          </div>
        </section>

        <section className="music-insight-band" aria-labelledby="music-timeline-title">
          <InsightHeading
            eyebrow="Signal History"
            id="music-timeline-title"
            title="Years, months, and a few loud spikes in the archive."
          >
            A compact view of listening hours over time, plus the biggest months in the export.
          </InsightHeading>
          <div className="music-timeline-grid">
            <div className="music-panel">
              <h3>Yearly Signal</h3>
              <div className="year-signal-grid">
                {musicInsights.yearlySignal.map((year) => (
                  <div className="year-signal" key={year.year}>
                    <span>{year.year}</span>
                    <div className="signal-meter" aria-label={`${year.year}: ${year.hours} hours`}>
                      <span style={barStyle(percent(year.hours, musicInsights.summary.peakYearHours))} />
                    </div>
                    <strong>{formatHours(year.hours)}h</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="music-panel">
              <h3>Recent Months</h3>
              <div className="month-signal-strip" aria-label="Latest 36 monthly listening totals">
                {musicInsights.recentMonths.map((month) => (
                  <span
                    aria-label={`${month.month}: ${month.hours} hours`}
                    key={month.month}
                    style={barStyle(percent(month.hours, maxHours(musicInsights.recentMonths)))}
                    title={`${month.month}: ${month.hours}h`}
                  />
                ))}
              </div>
              <div className="peak-month-list">
                {musicInsights.peakMonths.map((month) => (
                  <p key={month.month}>
                    <strong>{month.month}</strong>
                    <span>
                      {formatHours(month.hours)}h / {formatNumber(month.streams)} plays
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="music-insight-band" aria-labelledby="music-genre-title">
          <InsightHeading
            eyebrow="Genre Weather"
            id="music-genre-title"
            title="A tag cloud with metal weather systems and ambient pressure fronts."
          >
            Last.fm tags weighted by listening time for the top Spotify artists that could be matched.
          </InsightHeading>
          <div className="genre-weather-grid">
            {musicInsights.genres.map((genre) => (
              <article className="genre-weather-card" key={genre.name}>
                <h3>{titleCase(genre.name)}</h3>
                <div className="signal-meter">
                  <span style={barStyle(percent(genre.hours, musicInsights.genres[0].hours))} />
                </div>
                <p>
                  {formatHours(genre.hours)}h across {formatNumber(genre.artists)} artists
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="music-insight-band" aria-labelledby="music-era-title">
          <InsightHeading
            eyebrow="Eras"
            id="music-era-title"
            title="Chapters where one sound briefly ran the building."
          >
            These are the months where an artist, album, or genre suddenly dominated the listening archive.
          </InsightHeading>
          <div className="music-era-grid">
            {musicInsights.eras.map((era) => (
              <article className="music-era-card" key={`${era.title}-${era.period}`}>
                <div className="music-era-meta">
                  <span>{era.period}</span>
                  <span>{era.type}</span>
                  <span>{era.metric}</span>
                  <span>{era.share}</span>
                </div>
                <h3>{era.title}</h3>
                <p>{era.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="music-insight-band" aria-labelledby="music-dna-title">
          <InsightHeading
            eyebrow="Musical DNA"
            id="music-dna-title"
            title="Foundations, growth arcs, disappearances, comforts, and discoveries."
          >
            Artist-level fingerprints from the full Spotify export.
          </InsightHeading>
          <div className="music-dna-grid">
            {musicInsights.musicalDna.map((panel) => (
              <RankPanel key={panel.title} title={panel.title} items={panel.items} />
            ))}
          </div>
        </section>

        <section className="music-insight-band" aria-labelledby="music-weather-title">
          <InsightHeading
            eyebrow="Emotional Color"
            id="music-weather-title"
            title="Mood reads, treated as texture rather than truth."
          >
            These summaries are interpretive pattern reads from genre tags and repeated listening, not claims about mental health.
          </InsightHeading>
          <div className="music-mood-grid">
            {musicInsights.moodReads.map((mood) => (
              <article className="music-mood-card" key={mood.title}>
                <h3>{mood.title}</h3>
                <strong>{mood.value}</strong>
                <p>{mood.description}</p>
                <div className="music-chip-row">
                  {mood.evidence.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="music-insight-band" aria-labelledby="music-leaders-title">
          <InsightHeading
            eyebrow="All-Time Leaders"
            id="music-leaders-title"
            title="The heavy shelves, ranked by hours."
          >
            These are secondary to the story sections, but still useful for the record.
          </InsightHeading>
          <div className="music-rank-grid">
            <RankPanel title="Artists" items={musicInsights.allTime.artists} />
            <RankPanel title="Songs" items={musicInsights.allTime.songs} />
            <RankPanel title="Albums" items={musicInsights.allTime.albums} />
          </div>
        </section>

        <section className="music-insight-band" aria-labelledby="music-fixation-title">
          <InsightHeading
            eyebrow="Fixations"
            id="music-fixation-title"
            title="Tiny oddities from repeat days, album weeks, and format gravity."
          >
            The little statistical artifacts where a listening habit stops being casual and starts glowing.
          </InsightHeading>
          <div className="music-fixation-grid">
            {musicInsights.fixations.map((item) => (
              <article className="music-fixation-card" key={item.title}>
                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <p>{item.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="tape-row">
          {music.map((playlist) => (
            <article className="tape" key={playlist.title}>
              <h3>{playlist.title}</h3>
              <iframe
                title={`${playlist.title} Spotify playlist`}
                src={playlist.embedUrl}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </article>
          ))}
        </div>
        <div className="music-league">
          <div>
            <h3>Music League</h3>
            <p>Music Leagues I&apos;ve either run or participated in.</p>
          </div>
          <div className="music-league-card">
            <a
              className="music-league-link"
              href="https://app.musicleague.com/user/8e855be976294ae0aedf7a0820572ffb/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Jason's Music League profile"
            >
              <Image
                src="/images/music-league.png"
                alt="Music League"
                fill
                sizes="(max-width: 860px) 100vw, 520px"
                className="music-league-image"
              />
            </a>
            <a
              className="music-league-profile"
              href="https://app.musicleague.com/user/8e855be976294ae0aedf7a0820572ffb/"
              target="_blank"
              rel="noreferrer"
            >
              View Profile
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

type RankItem = {
  name: string;
  value: string;
  meta: string;
};

function StatCard({
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

function InsightHeading({
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

function RankPanel({ items, title }: { items: readonly RankItem[]; title: string }) {
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatHours(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function maxHours(items: readonly { hours: number }[]) {
  return Math.max(...items.map((item) => item.hours), 1);
}

function percent(value: number, max: number) {
  return `${Math.max((value / max) * 100, 2).toFixed(2)}%`;
}

function barStyle(value: string): CSSProperties {
  return { "--value": value } as CSSProperties;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
