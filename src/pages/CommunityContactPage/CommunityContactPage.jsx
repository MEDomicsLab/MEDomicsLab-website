import { useMemo, useState } from "react";
import { Copy, Mail } from "lucide-react";
import layoutData from "../../data/layout.json";
import { useTranslations } from "../../lib/translations";
import FlipWords from "../../components/FlipWords/FlipWords.jsx";

export default function CommunityContactPage() {
  const { t } = useTranslations();
  const footer = layoutData.footer;
  const addressLines = footer.contact.addressLines;
  const addressText = addressLines.join("\n");
  const mapQuery = addressLines.filter(Boolean).join(", ");
  const mapSrc = useMemo(
    () => ({
      google: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`,
      apple: `https://maps.apple.com/?q=${encodeURIComponent(mapQuery)}`,
    }),
    [mapQuery]
  );

  const emailLink = footer.social.reachOutLinks.find((link) => link.href.startsWith("mailto:"));
  const email = emailLink?.href.replace("mailto:", "") || emailLink?.label || "";

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-8 pt-24 pb-12">
      <div className="max-w-5xl space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">Contact us</h1>
          <p className="text-lg text-muted-foreground">
            <FlipWords words={["Ph.D.,", "M.Sc.,", "B.Sc.,"]} className="px-0 text-primary" /> and
            curious students or researchers are welcome to contact us for internships, visits, and
            to see if we have openings. If you are none of that but would like to ask any question,
            feel free as well.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start lg:items-center">
          <div className="space-y-6 text-center lg:text-left lg:items-start flex flex-col">
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
                {t(footer.contact.labelKey, footer.contact.labelDefault)}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">{addressText}</p>
            </div>

            <div className="space-y-3 flex flex-col items-center lg:items-start">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                Contact Martin Vallières
              </h3>
              <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs uppercase tracking-widest rounded-full border border-border bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  Contact Martin
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center rounded-full border border-border/70 px-3 py-3 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Copy email"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copied && (
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Copied
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <div className="rounded-3xl overflow-hidden border border-border/60 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full">
              <iframe
                title="MEDomicsLab location map"
                src={mapSrc.google}
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[420px]"
                style={{
                  filter: "grayscale(0.1) invert(90%) hue-rotate(180deg) brightness(0.8)",
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <a
                href={footer.contact.mapLink.href}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5/70 p-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] text-white transition-colors hover:text-primary"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Google Maps"
                title="Open Google Maps"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.73 1.23 9.25 3.27l6.9-6.9C35.62 1.99 30.07 0 24 0 14.64 0 6.6 5.38 2.7 13.22l8.26 6.42C12.8 13.22 18 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.66-.15-3.25-.43-4.8H24v9.09h12.65c-.55 2.97-2.21 5.48-4.72 7.16l7.27 5.65C43.6 37.3 46.5 31.34 46.5 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.96 28.64a14.5 14.5 0 010-9.28l-8.26-6.42A23.96 23.96 0 000 24c0 3.9.93 7.59 2.7 10.78l8.26-6.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.14 15.9-5.8l-7.27-5.65c-2.02 1.36-4.62 2.15-8.63 2.15-6 0-11.2-3.72-13.04-9.36l-8.26 6.14C6.6 42.62 14.64 48 24 48z"
                  />
                </svg>
              </a>
              <a
                href={mapSrc.apple}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5/70 p-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] text-white transition-colors hover:text-primary"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Apple Maps"
                title="Open Apple Maps"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M16.365 1.43c0 1.14-.47 2.28-1.27 3.08-.86.86-2.15 1.54-3.37 1.45-.14-1.12.32-2.3 1.1-3.1.8-.86 2.18-1.5 3.54-1.43z" />
                  <path d="M20.52 17.09c-.49 1.12-.72 1.61-1.35 2.6-.88 1.4-2.12 3.14-3.67 3.16-1.36.02-1.71-.89-3.59-.89-1.88 0-2.27.87-3.62.91-1.54.05-2.72-1.55-3.6-2.95-2.46-3.85-2.71-8.37-1.2-10.76.96-1.52 2.48-2.4 4.01-2.4 1.57 0 2.56.91 3.86.91 1.27 0 2.04-.92 3.84-.92 1.36 0 2.8.74 3.76 2.03-3.3 1.81-2.77 6.31 1.56 8.21z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
