import { useNavigate } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { useIsMobile } from "../hooks/useIsMobile";
import { QuickAddTask } from "../components/tasks/QuickAddTask";
import { TaskList } from "../components/tasks/TaskList";
import { useAppShell } from "../components/layout/AppShellContext";

export const TasksPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { tasks, selectedTaskId, setSelectedTaskId, createTask } = useAppShell();

  const selectTask = (taskId: string) => {
    setSelectedTaskId(taskId);

    if (isMobile) {
      navigate(`/app/task/${taskId}`);
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

        <TaskList
          tasks={tasks}
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
        All Tasks
      </div>
      <h2 className="mt-2 text-2xl font-bold text-textPrimary lg:text-3xl">
        Create tasks and keep all the real work context inside them.
      </h2>

      <div className="mt-4 lg:mt-6">
        <QuickAddTask onCreate={createTask} />
      </div>

      <div className="mt-4 lg:mt-6">
        <TaskList
          tasks={tasks}
          selectedTaskId={selectedTaskId}
          onSelect={selectTask}
        />
      </div>
    </Panel>
  );
};
