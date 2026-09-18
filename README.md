# CityBuzz — Discover Everything Happening Around Your City

> **The local event discovery platform for Nizamabad, Telangana, India.**

---

## What is CityBuzz?

CityBuzz is a website built for the people of Nizamabad. The idea is simple — every day, dozens of events happen in the city: cultural programs, sports tournaments, tech workshops, food festivals, community gatherings. But most people never find out about them because the information is scattered across WhatsApp groups, Instagram posts, and word of mouth.

CityBuzz fixes that. It is one place where you can see everything happening in your city, register for events, and never miss out again.

---

## Who is it for?

CityBuzz has two types of users:

**Participants** — people who want to discover and attend events.
- Browse all events in Nizamabad
- Filter by category, date, or whether it's free
- Register for events directly on the site
- Save events you're interested in
- Use the AI assistant to find events by chatting

**Organizers** — colleges, companies, NGOs, government bodies, sports clubs, or individuals who want to promote their events.
- Create a free organizer account
- Fill in event details (title, date, venue, description, image, etc.)
- Publish the event instantly — it appears live on the site for all participants to see
- Manage all your events from a personal dashboard

---

## Pages and Features

### Home Page
The first thing visitors see. It shows:
- A large banner carousel of featured events with auto-rotation
- A role picker ("I'm a Participant" / "I'm an Organizer") that personalizes the experience
- Events happening **today** — updated daily
- Upcoming events
- Event categories (Cultural, Sports, Workshop, Technology, Music, etc.)
- A "Why CityBuzz" and "How it works" section

### Events Page (`/events`)
A full listing of all events. You can:
- Search by keyword (event name, venue, organizer, tags)
- Filter by category using the pill buttons — results update instantly without reloading
- See "Happening Today" events at the top
- See upcoming events below

### Event Detail Page (`/events/[id]`)
Each event has its own dedicated page showing:
- Event image, title, category, date, time, venue
- Full description and highlights
- Capacity bar (how many spots are left)
- A working **Register** button — fills your name, email, and phone, and saves your registration
- Related events from the same category
- A link to open the venue in Google Maps

### Explore Page (`/explore`)
A city guide for Nizamabad — places to visit, local highlights like Nizamabad Fort, Sriramsagar Reservoir, Alisagar Deer Park, Turmeric Market, and more.

### Businesses Page (`/businesses`)
A preview of local businesses in Nizamabad — restaurants, retail shops, services, healthcare, and more. Full directory coming in Phase 3.

### Organizer Portal (`/organizer`)
The hub for event organizers. If you're not logged in, you'll see sign-in and register buttons. Logged-in organizers see their dashboard and event creation options.

### Organizer Signup (`/organizer/signup`)
A two-step registration specifically for organizers:
1. Choose your organization type (College, Company, NGO, Government, Sports Club, Cultural Org, Individual, etc.)
2. Fill in organization name, contact person, email, phone, and password

### Organizer Dashboard (`/organizer/dashboard`)
After logging in, organizers see:
- All their created events with status (Published / Cancelled)
- Total event count and capacity stats
- Publish / Unpublish / Delete buttons for each event
- Quick links to create a new event

### Create Event (`/organizer/create`)
A detailed form for publishing a new event:
- Event title, category, organizer name
- Short description and full description
- Bullet-point highlights (up to 6)
- Date, start time, end time
- Venue name, full address, locality (dropdown of Nizamabad areas)
- Free or paid toggle (with ticket price field)
- Registration required toggle + capacity
- Image picker (8 stock images or paste your own URL)
- Tags (up to 8)

Once submitted, the event is saved to Firebase and appears live on the Events page immediately.

### About Page (`/about`)
Explains what CityBuzz is, the mission, core values, the product roadmap (Phase 1 through Phase 5), and the team behind it.

### Contact Page (`/contact`)
Real contact details plus a message form. Reach the team at:
- Email: faizaanali0102@gmail.com
- Phone: +91 94400 74064

### Profile Page (`/profile`)
For logged-in participants:
- View and edit your name, phone, locality
- Select your interests from 12 categories
- See saved (bookmarked) events
- See events you've registered for
- Manage notification preferences
- Sign out

### Login & Signup (`/login`, `/signup`)
Standard authentication pages with email and password. Includes:
- Password strength indicators
- Show/hide password toggle
- Demo credentials for testing: `demo@citybuzz.in` / `password123`

### Privacy Policy & Terms of Service (`/privacy`, `/terms`)
Full legal pages explaining how user data is handled and the rules for using the platform.

---

## The AI Assistant

There is a floating **"Ask CityBuzz"** button on every page (bottom-right corner). Clicking it opens a chat window powered by Google Gemini AI.

