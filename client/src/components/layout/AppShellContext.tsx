import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { settingsService } from "../../services/settingsService";
import { taskService } from "../../services/taskService";
import type { Settings, Task } from "../../types";

interface AppShellContextValue {
  tasks: Task[];
  settings: Settings | null;
  loading: boolean;
  taskError: string | null;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  refreshAll: () => Promise<void>;
  createTask: (title: string) => Promise<void>;
  saveTask: (taskId: string, payload: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task["status"]) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  saveSettings: (payload: Partial<Settings>) => Promise<void>;
}

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

export const AppShellProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const refreshTasks = async (preferredTaskId?: string | null) => {
    try {
      const taskResponse = await taskService.list();
      setTaskError(null);
      setTasks(taskResponse.tasks);
      setSelectedTaskId((current) => {
        const nextSelectedTaskId = preferredTaskId ?? current;

        if (
          nextSelectedTaskId &&
          taskResponse.tasks.some((task) => task._id === nextSelectedTaskId)
        ) {
          return nextSelectedTaskId;
        }

        return taskResponse.tasks[0]?._id ?? null;
      });

      return taskResponse.tasks;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load tasks";
      setTaskError(message);
      throw error;
    }
  };

  const refreshSettings = async () => {
    const settingsResponse = await settingsService.get();
    setSettings(settingsResponse.settings);
    return settingsResponse.settings;
  };

  const refreshAll = async () => {
    setLoading(true);

    try {
      const [tasksResult, settingsResult] = await Promise.allSettled([
        refreshTasks(),
        refreshSettings()
      ]);

      if (tasksResult.status === "rejected") {
        console.error("Unable to load tasks", tasksResult.reason);
      }

      if (settingsResult.status === "rejected") {
        console.error("Unable to load settings", settingsResult.reason);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshAll();
  }, []);

  const createTask = async (title: string) => {
    console.log("Creating task:", title);

    try {
      const response = await taskService.create({
        title,
        description: "",
        notes: "",
        priority: "medium",
        status: "todo",
        reminderEnabled: false,
        reminderBeforeMinutes: settings?.defaultReminderBeforeMinutes ?? 15,
        pinned: false,
        subtasks: [],
        tags: []
      });

      console.log("Create task response:", response);
      await refreshTasks(response.task._id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create task";
      setTaskError(message);
      console.error("Create task failed:", error);
      throw error;
    }
  };

  const saveTask = async (taskId: string, payload: Partial<Task>) => {
    const response = await taskService.update(taskId, payload);
    setTasks((current) =>
      current.map((task) => (task._id === taskId ? response.task : task))
    );
  };

  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    const response = await taskService.updateStatus(taskId, status);
    setTasks((current) =>
      current.map((task) => (task._id === taskId ? response.task : task))
    );
  };

  const deleteTask = async (taskId: string) => {
    await taskService.remove(taskId);
    setTasks((current) => current.filter((task) => task._id !== taskId));
    setSelectedTaskId((current) => (current === taskId ? null : current));
  };

  const saveSettings = async (payload: Partial<Settings>) => {
    const response = await settingsService.update(payload);
    setSettings(response.settings);
  };

  const value = useMemo(
    () => ({
      tasks,
      settings,
      loading,
      taskError,
      selectedTaskId,
      setSelectedTaskId,
      refreshAll,
      createTask,
      saveTask,
      updateTaskStatus,
      deleteTask,
      saveSettings
    }),
    [tasks, settings, loading, taskError, selectedTaskId]
  );

  return (
    <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>
  );
};

export const useAppShell = () => {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error("useAppShell must be used inside AppShellProvider");
  }

  return context;
};
