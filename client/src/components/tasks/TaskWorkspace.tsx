import type { ReactNode } from "react";
import { Button } from "../common/Button";
import { Input, Textarea } from "../common/Input";
import { Panel } from "../common/Panel";
import type { Settings, Subtask, Task } from "../../types";
import { taskPriorities, taskStatuses } from "../../utils/constants";
import { formatDateLabel, getStatusLabel } from "../../utils/format";

const Accordion = ({
  title,
  defaultOpen = false,
  children,
  meta
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  meta?: string;
}) => (
  <details
    open={defaultOpen}
    className="group rounded-[18px] border border-border bg-background/60"
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
      <div>
        <div className="text-sm font-semibold text-textPrimary">{title}</div>
        {meta ? <div className="mt-1 text-xs text-textSecondary">{meta}</div> : null}
      </div>
      <span className="text-xs text-textSecondary transition group-open:rotate-180">⌄</span>
    </summary>
    <div className="border-t border-border px-4 py-4">{children}</div>
  </details>
);

const SummaryChip = ({
  label,
  value
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-textSecondary">
    <span className="mr-1 text-[10px] uppercase tracking-[0.2em]">{label}</span>
    <span className="text-textPrimary">{value}</span>
  </div>
);

interface TaskWorkspaceProps {
  task: Task;
  settings: Settings | null;
  onPatchTask: (payload: Partial<Task>) => void;
  onDelete: () => void;
  topAction?: ReactNode;
  compact?: boolean;
  fullScreenMobile?: boolean;
}

export const TaskWorkspace = ({
  task,
  settings,
  onPatchTask,
  onDelete,
  topAction,
  compact = false,
  fullScreenMobile = false
}: TaskWorkspaceProps) => {
  const updateSubtasks = (subtasks: Subtask[]) => onPatchTask({ subtasks });
  const completedCount = task.subtasks.filter((subtask) => subtask.completed).length;

  return (
    <Panel
      className={`h-full overflow-auto ${compact ? "p-4" : "p-4 md:p-5"} ${
        fullScreenMobile
          ? "min-h-screen rounded-none border-x-0 border-b-0 border-t-0"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {topAction}
          <Input
            className="mt-2 border-0 bg-transparent px-0 py-0 text-2xl font-bold text-textPrimary focus:border-0 md:text-[30px]"
            value={task.title}
            onChange={(event) => onPatchTask({ title: event.target.value })}
            placeholder="Task title"
          />
        </div>
        <Button
          variant="danger"
          className="px-3 py-2 text-xs"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SummaryChip label="Status" value={getStatusLabel(task.status)} />
        <SummaryChip label="Priority" value={task.priority} />
        <SummaryChip label="Due" value={formatDateLabel(task.dueDate)} />
      </div>

      <div className="mt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
          Notes
        </div>
        <Textarea
          className={`rounded-[20px] border-border bg-background/75 px-4 py-4 text-sm leading-7 ${compact ? "min-h-[42vh]" : "min-h-[38vh] md:min-h-[54vh]"}`}
          value={task.notes}
          onChange={(event) => onPatchTask({ notes: event.target.value })}
          placeholder="Capture debugging notes, meeting notes, links, logs, thoughts, next steps, and anything else needed to finish this task."
        />
      </div>

      <div className="mt-4 space-y-3">
        <Accordion
          title="Subtasks"
          defaultOpen={task.subtasks.length > 0}
          meta={
            task.subtasks.length
              ? `${completedCount}/${task.subtasks.length} completed`
              : "Checklist and smaller steps"
          }
        >
          <div className="space-y-2">
            {task.subtasks.map((subtask, index) => (
              <div
                key={`${subtask.title}-${index}`}
                className="flex gap-2 rounded-xl border border-border bg-card px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={(event) => {
                    const next = [...task.subtasks];
                    next[index] = { ...subtask, completed: event.target.checked };
                    updateSubtasks(next);
                  }}
                />
                <Input
                  className="border-0 bg-transparent px-0 py-0"
                  value={subtask.title}
                  onChange={(event) => {
                    const next = [...task.subtasks];
                    next[index] = { ...subtask, title: event.target.value };
                    updateSubtasks(next);
                  }}
                />
              </div>
            ))}
            <Button
              variant="secondary"
              className="mt-1"
              onClick={() =>
                updateSubtasks([
                  ...task.subtasks,
                  {
                    title: "New subtask",
                    completed: false,
                    order: task.subtasks.length
                  }
                ])
              }
            >
              Add subtask
            </Button>
          </div>
        </Accordion>

        <Accordion
          title="Task Details"
          meta="Status, due date, reminder, pinned, tags, and summary"
        >
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                Summary
              </div>
              <Textarea
                className="min-h-20"
                value={task.description}
                onChange={(event) => onPatchTask({ description: event.target.value })}
                placeholder="Short summary of the task."
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                  Status
                </div>
                <select
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-textPrimary"
                  value={task.status}
                  onChange={(event) =>
                    onPatchTask({ status: event.target.value as Task["status"] })
                  }
                >
                  {taskStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                  Priority
                </div>
                <select
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-textPrimary"
                  value={task.priority}
                  onChange={(event) =>
                    onPatchTask({ priority: event.target.value as Task["priority"] })
                  }
                >
                  {taskPriorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                  Due Date
                </div>
                <Input
                  type="date"
                  value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                  onChange={(event) => onPatchTask({ dueDate: event.target.value || null })}
                />
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                  Due Time
                </div>
                <Input
                  type="time"
                  value={task.dueTime ?? ""}
                  onChange={(event) => onPatchTask({ dueTime: event.target.value || null })}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-3">
                <span className="text-sm text-textPrimary">Pinned</span>
                <input
                  type="checkbox"
                  checked={task.pinned}
                  onChange={(event) => onPatchTask({ pinned: event.target.checked })}
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-3">
                <span className="text-sm text-textPrimary">Reminder Enabled</span>
                <input
                  type="checkbox"
                  checked={task.reminderEnabled}
                  onChange={(event) =>
                    onPatchTask({ reminderEnabled: event.target.checked })
                  }
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                  Reminder Time
                </div>
                <Input
                  type="datetime-local"
                  value={task.reminderAt ? task.reminderAt.slice(0, 16) : ""}
                  onChange={(event) =>
                    onPatchTask({ reminderAt: event.target.value || null })
                  }
                />
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                  Reminder Before
                </div>
                <Input
                  type="number"
                  value={task.reminderBeforeMinutes ?? settings?.defaultReminderBeforeMinutes ?? 15}
                  onChange={(event) =>
                    onPatchTask({
                      reminderBeforeMinutes: event.target.value
                        ? Number(event.target.value)
                        : null
                    })
                  }
                />
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary">
                Tags
              </div>
              <Input
                value={task.tags.join(", ")}
                onChange={(event) =>
                  onPatchTask({
                    tags: event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  })
                }
                placeholder="bug, follow-up, client"
              />
            </div>
          </div>
        </Accordion>
      </div>
    </Panel>
  );
};
