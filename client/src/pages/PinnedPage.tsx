import { useNavigate } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { useShellMode } from "../components/layout/ShellModeContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { TaskList } from "../components/tasks/TaskList";
import { useAppShell } from "../components/layout/AppShellContext";

export const PinnedPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { basePath } = useShellMode();
  const { tasks, selectedTaskId, setSelectedTaskId } = useAppShell();
  const pinnedTasks = tasks.filter((task) => task.pinned);

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
            Pinned
          </div>
          <h1 className="mt-2 text-2xl font-bold text-textPrimary">Pinned Tasks</h1>
        </div>

        <TaskList
          tasks={pinnedTasks}
          selectedTaskId={selectedTaskId}
          onSelect={selectTask}
          compactEmpty
        />
      </div>
    );
  }

  return (
    <Panel className="h-full p-4 lg:p-5">
      <div className="text-xs uppercase tracking-[0.3em] text-textSecondary">
        Pinned
      </div>
      <h2 className="mt-2 text-2xl font-bold text-textPrimary lg:text-3xl">Keep key work in sight</h2>
      <div className="mt-4 lg:mt-6">
        <TaskList
          tasks={pinnedTasks}
          selectedTaskId={selectedTaskId}
          onSelect={selectTask}
        />
      </div>
    </Panel>
  );
};
