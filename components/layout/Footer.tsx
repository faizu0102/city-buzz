import React from "react";
import { Zap, Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const footerLinks = {
  Platform: [
    { label: "Events",     href: "/events" },
    { label: "Explore",    href: "/explore" },
    { label: "Businesses", href: "/businesses" },
    { label: "Organizers", href: "/organizer" },
  ],
  Company: [
    { label: "About",           href: "/about" },
    { label: "Contact",         href: "/contact" },
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Terms of Service",href: "/terms" },
  ],
};

const socialLinks = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Twitter / X", href: "#", icon: Twitter },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "YouTube", href: "#", icon: Youtube },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-ink text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4 group" aria-label="CityBuzz home">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 group-hover:bg-brand-600 transition-colors">
                <Zap className="h-5 w-5 text-white" strokeWidth={2.5} fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tight">
                CITY<span className="text-brand-500">BUZZ</span>
              </span>
            </a>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-5">
              Discover Everything Happening Around Your City. Nizamabad&apos;s home for events,
              activities, places and local experiences.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 text-white/60 hover:bg-brand-500 hover:text-white transition-all duration-150"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-400" />
                <span>Nizamabad, Telangana 503001, India</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <a href="mailto:faizaanali0102@gmail.com">faizaanali0102@gmail.com</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <a href="tel:+919440074064">+91 94400 74064</a>
              </li>
            </ul>

            {/* Launch city badge */}
            <div className="mt-5 inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/30 rounded-full px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-xs font-semibold text-brand-300">
                Now Live in Nizamabad
              </span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/40">
            © 2026 CityBuzz. All rights reserved.
          </p>
          <p className="text-sm text-white/30">
            Built for Nizamabad 🇮🇳 with&nbsp;❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
