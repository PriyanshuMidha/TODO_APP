import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { useAppShell } from "../components/layout/AppShellContext";
import { TaskWorkspace } from "../components/tasks/TaskWorkspace";

export const MobileTaskDetailPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, settings, saveTask, deleteTask } = useAppShell();
  const task = useMemo(
    () => tasks.find((item) => item._id === taskId) ?? null,
    [tasks, taskId]
  );

  if (!task) {
    return (
      <div className="px-4 py-4 md:hidden">
        <EmptyState
          compact
          title="Task not found"
          description="Go back to the task list and pick another task."
        />
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <TaskWorkspace
        compact
        fullScreenMobile
        task={task}
        settings={settings}
        onPatchTask={(payload) => void saveTask(task._id, payload)}
        onDelete={() => {
          void deleteTask(task._id);
          navigate("/app/tasks");
        }}
        topAction={
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/app/tasks");
              }
            }}
            className="text-xs font-semibold uppercase tracking-[0.24em] text-textSecondary"
          >
            Back
          </button>
        }
      />
    </div>
  );
};
