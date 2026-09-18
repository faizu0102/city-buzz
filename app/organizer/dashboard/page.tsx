"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, BarChart2, Calendar, MapPin, Users, Clock,
  Edit2, Trash2, Eye, EyeOff, AlertCircle, CheckCircle2,
  Megaphone, ArrowRight, RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getOrganizerEvents,
  deleteOrganizerEvent,
  toggleEventStatus,
  type OrganizerEvent,
} from "@/lib/services/organizerEventService";
import { formatDate, formatTimeRange, getCategoryColors } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrganizerEvent["status"] }) {
  const map = {
    published: { bg: "bg-green-100",  text: "text-green-700",  label: "Published" },
    draft:     { bg: "bg-amber-100",  text: "text-amber-700",  label: "Draft" },
    cancelled: { bg: "bg-red-100",    text: "text-red-600",    label: "Cancelled" },
  };
  const s = map[status];
  return <Badge bgClass={s.bg} textClass={s.text} dot>{s.label}</Badge>;
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  message, onConfirm, onCancel,
}: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <p className="text-center font-semibold text-ink mb-5">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" size="md" fullWidth onClick={onCancel}>Cancel</Button>
          <Button variant="danger" size="md" fullWidth onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────

function OrganizerEventCard({
  event,
  onDelete,
  onToggleStatus,
}: {
  event: OrganizerEvent;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: OrganizerEvent["status"]) => void;
}) {
  const catColors  = getCategoryColors(event.category);
  const isPublished = event.status === "published";

  return (
    <article className="bg-white rounded-2xl border border-border shadow-card overflow-hidden flex flex-col sm:flex-row group">
      {/* Image */}
      <div className="relative h-40 sm:h-auto sm:w-44 shrink-0 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, 176px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={event.status} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge bgClass={catColors.bg} textClass={catColors.text} size="sm">
                {event.category}
              </Badge>
              {event.isFree
                ? <Badge bgClass="bg-green-100" textClass="text-green-700" size="sm">Free</Badge>
                : <Badge bgClass="bg-amber-100" textClass="text-amber-700" size="sm">{event.ticketPrice || "Paid"}</Badge>
              }
            </div>
            <h3 className="font-bold text-ink text-heading-lg leading-snug line-clamp-2">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-brand-400" /> {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-brand-400" /> {formatTimeRange(event.startTime, event.endTime)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-brand-400" /> {event.venue}
          </span>
          {event.capacity && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-brand-400" />
              {event.registrationCount ?? 0}/{event.capacity} registered
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-border">
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View Live
          </Link>

          <button
            onClick={() => onToggleStatus(
              event.id,
              isPublished ? "cancelled" : "published"
            )}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              isPublished
                ? "text-amber-600 hover:bg-amber-50"
                : "text-green-600 hover:bg-green-50"
            }`}
          >
            {isPublished
              ? <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
              : <><Eye className="h-3.5 w-3.5" /> Re-publish</>
            }
          </button>

          <button
            onClick={() => onDelete(event.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const [events,     setEvents]     = useState<OrganizerEvent[]>([]);
  const [fetching,   setFetching]   = useState(true);
  const [toast,      setToast]      = useState<{ type: "ok"|"err"; text: string } | null>(null);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);

  // Auth guard — redirect unauthenticated users to organizer login
  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/organizer/login");
  }, [loading, isAuthenticated, router]);

  const loadEvents = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    try {
      const list = await getOrganizerEvents(user.id);
      setEvents(list);
    } catch {
      showToast("err", "Failed to load events. Please refresh.");
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => { if (user) loadEvents(); }, [user, loadEvents]);

  const showToast = (type: "ok"|"err", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeleteId(null);
    try {
      await deleteOrganizerEvent(id, user.id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast("ok", "Event deleted successfully.");
    } catch {
      showToast("err", "Failed to delete event. Please try again.");
    }
  };

  const handleToggleStatus = async (id: string, newStatus: OrganizerEvent["status"]) => {
    if (!user) return;
    try {
      await toggleEventStatus(id, user.id, newStatus as "published" | "cancelled");
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      showToast("ok", newStatus === "published" ? "Event published!" : "Event unpublished.");
    } catch {
      showToast("err", "Failed to update status. Please try again.");
    }
  };

  // Stats
  const publishedCount = events.filter((e) => e.status === "published").length;
  const totalCapacity  = events.reduce((sum, e) => sum + (e.capacity ?? 0), 0);
  const totalReg       = events.reduce((sum, e) => sum + (e.registrationCount ?? 0), 0);

  if (loading || !user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-secondary">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-card-lg text-sm font-medium animate-fade-up ${
          toast.type === "ok"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}>
          {toast.type === "ok"
            ? <CheckCircle2 className="h-4 w-4 shrink-0" />
            : <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.text}
        </div>
      )}

      {/* Confirm delete dialog */}
      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to permanently delete this event? This cannot be undone."
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="bg-ink text-white">
        <div className="cb-container py-8 md:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="h-4 w-4 text-brand-400" />
                <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Organizer Dashboard</span>
              </div>
              <h1 className="text-display-sm font-bold text-white">
                Welcome, {user.fullName?.split(" ")[0] || "Organizer"} 👋
              </h1>
              <p className="text-white/60 text-body-sm mt-1">
                Manage your events and track registrations.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              href="/organizer/create"
              rightIcon={<Plus className="h-4 w-4" />}
            >
              Create Event
            </Button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Total Events",    value: events.length },
              { label: "Published",       value: publishedCount },
              { label: "Total Capacity",  value: totalCapacity || "—" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Events list ── */}
      <div className="cb-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-ink text-heading-xl">
            Your Events
            <span className="ml-2 text-brand-500">({events.length})</span>
          </h2>
          <button
            onClick={loadEvents}
            className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${fetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {fetching ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-border animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-20 text-center bg-white rounded-2xl border border-border">
            <div className="h-16 w-16 rounded-2xl bg-brand-50 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-brand-400" />
            </div>
            <div>
              <p className="font-bold text-ink text-heading-xl mb-1">No events yet</p>
              <p className="text-body-sm text-ink-muted max-w-xs">
                Create your first event and reach thousands of people in Nizamabad.
              </p>
            </div>
            <Button variant="primary" size="lg" href="/organizer/create" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <OrganizerEventCard
                key={event.id}
                event={event}
                onDelete={(id) => setDeleteId(id)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Quick links ── */}
      <div className="cb-container pb-12">
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-ink text-heading-lg mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" href="/organizer/create" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              New Event
            </Button>
            <Button variant="outline" size="sm" href="/events" leftIcon={<Eye className="h-3.5 w-3.5" />}>
              View Events Page
            </Button>
            <Button variant="outline" size="sm" href="/contact" leftIcon={<BarChart2 className="h-3.5 w-3.5" />}>
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
