"use client";

import { useState } from "react";
import { Truck, Search } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder — wire to /api/orders/track once order tracking is built.
    setMessage(
      "Order tracking is coming soon. For now, please contact us with your order number and we'll update you right away."
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-grey-100 text-foreground">
          <Truck size={22} />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Track Your Order</h1>
        <p className="mt-2 text-sm text-grey-500">
          Enter your order number and email to see the latest status.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-grey-200 bg-white p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-grey-700">Order number</label>
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} required className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground" placeholder="e.g. ULH-10234" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-grey-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground" placeholder="you@email.com" />
        </div>
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-white hover:bg-accent-hover">
          <Search size={16} /> Track Order
        </button>
        {message && <p className="rounded-lg bg-grey-50 px-4 py-3 text-sm text-grey-600">{message}</p>}
      </form>
    </div>
  );
}
