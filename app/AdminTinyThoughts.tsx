"use client";

import Link from "next/link";
import { TinyThoughtAdminList } from "./tiny-thought-admin/TinyThoughtAdminList";
import { TinyThoughtForm } from "./tiny-thought-admin/TinyThoughtForm";
import { useTinyThoughtAdmin } from "./tiny-thought-admin/useTinyThoughtAdmin";

export function AdminTinyThoughts() {
  const {
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
  } = useTinyThoughtAdmin();

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Tiny Thoughts</h1>
          <p>Create, edit, view, and delete short posts for the homepage.</p>
        </div>

        {!authenticated ? (
          <div className="admin-login">
            <p>This page requires an active admin session.</p>
            <Link className="admin-action-link" href="/admin" aria-disabled={!configured}>
              Open Admin Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="admin-toolbar">
              <button type="button" onClick={loadThoughts}>
                Refresh
              </button>
              <button type="button" onClick={handleLogout}>
                Log Out
              </button>
            </div>

            <TinyThoughtForm
              attachmentDraft={attachmentDraft}
              busy={Boolean(busyId)}
              form={form}
              isEditing={isEditing}
              onAddAttachment={addAttachment}
              onAttachmentFileChange={(file) => updateAttachmentField("file", file)}
              onAttachmentTitleChange={(value) => updateAttachmentField("title", value)}
              onAttachmentTypeChange={setAttachmentType}
              onAttachmentUrlChange={(value) => updateAttachmentField("url", value)}
              onCancel={resetForm}
              onCategoryChange={(value) => updateFormField("category", value)}
              onContentChange={(value) => updateFormField("content", value)}
              onInspiredByCategoryChange={(value) => updateFormField("inspiredByCategory", value)}
              onInspiredByChange={(value) => updateFormField("inspiredBy", value)}
              onRemoveAttachment={removeAttachment}
              onSubmit={saveThought}
              uploadingAttachment={uploadingAttachment}
              wordCount={wordCount}
            />
          </>
        )}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>

        {authenticated ? (
          <TinyThoughtAdminList
            busyId={busyId}
            onDelete={deleteThought}
            onEdit={editThought}
            thoughts={thoughts}
          />
        ) : null}
      </section>
    </main>
  );
}
