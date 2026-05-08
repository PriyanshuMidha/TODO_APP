import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";
import { Panel } from "../components/common/Panel";
import { useShellMode } from "../components/layout/ShellModeContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { QuickAddTask } from "../components/tasks/QuickAddTask";
import { TaskList } from "../components/tasks/TaskList";
import { useAppShell } from "../components/layout/AppShellContext";

export const TasksPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { basePath } = useShellMode();
  const {
    tasks,
    loading,
    taskError,
    selectedTaskId,
    setSelectedTaskId,
    createTask,
    refreshAll
  } = useAppShell();

  const selectTask = (taskId: string) => {
    setSelectedTaskId(taskId);

    if (isMobile) {
      navigate(`${basePath}/task/${taskId}`);
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4 px-4 py-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textSecondary">
            Tasks
          </div>
          <h1 className="mt-2 text-2xl font-bold text-textPrimary">All Tasks</h1>
        </div>

        <QuickAddTask onCreate={createTask} />

        {taskError ? (
          <div className="space-y-3 rounded-[22px] border border-danger/30 bg-danger/10 p-4">
            <div className="text-sm font-semibold text-danger">Unable to load tasks</div>
            <div className="text-sm text-textSecondary">URL: {taskError.url ?? "Unknown"}</div>
            <div className="text-sm text-textSecondary">Status: {taskError.status ?? "Failed fetch"}</div>
            <div className="text-sm text-textSecondary">Message: {taskError.message}</div>
            <Button variant="secondary" onClick={() => void refreshAll()}>
              Retry
            </Button>
          </div>
        ) : loading ? (
          <EmptyState
            compact
            title="Loading tasks..."
            description="Fetching your latest tasks from FocusDock."
          />
        ) : (
          <TaskList
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelect={selectTask}
            compactEmpty
          />
        )}
      </div>
    );
  }

  return (
    <Panel className="h-full p-4 lg:p-5">
      <div className="text-xs uppercase tracking-[0.3em] text-textSecondary">
        All Tasks
      </div>
      <h2 className="mt-2 text-2xl font-bold text-textPrimary lg:text-3xl">
        Create tasks and keep all the real work context inside them.
      </h2>

      <div className="mt-4 lg:mt-6">
        <QuickAddTask onCreate={createTask} />
      </div>

      <div className="mt-4 lg:mt-6">
        {taskError ? (
          <div className="space-y-3 rounded-[24px] border border-danger/30 bg-danger/10 p-4">
            <div className="text-base font-semibold text-danger">Unable to load tasks</div>
            <div className="text-sm text-textSecondary">URL: {taskError.url ?? "Unknown"}</div>
            <div className="text-sm text-textSecondary">Status: {taskError.status ?? "Failed fetch"}</div>
            <div className="text-sm text-textSecondary">Message: {taskError.message}</div>
            <Button variant="secondary" onClick={() => void refreshAll()}>
              Retry
            </Button>
          </div>
        ) : loading ? (
          <EmptyState
            title="Loading tasks..."
            description="Fetching your latest tasks from FocusDock."
          />
        ) : (
          <TaskList
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelect={selectTask}
          />
        )}
      </div>
    </Panel>
  );
};
