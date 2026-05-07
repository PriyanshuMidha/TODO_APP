import { NavLink } from "react-router-dom";
import { useShellMode } from "./ShellModeContext";

export const MobileTopNav = () => {
  const { basePath, forceMobile, isCompactDesktop } = useShellMode();
  const mobileNavItems = [
    { label: "Today", path: `${basePath}/today` },
    { label: "Tasks", path: `${basePath}/tasks` },
    { label: "Pinned", path: `${basePath}/pinned` },
    { label: "Settings", path: `${basePath}/settings` }
  ];

  return (
    <div
      className={
        isCompactDesktop
          ? "relative z-20"
          : `mobile-top-nav fixed left-3 right-3 z-50 ${forceMobile ? "" : "md:hidden"}`
      }
    >
      <nav className="grid grid-cols-4 gap-2 rounded-[22px] border border-border bg-card/95 p-2 shadow-panel backdrop-blur">
        {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `rounded-2xl px-2 py-2 text-center text-xs font-medium transition ${
              isActive
                ? "bg-accent text-white"
                : "text-textSecondary hover:bg-background/80 hover:text-textPrimary"
            }`
          }
        >
          {item.label}
        </NavLink>
        ))}
      </nav>
    </div>
  );
};
