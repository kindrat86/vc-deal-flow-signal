"use client";

import { useEffect, useState } from "react";
import { STAGES, STAGE_LABELS, type DreamCustomer, type Stage } from "@/lib/dream-customers-types";

interface Props {
  row: DreamCustomer | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<DreamCustomer>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function EditDrawer({ row, onClose, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<DreamCustomer | null>(row);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(row);
    setError(null);
  }, [row]);

  useEffect(() => {
    if (!row) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [row, onClose]);

  if (!row || !draft) return null;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(row.id, {
        name: draft.name,
        firm: draft.firm,
        role: draft.role,
        url: draft.url,
        segment: draft.segment,
        confidence: draft.confidence,
        stage: draft.stage,
        notes: draft.notes,
        last_engaged_at: draft.last_engaged_at,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete ${row.name}?`)) return;
    setSaving(true);
    try {
      await onDelete(row.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSaving(false);
    }
  };

  const lastEngagedDate = draft.last_engaged_at
    ? draft.last_engaged_at.slice(0, 10)
    : "";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label={`Edit ${row.name}`}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-neutral-950 border-l border-neutral-800 z-50 overflow-y-auto"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-100">Edit contact</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-100 text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <Field label="Name">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Handle (X)">
            <input
              type="text"
              value={draft.handle}
              disabled
              className={`${inputClass} opacity-50`}
              title="Handle is the unique key — drop and re-add to change it."
            />
          </Field>

          <Field label="Firm">
            <input
              type="text"
              value={draft.firm}
              onChange={(e) => setDraft({ ...draft, firm: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Role">
            <input
              type="text"
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="URL">
            <input
              type="url"
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Segment">
              <select
                value={draft.segment}
                onChange={(e) => setDraft({ ...draft, segment: e.target.value as DreamCustomer["segment"] })}
                className={inputClass}
              >
                <option value="">—</option>
                <option value="A">A — Solo GP</option>
                <option value="B">B — Partner</option>
                <option value="D">D — Family Office</option>
                <option value="F">F — Platform</option>
              </select>
            </Field>
            <Field label="Confidence">
              <select
                value={draft.confidence}
                onChange={(e) => setDraft({ ...draft, confidence: e.target.value as DreamCustomer["confidence"] })}
                className={inputClass}
              >
                <option value="">—</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </Field>
          </div>

          <Field label="Stage">
            <select
              value={draft.stage}
              onChange={(e) => setDraft({ ...draft, stage: e.target.value as Stage })}
              className={inputClass}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Last engaged">
            <input
              type="date"
              value={lastEngagedDate}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  last_engaged_at: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : "",
                })
              }
              className={inputClass}
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={6}
              maxLength={2000}
              className={`${inputClass} resize-none font-mono text-xs`}
              placeholder="What did they say? What's the next move?"
            />
            <div className="text-[10px] text-neutral-500 text-right">
              {draft.notes.length}/2000
            </div>
          </Field>

          {error && (
            <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900 rounded p-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-50"
            >
              Delete
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-3 py-1.5 text-xs rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="px-3 py-1.5 text-xs rounded bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide text-neutral-500 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none";
