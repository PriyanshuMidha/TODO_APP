import { EmptyState } from "../common/EmptyState";
import { TaskCard } from "./TaskCard";
import type { Task } from "../../types";

export const TaskList = ({
  tasks,
  selectedTaskId,
  onSelect,
  compactEmpty = false
}: {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelect: (id: string) => void;
  compactEmpty?: boolean;
}) => {
  if (!tasks.length) {
    return (
      <EmptyState
        compact={compactEmpty}
        title={compactEmpty ? "No tasks yet" : "Nothing here yet"}
        description={
          compactEmpty
            ? "Create a task to get started."
            : "Add a task to start building out your focus dock."
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          active={selectedTaskId === task._id}
          onClick={() => onSelect(task._id)}
        />
      ))}
    </div>
  );
};
