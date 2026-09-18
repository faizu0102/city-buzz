"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap, Eye, EyeOff, ArrowRight, AlertCircle,
  CheckCircle2, Building2, User, Mail, Phone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import Button from "@/components/ui/Button";

// ─── Organisation types ───────────────────────────────────────────────────────

const ORG_TYPES = [
  { value: "college",      label: "College / University",  icon: "🎓" },
  { value: "company",      label: "Company / Startup",     icon: "🏢" },
  { value: "ngo",          label: "NGO / Non-profit",      icon: "🤝" },
  { value: "government",   label: "Government / Municipal", icon: "🏛️" },
  { value: "school",       label: "School",                icon: "📚" },
  { value: "sports_club",  label: "Sports Club",           icon: "🏆" },
  { value: "cultural",     label: "Cultural Organisation", icon: "🎭" },
  { value: "individual",   label: "Individual Organiser",  icon: "👤" },
  { value: "other",        label: "Other",                 icon: "📌" },
] as const;

type OrgType = (typeof ORG_TYPES)[number]["value"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizerSignupPage() {
  const router = useRouter();
  const { signUp, isAuthenticated, loading } = useAuth();
  const { setRole } = useRole();

  // Step 1 — Org type
  // Step 2 — Org details + account credentials
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [orgType, setOrgType] = useState<OrgType | "">("");

  // Step 2 fields
  const [orgName,      setOrgName]      = useState("");
  const [contactName,  setContactName]  = useState("");
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [website,      setWebsite]      = useState("");
  const [password,     setPassword]     = useState("");
  const [showPass,     setShowPass]     = useState(false);

  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");

  // Redirect already-logged-in organizers
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setRole("organizer");
      router.replace("/organizer/dashboard");
    }
  }, [isAuthenticated, loading, router, setRole]);

  // Password checks
  const passwordChecks = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "Contains a number",      ok: /\d/.test(password) },
    { label: "Contains a letter",      ok: /[a-zA-Z]/.test(password) },
  ];

  const handleStep1 = () => {
    if (!orgType) { setError("Please select your organisation type."); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!orgName.trim())     { setError("Organisation name is required."); return; }
    if (!contactName.trim()) { setError("Contact person name is required."); return; }
    if (!email.trim())       { setError("Email address is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address."); return;
    }
    if (!phone.trim())       { setError("Phone number is required for organisers."); return; }
    if (!password)           { setError("Please choose a password."); return; }
    if (!passwordChecks.every((c) => c.ok)) {
      setError("Password must be at least 6 characters with a letter and a number."); return;
    }

    setSubmitting(true);
    try {
      // fullName format: "OrgName · ContactName" so both are preserved
      const fullName = `${orgName.trim()} · ${contactName.trim()}`;
      await signUp(email.trim(), password, fullName, phone.trim());

      // Store org metadata in localStorage for the profile/dashboard
      try {
        localStorage.setItem("citybuzz_org_meta", JSON.stringify({
          orgType,
          orgName:     orgName.trim(),
          contactName: contactName.trim(),
          website:     website.trim() || null,
          registeredAt: new Date().toISOString(),
        }));
      } catch { /* ignore */ }

      // Set role to organizer immediately
      setRole("organizer");
      router.replace("/organizer/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
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
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tight text-ink">
            CITY<span className="text-brand-500">BUZZ</span>
          </span>
        </div>
        <p className="text-center text-xs font-semibold text-brand-500 uppercase tracking-widest mb-8">
          Organizer Portal
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                step >= s ? "text-brand-500" : "text-ink-muted"
              }`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  step > s
                    ? "bg-brand-500 border-brand-500 text-white"
                    : step === s
                    ? "border-brand-500 text-brand-500"
                    : "border-border text-ink-muted"
                }`}>
                  {step > s ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
                </div>
                {s === 1 ? "Organisation Type" : "Your Details"}
              </div>
              {s < 2 && <div className={`flex-1 max-w-[60px] h-0.5 rounded ${step > 1 ? "bg-brand-500" : "bg-border"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border shadow-card-lg p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* ── STEP 1 — Org type picker ── */}
          {step === 1 && (
            <>
              <h1 className="text-display-sm font-bold text-ink mb-1">What type of organiser are you?</h1>
              <p className="text-body-sm text-ink-muted mb-6">
                This helps us tailor the experience for your organisation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {ORG_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => { setOrgType(type.value); setError(""); }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      orgType === type.value
                        ? "border-brand-500 bg-brand-50"
                        : "border-border hover:border-brand-300 hover:bg-surface-secondary"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{type.icon}</span>
                    <span className={`text-sm font-semibold ${
                      orgType === type.value ? "text-brand-600" : "text-ink-secondary"
                    }`}>
                      {type.label}
                    </span>
                    {orgType === type.value && (
                      <CheckCircle2 className="h-4 w-4 text-brand-500 ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <Button
                variant="primary" size="lg" fullWidth
                onClick={handleStep1}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                disabled={!orgType}
              >
                Continue
              </Button>
            </>
          )}

          {/* ── STEP 2 — Details form ── */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center text-xl shrink-0">
                  {ORG_TYPES.find((t) => t.value === orgType)?.icon}
                </div>
                <div>
                  <h1 className="text-heading-xl font-bold text-ink">Your Organisation Details</h1>
                  <p className="text-xs text-ink-muted">
                    {ORG_TYPES.find((t) => t.value === orgType)?.label}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="ml-2 text-brand-500 hover:text-brand-600 font-medium"
                    >
                      Change →
                    </button>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                {/* Org name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orgName" className="text-sm font-semibold text-ink">
                    Organisation Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                    <input
                      id="orgName" type="text"
                      value={orgName} onChange={(e) => setOrgName(e.target.value)}
                      placeholder={
                        orgType === "college" ? "e.g. NIT Nizamabad" :
                        orgType === "government" ? "e.g. Nizamabad Municipal Corporation" :
                        orgType === "individual" ? "Your full name" :
                        "e.g. Nizamabad Sports Club"
                      }
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Contact person */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contactName" className="text-sm font-semibold text-ink">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                    <input
                      id="contactName" type="text"
                      value={contactName} onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full name of the event coordinator"
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orgEmail" className="text-sm font-semibold text-ink">
                    Official Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                    <input
                      id="orgEmail" type="email" autoComplete="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="official@organisation.com"
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orgPhone" className="text-sm font-semibold text-ink">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                    <input
                      id="orgPhone" type="tel" autoComplete="tel"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Website (optional) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="website" className="text-sm font-semibold text-ink">
                    Website / Social Page <span className="text-ink-muted font-normal">(optional)</span>
                  </label>
                  <input
                    id="website" type="url"
                    value={website} onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourorganisation.com or Instagram link"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orgPassword" className="text-sm font-semibold text-ink">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="orgPassword" type={showPass ? "text" : "password"}
                      autoComplete="new-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a strong password"
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
                  {password.length > 0 && (
                    <ul className="flex flex-col gap-1 mt-0.5">
                      {passwordChecks.map((c) => (
                        <li key={c.label} className="flex items-center gap-1.5 text-xs">
                          <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${c.ok ? "text-green-500" : "text-ink-disabled"}`} />
                          <span className={c.ok ? "text-green-700" : "text-ink-muted"}>{c.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Trust note */}
                <p className="text-xs text-ink-muted bg-surface-secondary rounded-xl p-3 border border-border">
                  📋 Your organisation details will be reviewed by CityBuzz before events go live.
                  Fake or misleading information will result in account suspension.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    type="submit" variant="primary" size="lg" fullWidth
                    loading={submitting}
                    rightIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined}
                  >
                    {submitting ? "Creating Account…" : "Create Organiser Account"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-ink-muted mt-6">
          Already have an organiser account?{" "}
          <Link href="/organizer/login" className="font-semibold text-brand-500 hover:text-brand-600 transition-colors">
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs text-ink-muted mt-2">
          Looking for events?{" "}
          <Link href="/events" className="underline hover:text-ink transition-colors">
            Browse as Participant
          </Link>
        </p>
      </div>
    </div>
  );
}
