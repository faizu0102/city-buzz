# CityBuzz — Website Improvement Tasks

> **Project:** CityBuzz — Local Event Discovery Platform for Nizamabad, Telangana  
> **Stack:** Next.js 15, React 18, TypeScript, Tailwind CSS, Firebase, Gemini AI  
> **Status:** Phase 1 Live (mock data) · Phase 2 in progress  
> **File created:** September 18, 2026

---

## How to Use This File

Each task has a **priority** label:
- 🔴 **High** — Broken or critically missing; fix first
- 🟡 **Medium** — Important for UX or product completeness
- 🟢 **Low** — Nice-to-have, polish, future features

Check off tasks as you complete them: change `[ ]` to `[x]`.

---

## 1. Authentication & User Flows

- [ ] 🔴 **Create `/login` page** — The Navbar links to `/login` but the route does not exist. Clicking "Login" shows a 404. Build a login page with email/password form wired to `AuthContext.logIn()`.
- [ ] 🔴 **Create `/signup` page** — Same issue as above; `/signup` is linked but missing. Build a sign-up form wired to `AuthContext.signUp()`.
- [ ] 🔴 **Create onboarding flow** — `AuthContext` exposes `finishOnboarding()` and `isOnboarded` but there is no onboarding UI. New users should be asked to pick interests, city, and locality after signing up.
- [ ] 🔴 **Create forgot-password page** — `AuthContext.resetPassword()` exists but there is no UI entry point. Add a "Forgot password?" link on the login page that leads to a `/reset-password` route.
- [ ] 🟡 **Add auth-guard redirects** — Pages like the organizer dashboard and saved events should redirect unauthenticated users to `/login` with a `returnTo` query param.
- [ ] 🟡 **Show logged-in user in Navbar** — Currently the Navbar only shows Login/Sign Up. After login it should show the user's avatar or initials and a dropdown (profile, saved events, logout).

---

## 2. Event Registration

- [ ] 🔴 **Enable event registration button** — On every event detail page (`/events/[id]`) the "Register for this Event" button is hard-disabled (`opacity-75 pointer-events-none`) with a placeholder text "Registration coming soon". Wire up actual registration logic or, at minimum, replace the placeholder with an enquiry form.
- [ ] 🟡 **Real registration count updates** — `registrationCount` is hardcoded in mock data. After a user registers, increment the count in Firestore and reflect it live.
- [ ] 🟡 **Registration confirmation email/notification** — After a successful registration send a confirmation (email via Firebase or an in-app toast).
- [ ] 🟢 **Add a "Saved Events" page** — `SavedEventsContext` is fully implemented but there is no `/saved` or `/profile/saved` page to display what the user has bookmarked.

---

## 3. Search & Filtering

- [ ] 🔴 **EventSearchBar does not actually filter the events list** — It redirects to `/events?q=...` via `window.location.href` (full page reload) but the Events page server component reads the events statically without parsing URL params. Wire up URL param reading inside the events page or convert it to a client component that reads `useSearchParams()`.
- [ ] 🟡 **Category filter pills do not update the displayed events** — The `activeCategory` state in `EventSearchBar` is set but only submitted on form submit. Clicking a category pill should immediately filter results.
- [ ] 🟡 **Add advanced filters to Events page** — The `FilterState` type supports `dateFilter`, `eventType`, `location`, and `sort`, and `eventService.ts` has all the logic ready. Add a filter/sort UI panel to the Events page to expose these options.
- [ ] 🟢 **Persist filter state in URL params** — So users can share filtered views (e.g. `/events?category=Sports&date=this-weekend`).

---

## 4. Pages — Missing & Incomplete

- [ ] 🔴 **Create `/privacy` page** — Footer links to `/privacy` (Privacy Policy) but the page does not exist.
- [ ] 🔴 **Create `/terms` page** — Footer links to `/terms` (Terms of Service) but the page does not exist.
- [ ] 🟡 **Create `/profile` page** — No user profile/account page exists. Users need to view/edit their name, interests, locality, and notification preferences.
- [ ] 🟡 **Businesses page search is non-functional** — The `/businesses` page has a search input and a Search button but they do nothing (no `onSubmit`, no state, no filtering). Wire them up.
- [ ] 🟡 **Businesses page "View" buttons do nothing** — Each business card has a "View" button but there is no business detail page. Either create `/businesses/[id]` pages or disable the buttons with a "coming soon" state.
- [ ] 🟡 **Explore page places have no detail pages** — `ExploreCard` items and highlight cards are not clickable. Add links or detail pages.
- [ ] 🟢 **Add a `/saved` page** — Display the events the user has bookmarked using `SavedEventsContext`.
- [ ] 🟢 **Add a sitemap (`/sitemap.xml`)** — Good for SEO, especially given the structured data in `layout.tsx`.

---

## 5. AI Chat Assistant

