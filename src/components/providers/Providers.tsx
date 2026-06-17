"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/**
 * Global client-side providers: toast notifications.
 * (Native browser scrolling — no smooth-scroll inertia.)
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#ffffff",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
}
