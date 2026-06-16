"use client";

import { useMemo, useState } from "react";
import {
  buildJourneyExportPayload,
  buildJourneyLlmPrompt,
  journeySteps,
  lodgeProblems,
  type JourneyChoice,
  type JourneySelectionIds,
} from "./journey-data";

type SelectionMap = Record<string, JourneyChoice>;

function classNames(...values: Array<string | false>) {
  return values.filter(Boolean).join(" ");
}

export function TwinPeaksSelfJourney() {
  const [problemId, setProblemId] = useState(lodgeProblems[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<SelectionMap>({});
  const [exportStatus, setExportStatus] = useState("");
  const problem = lodgeProblems.find((item) => item.id === problemId) ?? lodgeProblems[0];
  const step = journeySteps[stepIndex];
  const selectedChoice = selections[step.id];
  const isLastStep = stepIndex === journeySteps.length - 1;
  const progress = Math.round(((stepIndex + 1) / journeySteps.length) * 100);
  const pathSummary = useMemo(
    () =>
      journeySteps
        .map((journeyStep) => selections[journeyStep.id])
        .filter(Boolean),
    [selections],
  );
  const selectionIds = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selections).map(([stepId, choice]) => [stepId, choice.id]),
      ) as JourneySelectionIds,
    [selections],
  );
  const journeyExport = useMemo(
    () => buildJourneyExportPayload({ problemId, selections: selectionIds }),
    [problemId, selectionIds],
  );
  const journeyExportJson = useMemo(
    () => JSON.stringify(journeyExport, null, 2),
    [journeyExport],
  );
  const llmPrompt = useMemo(
    () => buildJourneyLlmPrompt(journeyExport),
    [journeyExport],
  );

  function selectProblem(nextProblemId: string) {
    setProblemId(nextProblemId);
    setStepIndex(0);
    setSelections({});
  }

  function selectChoice(choice: JourneyChoice) {
    setSelections((currentSelections) => ({
      ...currentSelections,
      [step.id]: choice,
    }));
  }

  function goNext() {
    if (stepIndex < journeySteps.length - 1) {
      setStepIndex((currentStep) => currentStep + 1);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex((currentStep) => currentStep - 1);
    }
  }

  function restart() {
    setStepIndex(0);
    setSelections({});
    setExportStatus("");
  }

  async function copyLlmPrompt() {
    try {
      await navigator.clipboard.writeText(llmPrompt);
      setExportStatus("LLM prompt copied.");
    } catch {
      setExportStatus("Unable to copy prompt. Select the text and copy it manually.");
    }
  }

  function downloadJourneyJson() {
    const blob = new Blob([journeyExportJson], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `lodges-within-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportStatus("Journey JSON downloaded.");
  }

  return (
    <div className="lodge-journey">
      <section className="lodge-problem-panel" aria-labelledby="problem-heading">
        <div>
          <p className="eyebrow">Entry point</p>
          <h2 id="problem-heading">Twenty doors into the woods.</h2>
          <p>
            Choose the symbolic version of the problem you are carrying today.
            The language is theatrical on purpose; it gives the issue a shape
            without reducing you to it.
          </p>
        </div>
        <div className="lodge-problem-grid" role="list">
          {lodgeProblems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={classNames(
                "lodge-problem-button",
                item.id === problem.id && "selected",
              )}
              onClick={() => selectProblem(item.id)}
            >
              <strong>{item.title}</strong>
              <span>{item.meaning}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="lodge-workspace" aria-label="Self-reflection journey">
        <aside className="lodge-case-file">
          <p className="eyebrow">Case file</p>
          <h2>{problem.title}</h2>
          <dl>
            <div>
              <dt>Twin Peaks frame</dt>
              <dd>{problem.twinPeaksFrame}</dd>
            </div>
            <div>
              <dt>Meaning</dt>
              <dd>{problem.meaning}</dd>
            </div>
            <div>
              <dt>Opening clue</dt>
              <dd>{problem.openingInsight}</dd>
            </div>
          </dl>
          <p className="lodge-note">
            This is a self-reflection tool, not therapy, diagnosis, or emergency
            support. If you may hurt yourself or someone else, contact emergency
            services or a crisis line now.
          </p>
        </aside>

        <div className="lodge-step-panel">
          <div className="lodge-progress" aria-label={`Step ${stepIndex + 1} of ${journeySteps.length}`}>
            <span>Step {stepIndex + 1} of {journeySteps.length}</span>
            <div>
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="lodge-step-heading">
            <p className="eyebrow">{step.title}</p>
            <h2>{step.question}</h2>
            <p>{step.explanation}</p>
          </div>

          <div className="lodge-choice-grid">
            {step.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={classNames(
                  "lodge-choice-card",
                  selectedChoice?.id === choice.id && "selected",
                )}
                onClick={() => selectChoice(choice)}
              >
                <span>{choice.twinPeaksItem}</span>
                <strong>{choice.label}</strong>
                <small>{choice.meaning}</small>
              </button>
            ))}
          </div>

          {selectedChoice ? (
            <div className="lodge-meaning-panel">
              <p className="eyebrow">What it means</p>
              <h3>{selectedChoice.twinPeaksItem}</h3>
              <p>{selectedChoice.meaning}</p>
              <p>{selectedChoice.guidance}</p>
            </div>
          ) : null}

          <div className="lodge-actions">
            <button type="button" onClick={goBack} disabled={stepIndex === 0}>
              Back
            </button>
            {!isLastStep ? (
              <button type="button" onClick={goNext} disabled={!selectedChoice}>
                Continue
              </button>
            ) : (
              <button type="button" onClick={restart}>
                Start Again
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="lodge-summary" aria-label="Journey summary">
        <div>
          <p className="eyebrow">Your path</p>
          <h2>The line you carry out of the woods.</h2>
          <p>
            This path is also available as structured data for a future LLM or
            agent flow.
          </p>
        </div>
        <ol>
          {pathSummary.map((choice, index) => (
            <li key={`${choice.id}-${index}`}>
              <span>{index + 1}</span>
              <div>
                <strong>{choice.label}</strong>
                <p>{choice.guidance}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lodge-export" aria-label="LLM export">
        <div>
          <p className="eyebrow">LLM-ready export</p>
          <h2>Make the selected path portable.</h2>
          <p>
            The JSON payload captures the selected problem, each symbolic choice,
            safety framing, and suggested output shape. The prompt is generated
            from the same payload.
          </p>
          <div className="lodge-export-actions">
            <button type="button" onClick={copyLlmPrompt} disabled={!pathSummary.length}>
              Copy LLM Prompt
            </button>
            <button
              type="button"
              onClick={downloadJourneyJson}
              disabled={!pathSummary.length}
            >
              Download JSON
            </button>
          </div>
          {exportStatus ? (
            <p className="lodge-export-status" aria-live="polite">
              {exportStatus}
            </p>
          ) : null}
        </div>
        <label>
          <span>Generated prompt</span>
          <textarea readOnly value={llmPrompt} />
        </label>
      </section>
    </div>
  );
}
