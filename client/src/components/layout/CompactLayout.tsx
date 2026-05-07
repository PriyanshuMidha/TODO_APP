import { Outlet } from "react-router-dom";
import { AppShellProvider } from "./AppShellContext";
import { MobileTopNav } from "./MobileTopNav";
import { ShellModeProvider } from "./ShellModeContext";

const CompactHeader = () => {
  const hideCompactWindow = async () => {
    const tauriWindow = window as Window & {
      __TAURI__?: unknown;
      __TAURI_INTERNALS__?: unknown;
    };

    if (!tauriWindow.__TAURI__ && !tauriWindow.__TAURI_INTERNALS__) {
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("hide_focusdock");
    } catch (error) {
      console.error("Unable to hide compact FocusDock window", error);
    }
  };

  const withCompactWindow = async (
    action: (appWindow: {
      close: () => Promise<void>;
      hide: () => Promise<void>;
      minimize: () => Promise<void>;
    }) => Promise<void>
  ) => {
    const tauriWindow = window as Window & {
      __TAURI__?: unknown;
      __TAURI_INTERNALS__?: unknown;
    };

    if (!tauriWindow.__TAURI__ && !tauriWindow.__TAURI_INTERNALS__) {
      return;
    }

    try {
      const windowModule = await import("@tauri-apps/api/window");
      const appWindow =
        "getCurrentWindow" in windowModule
          ? windowModule.getCurrentWindow()
          : null;

      if (appWindow) {
        await action(appWindow);
      }
    } catch (error) {
      console.error("Compact FocusDock window action failed", error);
    }
  };

  return (
    <div className="mb-3 rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0)),linear-gradient(135deg,rgba(139,92,246,0.12),rgba(139,92,246,0.02))] px-3 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <div
        data-tauri-drag-region
        className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-black/20 px-3 py-2.5"
      >
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.3em] text-textSecondary">
            FocusDock
          </div>
          <div className="mt-1 text-sm font-semibold text-textPrimary">
            Floating Desk
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void hideCompactWindow()}
            className="rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-semibold text-textSecondary transition hover:text-textPrimary"
          >
            Hide
          </button>
          <button
            type="button"
            onClick={() => void withCompactWindow((appWindow) => appWindow.close())}
            className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-[11px] font-semibold text-danger transition hover:bg-danger/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const CompactLayout = () => (
  <ShellModeProvider
    value={{
      basePath: "/compact",
      forceMobile: true,
      isCompactDesktop: true
    }}
  >
    <AppShellProvider>
      <div className="min-h-screen bg-transparent p-3">
        <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[420px] rounded-[28px] border border-white/8 bg-[#101010]/94 p-3 shadow-[0_28px_80px_rgba(0,0,0,0.52)] backdrop-blur-xl">
          <CompactHeader />
          <MobileTopNav />
          <div className="pt-3">
            <Outlet />
          </div>
        </div>
      </div>
    </AppShellProvider>
  </ShellModeProvider>
);
