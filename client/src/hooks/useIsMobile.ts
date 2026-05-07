import { useEffect, useState } from "react";
import { useShellMode } from "../components/layout/ShellModeContext";

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
  const { forceMobile } = useShellMode();
  const getValue = () =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false;

  const [isMobile, setIsMobile] = useState(forceMobile || getValue);

  useEffect(() => {
    const handleResize = () => setIsMobile(forceMobile || getValue());

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [forceMobile]);

  return isMobile;
};
