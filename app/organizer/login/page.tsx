"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap, Eye, EyeOff, ArrowRight, AlertCircle, Megaphone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";

function OrganizerLoginContent() {
  const router = useRouter();
  const { logIn, isAuthenticated, loading } = useAuth();
  const { setRole } = useRole();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");

  // Already logged in — set organizer role and redirect
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setRole("organizer");
      router.replace("/organizer/dashboard");
    }
  }, [isAuthenticated, loading, router, setRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password."); return; }

    setSubmitting(true);
    try {
      await logIn(email.trim(), password);
      setRole("organizer");
      router.replace("/organizer/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-surface-secondary">
      <div className="w-full max-w-md">

        {/* Logo + portal label */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-ink">
            CITY<span className="text-brand-500">BUZZ</span>
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-8">
          <Megaphone className="h-3.5 w-3.5 text-brand-500" />
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest">
            Organizer Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border shadow-card-lg p-8">
          <h1 className="text-display-sm font-bold text-ink mb-1">Welcome back</h1>
          <p className="text-body-sm text-ink-muted mb-6">
            Sign in to your organiser account to manage and create events.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-ink">
                Email address
              </label>
              <input
                id="email" type="email" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="official@organisation.com"
                className="h-11 px-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-ink">
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password" type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full h-11 pl-4 pr-11 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
                <button
                  type="button" onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit" variant="primary" size="lg" fullWidth
              loading={submitting}
              rightIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined}
              className="mt-1"
            >
              {submitting ? "Signing in…" : "Sign In as Organiser"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button variant="outline" size="lg" fullWidth href="/organizer/signup">
            Register New Organiser Account
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-ink-muted mt-6">
          Not an organiser?{" "}
          <Link href="/login" className="font-semibold text-brand-500 hover:text-brand-600 transition-colors">
            Participant login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function OrganizerLoginPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" /></div>}><OrganizerLoginContent /></Suspense>;
}
