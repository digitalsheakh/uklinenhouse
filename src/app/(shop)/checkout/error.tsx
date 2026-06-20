"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[checkout error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-foreground">Something went wrong</h1>
      <p className="mt-2 text-sm text-grey-500">
        We hit a problem loading checkout. Your cart is safe, please try again.
        {" "}If you were charged, you won&apos;t be charged again.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <RefreshCw size={16} /> Try again
        </button>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-grey-300 px-5 py-3 text-sm font-semibold text-foreground hover:bg-white"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
