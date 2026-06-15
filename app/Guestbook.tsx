"use client";

import { useEffect, useState } from "react";
import type { GuestbookEntry } from "./lib/guestbook";

const categoryOptions = [
  { value: "music", label: "Music recommendation" },
  { value: "arcade", label: "Arcade memory" },
  { value: "cat", label: "Cat story" },
  { value: "twin-peaks", label: "Twin Peaks note" },
  { value: "site-note", label: "Site note" },
  { value: "other", label: "Something else" },
];

const categoryLabels = new Map(categoryOptions.map((category) => [category.value, category.label]));
const maxMessageLength = 500;

type PendingGuestbookSubmission = {
  name: string;
  email: string;
  category: string;
  message: string;
  website: string;
};

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [status, setStatus] = useState("Loading recent signals...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<PendingGuestbookSubmission | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      const response = await fetch("/api/guestbook");

      if (!response.ok) {
        throw new Error("Unable to load guestbook");
      }

      const data = (await response.json()) as { entries: GuestbookEntry[] };

      if (isMounted) {
        setEntries(data.entries);
        setStatus(data.entries.length ? "" : "No notes yet. The booth is waiting.");
      }
    }

    loadEntries().catch(() => {
      if (isMounted) {
        setStatus("Guestbook entries will appear once the database is connected.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function getSubmissionFromForm(form: HTMLFormElement): PendingGuestbookSubmission {
    const formData = new FormData(form);

    return {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      category: String(formData.get("category") ?? "other"),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
    };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const submission = getSubmissionFromForm(event.currentTarget);

    if (!submission.name) {
      setStatus("Add a name before sending your signal.");
      return;
    }

    if (submission.message.length < 3) {
      setStatus("Leave a little more of a signal before sending.");
      return;
    }

    if (submission.message.length > maxMessageLength) {
      setStatus(`Keep your signal to ${maxMessageLength} characters or fewer.`);
      return;
    }

    setPendingSubmission(submission);
    setStatus("Preview your signal, then submit it for admin approval.");
  }

  async function submitForApproval(form: HTMLFormElement) {
    if (!pendingSubmission) {
      setStatus("Preview your signal before submitting it.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Sending your signal for approval...");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingSubmission),
      });
      const data = (await response.json()) as {
        entry?: GuestbookEntry | null;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save note");
      }

      form.reset();
      setPendingSubmission(null);
      setStatus("Submitted for approval. Thanks for leaving a signal.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save note");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="guestbook-shell">
      <form className="guestbook-form" onSubmit={handleSubmit}>
        <div className="guestbook-field-row">
          <label>
            <span>Name</span>
            <input
              name="name"
              type="text"
              required
              maxLength={80}
              placeholder="Your name"
              disabled={Boolean(pendingSubmission) || isSubmitting}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              maxLength={160}
              placeholder="Only if you want"
              disabled={Boolean(pendingSubmission) || isSubmitting}
            />
          </label>
        </div>

        <label>
          <span>Kind of signal</span>
          <select
            name="category"
            defaultValue="music"
            disabled={Boolean(pendingSubmission) || isSubmitting}
          >
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Note</span>
          <textarea
            name="message"
            required
            minLength={3}
            maxLength={maxMessageLength}
            placeholder="A song, a cabinet you miss, a cat who knew too much, a Twin Peaks thought, a site note..."
            disabled={Boolean(pendingSubmission) || isSubmitting}
          />
          <small className="guestbook-help">{maxMessageLength} characters max</small>
        </label>

        <label className="guestbook-honey">
          <span>Website</span>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>

        {pendingSubmission ? (
          <div className="guestbook-review" aria-label="Review guestbook note">
            <span>Ready to submit?</span>
            <p>{pendingSubmission.message}</p>
            <small>
              {categoryLabels.get(pendingSubmission.category) ?? "Signal"}
            </small>
            <div className="guestbook-review-actions">
              <button
                className="guestbook-submit"
                type="button"
                disabled={isSubmitting}
                onClick={(event) => submitForApproval(event.currentTarget.form!)}
              >
                {isSubmitting ? "Sending..." : "Submit for Approval"}
              </button>
              <button
                className="guestbook-edit"
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setPendingSubmission(null);
                  setStatus("Make your edits, then review again.");
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <button className="guestbook-submit" type="submit" disabled={isSubmitting}>
            Preview Signal
          </button>
        )}
        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>
      </form>

      <div className="guestbook-entries" aria-label="Recent guestbook notes">
        {entries.map((entry) => (
          <article className="guestbook-entry" key={entry.id}>
            <div>
              <span>{categoryLabels.get(entry.category) ?? "Signal"}</span>
              <time dateTime={entry.createdAt}>
                {new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(entry.createdAt))}
              </time>
            </div>
            <p>{entry.message}</p>
            <strong>{entry.name}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
