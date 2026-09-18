import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact CityBuzz",
  description: "Get in touch with the CityBuzz team in Nizamabad.",
};

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "faizaanali0102@gmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:faizaanali0102@gmail.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+91 94400 74064",
    sub: "Mon–Sat, 10am–6pm IST",
    href: "tel:+919440074064",
  },
  {
    icon: MapPin,
    title: "Based In",
    detail: "Nizamabad, Telangana",
    sub: "India 503001",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="cb-container">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-brand-500" />
            <span className="text-sm font-semibold text-brand-500 uppercase tracking-widest">
              Contact
            </span>
          </div>
          <h1 className="text-display-md md:text-display-lg font-bold text-ink leading-tight mb-3">
            Let&apos;s Talk
          </h1>
          <p className="text-body-lg text-ink-muted max-w-lg">
            Have a question, feedback or want to collaborate? Reach out to the
            CityBuzz team — we read every message.
          </p>
        </div>
      </div>

      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

          {/* ── Left: contact info ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h2 className="text-heading-xl font-bold text-ink mb-2">Contact Details</h2>
              <p className="text-body-sm text-ink-muted">
                Multiple ways to reach us — pick whichever is easiest for you.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactDetails.map(({ icon: Icon, title, detail, sub, href }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-surface-secondary border border-border"
                >
                  <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-0.5">
                      {title}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-semibold text-ink hover:text-brand-500 transition-colors"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-ink">{detail}</p>
                    )}
                    <p className="text-xs text-ink-muted mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="flex items-center gap-2.5 p-4 bg-green-50 rounded-2xl border border-green-100">
              <Clock className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">Fast Response</p>
                <p className="text-xs text-green-600">We typically respond within 24 hours.</p>
              </div>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-border shadow-card-lg p-6 md:p-8">
              <h2 className="text-heading-xl font-bold text-ink mb-1">Send a Message</h2>
              <p className="text-body-sm text-ink-muted mb-6">
                Fill in the form and we&apos;ll get back to you shortly.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
