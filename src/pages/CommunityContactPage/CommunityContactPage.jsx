import { useState } from "react";
import { Check, Copy } from "lucide-react";
import layoutData from "../../data/layout.json";
import PageLink from "../../components/PageLink/PageLink.jsx";
import "./CommunityContactPage.css";

export default function CommunityContactPage() {
  const { contact, social } = layoutData.footer;
  const emailLink = social.reachOutLinks.find((link) => link.href.startsWith("mailto:"));
  const email = emailLink.href.slice("mailto:".length);
  const address = contact.addressLines;
  const mapQuery = encodeURIComponent(address.map((line) => line.replace(/,$/, "")).join(", "));
  const [copyStatus, setCopyStatus] = useState("idle");

  const copyEmail = async () => {
    setCopyStatus("copying");
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable.");
      }
      await navigator.clipboard.writeText(email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <section
      className="contact-page container mx-auto px-4 md:px-8"
      aria-labelledby="contact-title"
    >
      <header className="contact-header">
        <h1 id="contact-title" className="page-title">
          Contact us
        </h1>
        <p>
          PhD, MSc, BSc students and researchers are welcome to get in touch about internships,
          visits, or openings in the lab. Have a different question? We&apos;d be happy to hear from
          you.
        </p>
      </header>

      <div className="contact-details">
        <div className="contact-info">
          <div>
            <h2>Write to us</h2>
            <a className="contact-email" href={emailLink.href}>
              {email}
            </a>
            <button
              className="contact-copy"
              type="button"
              onClick={copyEmail}
              disabled={copyStatus === "copying"}
              aria-label="Copy email address"
            >
              {copyStatus === "copied" ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "copying"
                  ? "Copying..."
                  : "Copy email"}
            </button>
            <p className="contact-copy-status" role="status" aria-atomic="true">
              {copyStatus === "copied"
                ? "Email address copied."
                : copyStatus === "error"
                  ? "Couldn't copy. Select the address or use the email link."
                  : ""}
            </p>
          </div>

          <div>
            <h2>Find us</h2>
            <address>
              {address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>
        </div>

        <div className="contact-map">
          <iframe
            title="MEDomicsLab location map"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            width="600"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="contact-map-links">
            <PageLink href={contact.mapLink.href} target="_blank" rel="noreferrer" arrowSize="md">
              Google Maps
            </PageLink>
            <PageLink
              href={`https://maps.apple.com/?q=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
              arrowSize="md"
            >
              Apple Maps
            </PageLink>
          </div>
        </div>
      </div>
    </section>
  );
}
