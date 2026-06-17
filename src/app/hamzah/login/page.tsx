"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast.success("Welcome back");
      router.push("/hamzah");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grey-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-white">
            <Lock size={20} />
          </div>
          <h1 className="text-xl font-semibold text-foreground">UK Linen House</h1>
          <p className="mt-1 text-sm text-grey-500">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-grey-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-grey-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="admin@uklinenhouse.co.uk"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-grey-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-grey-200 px-3 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
