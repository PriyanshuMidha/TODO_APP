import { useNavigate } from "react-router-dom";
import { Panel } from "../components/common/Panel";
import { useIsMobile } from "../hooks/useIsMobile";
import { TaskList } from "../components/tasks/TaskList";
import { useAppShell } from "../components/layout/AppShellContext";

const Section = ({
  title,
  tasks,
  onSelect,
  compact = false
}: {
  title: string;
  tasks: ReturnType<typeof useAppShell>["tasks"];
  onSelect: (id: string) => void;
  compact?: boolean;
}) => {
  const { selectedTaskId } = useAppShell();

  return (
    <Panel className={compact ? "p-3" : "p-4"}>
      <div className={`${compact ? "mb-3 text-xs" : "mb-4 text-sm"} font-semibold uppercase tracking-[0.25em] text-textSecondary`}>
        {title}
      </div>
      <TaskList
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onSelect={onSelect}
        compactEmpty={compact}
      />
    </Panel>
  );
};

export const TodayPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { tasks, setSelectedTaskId } = useAppShell();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < today &&
      task.status !== "done" &&
      task.status !== "cancelled"
  );
  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
  const pinned = tasks.filter((task) => task.pinned);
  const currentTask =
    todayTasks.find((task) => task.status === "in_progress") ?? todayTasks[0];
  const nextTask =
    todayTasks.find((task) => task._id !== currentTask?._id && task.status !== "done") ??
    null;

  const selectTask = (taskId: string) => {
    setSelectedTaskId(taskId);

    if (isMobile) {
      navigate(`/app/task/${taskId}`);
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-3 px-4 py-4">
        <div className="grid gap-3">
          <Panel className="p-4">
            <div className="text-[11px] uppercase tracking-[0.28em] text-textSecondary">
              Current Task
            </div>
            <div className="mt-2 text-lg font-bold text-textPrimary">
              {currentTask?.title ?? "No current task"}
            </div>
            <div className="mt-1 text-sm text-textSecondary">
              {currentTask?.description ?? "Pick a task from today to get moving."}
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="text-[11px] uppercase tracking-[0.28em] text-textSecondary">
              Next Task
            </div>
            <div className="mt-2 text-lg font-bold text-textPrimary">
              {nextTask?.title ?? "Nothing queued"}
            </div>
            <div className="mt-1 text-sm text-textSecondary">
              {nextTask?.description ??
                "Your next task will appear here once today has a sequence."}
            </div>
          </Panel>
        </div>

        <Section title="Overdue" tasks={overdue} onSelect={selectTask} compact />
        <Section title="Pinned" tasks={pinned} onSelect={selectTask} compact />
        <Section title="Today Tasks" tasks={todayTasks} onSelect={selectTask} compact />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="p-4 lg:p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-textSecondary">
            Current Task
          </div>
          <div className="mt-3 text-xl font-bold text-textPrimary lg:text-2xl">
            {currentTask?.title ?? "No current task"}
          </div>
          <div className="mt-2 text-sm text-textSecondary">
            {currentTask?.description ?? "Pick a task from today to get moving."}
          </div>
        </Panel>

        <Panel className="p-4 lg:p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-textSecondary">
            Next Task
          </div>
          <div className="mt-3 text-xl font-bold text-textPrimary lg:text-2xl">
            {nextTask?.title ?? "Nothing queued"}
          </div>
          <div className="mt-2 text-sm text-textSecondary">
            {nextTask?.description ??
              "Your next task will appear here once today has a sequence."}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Section title="Overdue" tasks={overdue} onSelect={selectTask} />
        <Section title="Pinned" tasks={pinned} onSelect={selectTask} />
      </div>

      <Section title="Today Tasks" tasks={todayTasks} onSelect={selectTask} />
    </div>
  );
};
