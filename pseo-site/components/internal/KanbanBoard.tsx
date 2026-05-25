"use client";

import { useCallback, useMemo, useState } from "react";
import {
  STAGES,
  STAGE_LABELS,
  type DreamCustomer,
  type Stage,
} from "@/lib/dream-customers-types";
import Card from "./Card";
import EditDrawer from "./EditDrawer";

interface Props {
  initial: DreamCustomer[];
}

export default function KanbanBoard({ initial }: Props) {
  const [rows, setRows] = useState<DreamCustomer[]>(initial);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHandle, setNewHandle] = useState("");

  const byStage = useMemo(() => {
    const map: Record<Stage, DreamCustomer[]> = {
      sourced: [],
      followed: [],
      engaged: [],
      acknowledged: [],
      outreach_sent: [],
      in_conversation: [],
      trial: [],
      paying: [],
      champion: [],
    };
    for (const r of rows) {
      const stage = (STAGES as readonly string[]).includes(r.stage)
        ? r.stage
        : "sourced";
      map[stage as Stage].push(r);
    }
    return map;
  }, [rows]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const moveCard = useCallback(
    async (id: string, toStage: Stage) => {
      const original = rows;
      const next = rows.map((r) => (r.id === id ? { ...r, stage: toStage } : r));
      setRows(next);
      try {
        const res = await fetch(`/api/internal/dream-customers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: toStage }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        setRows(original);
        showToast(`Move failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    [rows, showToast],
  );

  const incrementComment = useCallback(
    async (id: string, delta: 1 | -1) => {
      const original = rows;
      const next = rows.map((r) =>
        r.id === id
          ? {
              ...r,
              comment_count: Math.max(0, r.comment_count + delta),
              last_engaged_at: delta === 1 ? new Date().toISOString() : r.last_engaged_at,
            }
          : r,
      );
      setRows(next);
      try {
        const res = await fetch(`/api/internal/dream-customers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentIncrement: delta }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { record: DreamCustomer };
        setRows((cur) => cur.map((r) => (r.id === id ? data.record : r)));
      } catch (err) {
        setRows(original);
        showToast(`Counter failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    [rows, showToast],
  );

  const saveEdit = useCallback(
    async (id: string, patch: Partial<DreamCustomer>) => {
      const res = await fetch(`/api/internal/dream-customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { record: DreamCustomer };
      setRows((cur) => cur.map((r) => (r.id === id ? data.record : r)));
    },
    [],
  );

  const deleteRow = useCallback(async (id: string) => {
    const res = await fetch(`/api/internal/dream-customers/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `HTTP ${res.status}`);
    }
    setRows((cur) => cur.filter((r) => r.id !== id));
  }, []);

  const addCard = useCallback(async () => {
    const name = newName.trim();
    const handle = newHandle.trim().replace(/^@/, "");
    if (!name || !handle) {
      showToast("Name and handle are required");
      return;
    }
    try {
      const res = await fetch(`/api/internal/dream-customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, handle }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { record: DreamCustomer };
      setRows((cur) => [...cur, data.record]);
      setNewName("");
      setNewHandle("");
      setAdding(false);
    } catch (err) {
      showToast(`Add failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [newName, newHandle, showToast]);

  const editingRow = editingId ? rows.find((r) => r.id === editingId) ?? null : null;

  return (
    <div className="relative">
      <div className="px-4 py-2 border-b border-neutral-800 flex items-center gap-3">
        {adding ? (
          <form
            className="flex items-center gap-2 flex-wrap"
            onSubmit={(e) => {
              e.preventDefault();
              addCard();
            }}
          >
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 w-32"
            />
            <input
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              placeholder="@handle"
              className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 w-28"
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs rounded bg-sky-600 hover:bg-sky-500 text-white"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setNewName("");
                setNewHandle("");
              }}
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-900"
          >
            + Add contact
          </button>
        )}
        <span className="text-[10px] text-neutral-500 ml-auto">
          {rows.length} total · {byStage.paying.length} paying · {byStage.champion.length} champions
        </span>
      </div>

      <div className="overflow-x-auto p-4">
        <div className="flex gap-3 min-w-max items-start">
          {STAGES.map((stage) => {
            const cards = byStage[stage];
            const isOver = dragOverStage === stage;
            return (
              <section
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverStage !== stage) setDragOverStage(stage);
                }}
                onDragLeave={() => {
                  if (dragOverStage === stage) setDragOverStage(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  setDragOverStage(null);
                  setDraggingId(null);
                  if (!id) return;
                  const current = rows.find((r) => r.id === id);
                  if (!current || current.stage === stage) return;
                  moveCard(id, stage);
                }}
                className={`w-72 shrink-0 rounded-lg border bg-neutral-900/40 transition ${
                  isOver ? "border-sky-500 bg-sky-950/30" : "border-neutral-800"
                }`}
              >
                <header className="px-3 py-2 border-b border-neutral-800 flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-300">
                    {STAGE_LABELS[stage]}
                  </h2>
                  <span className="text-[10px] font-mono text-neutral-500">{cards.length}</span>
                </header>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {cards.length === 0 ? (
                    <div className="text-[11px] text-neutral-600 text-center py-6">
                      drop here
                    </div>
                  ) : (
                    cards.map((row) => (
                      <Card
                        key={row.id}
                        row={row}
                        dragging={draggingId === row.id}
                        onDragStart={setDraggingId}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDragOverStage(null);
                        }}
                        onIncrement={incrementComment}
                        onEdit={setEditingId}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <EditDrawer
        row={editingRow}
        onClose={() => setEditingId(null)}
        onSave={saveEdit}
        onDelete={deleteRow}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-rose-900 bg-rose-950/90 text-rose-200 px-3 py-2 text-sm shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
