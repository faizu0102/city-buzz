import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  MapPin, Clock, Calendar, Users, ArrowLeft,
  CheckCircle2, Building2, BadgeCheck, Tag,
} from "lucide-react";
import {
  getEventById, getEventsByCategory, getEvents,
} from "@/lib/services/eventService";
import {
  formatDate, formatTimeRange, getCategoryColors, getStatusColors, capacityPercent,
} from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EventCard from "@/components/ui/EventCard";
import RegisterButton from "@/components/events/RegisterButton";

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getEvents().map((e) => ({ id: e.id }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const event = getEventById(id);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} | CityBuzz`,
    description: `Discover ${event.title} happening in ${event.city} on CityBuzz.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EventDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const event = getEventById(id);
  if (!event) notFound();

  const catColors    = getCategoryColors(event.category);
  const statusColors = getStatusColors(event.registrationStatus);
  const related      = getEventsByCategory(event.category)
    .filter((e) => e.id !== event.id)
    .slice(0, 3);

  const fillPct = event.capacity && event.registrationCount
    ? capacityPercent(event.registrationCount, event.capacity)
    : null;

  return (
    <>
      {/* ── Back nav ── */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="cb-container py-3 flex items-center gap-2 text-sm">
          <a
            href="/events"
            className="inline-flex items-center gap-1.5 font-medium text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Events
          </a>
          <span className="text-border-strong">/</span>
          <span className="text-ink-muted line-clamp-1 max-w-xs">{event.title}</span>
        </div>
      </div>

      <div className="bg-white">
        <div className="cb-container py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* ── Main column ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Hero image */}
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {/* Verified badge overlay */}
                {event.isVerified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                    <BadgeCheck className="h-4 w-4 text-accent-500 fill-accent-100" />
                    <span className="text-xs font-semibold text-accent-600">Verified Event</span>
                  </div>
                )}
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                <Badge bgClass={catColors.bg} textClass={catColors.text} size="md">
                  {event.category}
                </Badge>
                <Badge bgClass={statusColors.bg} textClass={statusColors.text} size="md" dot>
                  {event.registrationStatus}
                </Badge>
                {event.isFree ? (
                  <Badge bgClass="bg-green-100" textClass="text-green-700" size="md">
                    Free Entry
                  </Badge>
                ) : (
                  <Badge bgClass="bg-amber-100" textClass="text-amber-700" size="md">
                    Paid Event
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-display-sm md:text-display-md font-bold text-ink leading-tight">
                {event.title}
              </h1>

              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: Calendar,
                    label: "Date",
                    value: formatDate(event.date),
                  },
                  {
                    icon: Clock,
                    label: "Time",
                    value: formatTimeRange(event.startTime, event.endTime),
                  },
                  {
                    icon: MapPin,
                    label: "Venue",
                    value: event.venue,
                  },
                  {
                    icon: Users,
                    label: "Interested",
                    value: event.registrationCount
                      ? `${event.registrationCount.toLocaleString("en-IN")} people`
                      : "Open for all",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3.5 bg-surface-secondary rounded-xl border border-border">
                    <div className="h-8 w-8 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-brand-500" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-ink leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div>
                <h2 className="text-heading-xl font-bold text-ink mb-3">About this Event</h2>
                <p className="text-body-md text-ink-secondary leading-relaxed">
                  {event.longDescription ?? event.description}
                </p>
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div>
                  <h2 className="text-heading-xl font-bold text-ink mb-3">Event Highlights</h2>
                  <ul className="flex flex-col gap-2">
                    {event.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                        <span className="text-body-sm text-ink-secondary">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Location section */}
              <div>
                <h2 className="text-heading-xl font-bold text-ink mb-3">Location</h2>
                <div className="bg-surface-secondary rounded-2xl border border-border overflow-hidden">
                  {/* Map placeholder — wire up Google Maps / Mapbox in Phase 3 */}
                  <div className="h-40 bg-gradient-to-br from-surface-tertiary to-border flex items-center justify-center border-b border-border">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-brand-400 mx-auto mb-2" />
                      <p className="text-xs text-ink-muted font-medium">Map view coming soon</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink text-sm">{event.venue}</p>
                      <p className="text-xs text-ink-muted mt-0.5">{event.address}</p>
                      <p className="text-xs text-ink-muted">{event.city}, Telangana</p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        `${event.venue}, ${event.address}, ${event.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                    >
                      Open in Maps →
                    </a>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag className="h-3.5 w-3.5 text-ink-subtle" />
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-surface-tertiary rounded-full text-xs font-medium text-ink-muted border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Related events */}
              {related.length > 0 && (
                <div className="pt-2">
                  <h2 className="text-heading-xl font-bold text-ink mb-5">
                    More {event.category} Events
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {related.map((e) => (
                      <EventCard key={e.id} event={e} variant="default" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white border border-border rounded-2xl shadow-card-lg p-6 flex flex-col gap-5">

                {/* Organizer */}
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-ink-muted">Organised by</p>
                    <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">
                      {event.organizer}
                    </p>
                  </div>
                </div>

                {/* Quick details */}
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-brand-400 shrink-0" />
                    <span className="text-ink-secondary">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-brand-400 shrink-0" />
                    <span className="text-ink-secondary">
                      {formatTimeRange(event.startTime, event.endTime)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                    <span className="text-ink-secondary leading-snug">{event.venue}</span>
                  </div>
                </div>

                {/* Capacity bar */}
                {fillPct !== null && (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-ink-muted">
                        {event.registrationCount?.toLocaleString("en-IN")} registered
                      </span>
                      <span className="text-ink-muted">{fillPct}% full</span>
                    </div>
                    <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPct >= 90
                            ? "bg-red-400"
                            : fillPct >= 60
                            ? "bg-amber-400"
                            : "bg-brand-500"
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status badge */}
                <Badge
                  bgClass={statusColors.bg}
                  textClass={statusColors.text}
                  size="md"
                  dot
                  className="justify-center"
                >
                  Registration {event.registrationStatus}
                </Badge>

                {/* Registration CTA */}
                <RegisterButton
                  event={{
                    id: event.id,
                    title: event.title,
                    date: formatDate(event.date),
                    venue: event.venue,
                    isFree: event.isFree,
                    registrationStatus: event.registrationStatus,
                  }}
                />

                {/* Free note */}
                {event.isFree && (
                  <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-xs font-medium text-green-700">
                      Free entry — no ticket required
                    </span>
                  </div>
                )}

                {/* Share link */}
                <a
                  href={`/events/${event.id}`}
                  className="text-xs text-center text-brand-500 hover:text-brand-600 font-medium transition-colors"
                >
                  Share this event →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
