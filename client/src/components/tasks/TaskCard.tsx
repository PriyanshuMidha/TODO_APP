import type { Task } from "../../types";
import { formatDateLabel, getPriorityTone, getStatusLabel } from "../../utils/format";

export const TaskCard = ({
  task,
  active,
  onClick
}: {
  task: Task;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-[18px] border px-3 py-3 text-left transition ${
      active
        ? "border-accent bg-accent/10"
        : "border-border bg-card hover:border-textSecondary/30 hover:bg-neutral-950"
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-textPrimary">{task.title}</div>
        <div className="mt-1 truncate text-xs text-textSecondary">
          {task.notes || task.description || "Open to add task context and working notes."}
        </div>
      </div>
    </div>

    <div className="mt-3 flex items-center gap-2 text-[11px] text-textSecondary">
      <span className="rounded-full border border-border px-2 py-1">
        {getStatusLabel(task.status)}
      </span>
      <span className={`rounded-full border border-border px-2 py-1 font-semibold uppercase ${getPriorityTone(task.priority)}`}>
        {task.priority}
      </span>
      <span className="truncate rounded-full border border-border px-2 py-1">
        {formatDateLabel(task.dueDate)}
      </span>
    </div>
  </button>
);
