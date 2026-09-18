"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Zap, Megaphone, Compass, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";

// ─── Nav link data ────────────────────────────────────────────────────────────

const participantLinks = [
  { label: "Home",       href: "/" },
  { label: "Events",     href: "/events" },
  { label: "Explore",    href: "/explore" },
  { label: "Businesses", href: "/businesses" },
  { label: "About",      href: "/about" },
];

const organizerLinks = [
  { label: "Home",         href: "/" },
  { label: "Dashboard",    href: "/organizer/dashboard" },
  { label: "Create Event", href: "/organizer/create" },
  { label: "How It Works", href: "/about" },
  { label: "Contact",      href: "/contact" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { role, isOrganizer, clearRole, hydrated } = useRole();
  const { user, isAuthenticated, logOut } = useAuth();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef  = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = isOrganizer ? organizerLinks : participantLinks;

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  // Desktop nav links
  const desktopNavLinks = navLinks.map((link) => (
    <Link
      key={link.href + link.label}
      href={link.href}
      className={cn(
        "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
        currentPath === link.href
          ? "text-brand-500 bg-brand-50"
          : "text-ink-secondary hover:text-ink hover:bg-surface-secondary"
      )}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-200",
          scrolled && "shadow-[0_1px_12px_0_rgb(0_0_0/0.08)]"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="CityBuzz home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 shadow-sm group-hover:bg-brand-600 transition-colors">
                <Zap className="h-4 w-4 text-white" strokeWidth={2.5} fill="currentColor" />
              </div>
              <span className="text-lg font-black tracking-tight text-ink">
                CITY<span className="text-brand-500">BUZZ</span>
              </span>
            </Link>

            {/* ── Role pill (shows once hydrated + role chosen) ── */}
            {hydrated && role && (
              <button
                onClick={clearRole}
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                  isOrganizer
                    ? "bg-ink/8 border-ink/20 text-ink hover:bg-ink/15"
                    : "bg-brand-50 border-brand-200 text-brand-600 hover:bg-brand-100"
                )}
                aria-label="Switch role"
                title="Click to switch role"
              >
                {isOrganizer
                  ? <><Megaphone className="h-3 w-3" /> Organizer</>
                  : <><Compass className="h-3 w-3" /> Participant</>
                }
                <span className="text-ink-subtle">·</span>
                <span className="text-ink-muted font-normal">switch</span>
              </button>
            )}

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {desktopNavLinks}
            </nav>

            {/* ── Right side ── */}
            <div className="flex items-center gap-2">
              {/* Search — only for participants */}
              {!isOrganizer && (
                <button
                  aria-label="Toggle search"
                  onClick={() => setSearchOpen((p) => !p)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary transition-colors"
                >
                  {searchOpen ? <X className="h-4.5 w-4.5" /> : <Search className="h-4.5 w-4.5" />}
                </button>
              )}

              {/* Desktop auth / CTA */}
              <div className="hidden md:flex items-center gap-2">
                {isOrganizer ? (
                  <Button variant="primary" size="sm" href="/organizer/dashboard">
                    My Dashboard
                  </Button>
                ) : isAuthenticated && user ? (
                  /* ── Logged-in user menu ── */
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen((p) => !p)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-border hover:bg-surface-secondary transition-all text-sm font-medium text-ink"
                      aria-label="User menu"
                      aria-expanded={userMenuOpen}
                    >
                      <div className="h-7 w-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(user.fullName || user.email || "U")[0].toUpperCase()}
                      </div>
                      <span className="max-w-[120px] truncate">
                        {user.fullName?.split(" ")[0] || user.email}
                      </span>
                      <ChevronDown className={cn("h-3.5 w-3.5 text-ink-muted transition-transform", userMenuOpen && "rotate-180")} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-2xl shadow-card-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-xs font-semibold text-ink truncate">{user.fullName || "My Account"}</p>
                          <p className="text-xs text-ink-muted truncate">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-ink-secondary hover:bg-surface-secondary hover:text-ink transition-colors"
                          >
                            <User className="h-4 w-4" /> My Profile
                          </Link>
                          <button
                            onClick={async () => { setUserMenuOpen(false); await logOut(); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" href="/login">Login</Button>
                    <Button variant="primary" size="sm" href="/signup">Sign Up</Button>
                  </>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((p) => !p)}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary transition-colors"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* ── Search bar expansion ── */}
          {!isOrganizer && (
            <div className={cn(
              "overflow-hidden transition-all duration-200",
              searchOpen ? "max-h-16 pb-3 opacity-100" : "max-h-0 opacity-0"
            )}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/events?q=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="relative"
              >
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle pointer-events-none" />
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, activities, places..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-surface-secondary text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile menu panel ── */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-40 md:hidden bg-white border-b border-border shadow-lg",
          "transition-all duration-200 ease-out",
          mobileOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-2 opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors",
                currentPath === link.href
                  ? "bg-brand-50 text-brand-500"
                  : "text-ink-secondary hover:bg-surface-secondary hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-border pt-3">
          {isOrganizer ? (
            <Button variant="primary" size="lg" fullWidth href="/organizer/dashboard">
              My Dashboard
            </Button>
          ) : isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {(user.fullName || user.email || "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{user.fullName || "My Account"}</p>
                  <p className="text-xs text-ink-muted truncate">{user.email}</p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-ink-secondary hover:bg-surface-secondary hover:text-ink transition-colors"
              >
                <User className="h-4 w-4" /> My Profile
              </Link>
              <button
                onClick={async () => { setMobileOpen(false); await logOut(); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Button variant="outline" size="lg" fullWidth href="/login">Login</Button>
              <Button variant="primary" size="lg" fullWidth href="/signup">Sign Up</Button>
            </>
          )}
          {hydrated && role && (
            <button
              onClick={() => { clearRole(); setMobileOpen(false); }}
              className="text-sm text-ink-muted hover:text-ink font-medium py-2 transition-colors"
            >
              Switch role ({role})
            </button>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
