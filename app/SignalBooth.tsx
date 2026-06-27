"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  getSignalBoothOptionsForMode,
  signalBoothModes,
  type SignalBoothMode,
} from "./signal-booth-data";

function randomIndex(length: number, except: number) {
  if (length < 2) {
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * length);

  while (nextIndex === except) {
    nextIndex = Math.floor(Math.random() * length);
  }

  return nextIndex;
}

export function SignalBooth() {
  const [activeMode, setActiveMode] = useState<SignalBoothMode>("random");
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredSignals = useMemo(
    () => getSignalBoothOptionsForMode(activeMode),
    [activeMode],
  );
  const safeActiveIndex =
    filteredSignals.length > 0 ? Math.min(activeIndex, filteredSignals.length - 1) : 0;
  const activeSignal = filteredSignals[safeActiveIndex];
  const signalNumber = String(safeActiveIndex + 1).padStart(3, "0");

  if (!activeSignal) {
    return null;
  }

  return (
    <div className="signal-booth-machine">
      <div className="signal-booth-display">
        <Image
          src={activeSignal.image}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 860px) 100vw, 520px"
          className="signal-booth-image"
        />
        <div className="signal-booth-overlay" />
      </div>

      <div className="signal-booth-panel">
        <div className="signal-booth-meta">
          <span>Signal {signalNumber}</span>
          <span>{filteredSignals.length} options online</span>
        </div>
        <label className="signal-booth-mode">
          <span>Mode</span>
          <select
            value={activeMode}
            onChange={(event) => {
              setActiveMode(event.target.value as SignalBoothMode);
              setActiveIndex(0);
            }}
          >
            {signalBoothModes.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>
        <h3>{activeSignal.title}</h3>
        <p>{activeSignal.prompt}</p>
        <div className="signal-booth-action">{activeSignal.action}</div>
        <div className="signal-booth-tags" aria-label="Signal tags">
          {activeSignal.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <button
          className="signal-booth-button"
          type="button"
          onClick={() =>
            setActiveIndex((current) => randomIndex(filteredSignals.length, current))
          }
        >
          Tune Another Signal
        </button>
      </div>
    </div>
  );
}
