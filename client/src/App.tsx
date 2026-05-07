import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AppShellProvider } from "./components/layout/AppShellContext";
import { MobileTaskDetailPage } from "./pages/MobileTaskDetailPage";
import { PinnedPage } from "./pages/PinnedPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StickyPage } from "./pages/StickyPage";
import { TasksPage } from "./pages/TasksPage";
import { TodayPage } from "./pages/TodayPage";

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/app/today" replace />} />
    <Route
      path="/sticky"
      element={
        <AppShellProvider>
          <StickyPage />
        </AppShellProvider>
      }
    />
    <Route path="/app" element={<AppLayout />}>
      <Route index element={<Navigate to="/app/today" replace />} />
      <Route path="today" element={<TodayPage />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="pinned" element={<PinnedPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="task/:taskId" element={<MobileTaskDetailPage />} />
    </Route>
  </Routes>
);

export default App;
