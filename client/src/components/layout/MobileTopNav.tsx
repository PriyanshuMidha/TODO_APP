import { NavLink } from "react-router-dom";

const mobileNavItems = [
  { label: "Today", path: "/app/today" },
  { label: "Tasks", path: "/app/tasks" },
  { label: "Pinned", path: "/app/pinned" },
  { label: "Settings", path: "/app/settings" }
];

export const MobileTopNav = () => (
  <div className="mobile-top-nav fixed left-3 right-3 z-50 md:hidden">
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
