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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const refreshAll = async () => {
    setLoading(true);

    try {
      const [taskResponse, settingsResponse] = await Promise.all([
        taskService.list(),
        settingsService.get()
      ]);
      setTasks(taskResponse.tasks);
      setSettings(settingsResponse.settings);
      setSelectedTaskId((current) => current ?? taskResponse.tasks[0]?._id ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshAll();
  }, []);

  const createTask = async (title: string) => {
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

    setTasks((current) => [response.task, ...current]);
    setSelectedTaskId(response.task._id);
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
      selectedTaskId,
      setSelectedTaskId,
      refreshAll,
      createTask,
      saveTask,
      updateTaskStatus,
      deleteTask,
      saveSettings
    }),
    [tasks, settings, loading, selectedTaskId]
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
