"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, Lock, Mail, User as UserIcon, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

export default function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login" ? { email, password } : { name, email, password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      toast.success(mode === "login" ? "Welcome back!" : "Account created — welcome!");
      // The server component re-reads the auth cookie and renders the dashboard.
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setPassword("");
  }

  return (
    <div className="bg-grey-50">
      <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent">
            UK Linen House Account
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {mode === "login" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-grey-500">
            {mode === "login"
              ? "Access your orders, addresses and account details."
              : "Join UK Linen House to track orders and check out faster."}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-lg border border-grey-200 bg-white p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`rounded-md py-2 transition-colors ${
              mode === "login" ? "bg-accent text-white" : "text-grey-600 hover:text-foreground"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`rounded-md py-2 transition-colors ${
              mode === "register" ? "bg-accent text-white" : "text-grey-600 hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-grey-200 bg-white p-6 sm:p-8"
        >
          {mode === "register" && (
            <Field
              icon={<UserIcon size={17} />}
              label="Full name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Jane Smith"
              autoComplete="name"
              required
            />
          )}

          <Field
            icon={<Mail size={17} />}
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <div className="flex items-center overflow-hidden rounded-lg border border-grey-300 transition-colors focus-within:border-accent">
              <span className="pl-3 text-grey-400">
                <Lock size={17} />
              </span>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "At least 8 characters" : "Your password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={mode === "register" ? 8 : undefined}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-grey-400"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="px-3 text-grey-400 hover:text-grey-600"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>

          <p className="text-center text-sm text-grey-500">
            {mode === "login" ? (
              <>
                New to UK Linen House?{" "}
                <button type="button" onClick={() => switchMode("register")} className="font-semibold text-accent hover:underline">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("login")} className="font-semibold text-accent hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-grey-400">
          Looking for a trade account?{" "}
          <Link href="/wholesale" className="font-medium text-accent hover:underline">
            Apply for wholesale pricing
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center overflow-hidden rounded-lg border border-grey-300 transition-colors focus-within:border-accent">
        <span className="pl-3 text-grey-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-grey-400"
        />
      </div>
    </div>
  );
}
