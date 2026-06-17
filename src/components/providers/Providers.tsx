"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "./SmoothScroll";

/**
 * Global client-side providers: smooth scroll + toast notifications.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
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
    </SmoothScroll>
  );
}
