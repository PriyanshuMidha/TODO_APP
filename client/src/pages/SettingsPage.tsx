import { Panel } from "../components/common/Panel";
import { Input } from "../components/common/Input";
import { useAppShell } from "../components/layout/AppShellContext";
import { useIsMobile } from "../hooks/useIsMobile";

export const SettingsPage = () => {
  const isMobile = useIsMobile();
  const { settings, saveSettings } = useAppShell();

  if (isMobile) {
    return (
      <div className="space-y-4 px-4 py-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textSecondary">
            Settings
          </div>
          <h1 className="mt-2 text-2xl font-bold text-textPrimary">Task Defaults</h1>
        </div>

        <div className="rounded-[20px] border border-border bg-card p-4">
          <div className="text-sm text-textSecondary">Theme</div>
          <div className="mt-2 text-base font-semibold text-textPrimary">
            {settings?.theme ?? "dark"}
          </div>
        </div>

        <div className="rounded-[20px] border border-border bg-card p-4">
          <div className="text-sm text-textSecondary">Default reminder lead time</div>
          <Input
            className="mt-3"
            type="number"
            value={settings?.defaultReminderBeforeMinutes ?? 15}
            onChange={(event) =>
              void saveSettings({
                defaultReminderBeforeMinutes: Number(event.target.value || 15)
              })
            }
          />
        </div>
      </div>
    );
  }

  return (
    <Panel className="h-full p-5">
      <div className="text-xs uppercase tracking-[0.3em] text-textSecondary">
        Settings
      </div>
      <h2 className="mt-2 text-3xl font-bold text-textPrimary">Task Defaults</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[22px] border border-border bg-background/70 p-4">
          <div className="text-sm text-textSecondary">Theme</div>
          <div className="mt-2 text-lg font-semibold">{settings?.theme ?? "dark"}</div>
        </div>
        <div className="rounded-[22px] border border-border bg-background/70 p-4">
          <div className="text-sm text-textSecondary">Default reminder lead time</div>
          <Input
            className="mt-3"
            type="number"
            value={settings?.defaultReminderBeforeMinutes ?? 15}
            onChange={(event) =>
              void saveSettings({
                defaultReminderBeforeMinutes: Number(event.target.value || 15)
              })
            }
          />
        </div>
      </div>
    </Panel>
  );
};