You can ask it things like:
- *"What's happening today in Nizamabad?"*
- *"Are there any free events this weekend?"*
- *"Show me technology events"*
- *"Tell me about the cricket tournament"*

The AI knows about all current CityBuzz events and responds with real event data — it won't make up information. If it doesn't have the data, it says so.

---

## Tech Stack

| What | Technology Used |
|---|---|
| Framework | Next.js 15 (React 18) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Firebase (Firestore + Authentication) |
| AI | Google Gemini API (`@google/genai`) |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |
| Images | Unsplash (CDN) |

---

## Project Structure

```
citybuzz/
├── app/                    # All pages (Next.js App Router)
│   ├── page.tsx            # Home page
│   ├── events/             # Events listing + individual event pages
│   ├── explore/            # City exploration page
│   ├── businesses/         # Local businesses directory
│   ├── about/              # About page with team
│   ├── contact/            # Contact page
│   ├── profile/            # User profile page
│   ├── login/              # Participant login
│   ├── signup/             # Participant signup
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── organizer/          # Organizer portal
│   │   ├── page.tsx        # Organizer landing page
│   │   ├── login/          # Organizer login
│   │   ├── signup/         # Organizer signup (2-step with org type)
│   │   ├── dashboard/      # Organizer dashboard
│   │   └── create/         # Create event form
│   └── api/chat/           # AI chat API endpoint
│
├── components/             # Reusable UI components
│   ├── ai/                 # AI chat drawer, message items, input
│   ├── forms/              # Search bar, contact form, enquiry form
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Homepage sections (Hero, Featured, Today, etc.)
│   ├── events/             # Register button modal
│   └── ui/                 # Buttons, badges, cards, section wrappers
│
├── context/                # React context providers
│   ├── AuthContext.tsx     # Login/signup/logout state
│   ├── RoleContext.tsx     # Participant vs Organizer role
│   └── SavedEventsContext.tsx  # Bookmarked events state
│
├── lib/
│   ├── data/               # Mock event data, categories, explore places
│   ├── firebase/           # Firebase configuration
│   ├── services/           # Business logic layer
│   │   ├── eventService.ts          # Filter, search, sort events
│   │   ├── organizerEventService.ts # Create/manage organizer events in Firestore
│   │   ├── authService.ts           # Firebase auth + local mock fallback
│   │   ├── userService.ts           # User profile in Firestore
│   │   ├── savedEventsService.ts    # Saved events in Firestore
│   │   ├── geminiService.ts         # Gemini AI API calls
│   │   └── aiContextService.ts      # Build event context for AI
│   └── types/              # TypeScript type definitions
│
└── .env.local              # Environment variables (API keys)
```

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the root (or edit the existing one) with:

```env
# Gemini AI — get from https://aistudio.google.com/apikey
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.6-flash

# Firebase — get from Firebase Console → Project Settings → Web App
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Enable Firebase services
In your Firebase Console:
- **Authentication** → Sign-in method → Enable **Email/Password**
- **Firestore Database** → Create database → Start in test mode

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## How Organizer Events Work

When an organizer creates an event:
1. The event is saved to **Firestore** with `source: "organizer"` and `status: "published"`
2. The participant Events page fetches all published organizer events from Firestore on load
3. These are merged with the built-in mock events and shown together
4. Participants can search, filter, and register for organizer events just like any other event

If Firebase is not configured, everything falls back to **localStorage** — so the app works fully offline/locally too.

---

## Data Flow Summary

```
Participant visits /events
       ↓
Mock events (lib/data/events.ts)  +  Firestore organizer events
       ↓
Merged, filtered, sorted
       ↓
Displayed as EventCards
       ↓
Participant clicks Register
       ↓
Modal → name/email/phone → saved to localStorage (Phase 2)
                         → will sync to Firestore in Phase 3
```

---

## Roadmap

| Phase | What | Status |
|---|---|---|
| Phase 1 | Event discovery — browse, search, filter | ✅ Live |
| Phase 2 | Organizer portal — create and manage events | ✅ Live |
| Phase 3 | Real-time Firestore for all data, full registration system | 🔄 Live |
| Phase 4 | Business listings, local transport, safety info | 📋 Planned |
| Phase 5 | Full AI personalization, smart alerts, PWA | 🔮 Planned |

---

## Team

| Name | Role |
|---|---|
| Mohammed Faizaan Ali Khan | Senior Developer |
| Shaik Cezan | Junior Developer |
| Shaik Sahil | Junior Developer |
| Salman Bi Salam | Junior Developer |

**Contact:** faizaanali0102@gmail.com · +91 94400 74064

---

## License

Built for Nizamabad 🇮🇳 with ❤️

© 2026 CityBuzz. All rights reserved.