- [ ] 🟡 **Fix Gemini model name** — In `geminiService.ts` the fallback model is `"gemini-3.6-flash"` which does not exist. The correct name should be `"gemini-1.5-flash"` or `"gemini-2.0-flash"`. Using an invalid model will cause all AI responses to fail silently.
- [ ] 🟡 **Add "Save to Firestore" for chat history** — Currently chat history is in-memory only and lost on page refresh. For logged-in users, persist the last N turns to Firestore.
- [ ] 🟡 **Rate-limit Map leaks memory on long-running server** — The in-memory `rateLimitMap` in `route.ts` is never fully cleared between deployments and will grow unboundedly on a serverless edge environment. Use Redis or a proper rate-limit library (e.g. `@upstash/ratelimit`) for production.
- [ ] 🟢 **Improve suggested questions** — The AI returns suggested follow-up questions but the UI does not render them as clickable chips. Display them below the AI reply so users can tap to ask.
- [ ] 🟢 **Show a typing indicator** — There is no loading animation while waiting for the AI response.

---

## 6. Data & Backend

- [ ] 🔴 **Dates will go stale** — All `isToday` flags and dates in `lib/data/events.ts` are hardcoded to September–October 2026. Once those dates pass, "Happening Today" sections will always be empty. Replace the static `isToday` flag with a runtime comparison using the event's `date` field (the `eventService` already does this correctly in `getTodaysEvents()`).
- [ ] 🟡 **Connect Firebase Firestore for real event data** — `lib/firebase/config.ts` is set up and `lib/services/` has the service layer ready. Replace `getAllEvents()` in `lib/data/events.ts` with a Firestore query.
- [ ] 🟡 **Firebase config is missing from `.env.local`** — `.env.local.example` presumably lists required Firebase keys. Make sure all keys are filled in before deploying. Add a startup check that throws a readable error if any key is missing.
- [ ] 🟡 **Add event slug-based routing** — `Event` has a `slug` field and `getEventById` matches on both `id` and `slug`, but `generateStaticParams` only generates paths using `id`. Add slug-based static params so `/events/nizamabad-marathon-2026` works.
- [ ] 🟢 **Add pagination to Events page** — Currently all events load at once. Add a "Load more" button or infinite scroll for scalability.
- [ ] 🟢 **Add an admin event submission flow** — Organizers fill the enquiry form but events still require manual publishing. Build an admin-side review/approval interface or at least a Firestore-backed organizer dashboard.

---

## 7. UI / UX Improvements

- [ ] 🟡 **Navbar active link uses `window.location.pathname`** — This is calculated on every render but runs on the client only (guarded by `typeof window !== "undefined"`), causing a hydration mismatch. Use Next.js `usePathname()` hook instead.
- [ ] 🟡 **Share button on event detail page is a plain anchor** — The "Share this event →" link in the sidebar just links back to the same page. Replace with a real share menu (Web Share API with clipboard fallback) or use the existing `ShareButton.tsx` component.
- [ ] 🟡 **Map placeholder on event detail page** — The location section shows "Map view coming soon" with a static placeholder. Integrate Google Maps Embed API (free tier) or Leaflet.js to show the actual event coordinates (lat/long are already in the data).
- [ ] 🟡 **FeaturedEventsBanner progress bar animation** — The banner uses an inline `<style jsx>` block for the `progressBar` keyframe. This requires `styled-jsx` (not installed). Move the animation to `globals.css` or Tailwind keyframes, or it may silently break.
- [ ] 🟡 **EventSearchBar: "EventSearchBar does not read URL params on load"** — If a user navigates to `/events?category=Sports`, the category filter pill is not pre-selected. Read URL params on mount with `useSearchParams()`.
- [ ] 🟢 **Add scroll-to-top button** — For long pages (Events listing, Explore) add a "Back to top" button that appears after scrolling down.
- [ ] 🟢 **Add empty state UI** — When filters return 0 events, show a friendly illustration + message + a "Clear filters" button.
- [ ] 🟢 **Improve mobile menu** — The mobile nav only shows a "switch role" button; it does not show the user's login state. Add Login/Profile options that are context-aware.

---

## 8. Performance & SEO

