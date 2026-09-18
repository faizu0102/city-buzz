"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, SlidersHorizontal } from "lucide-react";
import { Section } from "@/components/ui/Section";
import EventCard from "@/components/ui/EventCard";
import Badge from "@/components/ui/Badge";
import EventSearchBar from "@/components/forms/EventSearchBar";
import {
  getEvents,
  searchEvents,
  applyDateFilter,
  applyTypeFilter,
  applyLocationFilter,
  sortEvents,
  DEFAULT_FILTERS,
} from "@/lib/services/eventService";
import { getAllPublishedOrganizerEvents, type OrganizerEvent } from "@/lib/services/organizerEventService";
import type { FilterState, DateFilter, EventTypeFilter, SortOption, Event } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getParam(params: URLSearchParams, key: string, fallback: string): string {
  return params.get(key) ?? fallback;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const searchParams = useSearchParams();

  // Live organizer events from Firestore
  const [orgEvents, setOrgEvents] = useState<OrganizerEvent[]>([]);
  const [orgLoading, setOrgLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllPublishedOrganizerEvents()
      .then((events) => { if (!cancelled) setOrgEvents(events); })
      .catch(() => {}) // silently fall back to empty
      .finally(() => { if (!cancelled) setOrgLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Build filter state from URL params
  const filterState = useMemo<FilterState>(() => ({
    query:      getParam(searchParams, "q",        DEFAULT_FILTERS.query),
    category:   getParam(searchParams, "category", DEFAULT_FILTERS.category),
    dateFilter: getParam(searchParams, "date",     DEFAULT_FILTERS.dateFilter) as DateFilter,
    eventType:  getParam(searchParams, "type",     DEFAULT_FILTERS.eventType)  as EventTypeFilter,
    location:   getParam(searchParams, "location", DEFAULT_FILTERS.location),
    sort:       getParam(searchParams, "sort",     DEFAULT_FILTERS.sort)       as SortOption,
  }), [searchParams]);

  // Merge mock + Firestore organizer events, deduplicate by id
  const allMock = useMemo(() => getEvents(), []);
  const allEvents = useMemo<Event[]>(() => {
    const mockIds = new Set(allMock.map((e) => e.id));
    const newOrg  = orgEvents.filter((e) => !mockIds.has(e.id));
    return [...allMock, ...newOrg];
  }, [allMock, orgEvents]);

  // Run the full filter pipeline over merged events
  const filteredEvents = useMemo(() => {
    let result = [...allEvents];
    if (filterState.query)                         result = searchEvents(result, filterState.query);
    if (filterState.category && filterState.category !== "All")
      result = result.filter((e) => e.category === filterState.category);
    if (filterState.dateFilter !== "all")          result = applyDateFilter(result, filterState.dateFilter);
    if (filterState.eventType  !== "all")          result = applyTypeFilter(result, filterState.eventType);
    if (filterState.location   && filterState.location !== "all")
      result = applyLocationFilter(result, filterState.location);
    result = sortEvents(result, filterState.sort);
    return result;
  }, [allEvents, filterState]);

  const todayEvents    = useMemo(() => filteredEvents.filter((e) => e.isToday),  [filteredEvents]);
  const upcomingEvents = useMemo(() => filteredEvents.filter((e) => !e.isToday), [filteredEvents]);

  const isFiltered =
    filterState.query ||
    filterState.category !== "All" ||
    filterState.dateFilter !== "all" ||
    filterState.eventType  !== "all" ||
    filterState.location   !== "all";

  return (
    <>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="cb-container">
          <div className="flex flex-col gap-4 max-w-2xl">
            <Badge variant="category" size="md">
              <Calendar className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />
              Nizamabad Events
            </Badge>
            <h1 className="text-display-md md:text-display-lg font-bold text-ink leading-tight">
              Discover Events in Nizamabad
            </h1>
            <p className="text-body-lg text-ink-muted max-w-xl">
              Find cultural programs, workshops, sports, competitions and
              activities happening around the city.
            </p>
          </div>
        </div>
      </div>

      {/* ── Search + filter bar + results ── */}
      <Section className="bg-white pt-10 pb-20">
        <div className="mb-6">
          <EventSearchBar />
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <p className="text-body-sm text-ink-muted">
            {isFiltered ? (
              <>
                <span className="font-semibold text-ink">{filteredEvents.length}</span>
                {" "}of <span className="font-semibold text-ink">{allEvents.length}</span> events
                {filterState.query && (
                  <> for &ldquo;<span className="font-semibold text-ink">{filterState.query}</span>&rdquo;</>
                )}
                {filterState.category !== "All" && (
                  <> in <span className="font-semibold text-ink">{filterState.category}</span></>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold text-ink">{allEvents.length}</span> events in Nizamabad
                {orgEvents.length > 0 && (
                  <span className="ml-2 text-xs text-brand-500 font-semibold">
                    +{orgEvents.length} new
                  </span>
                )}
              </>
            )}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge bgClass="bg-green-100" textClass="text-green-700" dot>
              {todayEvents.length} Today
            </Badge>
            <Badge bgClass="bg-blue-100" textClass="text-blue-700" dot>
              {upcomingEvents.length} Upcoming
            </Badge>
            {orgLoading && (
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <span className="h-3 w-3 rounded-full border border-brand-400 border-t-transparent animate-spin" />
                Loading new events…
              </span>
            )}
          </div>
        </div>

        {/* Zero results */}
        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center">
              <SlidersHorizontal className="h-7 w-7 text-ink-muted" />
            </div>
            <div>
              <p className="font-semibold text-ink text-heading-lg mb-1">No events found</p>
              <p className="text-body-sm text-ink-muted max-w-xs">
                Try adjusting your search or removing the active category filter.
              </p>
            </div>
            <a href="/events" className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">
              Clear all filters →
            </a>
          </div>
        )}

        {/* Today's events */}
        {todayEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-heading-xl font-bold text-ink">Happening Today</h2>
              <span className="bg-brand-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">Live</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming events */}
        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-heading-xl font-bold text-ink mb-5">
              {isFiltered && todayEvents.length === 0 ? "Matching Events" : "Upcoming Events"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
