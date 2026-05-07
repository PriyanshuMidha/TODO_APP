import { createContext, useContext, type ReactNode } from "react";

export interface ShellModeValue {
  basePath: "/app" | "/compact";
  forceMobile: boolean;
  isCompactDesktop: boolean;
}

const ShellModeContext = createContext<ShellModeValue>({
  basePath: "/app",
  forceMobile: false,
  isCompactDesktop: false
});

export const ShellModeProvider = ({
  children,
  value
}: {
  children: ReactNode;
  value: ShellModeValue;
}) => (
  <ShellModeContext.Provider value={value}>{children}</ShellModeContext.Provider>
);

export const useShellMode = () => useContext(ShellModeContext);
