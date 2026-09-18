import type { Metadata } from "next";
import { Zap, Target, Users, MapPin, Rocket, Heart, Mail } from "lucide-react";
import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About CityBuzz",
  description:
    "Learn about CityBuzz — the digital platform connecting people with everything happening in Nizamabad.",
};

const values = [
  {
    icon: MapPin,
    title: "Local First",
    desc: "Every decision we make starts with what's right for Nizamabad and its people.",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "CityBuzz is built with and for the community — not for metrics or external markets.",
  },
  {
    icon: Target,
    title: "Problem Focused",
    desc: "We solve real problems. Information scattered across WhatsApp and Instagram hurts real people.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    desc: "We care deeply about the product, the design, and the experience we deliver.",
  },
];

const roadmap = [
  { phase: "Phase 1", title: "Events & Activities", status: "Live", desc: "Event discovery for Nizamabad — cultural, sports, workshops, community and more." },
  { phase: "Phase 2", title: "City Exploration", status: "Next", desc: "Places to visit, food guides, local businesses and activity listings." },
  { phase: "Phase 3", title: "Offers & Businesses", status: "Planned", desc: "Local business listings, offers, promotions and reviews." },
  { phase: "Phase 4", title: "Transport & Safety", status: "Planned", desc: "Local transport info, emergency contacts and safety resources." },
  { phase: "Phase 5", title: "AI City Assistant", status: "Future", desc: "AI-powered recommendations, personalised city discovery and smart alerts." },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="cb-container">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
              <Zap className="h-5 w-5 text-white" strokeWidth={2.5} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tight text-ink">
              CITY<span className="text-brand-500">BUZZ</span>
            </span>
          </div>
          <h1 className="text-display-md md:text-display-lg font-bold text-ink leading-tight mb-4 max-w-2xl">
            One Platform for{" "}
            <span className="text-brand-500">Everything</span>{" "}
            Happening in Your City
          </h1>
          <p className="text-body-lg text-ink-muted max-w-xl leading-relaxed">
            CityBuzz started with a simple observation: people miss local events
            because information is scattered everywhere. We&apos;re fixing that —
            one city at a time, starting with Nizamabad.
          </p>
        </div>
      </div>

      {/* ── Mission ── */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-label-md uppercase tracking-widest text-brand-500 mb-3">Our Mission</p>
            <h2 className="text-display-sm font-bold text-ink mb-5 leading-tight">
              Discover Everything Happening Around Your City.
            </h2>
            <div className="space-y-4 text-body-md text-ink-secondary leading-relaxed">
              <p>
                CityBuzz is a local city-focused digital platform. We believe every city has
                vibrant events, unique places and remarkable businesses — but most people
                never find out about them because the information is fragmented.
              </p>
              <p>
                We&apos;re building the unified layer that connects people with their city.
                Events are our first chapter. The full city ecosystem is our long-term vision.
              </p>
              <p>
                Our initial launch city is <strong className="text-ink">Nizamabad, Telangana</strong>.
                Built here, for here.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-5 rounded-2xl bg-surface-secondary border border-border"
                >
                  <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-brand-500" />
                  </div>
                  <h3 className="font-semibold text-ink text-heading-md mb-1.5">{v.title}</h3>
                  <p className="text-body-sm text-ink-muted leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── Roadmap ── */}
      <Section className="bg-surface-secondary">
        <div className="text-center mb-12">
          <p className="text-label-md uppercase tracking-widest text-brand-500 mb-2">What&apos;s Coming</p>
          <h2 className="text-display-sm font-bold text-ink">CityBuzz Roadmap</h2>
          <p className="text-body-lg text-ink-muted mt-2 max-w-xl mx-auto">
            Events are just the beginning. Here&apos;s where we&apos;re headed.
          </p>
        </div>

        <div className="relative flex flex-col gap-0">
          {roadmap.map((item, i) => (
            <div key={item.phase} className="flex gap-5 md:gap-8 group">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-black text-xs z-10 ${
                    item.status === "Live"
                      ? "bg-brand-500 text-white shadow-md"
                      : item.status === "Next"
                      ? "bg-accent-500 text-white"
                      : "bg-surface-tertiary border-2 border-border text-ink-muted"
                  }`}
                >
                  {item.status === "Live" ? (
                    <Rocket className="h-4 w-4" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {i < roadmap.length - 1 && (
                  <div className="flex-1 w-0.5 bg-border my-1" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-8 flex-1 pt-1.5 ${i === roadmap.length - 1 ? "pb-0" : ""}`}>
                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">
                    {item.phase}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      item.status === "Live"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Next"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-surface-tertiary text-ink-subtle"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-ink text-heading-xl mb-1">{item.title}</h3>
                <p className="text-body-sm text-ink-muted leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Team ── */}
      <Section className="bg-white">
        <div className="text-center mb-12">
          <p className="text-label-md uppercase tracking-widest text-brand-500 mb-2">The People Behind It</p>
          <h2 className="text-display-sm font-bold text-ink">Meet the Team</h2>
          <p className="text-body-lg text-ink-muted mt-2 max-w-xl mx-auto">
            A small, passionate team from Nizamabad building the city&apos;s digital pulse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {[
            {
              name: "Mohammed Faizaan Ali Khan",
              role: "Senior Developer",
              initials: "MF",
              color: "bg-brand-500",
              email: "faizaanali0102@gmail.com",
              phone: "+91 94400 74064",
            },
            {
              name: "Shaik Cezan",
              role: "Junior Developer",
              initials: "SC",
              color: "bg-accent-500",
              email: null,
              phone: null,
            },
            {
              name: "Shaik Sahil",
              role: "Junior Developer",
              initials: "SS",
              color: "bg-teal-500",
              email: null,
              phone: null,
            },
            {
              name: "Salman Bi Salam",
              role: "Junior Developer",
              initials: "SB",
              color: "bg-purple-500",
              email: null,
              phone: null,
            },
          ].map((member) => (
            <div
              key={member.name}
              className="bg-surface-secondary border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-card-hover transition-all duration-200"
            >
              {/* Avatar */}
              <div className={`h-16 w-16 rounded-2xl ${member.color} flex items-center justify-center text-white text-xl font-black shadow-sm`}>
                {member.initials}
              </div>

              <div>
                <p className="font-bold text-ink text-heading-md leading-snug">{member.name}</p>
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mt-0.5">{member.role}</p>
              </div>

              {member.email && (
                <div className="flex flex-col gap-1 w-full text-xs text-ink-muted border-t border-border pt-3">
                  <a href={`mailto:${member.email}`} className="hover:text-brand-500 transition-colors truncate">
                    ✉ {member.email}
                  </a>
                  {member.phone && (
                    <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="hover:text-brand-500 transition-colors">
                      📞 {member.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Contact CTA ── */}
      <Section className="bg-white" narrow>
        <div className="text-center">
          <div className="h-14 w-14 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-5">
            <Mail className="h-6 w-6 text-brand-500" />
          </div>
          <h2 className="text-display-sm font-bold text-ink mb-3">Get in Touch</h2>
          <p className="text-body-lg text-ink-muted mb-6 max-w-md mx-auto">
            Have a question, suggestion or want to collaborate? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="primary" size="lg" href="/contact">
              Contact Us
            </Button>
            <Button variant="outline" size="lg" href="/organizer">
              List an Event
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