- [ ] 🟡 **Add OG image** — `layout.tsx` references `/og-image.png` for OpenGraph but no such file exists in `/public`. Create a proper 1200×630 OG image.
- [ ] 🟡 **Add favicon and Apple touch icon** — `layout.tsx` references `/favicon.ico` and `/apple-touch-icon.png` but `public/` only contains `placeholder.txt`.
- [ ] 🟡 **Add `site.webmanifest`** — Referenced in layout metadata but missing from `/public`.
- [ ] 🟡 **Lazy-load below-the-fold images** — `EventCard` and `ExploreCard` images do not set `loading="lazy"` on `<Image />`. Next.js images are lazy by default unless `priority` is set, but double-check cards that are always above the fold on mobile.
- [ ] 🟢 **Add `robots.txt`** — Not present in `/public`. Add one to control crawler access.
- [ ] 🟢 **Event detail pages: add structured data (JSON-LD)** — Add `Event` schema to individual event pages for rich results in Google Search.
- [ ] 🟢 **Reduce Google Fonts network request** — Fonts are loaded via a CSS `@import` in `globals.css` inside a `@tailwind` layer. This blocks rendering. Move the `<link>` preload tags to `layout.tsx` `<head>` (they're already partially done with `preconnect`; add the actual font stylesheet as a `<link rel="stylesheet">`).

---

## 9. Accessibility

- [ ] 🟡 **FeaturedEventsBanner: keyboard navigation conflict** — Arrow key handlers are added to `window` globally in the banner. This conflicts with any focusable element on the page that also uses arrow keys (e.g. dropdowns, inputs). Scope the handler to the banner section element.
- [ ] 🟡 **Businesses page category buttons** — The category filter buttons in `/businesses` use `<button>` but clicking them does nothing and there is no aria state feedback. Either make them functional or change to a visual-only element.
- [ ] 🟡 **EventSearchBar: form has no `aria-label`** — The search `<form>` should have an accessible name.
- [ ] 🟢 **Add `aria-live` region for AI chat responses** — Screen readers should announce new AI messages automatically. Wrap the chat reply area in a `<div aria-live="polite">`.
- [ ] 🟢 **Check color contrast** — The `text-ink-subtle` (`#9ca3af`) on white background (`#ffffff`) has a contrast ratio of ~2.9:1, below the WCAG AA minimum of 4.5:1 for normal text. Audit and fix low-contrast combinations.

---

## 10. Code Quality & Architecture

- [ ] 🟡 **`EventSearchBar` should use `useRouter` + `useSearchParams`** — Replace `window.location.href` redirects with Next.js router navigation to avoid full-page reloads.
- [ ] 🟡 **`Navbar.tsx`: replace `<a>` tags with Next.js `<Link>`** — All `<a href="...">` tags in Navbar, Footer, and cards should use `next/link` for client-side navigation and prefetching.
- [ ] 🟡 **Add form validation** — `ContactForm` and `OrganizerEnquiryForm` collect user input. Add client-side validation (required fields, email format, phone format) and display inline error messages.
- [ ] 🟡 **Environment variable validation on startup** — Add a `lib/env.ts` module that reads and validates all required env vars (`GEMINI_API_KEY`, Firebase keys) and throws a descriptive error at build time if any are missing.
- [ ] 🟢 **Add TypeScript strict mode** — `tsconfig.json` may not have `"strict": true`. Enable it and fix any resulting type errors for safer development.
- [ ] 🟢 **Split large data file** — `lib/data/events.ts` is very large (700+ lines). Consider splitting into multiple files by category or month, or moving to a JSON file.
- [ ] 🟢 **Remove `isToday` from data model** — The `isToday` boolean flag is a derived/computed value that should never be in the data layer. It is already computed correctly by `getTodaysEvents()` in the service. Remove it from the `Event` type and the mock data to avoid stale values.

---

## 11. Testing

- [ ] 🟢 **Add unit tests for `eventService.ts`** — The filter/search/sort logic in `lib/services/eventService.ts` has no tests. Add Jest or Vitest tests covering: `searchEvents`, `applyDateFilter`, `applyTypeFilter`, `sortEvents`, `filterEvents`.
- [ ] 🟢 **Add unit tests for `utils.ts`** — `formatDate`, `formatTime`, `formatTimeRange`, `getCategoryColors`, `capacityPercent` are all pure functions — easy to test.
- [ ] 🟢 **Add E2E smoke tests** — Use Playwright or Cypress to test: homepage loads, event detail page loads, search redirects, AI chat opens.

---

## 12. Missing Features (Planned)

- [ ] 🟢 **Notification preferences UI** — `UserProfile` and `AuthContext` have `notificationPreferences` but no UI exists to configure them.
- [ ] 🟢 **Organizer dashboard** — After signing up as an organizer, there is no dashboard to view or manage submitted events.
- [ ] 🟢 **Event image upload** — Organizers currently cannot upload event images; images come from Unsplash URLs in mock data.
- [ ] 🟢 **Multi-city support** — The platform is described as "starting with Nizamabad" but has no city-switching mechanism. Prepare the data model and routing for multi-city.
- [ ] 🟢 **Push notifications / PWA** — `site.webmanifest` is referenced but missing. Add a full PWA manifest and service worker for offline support and push notification opt-in.

---

## Quick Wins (Start Here)

These are fast fixes with high visibility:

1. Fix Gemini model name (`"gemini-3.6-flash"` → `"gemini-1.5-flash"`) in `lib/services/geminiService.ts`
2. Add `/favicon.ico`, `/apple-touch-icon.png`, `/og-image.png`, and `/site.webmanifest` to `/public`
3. Create stub `/privacy` and `/terms` pages so footer links don't 404
4. Replace `window.location.href` in `EventSearchBar` with `useRouter().push()`
5. Replace `<a>` with `next/link` `<Link>` in `Navbar.tsx` and `Footer.tsx`
6. Move `progressBar` keyframe from inline `<style jsx>` to `globals.css`
7. Create skeleton `/login` and `/signup` pages with basic forms
8. Make the "Register for this Event" button show an enquiry modal instead of being disabled
