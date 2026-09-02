#!/usr/bin/env node
/**
 * License compliance: fails if any production dependency carries a license
 * that is not in the allowed list (typical for open-source web apps).
 *
 * "Senior practice" guard against accidentally pulling in GPL/AGPL/SSPL/etc.
 * which would put obligations on the site we don't want.
 */
import { init } from "license-checker-rseidelsohn";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..", "..");

const ALLOWED = [
  "MIT",
  "ISC",
  "Apache-2.0",
  "BSD",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "0BSD",
  "CC0-1.0",
  "CC-BY-3.0",
  "CC-BY-4.0",
  "Unlicense",
  "Python-2.0",
  "WTFPL",
  "Zlib",
  "MPL-2.0",
];

// Packages we accept on a case-by-case basis (e.g. self-published content).
// Use `name` (without version) — values are notes for reviewers.
const ALLOW_PACKAGES = new Map([
  ["gsap", "GSAP Standard License — free for non-commercial / website use"],
]);

const isAllowed = (license) => {
  if (!license) return false;
  // Some pkgs report "(MIT OR Apache-2.0)" — allow if any is allowed
  const cleaned = license.replace(/[()]/g, "");
  const parts = cleaned.split(/\s+(?:OR|AND)\s+/i).map((s) => s.trim());
  return parts.some((p) => ALLOWED.includes(p));
};

init({ start: root, production: true, excludePrivatePackages: true }, (err, packages) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  const offenders = [];
  for (const [pkg, info] of Object.entries(packages)) {
    if (ALLOW_PACKAGES.has(pkg.split("@")[0])) continue;
    const license = Array.isArray(info.licenses) ? info.licenses.join(" OR ") : info.licenses;
    if (!isAllowed(license)) {
      offenders.push(`  - ${pkg}: ${license || "UNKNOWN"}`);
    }
  }
  if (offenders.length > 0) {
    console.error(`Found ${offenders.length} dependency license(s) outside the allow-list:`);
    console.error(offenders.join("\n"));
    console.error(
      "\nReview and either remove the dependency or extend the allow-list in scripts/check-licenses.mjs"
    );
    process.exit(1);
  }
  console.log(`License check passed (${Object.keys(packages).length} production dependencies).`);
});
