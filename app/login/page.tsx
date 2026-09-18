"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logIn, isAuthenticated, loading } = useAuth();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const returnTo = searchParams.get("returnTo") || "/";

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace(returnTo);
  }, [isAuthenticated, loading, router, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password."); return; }
    setSubmitting(true);
    try {
      await logIn(email.trim(), password);
      router.replace(returnTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-surface-secondary">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-ink">
            CITY<span className="text-brand-500">BUZZ</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-card-lg p-8">
          <h1 className="text-display-sm font-bold text-ink mb-1">Welcome back</h1>
          <p className="text-body-sm text-ink-muted mb-6">Sign in to your CityBuzz account</p>

          <div className="mb-5 p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-700">
            <strong>Demo credentials:</strong> demo@citybuzz.in / password123
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-ink">Email address</label>
              <input id="email" type="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="h-11 px-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-ink">Password</label>
                <Link href="/reset-password" className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input id="password" type={showPass ? "text" : "password"} autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
                  className="w-full h-11 pl-4 pr-11 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}
              rightIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined} className="mt-1">
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link href={`/signup${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
              className="font-semibold text-brand-500 hover:text-brand-600 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-ink-muted mt-6">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-ink transition-colors">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-ink transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
