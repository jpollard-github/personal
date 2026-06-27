"use client";

import { useMemo, useState } from "react";
import { TrackedLink } from "../TrackedLink";
import { trackEvent } from "../lib/analytics";
import { terminalCommands, terminalProfileLines } from "./terminal-data";

type HistoryEntry = {
  command: string;
  lines: string[];
  href?: string;
  linkLabel?: string;
  isError?: boolean;
};

const availableCommands = [
  "help",
  "reset",
  ...terminalCommands.map((item) => item.command),
];

function createHelpEntry(): HistoryEntry {
  return {
    command: "help",
    lines: [
      "Available commands:",
      availableCommands.join("  "),
    ],
  };
}

const initialHistory: HistoryEntry[] = [
  {
    command: "load profile",
    lines: [...terminalProfileLines],
  },
];

function createInitialHistory() {
  return initialHistory.map((entry) => ({
    ...entry,
    lines: [...entry.lines],
  }));
}

export function HomeDevTerminal() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>(createInitialHistory);

  const commandMap = useMemo(
    () => new Map(terminalCommands.map((item) => [item.command, item])),
    [],
  );

  function resetTerminal() {
    setHistory(createInitialHistory());
    setCommand("");
  }

  function runCommand(rawValue: string) {
    const normalizedCommand = rawValue.trim().toLowerCase();

    if (!normalizedCommand) {
      return;
    }

    if (normalizedCommand === "help") {
      trackEvent("Terminal Command Run", { command: normalizedCommand, outcome: "help" });
      setHistory((currentHistory) => [...currentHistory, createHelpEntry()]);
      setCommand("");
      return;
    }

    if (normalizedCommand === "reset") {
      trackEvent("Terminal Command Run", { command: normalizedCommand, outcome: "reset" });
      resetTerminal();
      return;
    }

    const match = commandMap.get(normalizedCommand);

    if (match) {
      trackEvent("Terminal Command Run", {
        command: normalizedCommand,
        outcome: "known",
        hasLink: Boolean(match.href),
      });
      setHistory((currentHistory) => [
        ...currentHistory,
        {
          command: normalizedCommand,
          lines: match.responseLines,
          href: match.href,
          linkLabel: match.linkLabel,
        },
      ]);
      setCommand("");
      return;
    }

    trackEvent("Terminal Command Run", { command: normalizedCommand, outcome: "unknown" });
    setHistory((currentHistory) => [
      ...currentHistory,
      {
        command: normalizedCommand,
        lines: [
          `Unknown command: ${normalizedCommand}`,
          "Type help to see the available commands.",
        ],
        isError: true,
      },
    ]);
    setCommand("");
  }

  return (
    <section className="hero-terminal" aria-label="80s developer terminal">
      <div className="hero-terminal-toolbar">
        <button type="button" onClick={resetTerminal} className="hero-terminal-reset">
          RESET
        </button>
      </div>

      <div className="hero-terminal-header">
        <p className="hero-terminal-title">80s Dev Terminal</p>
        <p className="hero-terminal-instructions">
          Type <code>help</code> for commands.
        </p>
      </div>

      <div className="hero-terminal-screen">
        <div className="hero-terminal-chrome" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="hero-terminal-history">
          {history.map((entry, index) => (
            <div className="hero-terminal-entry" key={`${entry.command}-${index}`}>
              <p className="hero-terminal-command">
                <span className="hero-terminal-prompt">&gt;</span> {entry.command}
              </p>
              <div className="hero-terminal-response">
                {entry.lines.map((line) => (
                  <p
                    className={entry.isError ? "hero-terminal-error" : undefined}
                    key={`${entry.command}-${line}`}
                  >
                    {line}
                  </p>
                ))}
                {entry.href && entry.linkLabel ? (
                  <TrackedLink
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    trackingEvent="Terminal Link Clicked"
                    trackingProperties={{
                      destination: entry.href,
                      command: entry.command,
                    }}
                  >
                    {entry.linkLabel}
                  </TrackedLink>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <form
          className="hero-terminal-form"
          onSubmit={(event) => {
            event.preventDefault();
            runCommand(command);
          }}
        >
          <label className="hero-terminal-input-row">
            <span className="hero-terminal-prompt" aria-hidden="true">
              &gt;
            </span>
            <span className="sr-only">Terminal command</span>
            <input
              aria-label="Terminal command"
              type="text"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              placeholder="help"
            />
          </label>
        </form>
      </div>
    </section>
  );
}
