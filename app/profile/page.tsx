"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User, Mail, Phone, MapPin, Calendar, Edit2, Save, X,
  Bookmark, Clock, CheckCircle2, Ticket, Settings,
  Bell, Heart, ArrowRight, LogOut, BadgeCheck, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSavedEvents } from "@/context/SavedEventsContext";
import { getEventById } from "@/lib/services/eventService";
import { formatDate, formatTimeRange, getCategoryColors } from "@/lib/utils";
import type { Event } from "@/lib/types";
import type { UserProfile } from "@/lib/types/user";
import { AVAILABLE_INTERESTS, NIZAMABAD_LOCALITIES } from "@/lib/types/user";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Avatar({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const cls = size === "lg"
    ? "h-20 w-20 text-2xl rounded-2xl"
    : "h-10 w-10 text-sm rounded-xl";
  return (
    <div className={`${cls} bg-brand-500 flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Registered events (from localStorage — Phase 2) ─────────────────────────

interface LocalRegistration {
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone?: string | null;
  submittedAt: string;
}

function getLocalRegistrations(email: string): LocalRegistration[] {
  try {
    const raw = localStorage.getItem("citybuzz_registrations");
    if (!raw) return [];
    const all: LocalRegistration[] = JSON.parse(raw);
    return all.filter((r) => r.email.toLowerCase() === email.toLowerCase());
  } catch {
    return [];
  }
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-border shadow-card p-6 ${className}`}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, updateProfile, logOut } = useAuth();
  const { savedIds } = useSavedEvents();

  // Edit mode
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [saveMsg, setSaveMsg]   = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Editable fields
  const [editName,     setEditName]     = useState("");
  const [editPhone,    setEditPhone]    = useState("");
  const [editLocality, setEditLocality] = useState("");
  const [editInterests, setEditInterests] = useState<string[]>([]);

  // Saved events resolved
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  // Registered events
  const [registrations, setRegistrations] = useState<LocalRegistration[]>([]);

  // Tab
  const [tab, setTab] = useState<"overview" | "saved" | "registered" | "settings">("overview");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login?returnTo=/profile");
    }
  }, [loading, isAuthenticated, router]);

  // Populate edit fields when user loads
  useEffect(() => {
    if (user) {
      setEditName(user.fullName || "");
      setEditPhone(user.phone || "");
      setEditLocality(user.locality || "");
      setEditInterests(user.interests || []);
      // Registrations from localStorage
      setRegistrations(getLocalRegistrations(user.email));
    }
  }, [user]);

  // Resolve saved event IDs → full Event objects
  useEffect(() => {
    const resolved: Event[] = [];
    for (const id of savedIds) {
      const ev = getEventById(id);
      if (ev) resolved.push(ev);
    }
    setSavedEvents(resolved);
  }, [savedIds]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await updateProfile({
        fullName:  editName.trim(),
        phone:     editPhone.trim() || undefined,
        locality:  editLocality || undefined,
        interests: editInterests,
      });
      setSaveMsg({ type: "ok", text: "Profile updated successfully!" });
      setEditing(false);
    } catch {
      setSaveMsg({ type: "err", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }, [user, updateProfile, editName, editPhone, editLocality, editInterests]);

  const toggleInterest = (id: string) => {
    setEditInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ── Loading / redirect states ──
  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });

  const tabs = [
    { id: "overview",    label: "Overview",   icon: User },
    { id: "saved",       label: `Saved (${savedEvents.length})`, icon: Bookmark },
    { id: "registered",  label: `Registered (${registrations.length})`, icon: Ticket },
    { id: "settings",    label: "Settings",   icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-surface-secondary">

      {/* ── Profile Hero ── */}
      <div className="bg-white border-b border-border">
        <div className="cb-container py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar name={user.fullName || user.email} size="lg" />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-display-sm font-bold text-ink truncate">
                  {user.fullName || "My Account"}
                </h1>
                {user.onboardingCompleted && (
                  <BadgeCheck className="h-5 w-5 text-accent-500" />
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-brand-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-400" />
                  {user.locality ? `${user.locality}, ` : ""}{user.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand-400" />
                  Joined {joinDate}
                </span>
              </div>

              {/* Interest chips */}
              {user.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {user.interests.slice(0, 6).map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-0.5 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                  {user.interests.length > 6 && (
                    <span className="px-2.5 py-0.5 bg-surface-tertiary text-ink-muted text-xs rounded-full">
                      +{user.interests.length - 6} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 sm:gap-6 shrink-0">
              {[
                { label: "Saved",      value: savedEvents.length },
                { label: "Registered", value: registrations.length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-brand-500">{s.value}</p>
                  <p className="text-xs text-ink-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="cb-container">
          <div className="flex gap-0 border-b border-border overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === id
                    ? "border-brand-500 text-brand-500"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="cb-container py-8">

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Basic info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-ink text-heading-xl">Basic Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => { setEditing(true); setSaveMsg(null); }}
                      className="flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditing(false); setSaveMsg(null); }}
                        className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                      <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
                        <Save className="h-3.5 w-3.5 mr-1" /> Save
                      </Button>
                    </div>
                  )}
                </div>

                {/* Save feedback */}
                {saveMsg && (
                  <div className={`mb-4 flex items-center gap-2.5 p-3 rounded-xl border text-sm ${
                    saveMsg.type === "ok"
                      ? "bg-green-50 border-green-100 text-green-700"
                      : "bg-red-50 border-red-100 text-red-700"
                  }`}>
                    {saveMsg.type === "ok"
                      ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                      : <AlertCircle className="h-4 w-4 shrink-0" />}
                    {saveMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full name */}
                  <Field label="Full Name" icon={User}>
                    {editing ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-border bg-surface-secondary text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                      />
                    ) : (
                      <p className="text-sm text-ink font-medium">{user.fullName || "—"}</p>
                    )}
                  </Field>

                  {/* Email (read-only) */}
                  <Field label="Email Address" icon={Mail}>
                    <p className="text-sm text-ink font-medium">{user.email}</p>
                    <p className="text-xs text-ink-muted">Cannot be changed</p>
                  </Field>

                  {/* Phone */}
                  <Field label="Phone Number" icon={Phone}>
                    {editing ? (
                      <input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-10 px-3 rounded-xl border border-border bg-surface-secondary text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                      />
                    ) : (
                      <p className="text-sm text-ink font-medium">{user.phone || "Not set"}</p>
                    )}
                  </Field>

                  {/* Locality */}
                  <Field label="Locality in Nizamabad" icon={MapPin}>
                    {editing ? (
                      <select
                        value={editLocality}
                        onChange={(e) => setEditLocality(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-border bg-surface-secondary text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                      >
                        <option value="">Select locality…</option>
                        {NIZAMABAD_LOCALITIES.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-ink font-medium">{user.locality || "Not set"}</p>
                    )}
                  </Field>
                </div>
              </Card>

              {/* Interests */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-ink text-heading-xl flex items-center gap-2">
                    <Heart className="h-4 w-4 text-brand-500" /> My Interests
                  </h2>
                  {editing && (
                    <p className="text-xs text-ink-muted">Click to toggle</p>
                  )}
                </div>

                {editing ? (
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_INTERESTS.map((interest) => {
                      const active = editInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => toggleInterest(interest.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            active
                              ? "bg-brand-500 text-white border-brand-500"
                              : "bg-white border-border text-ink-secondary hover:border-brand-300 hover:text-brand-500"
                          }`}
                        >
                          {interest.name}
                        </button>
                      );
                    })}
                  </div>
                ) : user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((id) => {
                      const meta = AVAILABLE_INTERESTS.find((i) => i.id === id);
                      return (
                        <span
                          key={id}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 border border-brand-100 text-brand-700"
                        >
                          {meta?.name || id}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <Heart className="h-8 w-8 text-ink-disabled" />
                    <p className="text-body-sm text-ink-muted">No interests set yet.</p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                    >
                      Add interests →
                    </button>
                  </div>
                )}
              </Card>
            </div>

            {/* Right — Quick links */}
            <div className="flex flex-col gap-4">
              <Card>
                <h3 className="font-bold text-ink text-heading-lg mb-4">Quick Links</h3>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "Browse Events",    href: "/events",     icon: Calendar },
                    { label: "Explore Nizamabad",href: "/explore",    icon: MapPin },
                    { label: "List an Event",    href: "/organizer",  icon: Ticket },
                    { label: "Contact Support",  href: "/contact",    icon: Mail },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-secondary hover:bg-surface-secondary hover:text-ink transition-colors group"
                    >
                      <Icon className="h-4 w-4 text-brand-400 shrink-0" />
                      <span className="flex-1">{label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-ink-subtle group-hover:text-ink transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>

              {/* Account actions */}
              <Card>
                <h3 className="font-bold text-ink text-heading-lg mb-4">Account</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-ink-muted px-1">
                    Member since {joinDate}
                  </p>
                  <button
                    onClick={async () => { await logOut(); router.replace("/"); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── SAVED EVENTS TAB ── */}
        {tab === "saved" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-ink text-heading-xl">
                Saved Events
                <span className="ml-2 text-brand-500">({savedEvents.length})</span>
              </h2>
              <Link href="/events" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
                Browse Events →
              </Link>
            </div>

            {savedEvents.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No saved events yet"
                desc="Bookmark events you're interested in and they'll appear here."
                action={{ label: "Explore Events", href: "/events" }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedEvents.map((event) => (
                  <SavedEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REGISTERED EVENTS TAB ── */}
        {tab === "registered" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-ink text-heading-xl">
                Registered Events
                <span className="ml-2 text-brand-500">({registrations.length})</span>
              </h2>
              <Link href="/events" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
                Find More Events →
              </Link>
            </div>

            {registrations.length === 0 ? (
              <EmptyState
                icon={Ticket}
                title="No registrations yet"
                desc="When you register for events, they'll appear here with your details."
                action={{ label: "Browse Events", href: "/events" }}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {registrations.map((reg) => {
                  const event = getEventById(reg.eventId);
                  return (
                    <RegistrationCard key={reg.eventId + reg.submittedAt} reg={reg} event={event} />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="max-w-xl flex flex-col gap-6">
            <Card>
              <h2 className="font-bold text-ink text-heading-xl flex items-center gap-2 mb-5">
                <Bell className="h-4 w-4 text-brand-500" /> Notification Preferences
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  { key: "eventReminders",      label: "Event Reminders",            desc: "Get reminded before events you've registered for" },
                  { key: "interestBasedEvents", label: "Interest-Based Event Alerts", desc: "New events matching your interests" },
                  { key: "importantUpdates",    label: "Important Updates",           desc: "Changes or cancellations for events you've saved" },
                  { key: "promotionalUpdates",  label: "Promotional Updates",         desc: "Offers and featured events from CityBuzz" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">{label}</p>
                      <p className="text-xs text-ink-muted mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      checked={user.notificationPreferences[key as keyof typeof user.notificationPreferences]}
                      onChange={async (val) => {
                        await updateProfile({
                          notificationPreferences: {
                            ...user.notificationPreferences,
                            [key]: val,
                          },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="font-bold text-ink text-heading-xl mb-5">Danger Zone</h2>
              <p className="text-body-sm text-ink-muted mb-4">
                To delete your account or request a data export, contact us at{" "}
                <a href="mailto:hello@citybuzz.in" className="text-brand-500 hover:text-brand-600">
                  hello@citybuzz.in
                </a>
              </p>
              <button
                onClick={async () => { await logOut(); router.replace("/"); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label, icon: Icon, children,
}: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted uppercase tracking-wide">
        <Icon className="h-3.5 w-3.5" /> {label}
      </label>
      {children}
    </div>
  );
}

function EmptyState({
  icon: Icon, title, desc, action,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="h-16 w-16 rounded-2xl bg-surface-tertiary flex items-center justify-center">
        <Icon className="h-7 w-7 text-ink-muted" />
      </div>
      <div>
        <p className="font-semibold text-ink text-heading-lg mb-1">{title}</p>
        <p className="text-body-sm text-ink-muted max-w-xs">{desc}</p>
      </div>
      <Button variant="primary" size="md" href={action.href}>
        {action.label}
      </Button>
    </div>
  );
}

function SavedEventCard({ event }: { event: Event }) {
  const catColors = getCategoryColors(event.category);
  return (
    <Link
      href={`/events/${event.id}`}
      className="group bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="relative h-40 overflow-hidden shrink-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge bgClass={catColors.bg} textClass={catColors.text}>{event.category}</Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-ink text-sm leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
          {event.title}
        </h3>
        <div className="flex flex-col gap-1 text-xs text-ink-muted mt-auto">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-brand-400" /> {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-brand-400" /> {formatTimeRange(event.startTime, event.endTime)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-brand-400" /> {event.venue}
          </span>
        </div>
      </div>
    </Link>
  );
}

function RegistrationCard({
  reg, event,
}: { reg: LocalRegistration; event: Event | undefined }) {
  const registeredOn = new Date(reg.submittedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const catColors = event ? getCategoryColors(event.category) : { bg: "bg-gray-100", text: "text-gray-600" };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-5 flex flex-col sm:flex-row gap-4">
      {/* Left — event info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {event && (
            <Badge bgClass={catColors.bg} textClass={catColors.text} size="sm">
              {event.category}
            </Badge>
          )}
          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
            <CheckCircle2 className="h-3 w-3" /> Registered
          </span>
        </div>

        <h3 className="font-semibold text-ink text-heading-md leading-snug mb-2">
          {event?.title || reg.eventTitle}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          {event && (
            <>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-brand-400" /> {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-brand-400" /> {formatTimeRange(event.startTime, event.endTime)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-brand-400" /> {event.venue}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right — registration meta */}
      <div className="flex flex-col gap-2 shrink-0 sm:text-right sm:items-end">
        <p className="text-xs text-ink-muted">Registered on {registeredOn}</p>
        <p className="text-xs text-ink-muted">Name: <span className="text-ink font-medium">{reg.name}</span></p>
        {reg.phone && <p className="text-xs text-ink-muted">Phone: {reg.phone}</p>}
        {event && (
          <Link
            href={`/events/${event.id}`}
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            View Event <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

function Toggle({
  checked, onChange,
}: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
        checked ? "bg-brand-500" : "bg-border-strong"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
