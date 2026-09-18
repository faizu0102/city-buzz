"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, X, Image as ImageIcon, CheckCircle2,
  AlertCircle, Calendar, Clock, MapPin, Tag, Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createOrganizerEvent, type OrganizerEventInput } from "@/lib/services/organizerEventService";
import Button from "@/components/ui/Button";
import type { EventCategory } from "@/lib/types";
import { NIZAMABAD_LOCALITIES } from "@/lib/types/user";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: EventCategory[] = [
  "Cultural", "Sports", "Workshop", "Education",
  "Technology", "Music", "Competition", "Community", "Business",
];

const DEFAULT_IMAGES: { label: string; url: string }[] = [
  { label: "Conference / Summit",  url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
  { label: "Cultural / Dance",     url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80" },
  { label: "Sports / Cricket",     url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80" },
  { label: "Technology / Coding",  url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" },
  { label: "Music / Concert",      url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80" },
  { label: "Workshop / Education", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80" },
  { label: "Community / Food",     url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" },
  { label: "Business / Startup",   url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FormSection({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-6">
      <h2 className="flex items-center gap-2 font-bold text-ink text-heading-xl mb-5">
        <div className="h-7 w-7 rounded-lg bg-brand-100 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-brand-500" />
        </div>
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-sm font-semibold text-ink">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-11 px-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`w-full px-4 py-3 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`w-full h-11 px-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition ${props.className ?? ""}`}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  // ── Form state ──
  const [title,         setTitle]         = useState("");
  const [category,      setCategory]      = useState<EventCategory>("Cultural");
  const [description,   setDescription]   = useState("");
  const [longDesc,      setLongDesc]      = useState("");
  const [highlights,    setHighlights]    = useState<string[]>(["", ""]);
  const [image,         setImage]         = useState(DEFAULT_IMAGES[0].url);
  const [customImage,   setCustomImage]   = useState("");
  const [date,          setDate]          = useState("");
  const [startTime,     setStartTime]     = useState("09:00");
  const [endTime,       setEndTime]       = useState("17:00");
  const [venue,         setVenue]         = useState("");
  const [address,       setAddress]       = useState("");
  const [locality,      setLocality]      = useState("");
  const [isFree,        setIsFree]        = useState(true);
  const [ticketPrice,   setTicketPrice]   = useState("");
  const [regRequired,   setRegRequired]   = useState(true);
  const [capacity,      setCapacity]      = useState("");
  const [tagsInput,     setTagsInput]     = useState("");
  const [tags,          setTags]          = useState<string[]>([]);
  const [organizerName, setOrganizerName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);
  const [createdId,  setCreatedId]  = useState("");

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  // Auth guard — redirect unauthenticated users to organizer login
  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/organizer/login");
  }, [loading, isAuthenticated, router]);

  // Pre-fill organizer name from profile
  useEffect(() => {
    if (user?.fullName) setOrganizerName(user.fullName);
  }, [user]);

  // ── Highlights helpers ──
  const setHighlight = (i: number, val: string) =>
    setHighlights((prev) => prev.map((h, idx) => (idx === i ? val : h)));
  const addHighlight = () => {
    if (highlights.length < 6) setHighlights((p) => [...p, ""]);
  };
  const removeHighlight = (i: number) =>
    setHighlights((p) => p.filter((_, idx) => idx !== i));

  // ── Tags helpers ──
  const addTag = () => {
    const t = tagsInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags((p) => [...p, t]);
      setTagsInput("");
    }
  };
  const removeTag = (t: string) => setTags((p) => p.filter((x) => x !== t));

  // ── Validate ──
  const validate = (): string => {
    if (!title.trim())       return "Event title is required.";
    if (!description.trim()) return "Short description is required.";
    if (!date)               return "Event date is required.";
    if (!startTime || !endTime) return "Start and end time are required.";
    if (startTime >= endTime) return "End time must be after start time.";
    if (!venue.trim())       return "Venue name is required.";
    if (!address.trim())     return "Full address is required.";
    if (!locality)           return "Please select a locality.";
    if (!organizerName.trim()) return "Organizer / organization name is required.";
    if (!isFree && !ticketPrice.trim()) return "Please enter the ticket price.";
    return "";
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (!user) return;

    setError("");
    setSubmitting(true);

    const finalImage = customImage.trim() || image;

    const input: OrganizerEventInput = {
      title:               title.trim(),
      category,
      description:         description.trim(),
      longDescription:     longDesc.trim() || undefined,
      highlights:          highlights.filter((h) => h.trim()),
      image:               finalImage,
      date,
      startTime,
      endTime,
      venue:               venue.trim(),
      address:             address.trim(),
      locality,
      isFree,
      ticketPrice:         isFree ? undefined : ticketPrice.trim(),
      registrationRequired: regRequired,
      capacity:            capacity ? parseInt(capacity, 10) : undefined,
      tags,
      organizerName:       organizerName.trim(),
    };

    try {
      const created = await createOrganizerEvent(input, user.id);
      setCreatedId(created.id);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / success states ──
  if (loading || !user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );

  if (success) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-5">
        <div className="h-20 w-20 rounded-3xl bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <div>
          <h1 className="text-display-sm font-bold text-ink mb-2">Event Published!</h1>
          <p className="text-body-md text-ink-muted">
            Your event is now live on CityBuzz and visible to all participants in Nizamabad.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button variant="primary" size="lg" fullWidth href={`/events/${createdId}`}>
            View Event Page
          </Button>
          <Button variant="outline" size="lg" fullWidth href="/organizer/dashboard">
            My Dashboard
          </Button>
        </div>
        <button
          onClick={() => { setSuccess(false); setTitle(""); setDescription(""); setDate(""); setVenue(""); setAddress(""); setLocality(""); setHighlights(["",""]); setTags([]); }}
          className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
        >
          Create another event →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="cb-container py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/organizer/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <span className="text-border-strong">/</span>
            <span className="text-sm font-semibold text-ink">Create Event</span>
          </div>
          <Button
            type="submit"
            form="create-event-form"
            variant="primary"
            size="sm"
            loading={submitting}
          >
            {submitting ? "Publishing…" : "Publish Event"}
          </Button>
        </div>
      </div>

      <div className="cb-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-display-sm font-bold text-ink">Create a New Event</h1>
            <p className="text-body-sm text-ink-muted mt-1">
              Fill in the details below. Your event will go live immediately after publishing.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form id="create-event-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            {/* ── Basic Info ── */}
            <FormSection title="Basic Information" icon={Info}>
              <div className="flex flex-col gap-1.5">
                <Label required>Event Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nizamabad Startup Summit 2026"
                  maxLength={120}
                />
                <p className="text-xs text-ink-muted text-right">{title.length}/120</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label required>Category</Label>
                  <Select value={category} onChange={(e) => setCategory(e.target.value as EventCategory)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label required>Organizer / Organization Name</Label>
                  <Input
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="e.g. NIT Nizamabad Tech Club"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label required>Short Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A one-paragraph summary visible in event cards and search results (max 300 chars)"
                  maxLength={300}
                  rows={2}
                />
                <p className="text-xs text-ink-muted text-right">{description.length}/300</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Full Description <span className="text-ink-muted font-normal">(optional)</span></Label>
                <Textarea
                  value={longDesc}
                  onChange={(e) => setLongDesc(e.target.value)}
                  placeholder="Detailed description shown on the event detail page…"
                  rows={4}
                />
              </div>

              {/* Highlights */}
              <div className="flex flex-col gap-2">
                <Label>Event Highlights <span className="text-ink-muted font-normal">(up to 6 bullet points)</span></Label>
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-brand-400 shrink-0">•</span>
                    <Input
                      value={h}
                      onChange={(e) => setHighlight(i, e.target.value)}
                      placeholder={`Highlight ${i + 1}`}
                      className="flex-1"
                    />
                    {highlights.length > 1 && (
                      <button type="button" onClick={() => removeHighlight(i)}
                        className="text-ink-subtle hover:text-red-500 transition-colors shrink-0">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {highlights.length < 6 && (
                  <button type="button" onClick={addHighlight}
                    className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors self-start">
                    <Plus className="h-3.5 w-3.5" /> Add highlight
                  </button>
                )}
              </div>
            </FormSection>

            {/* ── Date & Time ── */}
            <FormSection title="Date & Time" icon={Calendar}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <Label required>Date</Label>
                  <Input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label required>Start Time</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label required>End Time</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
            </FormSection>

            {/* ── Location ── */}
            <FormSection title="Location" icon={MapPin}>
              <div className="flex flex-col gap-1.5">
                <Label required>Venue Name</Label>
                <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. NIT Nizamabad — Main Auditorium" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label required>Full Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Hyderabad Road, Nizamabad, Telangana 503001" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label required>Locality / Area</Label>
                <Select value={locality} onChange={(e) => setLocality(e.target.value)}>
                  <option value="">Select locality in Nizamabad…</option>
                  {NIZAMABAD_LOCALITIES.map((l) => <option key={l} value={l}>{l}</option>)}
                </Select>
              </div>
            </FormSection>

            {/* ── Registration & Tickets ── */}
            <FormSection title="Registration & Tickets" icon={Clock}>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="radio" name="pricing" checked={isFree}
                    onChange={() => setIsFree(true)}
                    className="accent-brand-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-ink">Free entry</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="radio" name="pricing" checked={!isFree}
                    onChange={() => setIsFree(false)}
                    className="accent-brand-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-ink">Paid event</span>
                </label>
              </div>

              {!isFree && (
                <div className="flex flex-col gap-1.5">
                  <Label required>Ticket Price</Label>
                  <Input
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="e.g. ₹299 or ₹500 per person"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Registration Required?</Label>
                  <Select
                    value={regRequired ? "yes" : "no"}
                    onChange={(e) => setRegRequired(e.target.value === "yes")}
                  >
                    <option value="yes">Yes — attendees must register</option>
                    <option value="no">No — walk-in welcome</option>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Event Capacity <span className="text-ink-muted font-normal">(optional)</span></Label>
                  <Input
                    type="number" min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 200"
                  />
                </div>
              </div>
            </FormSection>

            {/* ── Image ── */}
            <FormSection title="Event Image" icon={ImageIcon}>
              <p className="text-xs text-ink-muted -mt-2">Pick a stock image or paste your own URL.</p>

              {/* Stock image picker */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEFAULT_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => { setImage(img.url); setCustomImage(""); }}
                    className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      image === img.url && !customImage
                        ? "border-brand-500 ring-2 ring-brand-200"
                        : "border-transparent hover:border-brand-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    {image === img.url && !customImage && (
                      <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-white drop-shadow" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-1">
                      <p className="text-[9px] text-white truncate">{img.label}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Or paste a custom image URL</Label>
                <Input
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  placeholder="https://example.com/event-image.jpg"
                />
                {customImage && (
                  <div className="relative h-32 rounded-xl overflow-hidden border border-border mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={customImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>
            </FormSection>

            {/* ── Tags ── */}
            <FormSection title="Tags" icon={Tag}>
              <div className="flex flex-col gap-1.5">
                <Label>Add tags <span className="text-ink-muted font-normal">(up to 8)</span></Label>
                <div className="flex gap-2">
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Type a tag and press Enter"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="md" onClick={addTag}>Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((t) => (
                      <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium rounded-full">
                        #{t}
                        <button type="button" onClick={() => removeTag(t)} className="text-brand-400 hover:text-red-500 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </FormSection>

            {/* ── Submit ── */}
            <div className="flex flex-col sm:flex-row gap-3 pb-8">
              <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
                {submitting ? "Publishing Event…" : "Publish Event Now"}
              </Button>
              <Button type="button" variant="outline" size="lg" href="/organizer/dashboard">
                Cancel
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
