import { musicInsights } from "../music-insights-data";
import {
  InsightHeading,
  barStyle,
  formatHours,
  formatNumber,
  maxHours,
  percent,
} from "./shared";

export function MusicSignalHistory() {
  return (
    <section className="music-insight-band" aria-labelledby="music-timeline-title">
      <InsightHeading
        eyebrow="Signal History"
        id="music-timeline-title"
        title="Years, months, and a few loud spikes in the archive."
      >
        A compact view of listening hours over time, plus the biggest months in
        the export.
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
          <h3>Monthly Pulse</h3>
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
  );
}
