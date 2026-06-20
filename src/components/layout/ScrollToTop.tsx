"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets scroll to the top whenever the route changes, so opening a
 * product (or any page) always starts at the top.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
