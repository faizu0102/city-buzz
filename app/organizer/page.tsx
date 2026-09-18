"use client";

import React from "react";
import {
  Megaphone, CheckCircle2, BarChart2, Users, Bell,
  Globe, ArrowRight, Star, Send, LogIn, UserPlus,
} from "lucide-react";
import OrganizerEnquiryForm from "@/components/forms/OrganizerEnquiryForm";
import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";

// ─── Static data ──────────────────────────────────────────────────────────────

const features = [
  {
    icon: Globe,
    title: "City-Wide Reach",
    desc: "Your event is discovered by everyone browsing CityBuzz in Nizamabad.",
  },
  {
    icon: Users,
    title: "Easy Registration",
    desc: "Attendees register directly on CityBuzz. No external tools needed.",
  },
  {
    icon: BarChart2,
    title: "Track Attendance",
    desc: "See registrations, interest counts and attendee data in real time.",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    desc: "CityBuzz sends reminders to registered attendees so turnout improves.",
  },
  {
    icon: CheckCircle2,
    title: "Free During Phase 1",
    desc: "Listing your event is completely free during our launch phase.",
  },
  {
    icon: Star,
    title: "Featured Placement",
    desc: "Selected events get featured spots on the homepage and category pages.",
  },
];

const steps = [
  { n: "01", title: "Create an Account", desc: "Sign up as an organiser — select your organisation type and fill in basic details." },
  { n: "02", title: "Fill Event Details", desc: "Title, description, date, time, location, category and an event image." },
  { n: "03", title: "Publish Instantly",  desc: "Your event goes live immediately on CityBuzz and is visible to all of Nizamabad." },
  { n: "04", title: "Track & Manage",     desc: "Monitor registrations and manage your events from your organiser dashboard." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizerPage() {
  const { isAuthenticated, loading } = useAuth();
  const { isOrganizer } = useRole();

  const isOrgLoggedIn = isAuthenticated && isOrganizer;

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-ink py-20 md:py-28">
        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative cb-container">
          <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/25 rounded-full px-4 py-1.5 mb-5">
            <Megaphone className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-semibold text-brand-300 uppercase tracking-widest">
              For Organizers
            </span>
          </div>

          <h1 className="text-display-md md:text-display-lg font-bold text-white leading-tight mb-5 max-w-2xl">
            Have an Event in{" "}
            <span className="text-brand-400">Nizamabad?</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-xl mb-8">
            Publish your event on CityBuzz and reach people across the city.
            From cultural programs to sports meets — we help you fill every seat.
          </p>

          {/* ── Auth-aware CTA buttons ── */}
          {!loading && (
            <div className="flex flex-wrap gap-3">
              {isOrgLoggedIn ? (
                /* Already logged in as organizer */
                <>
                  <Button
                    variant="primary" size="xl"
                    href="/organizer/create"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Create New Event
                  </Button>
                  <Button
                    variant="outline" size="xl"
                    href="/organizer/dashboard"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  >
                    Go to Dashboard
                  </Button>
                </>
              ) : isAuthenticated ? (
                /* Logged in as participant — offer switch */
                <>
                  <Button
                    variant="primary" size="xl"
                    href="/organizer/create"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Create an Event
                  </Button>
                  <Button
                    variant="outline" size="xl"
                    href="/organizer/dashboard"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  >
                    My Dashboard
                  </Button>
                </>
              ) : (
                /* Not logged in — primary CTA is signup */
                <>
                  <Button
                    variant="primary" size="xl"
                    href="/organizer/signup"
                    rightIcon={<UserPlus className="h-4 w-4" />}
                  >
                    Register as Organiser
                  </Button>
                  <Button
                    variant="outline" size="xl"
                    href="/organizer/login"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    rightIcon={<LogIn className="h-4 w-4" />}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Trust signals */}
          <div className="flex flex-wrap gap-5 mt-10 pt-8 border-t border-white/10">
            {[
              "Free event listing",
              "Publish instantly",
              "City-wide visibility",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-white/60">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Auth gate banner (shown only when not logged in) ── */}
      {!loading && !isAuthenticated && (
        <div className="bg-brand-50 border-b border-brand-100">
          <div className="cb-container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                <Megaphone className="h-4.5 w-4.5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Ready to list your event?</p>
                <p className="text-xs text-ink-muted">Create a free account — takes under 2 minutes.</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" href="/organizer/login">
                Sign In
              </Button>
              <Button variant="primary" size="sm" href="/organizer/signup">
                Register Free
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Features ── */}
      <Section className="bg-white">
        <div className="text-center mb-12">
          <p className="text-label-md uppercase tracking-widest text-brand-500 mb-2">Why List on CityBuzz</p>
          <h2 className="text-display-sm font-bold text-ink">
            Everything You Need to Run a Successful Event
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-border bg-white hover:shadow-card-hover transition-all duration-200"
              >
                <div className="h-11 w-11 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-brand-500" />
                </div>
                <h3 className="font-bold text-ink text-heading-lg mb-2">{f.title}</h3>
                <p className="text-body-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── How to list ── */}
      <Section className="bg-surface-secondary">
        <div className="text-center mb-12">
          <p className="text-label-md uppercase tracking-widest text-brand-500 mb-2">Simple Process</p>
          <h2 className="text-display-sm font-bold text-ink">How to List Your Event</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {steps.map((s) => (
            <div key={s.n} className="bg-white rounded-2xl border border-border p-6 text-center">
              <div className="text-3xl font-black text-brand-100 mb-3">{s.n}</div>
              <h3 className="font-bold text-ink text-heading-lg mb-2">{s.title}</h3>
              <p className="text-body-sm text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA — auth aware ── */}
        <div className="bg-white rounded-3xl border border-border shadow-card-lg p-8 text-center max-w-lg mx-auto">
          {!loading && isOrgLoggedIn ? (
            <>
              <h3 className="font-bold text-ink text-heading-xl mb-2">Ready to create your next event?</h3>
              <p className="text-body-sm text-ink-muted mb-5">Head to the dashboard or jump straight into creating.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" size="lg" href="/organizer/create" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Create Event
                </Button>
                <Button variant="outline" size="lg" href="/organizer/dashboard">
                  My Dashboard
                </Button>
              </div>
            </>
          ) : !loading && !isAuthenticated ? (
            <>
              <div className="h-12 w-12 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="font-bold text-ink text-heading-xl mb-2">Get Started Free</h3>
              <p className="text-body-sm text-ink-muted mb-5">
                Register your organisation and publish your first event in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" size="lg" href="/organizer/signup" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Register as Organiser
                </Button>
                <Button variant="outline" size="lg" href="/organizer/login">
                  Sign In
                </Button>
              </div>
            </>
          ) : (
            /* Participant logged in — quick enquiry form fallback */
            <>
              <div className="flex items-center gap-3 mb-6 text-left">
                <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
                  <Send className="h-5 w-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-heading-xl">Quick Event Enquiry</h3>
                  <p className="text-xs text-ink-muted">We&apos;ll reach out within 24 hours.</p>
                </div>
              </div>
              <OrganizerEnquiryForm />
            </>
          )}
        </div>
      </Section>
    </>
  );
}
