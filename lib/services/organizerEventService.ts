/**
 * CityBuzz Organizer Event Service
 *
 * Saves, fetches, updates and deletes organizer-created events in Firestore.
 * Falls back to localStorage when Firebase is not configured.
 *
 * Firestore path: events/{eventId}
 * Each document includes `organizerId` and `source: "organizer"` to distinguish
 * from the static mock dataset.
 */

import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import type { Event, EventCategory, RegistrationStatus } from "@/lib/types";

// ─── Form input type (what the Create form submits) ──────────────────────────

export interface OrganizerEventInput {
  title:              string;
  category:           EventCategory;
  description:        string;
  longDescription?:   string;
  highlights:         string[];   // up to 5 bullet points
  image:              string;     // URL
  date:               string;     // ISO date "YYYY-MM-DD"
  startTime:          string;     // "HH:MM"
  endTime:            string;     // "HH:MM"
  venue:              string;
  address:            string;
  locality:           string;
  isFree:             boolean;
  ticketPrice?:       string;
  registrationRequired: boolean;
  capacity?:          number;
  tags:               string[];
  organizerName:      string;     // display name of organizer
}

// ─── Stored document type ─────────────────────────────────────────────────────

export interface OrganizerEvent extends Event {
  organizerId:  string;
  source:       "organizer";
  status:       "draft" | "published" | "cancelled";
  ticketPrice?: string;
}

// ─── Local storage fallback ───────────────────────────────────────────────────

const LOCAL_KEY = "citybuzz_organizer_events";

function readLocal(): OrganizerEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeLocal(events: OrganizerEvent[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(events)); } catch { /* ignore */ }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return "org-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now();
}

function makeSlug(title: string, id: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    + "-" + id.slice(-6);
}

function inputToEvent(
  input: OrganizerEventInput,
  organizerId: string,
  id: string
): OrganizerEvent {
  const today = new Date().toISOString().split("T")[0];
  const isToday = input.date === today;

  const registrationStatus: RegistrationStatus = input.isFree ? "Free" : "Open";

  return {
    id,
    slug:               makeSlug(input.title, id),
    title:              input.title.trim(),
    category:           input.category,
    description:        input.description.trim(),
    longDescription:    input.longDescription?.trim() || input.description.trim(),
    highlights:         input.highlights.filter((h) => h.trim()),
    image:              input.image.trim() ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    date:               input.date,
    startTime:          input.startTime,
    endTime:            input.endTime,
    venue:              input.venue.trim(),
    address:            input.address.trim(),
    city:               "Nizamabad",
    locality:           input.locality.trim(),
    organizer:          input.organizerName.trim(),
    isFeatured:         false,
    isVerified:         false,
    isFree:             input.isFree,
    isToday,
    registrationStatus,
    registrationRequired: input.registrationRequired,
    capacity:           input.capacity || undefined,
    registrationCount:  0,
    attendeeCount:      0,
    tags:               input.tags.filter((t) => t.trim()),
    createdAt:          today,
    // organizer-specific
    organizerId,
    source:             "organizer",
    status:             "published",
    ticketPrice:        input.ticketPrice || undefined,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Create a new event. Returns the saved event with generated id. */
export async function createOrganizerEvent(
  input: OrganizerEventInput,
  organizerId: string
): Promise<OrganizerEvent> {
  const id = generateId();
  const event = inputToEvent(input, organizerId, id);

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "events");
      const docRef = await addDoc(colRef, {
        ...event,
        createdAtTimestamp: serverTimestamp(),
      });
      // Update the local object with the real Firestore id
      const firestoreEvent: OrganizerEvent = { ...event, id: docRef.id };
      const local = readLocal();
      writeLocal([...local, firestoreEvent]);
      return firestoreEvent;
    } catch (err) {
      console.warn("CityBuzz: Firestore write failed, saving locally:", err);
    }
  }

  const local = readLocal();
  writeLocal([...local, event]);
  return event;
}

/** Fetch all events created by a specific organizer. */
export async function getOrganizerEvents(organizerId: string): Promise<OrganizerEvent[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef  = collection(db, "events");
      const q       = query(
        colRef,
        where("organizerId", "==", organizerId),
        orderBy("createdAtTimestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const events: OrganizerEvent[] = snapshot.docs.map((d) => ({
        ...(d.data() as OrganizerEvent),
        id: d.id,
      }));
      // Sync local cache
      const otherLocal = readLocal().filter((e) => e.organizerId !== organizerId);
      writeLocal([...otherLocal, ...events]);
      return events;
    } catch (err) {
      console.warn("CityBuzz: Firestore fetch failed, using local cache:", err);
    }
  }

  return readLocal().filter((e) => e.organizerId === organizerId);
}

/** Fetch ALL published organizer events (for the participant events feed). */
export async function getAllPublishedOrganizerEvents(): Promise<OrganizerEvent[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef  = collection(db, "events");
      const q       = query(
        colRef,
        where("source",  "==", "organizer"),
        where("status",  "==", "published"),
        orderBy("date",  "asc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        ...(d.data() as OrganizerEvent),
        id: d.id,
      }));
    } catch (err) {
      console.warn("CityBuzz: Firestore allPublished fetch failed:", err);
    }
  }

  // Local fallback — return all local published events
  return readLocal().filter((e) => e.status === "published");
}

/** Update an existing organizer event. */
export async function updateOrganizerEvent(
  eventId: string,
  organizerId: string,
  input: OrganizerEventInput
): Promise<OrganizerEvent> {
  const updated = inputToEvent(input, organizerId, eventId);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "events", eventId);
      await updateDoc(docRef, { ...updated });
    } catch (err) {
      console.warn("CityBuzz: Firestore update failed:", err);
    }
  }

  const local = readLocal().map((e) => (e.id === eventId ? updated : e));
  writeLocal(local);
  return updated;
}

/** Delete an event (only by the organizer who created it). */
export async function deleteOrganizerEvent(
  eventId: string,
  organizerId: string
): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef  = doc(db, "events", eventId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists() && snapshot.data()?.organizerId === organizerId) {
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn("CityBuzz: Firestore delete failed:", err);
    }
  }

  const local = readLocal().filter(
    (e) => !(e.id === eventId && e.organizerId === organizerId)
  );
  writeLocal(local);
}

/** Toggle published / cancelled status. */
export async function toggleEventStatus(
  eventId: string,
  organizerId: string,
  newStatus: "published" | "cancelled"
): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "events", eventId);
      await updateDoc(docRef, { status: newStatus });
    } catch (err) {
      console.warn("CityBuzz: Firestore status toggle failed:", err);
    }
  }

  const local = readLocal().map((e) =>
    e.id === eventId && e.organizerId === organizerId
      ? { ...e, status: newStatus }
      : e
  );
  writeLocal(local);
}
