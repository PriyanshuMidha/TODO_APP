import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { Input, Textarea } from "../components/common/Input";
import { Panel } from "../components/common/Panel";
import { QuickAddTask } from "../components/tasks/QuickAddTask";
import { TaskCard } from "../components/tasks/TaskCard";
import { useAppShell } from "../components/layout/AppShellContext";

type NotesSaveStatus = "idle" | "saving" | "saved" | "failed";

export const StickyPage = () => {
  const { tasks, selectedTaskId, createTask, saveTask, setSelectedTaskId } = useAppShell();
  const [draftNotes, setDraftNotes] = useState("");
  const [notesSaveStatus, setNotesSaveStatus] = useState<NotesSaveStatus>("idle");
  const stickyTasks = useMemo(
    () => tasks.filter((task) => task.pinned || task.status === "in_progress").slice(0, 4),
    [tasks]
  );
  const primaryTask = useMemo(
    () => tasks.find((task) => task.pinned) ?? tasks.find((task) => task.status === "in_progress") ?? tasks[0] ?? null,
    [tasks]
  );
  const selectedTask = useMemo(
    () => tasks.find((task) => task._id === selectedTaskId) ?? primaryTask,
    [tasks, selectedTaskId, primaryTask]
  );

  useEffect(() => {
    setDraftNotes(selectedTask?.notes ?? "");
    setNotesSaveStatus("idle");
  }, [selectedTask?._id, selectedTask?.notes]);

  useEffect(() => {
    document.body.classList.add("sticky-mode");

    const setupStickyWindow = async () => {
      const tauriWindow = window as Window & {
        __TAURI__?: unknown;
        __TAURI_INTERNALS__?: unknown;
      };

      if (!tauriWindow.__TAURI__ && !tauriWindow.__TAURI_INTERNALS__) {
        return;
      }

      try {
        const windowModule = await import("@tauri-apps/api/window");
        const appWindow =
          "getCurrentWindow" in windowModule
            ? windowModule.getCurrentWindow()
            : null;

        if (appWindow) {
          await appWindow.setAlwaysOnTop(true);
          await appWindow.setVisibleOnAllWorkspaces(true);
          await appWindow.setSizeConstraints({
            minWidth: 320,
            minHeight: 380,
            maxWidth: 700,
            maxHeight: 900
          });
        }
      } catch (error) {
        console.error("Unable to fully configure sticky window mode", error);
      }
    };

    void setupStickyWindow();

    return () => {
      document.body.classList.remove("sticky-mode");
    };
  }, []);

  const withStickyWindow = async (
    action: (appWindow: {
      close: () => Promise<void>;
      minimize: () => Promise<void>;
      hide: () => Promise<void>;
    }) => Promise<void>
  ) => {
    const tauriWindow = window as Window & {
      __TAURI__?: unknown;
      __TAURI_INTERNALS__?: unknown;
    };

    if (!tauriWindow.__TAURI__ && !tauriWindow.__TAURI_INTERNALS__) {
      return;
    }

    try {
      const windowModule = await import("@tauri-apps/api/window");
      const appWindow =
        "getCurrentWindow" in windowModule
          ? windowModule.getCurrentWindow()
          : null;

      if (appWindow) {
        await action(appWindow);
      }
    } catch (error) {
      console.error("Sticky window action failed", error);
    }
  };

  const openFullApp = async () => {
    const tauriWindow = window as Window & {
      __TAURI__?: unknown;
      __TAURI_INTERNALS__?: unknown;
    };

    if (!tauriWindow.__TAURI__ && !tauriWindow.__TAURI_INTERNALS__) {
      window.location.href = "/app/tasks";
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("open_focusdock");
    } catch (error) {
      console.error("Unable to open full FocusDock app", error);
      window.location.href = "/app/tasks";
    }
  };

  const hasPendingNotesChanges = draftNotes !== (selectedTask?.notes ?? "");

  const saveNotes = async () => {
    if (!selectedTask || !hasPendingNotesChanges || notesSaveStatus === "saving") {
      return;
    }

    setNotesSaveStatus("saving");

    try {
      await saveTask(selectedTask._id, { notes: draftNotes });
      setNotesSaveStatus("saved");
    } catch (error) {
      console.error("Unable to save sticky notes", error);
      setNotesSaveStatus("failed");
    }
  };

  const notesStatusLabel =
    notesSaveStatus === "saving"
      ? "Saving..."
      : notesSaveStatus === "saved"
        ? "Saved"
        : notesSaveStatus === "failed"
          ? "Failed to save"
          : hasPendingNotesChanges
            ? "Unsaved changes"
            : "Saved";

  return (
    <div className="min-h-screen bg-transparent p-3">
      <Panel className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[420px] flex-col rounded-[28px] border border-white/8 bg-[#101010]/94 p-3 shadow-[0_26px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl">
        <div className="mb-3 rounded-[22px] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),linear-gradient(135deg,rgba(139,92,246,0.14),rgba(139,92,246,0.02))] px-3 py-3">
          <div
            data-tauri-drag-region
            className="mb-2 flex items-center justify-between rounded-2xl border border-white/5 bg-background/20 px-3 py-2"
          >
            <div className="text-[10px] uppercase tracking-[0.32em] text-textSecondary">
              Drag Widget
            </div>
            <div className="h-1.5 w-16 rounded-full bg-white/10" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.32em] text-textSecondary">
                FocusDock
              </div>
              <div className="mt-1 text-sm font-semibold text-textPrimary">
                Sticky Widget
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void openFullApp()}
                className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-textPrimary transition hover:border-accent"
              >
                Full App
              </button>
              <button
                type="button"
                onClick={() => void withStickyWindow((appWindow) => appWindow.minimize())}
                className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-textSecondary transition hover:text-textPrimary"
              >
                Hide
              </button>
              <button
                type="button"
                onClick={() => void withStickyWindow((appWindow) => appWindow.close())}
                className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/5 bg-background/70 p-3">
          <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-textSecondary">
            Quick Add
          </div>
          <QuickAddTask onCreate={createTask} label="Add" />
        </div>

        <div className="mt-3 space-y-2">
          <div className="text-[10px] uppercase tracking-[0.28em] text-textSecondary">
            Pinned or Current
          </div>
          {stickyTasks.length ? (
            <div className="space-y-2">
              {stickyTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  active={selectedTask?._id === task._id}
                  onClick={() => setSelectedTaskId(task._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              title="No pinned task yet"
              description="Pin a task or start one in progress to surface it here."
            />
          )}
        </div>

        <div className="mt-3 flex-1 overflow-auto rounded-[22px] border border-white/5 bg-background/70 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] uppercase tracking-[0.28em] text-textSecondary">
              Quick Notes
            </div>
            <div className="text-xs text-textSecondary">{notesStatusLabel}</div>
          </div>
          {selectedTask ? (
            <div className="mt-2 space-y-2">
              <Input
                className="border-0 bg-transparent px-0 py-0 text-base font-semibold"
                value={selectedTask.title}
                onChange={(event) =>
                  void saveTask(selectedTask._id, { title: event.target.value })
                }
              />
              <Textarea
                className="min-h-[150px] rounded-[18px] border-white/5 bg-[#121212]"
                value={draftNotes}
                onChange={(event) => {
                  setDraftNotes(event.target.value);
                  setNotesSaveStatus("idle");
                }}
                placeholder="Add quick notes for the selected sticky task."
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => void saveNotes()}
                  disabled={!hasPendingNotesChanges || notesSaveStatus === "saving"}
                  variant={notesSaveStatus === "failed" ? "danger" : "primary"}
                >
                  {notesSaveStatus === "saving" ? "Saving Notes..." : "Save Notes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2 rounded-[18px] border border-dashed border-border p-4 text-sm text-textSecondary">
              Select a task to edit its notes here.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
};
