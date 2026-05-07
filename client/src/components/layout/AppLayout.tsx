import { Outlet } from "react-router-dom";
import { AppShellProvider } from "./AppShellContext";
import { MobileTopNav } from "./MobileTopNav";
import { Sidebar } from "./Sidebar";
import { TaskDetailPanel } from "../tasks/TaskDetailPanel";

export const AppLayout = () => {
  return (
    <AppShellProvider>
      <>
        <div className="hidden min-h-screen p-4 md:block md:p-5">
          <div className="grid min-h-[calc(100vh-2rem)] gap-4 md:grid-cols-[220px_minmax(0,1fr)_400px] xl:grid-cols-[240px_minmax(0,1fr)_420px]">
            <Sidebar />
            <div className="min-w-0">
              <Outlet />
            </div>
            <div className="min-w-0 md:max-h-[calc(100vh-2rem)]">
              <TaskDetailPanel />
            </div>
          </div>
        </div>

        <div className="min-h-screen md:hidden">
          <MobileTopNav />
          <div className="mobile-page-offset">
            <Outlet />
          </div>
        </div>
      </>
    </AppShellProvider>
  );
};
