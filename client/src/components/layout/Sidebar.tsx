import { NavLink } from "react-router-dom";
import { Panel } from "../common/Panel";
import { sidebarItems } from "../../utils/constants";

export const Sidebar = () => {
  return (
    <Panel className="flex h-full flex-col gap-4 p-3 md:p-4">
      <div className="px-1">
        <div className="text-xs uppercase tracking-[0.35em] text-textSecondary">
          FocusDock
        </div>
        <h1 className="mt-2 text-lg font-bold text-textPrimary">Tasks with room to think.</h1>
      </div>

      <nav className="flex flex-1 gap-2 overflow-x-auto md:flex-col">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `shrink-0 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-accent text-white"
                  : "text-textSecondary hover:bg-background/90 hover:text-textPrimary"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </Panel>
  );
};
