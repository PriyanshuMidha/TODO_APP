import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { QuickAddTask } from "../components/tasks/QuickAddTask";
import { TaskCard } from "../components/tasks/TaskCard";
import { useAppShell } from "../components/layout/AppShellContext";

export const StickyPage = () => {
  const { tasks, createTask, setSelectedTaskId } = useAppShell();
  const pinnedTask = useMemo(
    () => tasks.find((task) => task.pinned) ?? tasks.find((task) => task.status === "in_progress") ?? tasks[0] ?? null,
    [tasks]
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
        <div className="mb-3 rounded-xl border border-border bg-background/70 px-3 py-2 text-xs uppercase tracking-[0.28em] text-textSecondary">
          Sticky FocusDock
        </div>

        <QuickAddTask onCreate={createTask} label="Quick Add" />

        <div className="mt-4 flex-1 space-y-3 overflow-auto">
          <div className="text-xs uppercase tracking-[0.24em] text-textSecondary">
            Pinned or Current
          </div>
          {pinnedTask ? (
            <TaskCard
              task={pinnedTask}
              active={false}
              onClick={() => setSelectedTaskId(pinnedTask._id)}
            />
          ) : (
            <div className="rounded-[18px] border border-dashed border-border p-4 text-sm text-textSecondary">
              No pinned or current task yet.
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
