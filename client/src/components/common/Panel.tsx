import type { ReactNode } from "react";

export const Panel = ({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[24px] border border-border/80 bg-card/90 shadow-panel backdrop-blur ${className}`}
  >
    {children}
  </div>
);
