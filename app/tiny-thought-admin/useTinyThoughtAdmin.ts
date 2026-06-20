"use client";

import { useEffect, useMemo, useState } from "react";
import { countWords, normalizeTinyThoughtUrl, type TinyThought, type TinyThoughtAttachment } from "../lib/tiny-thoughts";
import {
  AttachmentDraft,
  TinyThoughtFormState,
  emptyAttachmentDraft,
  emptyForm,
  toTinyThoughtFormState,
} from "./shared";

function sortThoughtsByCreatedAt(thoughts: TinyThought[]) {
  return [...thoughts].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function useTinyThoughtAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [thoughts, setThoughts] = useState<TinyThought[]>([]);
  const [form, setForm] = useState<TinyThoughtFormState>(emptyForm);
  const [attachmentDraft, setAttachmentDraft] = useState<AttachmentDraft>(emptyAttachmentDraft);
  const [status, setStatus] = useState("Checking admin session...");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const wordCount = useMemo(() => countWords(form.content), [form.content]);
  const isEditing = Boolean(form.id);

  async function loadThoughts() {
    const response = await fetch("/api/admin/tiny-thoughts");

    if (!response.ok) {
      throw new Error("Unable to load tiny thoughts.");
    }

    const data = (await response.json()) as { thoughts: TinyThought[] };
    setThoughts(data.thoughts);
    setStatus(data.thoughts.length ? "" : "No tiny thoughts yet.");
  }

  useEffect(() => {
    async function loadSession() {
      const response = await fetch("/api/admin/session");
      const data = (await response.json()) as {
        authenticated: boolean;
        configured: boolean;
      };

      setAuthenticated(data.authenticated);
      setConfigured(data.configured);

      if (!data.configured) {
        setStatus("ADMIN_USERNAME or ADMIN_PASSWORD is not configured.");
        return;
      }

      if (data.authenticated) {
        await loadThoughts();
      } else {
        setStatus("Sign in from the admin dashboard to manage tiny thoughts.");
      }
    }

    loadSession().catch(() => setStatus("Tiny Thoughts admin is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setThoughts([]);
    resetForm();
    setStatus("Signed out.");
  }

  function updateFormField<K extends keyof TinyThoughtFormState>(
    field: K,
    value: TinyThoughtFormState[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateAttachmentField<K extends keyof AttachmentDraft>(
    field: K,
    value: AttachmentDraft[K],
  ) {
    setAttachmentDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function setAttachmentType(type: TinyThoughtAttachment["type"]) {
    setAttachmentDraft({
      type,
      url: "",
      title: "",
      file: null,
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setAttachmentDraft(emptyAttachmentDraft);
  }

  function editThought(thought: TinyThought) {
    setForm(toTinyThoughtFormState(thought));
    setAttachmentDraft(emptyAttachmentDraft);
    setStatus("Editing tiny thought.");
  }

  async function uploadImageAttachment(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/tiny-thoughts/upload", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as {
      attachment?: TinyThoughtAttachment;
      error?: string;
    };

    if (!response.ok || !data.attachment || data.attachment.type !== "image") {
      throw new Error(data.error ?? "Unable to upload image.");
    }

    return data.attachment;
  }

  async function addAttachment() {
    if (attachmentDraft.type === "image") {
      if (!attachmentDraft.file) {
        setStatus("Choose an image file to upload.");
        return;
      }

      setUploadingAttachment(true);
      setStatus("Uploading image...");

      try {
        const attachment = await uploadImageAttachment(attachmentDraft.file);

        setForm((currentForm) => ({
          ...currentForm,
          attachments: [...currentForm.attachments, attachment].slice(0, 8),
        }));
        setAttachmentDraft(emptyAttachmentDraft);
        setStatus("Image uploaded to Vercel Blob.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to upload image.");
      } finally {
        setUploadingAttachment(false);
      }

      return;
    }

    const url = normalizeTinyThoughtUrl(attachmentDraft.url);

    if (!url) {
      setStatus("Add an http or https URL for the attachment.");
      return;
    }

    const attachment: TinyThoughtAttachment = {
      type: "link",
      url,
      title: attachmentDraft.title.trim() || undefined,
    };

    setForm((currentForm) => ({
      ...currentForm,
      attachments: [...currentForm.attachments, attachment].slice(0, 8),
    }));
    setAttachmentDraft(emptyAttachmentDraft);
    setStatus("Attachment added.");
  }

  function removeAttachment(index: number) {
    setForm((currentForm) => ({
      ...currentForm,
      attachments: currentForm.attachments.filter((_, attachmentIndex) => attachmentIndex !== index),
    }));
  }

  async function saveThought(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyId(form.id || "new");
    setStatus(isEditing ? "Updating tiny thought..." : "Saving tiny thought...");

    try {
      const response = await fetch("/api/admin/tiny-thoughts", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { thought?: TinyThought; error?: string };

      if (!response.ok || !data.thought) {
        throw new Error(data.error ?? "Unable to save tiny thought.");
      }

      setThoughts((currentThoughts) =>
        sortThoughtsByCreatedAt([
          data.thought!,
          ...currentThoughts.filter((thought) => thought.id !== data.thought!.id),
        ]),
      );
      resetForm();
      setStatus(isEditing ? "Tiny thought updated." : "Tiny thought saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save tiny thought.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteThought(id: string) {
    const confirmed = window.confirm("Delete this tiny thought permanently?");

    if (!confirmed) {
      return;
    }

    setBusyId(id);
    setStatus("Deleting tiny thought...");

    try {
      const response = await fetch("/api/admin/tiny-thoughts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete tiny thought.");
      }

      setThoughts((currentThoughts) => currentThoughts.filter((thought) => thought.id !== id));
      if (form.id === id) {
        resetForm();
      }
      setStatus("Tiny thought deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete tiny thought.");
    } finally {
      setBusyId(null);
    }
  }

  return {
    attachmentDraft,
    authenticated,
    busyId,
    configured,
    form,
    isEditing,
    status,
    thoughts,
    uploadingAttachment,
    wordCount,
    addAttachment,
    deleteThought,
    editThought,
    handleLogout,
    loadThoughts,
    removeAttachment,
    resetForm,
    saveThought,
    setAttachmentType,
    updateAttachmentField,
    updateFormField,
  };
}
