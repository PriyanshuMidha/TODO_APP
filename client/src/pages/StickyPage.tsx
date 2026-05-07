import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { Input, Textarea } from "../components/common/Input";
import { Panel } from "../components/common/Panel";
import { QuickAddTask } from "../components/tasks/QuickAddTask";
import { TaskCard } from "../components/tasks/TaskCard";
import { useAppShell } from "../components/layout/AppShellContext";

export const StickyPage = () => {
  const { tasks, selectedTaskId, createTask, saveTask, setSelectedTaskId } = useAppShell();
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
    const enableAlwaysOnTop = async () => {
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
        }
      } catch (error) {
        console.error("Unable to enable sticky window mode", error);
      }
    };

    void enableAlwaysOnTop();
  }, []);

  return (
    <div className="min-h-screen bg-background p-3">
      <Panel className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[360px] flex-col rounded-[24px] p-4">
        <div className="mb-3 rounded-xl border border-border bg-background/70 px-3 py-2">
          <div className="text-[11px] uppercase tracking-[0.28em] text-textSecondary">
            Sticky FocusDock
          </div>
          <div className="mt-1 text-sm font-semibold text-textPrimary">
            Quick capture and pinned work
          </div>
        </div>

        <QuickAddTask onCreate={createTask} label="Quick Add" />

        <div className="mt-4 space-y-3">
          <div className="text-xs uppercase tracking-[0.24em] text-textSecondary">
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

        <div className="mt-4 flex-1 overflow-auto">
          <div className="text-xs uppercase tracking-[0.24em] text-textSecondary">
            Selected Notes
          </div>
          {selectedTask ? (
            <div className="mt-2 space-y-2">
              <Input
                className="border-0 bg-transparent px-0 py-0 text-lg font-semibold"
                value={selectedTask.title}
                onChange={(event) =>
                  void saveTask(selectedTask._id, { title: event.target.value })
                }
              />
              <Textarea
                className="min-h-[160px] rounded-[18px] bg-background/75"
                value={selectedTask.notes}
                onChange={(event) =>
                  void saveTask(selectedTask._id, { notes: event.target.value })
                }
                placeholder="Add quick notes for the selected sticky task."
              />
            </div>
          ) : (
            <div className="mt-2 rounded-[18px] border border-dashed border-border p-4 text-sm text-textSecondary">
              Select a task to edit its notes here.
            </div>
          )}
        </div>

        <Link
          to="/app/tasks"
          className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-textPrimary transition hover:border-accent"
        >
          Open Full App
        </Link>
      </Panel>
    </div>
  );
};
