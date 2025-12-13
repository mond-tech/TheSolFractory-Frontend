import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean | null {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );

    const onChange = () => {
      setIsMobile(mql.matches);
    };

    // Set immediately on mount
    setIsMobile(mql.matches);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
