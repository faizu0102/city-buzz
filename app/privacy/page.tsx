import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CityBuzz",
  description: "How CityBuzz collects, uses and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "**Account information** — When you create a CityBuzz account we collect your name, email address, and optionally your phone number and city/locality.",
      "**Usage data** — We collect information about how you interact with the platform, including pages viewed, events browsed, and search queries. This helps us improve the experience.",
      "**Saved events** — If you save or bookmark events, we store that list against your account.",
      "**Contact form submissions** — Messages sent through the Contact or Organizer Enquiry forms are stored to allow us to respond.",
      "**Device information** — We may collect browser type, operating system, and IP address for security and analytics purposes.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To provide, operate, and improve the CityBuzz platform.",
      "To send event-related notifications and reminders you have opted into.",
      "To respond to enquiries and support requests you submit.",
      "To personalise event recommendations based on your stated interests and location.",
      "To detect and prevent fraud, abuse, or security incidents.",
      "We do **not** sell your personal data to third parties.",
    ],
  },
  {
    title: "3. Data Storage & Security",
    body: [
      "CityBuzz uses Google Firebase for authentication and data storage. Firebase is ISO 27001 certified and SOC 2 compliant.",
      "Passwords are managed entirely by Firebase Authentication using industry-standard hashing. CityBuzz never stores plaintext passwords.",
      "Data is stored in Google Cloud infrastructure. We apply access controls, encryption in transit (HTTPS/TLS), and encryption at rest.",
      "While we take security seriously, no system is completely impenetrable. In the event of a data breach we will notify affected users within 72 hours in line with applicable regulations.",
    ],
  },
  {
    title: "4. Cookies & Local Storage",
    body: [
      "CityBuzz uses browser localStorage to persist your role preference (participant/organiser) and anonymously saved events across sessions — no personal data is stored in localStorage.",
      "We do not currently use tracking cookies or third-party advertising cookies.",
      "Standard browser session cookies may be set by Firebase Authentication for maintaining your login session.",
    ],
  },
  {
    title: "5. Third-Party Services",
    body: [
      "**Google Firebase** — Authentication and database. Google's privacy policy applies: https://policies.google.com/privacy",
      "**Google Gemini AI** — Our AI assistant sends your chat messages to Google's Gemini API to generate responses. Messages are not stored by CityBuzz beyond the current session. Refer to Google's AI privacy policy for how Google processes these inputs.",
      "**Unsplash** — Event images are served from Unsplash CDN. Their privacy policy applies to image requests.",
      "We do not use Google Analytics, Meta Pixel, or other third-party trackers at this time.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "**Access** — You may request a copy of the personal data we hold about you.",
      "**Correction** — You may update your profile information at any time from your account settings.",
      "**Deletion** — You may request deletion of your account and associated data by emailing hello@citybuzz.in.",
      "**Portability** — You may request an export of your data in a machine-readable format.",
      "To exercise any of these rights, contact us at hello@citybuzz.in. We will respond within 30 days.",
    ],
  },
  {
    title: "7. Children's Privacy",
    body: [
      "CityBuzz is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.",
      "If you believe a child has provided us with personal information, please contact us immediately at hello@citybuzz.in and we will delete it.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the 'Last updated' date at the top of this page.",
      "For significant changes, we will notify registered users via email or an in-app notice.",
      "Continued use of CityBuzz after policy changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "9. Contact",
    body: [
      "If you have any questions about this Privacy Policy or how we handle your data, please contact us:",
      "**Email:** hello@citybuzz.in",
      "**Address:** Nizamabad, Telangana 503001, India",
    ],
  },
];

export default function PrivacyPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div className="cb-container">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-brand-500" />
            <span className="text-sm font-semibold text-brand-500 uppercase tracking-widest">
              Legal
            </span>
          </div>
          <h1 className="text-display-md md:text-display-lg font-bold text-ink leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-body-lg text-ink-muted max-w-xl">
            How CityBuzz collects, uses and protects your personal information.
          </p>
          <p className="text-sm text-ink-muted mt-3">
            Last updated: <strong className="text-ink">{lastUpdated}</strong>
          </p>
        </div>
      </div>

      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">

          {/* Intro */}
          <div className="mb-10 p-5 bg-brand-50 border border-brand-100 rounded-2xl">
            <p className="text-body-sm text-brand-800 leading-relaxed">
              CityBuzz (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy.
              This policy explains what data we collect when you use CityBuzz, why we collect it,
              and how we handle it. CityBuzz is currently in its launch phase, operating in Nizamabad, Telangana, India.
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
                      {/* Render bold markdown-style **text** */}
                      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={j} className="text-ink font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          part
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
            <Link href="/terms" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Terms of Service →
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
