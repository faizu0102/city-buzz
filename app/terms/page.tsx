import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | CityBuzz",
  description: "Terms and conditions for using the CityBuzz platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using the CityBuzz platform (website, mobile web, or any related services), you agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, please do not use CityBuzz.",
      "We may update these terms from time to time. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms.",
    ],
  },
  {
    title: "2. Description of Service",
    body: [
      "CityBuzz is a local city discovery platform that helps people in Nizamabad, Telangana find events, activities, businesses, and local experiences.",
      "The platform is currently in its launch phase. Features, availability, and content are subject to change without notice.",
      "CityBuzz acts as an information aggregator. We do not organise, host, or take responsibility for the events listed on the platform unless explicitly stated.",
    ],
  },
  {
    title: "3. User Accounts",
    body: [
      "You must provide accurate, current, and complete information when creating an account.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You must notify us immediately at hello@citybuzz.in if you suspect unauthorised access to your account.",
      "You must be at least 13 years old to create an account on CityBuzz.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    title: "4. User Conduct",
    body: [
      "You agree not to use CityBuzz to post, submit, or transmit any content that is false, misleading, defamatory, harassing, abusive, or unlawful.",
      "You agree not to use automated tools, bots, or scrapers to access or collect data from CityBuzz without prior written consent.",
      "You agree not to attempt to gain unauthorised access to any part of the platform, its servers, or related infrastructure.",
      "You agree not to post event listings that are fraudulent, misleading, or designed to deceive attendees.",
      "Violation of these rules may result in immediate account suspension.",
    ],
  },
  {
    title: "5. Event Listings & Organiser Responsibilities",
    body: [
      "Event organisers who list events on CityBuzz are solely responsible for the accuracy of the information provided, including dates, times, venues, fees, and registration requirements.",
      "CityBuzz reviews listings before publishing but does not guarantee the accuracy or completeness of any event information.",
      "Organisers must ensure their events comply with all applicable local laws and regulations.",
      "CityBuzz reserves the right to remove any event listing that violates these terms or is reported as fraudulent.",
      "Listing events on CityBuzz is free during the current Phase 1 launch period. Pricing for future phases will be communicated in advance.",
    ],
  },
  {
    title: "6. Intellectual Property",
    body: [
      "The CityBuzz name, logo, design system, and original platform content are the intellectual property of CityBuzz and may not be reproduced without permission.",
      "Event images and descriptions submitted by organisers remain the intellectual property of the respective organisers. By submitting content, organisers grant CityBuzz a non-exclusive licence to display that content on the platform.",
      "Stock images from Unsplash are used under the Unsplash Licence and remain the property of respective photographers.",
    ],
  },
  {
    title: "7. Disclaimers & Limitation of Liability",
    body: [
      "CityBuzz is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, express or implied.",
      "We do not guarantee that the platform will be error-free, uninterrupted, or free from viruses.",
      "CityBuzz is not responsible for any loss or damage arising from your use of the platform, reliance on event information, or attendance at events listed on the platform.",
      "Our AI assistant (CityBuzz AI) may occasionally provide incomplete or inaccurate information. Always verify event details directly with the organiser.",
      "To the maximum extent permitted by law, CityBuzz's total liability for any claim shall not exceed ₹1,000 (Indian Rupees One Thousand).",
    ],
  },
  {
    title: "8. Third-Party Links & Services",
    body: [
      "CityBuzz may contain links to third-party websites or services (e.g. Google Maps, event registration portals). We are not responsible for the content or practices of those sites.",
      "Your interactions with third-party services are governed by their own terms and privacy policies.",
    ],
  },
  {
    title: "9. Termination",
    body: [
      "You may delete your account at any time by contacting hello@citybuzz.in.",
      "We may terminate or suspend your access to CityBuzz at any time, with or without cause, and with or without notice.",
      "Upon termination, your right to use the platform ceases immediately. Sections on Intellectual Property, Disclaimers, and Governing Law survive termination.",
    ],
  },
  {
    title: "10. Governing Law",
    body: [
      "These terms are governed by and construed in accordance with the laws of India.",
      "Any disputes arising from these terms or your use of CityBuzz shall be subject to the exclusive jurisdiction of the courts in Nizamabad, Telangana, India.",
    ],
  },
  {
    title: "11. Contact",
    body: [
      "If you have questions about these Terms of Service, please contact us:",
      "**Email:** hello@citybuzz.in",
      "**Address:** Nizamabad, Telangana 503001, India",
    ],
  },
];

export default function TermsPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div className="cb-container">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-brand-500" />
            <span className="text-sm font-semibold text-brand-500 uppercase tracking-widest">
              Legal
            </span>
          </div>
          <h1 className="text-display-md md:text-display-lg font-bold text-ink leading-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-body-lg text-ink-muted max-w-xl">
            Please read these terms carefully before using the CityBuzz platform.
          </p>
          <p className="text-sm text-ink-muted mt-3">
            Last updated: <strong className="text-ink">{lastUpdated}</strong>
          </p>
        </div>
      </div>

      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">

          {/* Intro */}
          <div className="mb-10 p-5 bg-surface-secondary border border-border rounded-2xl">
            <p className="text-body-sm text-ink-secondary leading-relaxed">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of CityBuzz, operated by CityBuzz
              (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), headquartered in Nizamabad, Telangana, India.
              By using CityBuzz you agree to these Terms in full.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-heading-xl font-bold text-ink mb-4">{s.title}</h2>
                <ul className="flex flex-col gap-3">
                  {s.body.map((line, i) => (
                    <li key={i} className="text-body-sm text-ink-secondary leading-relaxed">
                      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={j} className="text-ink font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          <span key={j} dangerouslySetInnerHTML={{ __html: part }} />
                        )
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer nav */}
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Privacy Policy →
            </Link>
            <Link href="/contact" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
