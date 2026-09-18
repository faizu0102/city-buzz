"use client";

import React, { useState } from "react";
import {
  X, User, Phone, Mail, Send, CheckCircle2, AlertCircle, Calendar, MapPin,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterButtonProps {
  event: Pick<Event, "id" | "title" | "date" | "venue" | "isFree" | "registrationStatus">;
}

type FormState = "idle" | "submitting" | "success" | "error";

// ─── Modal ────────────────────────────────────────────────────────────────────

function RegisterModal({
  event,
  onClose,
}: {
  event: RegisterButtonProps["event"];
  onClose: () => void;
}) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [phone, setPhone]   = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError]   = useState("");

  // Prevent background scroll while modal is open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim())  { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address."); return;
    }

    setFormState("submitting");

    try {
      // Phase 2: simulate a short delay and store locally.
      // In Phase 3 replace this with a real Firestore write / API call.
      await new Promise((res) => setTimeout(res, 900));

      // Persist interest locally (guest-mode) so we don't lose it
      try {
        const key  = "citybuzz_registrations";
        const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as object[];
        prev.push({
          eventId:   event.id,
          eventTitle: event.title,
          name:      name.trim(),
          email:     email.trim(),
          phone:     phone.trim() || null,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(prev));
      } catch {
        // localStorage unavailable — not critical
      }

      setFormState("success");
    } catch {
      setFormState("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="register-modal-title"
    >
      <div
        className={cn(
          "w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden",
          "animate-fade-up"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <h2 id="register-modal-title" className="font-bold text-ink text-heading-xl">
              Register for Event
            </h2>
            <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close registration form"
            className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* ── Success state ── */}
          {formState === "success" ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="font-bold text-ink text-heading-xl mb-1">You&apos;re registered!</p>
                <p className="text-body-sm text-ink-muted max-w-xs">
                  We&apos;ve noted your interest. You&apos;ll receive event details on your email closer to the date.
                </p>
              </div>

              {/* Event summary */}
              <div className="w-full bg-surface-secondary rounded-2xl border border-border p-4 text-sm text-left flex flex-col gap-2">
                <div className="flex items-center gap-2 text-ink-secondary">
                  <Calendar className="h-4 w-4 text-brand-400 shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-secondary">
                  <MapPin className="h-4 w-4 text-brand-400 shrink-0" />
                  <span className="line-clamp-1">{event.venue}</span>
                </div>
              </div>

              <Button variant="primary" size="lg" fullWidth onClick={onClose}>
                Done
              </Button>
            </div>
          ) : (
            /* ── Registration form ── */
            <>
              {/* Event info strip */}
              <div className="mb-5 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-sm flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-brand-700">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-700">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="line-clamp-1">{event.venue}</span>
                </div>
                {event.isFree && (
                  <div className="flex items-center gap-2 text-green-700 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-semibold">Free entry</span>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-name" className="text-sm font-semibold text-ink">
                    Your name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                    <input
                      id="reg-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-email" className="text-sm font-semibold text-ink">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Phone (optional) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-phone" className="text-sm font-semibold text-ink">
                    Phone <span className="text-ink-muted font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                    <input
                      id="reg-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={formState === "submitting"}
                  rightIcon={formState !== "submitting" ? <Send className="h-4 w-4" /> : undefined}
                >
                  {formState === "submitting" ? "Submitting…" : "Register Now"}
                </Button>

                <p className="text-xs text-ink-muted text-center">
                  Your details will only be used to notify you about this event.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main export — the button that opens the modal ────────────────────────────

export default function RegisterButton({ event }: RegisterButtonProps) {
  const [open, setOpen] = useState(false);

  const isDisabled =
    event.registrationStatus === "Full" ||
    event.registrationStatus === "Closing Soon" && false; // still allow "Closing Soon"

  return (
    <>
      {/* Registration CTA area — replaces the old disabled block */}
      <div className="flex flex-col gap-2">
        {event.registrationStatus !== "Full" ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setOpen(true)}
            disabled={isDisabled}
          >
            Register for this Event
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-red-50 rounded-xl p-3 border border-red-100">
            <p className="text-xs text-center text-red-600 font-medium">
              This event is fully booked
            </p>
          </div>
        )}

        {event.registrationStatus === "Closing Soon" && (
          <p className="text-xs text-center text-amber-600 font-medium">
            ⚡ Registration closing soon — act fast!
          </p>
        )}
      </div>

      {open && (
        <RegisterModal event={event} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
