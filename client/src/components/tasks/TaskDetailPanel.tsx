import { useMemo } from "react";
import { EmptyState } from "../common/EmptyState";
import { useAppShell } from "../layout/AppShellContext";
import { TaskWorkspace } from "./TaskWorkspace";

export const TaskDetailPanel = () => {
  const { tasks, settings, selectedTaskId, saveTask, deleteTask } = useAppShell();
  const task = useMemo(
    () => tasks.find((item) => item._id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  if (!task) {
    return (
      <EmptyState
        title="Open a task"
        description="Select a task to start writing notes and working inside the task."
      />
    );
  }

  return (
    <TaskWorkspace
      task={task}
      settings={settings}
      onPatchTask={(payload) => saveTask(task._id, payload)}
      onDelete={() => void deleteTask(task._id)}
      topAction={
        <div className="text-[11px] uppercase tracking-[0.3em] text-textSecondary">
          Selected Task
        </div>
      }
    />
  );
};
