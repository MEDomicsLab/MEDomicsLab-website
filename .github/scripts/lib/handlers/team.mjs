import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { slugify } from "../slug.mjs";
import { ensureDir, readJson, writeJson, insertTeamMember } from "../data-store.mjs";
import { validateAgainst } from "../validate.mjs";

const FIELD = {
  fullName: "Full name",
  slug: "Suggested URL slug",
  cohort: "Cohort / group",
  position: "Position",
  email: "Email",
  bio: "Short biography",
  expertise: "Areas of expertise",
  education: "Education",
  note: "Special note",
  linkedin: "LinkedIn",
  orcid: "ORCID",
  scholar: "Google Scholar",
  researchgate: "ResearchGate",
  github: "GitHub",
  stackoverflow: "Stack Overflow",
  cv: "CV (URL)",
  photo: "Portrait photo",
  additional: "Anything else?",
};

const SIZES = [80, 128, 160, 256];
const VARIANT_FORMATS = ["avif", "webp"];

const URL_RE = /(https?:\/\/[^\s)]+)/i;
const MARKDOWN_IMAGE_RE = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/;
const HTML_IMAGE_RE = /<img[^>]+src=["']([^"']+)["']/i;

function extractPhotoSource(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const md = MARKDOWN_IMAGE_RE.exec(trimmed);
  if (md) return md[1];
  const html = HTML_IMAGE_RE.exec(trimmed);
  if (html) return html[1];
  const url = URL_RE.exec(trimmed);
  if (url) return url[1];
  if (trimmed.startsWith("file://")) return trimmed;
  if (/^[\w./-]+\.(png|jpe?g|webp|avif)$/i.test(trimmed)) return trimmed;
  return null;
}

function parseLines(value) {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseEducation(value) {
  const rows = parseLines(value);
  const entries = [];
  const errors = [];
  for (const row of rows) {
    const parts = row.split("|").map((s) => s.trim());
    if (parts.length !== 3 || parts.some((p) => !p)) {
      errors.push(`Education row must be \`course | institution | year\` (got \`${row}\`).`);
      continue;
    }
    entries.push({ course: parts[0], institution: parts[1], year: parts[2] });
  }
  return { entries, errors };
}

function buildSocials(fields) {
  const keys = ["linkedin", "orcid", "scholar", "researchgate", "github", "stackoverflow", "cv"];
  const socials = {};
  for (const key of keys) {
    const value = (fields[FIELD[key]] || "").trim();
    if (value) socials[key] = value;
  }
  return socials;
}

const GITHUB_ATTACHMENT_RE =
  /^https?:\/\/(?:github\.com\/user-attachments\/|user-images\.githubusercontent\.com\/|private-user-images\.githubusercontent\.com\/)/i;

async function resolveSignedAttachmentUrl(rawUrl) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GitHub user-attachment URLs require GITHUB_TOKEN to be exposed to the workflow step."
    );
  }
  const repo = process.env.GITHUB_REPOSITORY || "";
  const apiBase = process.env.GITHUB_API_URL || "https://api.github.com";
  const res = await fetch(`${apiBase}/markdown`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "content-type": "application/json",
      "user-agent": "medomicslab-issue-to-pr",
    },
    body: JSON.stringify({
      text: `![portrait](${rawUrl})`,
      mode: repo ? "gfm" : "markdown",
      context: repo || undefined,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Could not resolve user-attachment URL via Markdown API (${res.status} ${res.statusText}).`
    );
  }
  const html = await res.text();
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  if (!match) {
    throw new Error("Markdown API did not return a signed URL for the portrait.");
  }
  return match[1];
}

async function loadPhotoBuffer(source, { fixtureRoot } = {}) {
  if (!source) throw new Error("No portrait photo provided.");
  if (/^https?:\/\//i.test(source)) {
    let downloadUrl = source;
    if (GITHUB_ATTACHMENT_RE.test(source)) {
      downloadUrl = await resolveSignedAttachmentUrl(source);
    }
    const res = await fetch(downloadUrl, {
      headers: { "user-agent": "medomicslab-issue-to-pr" },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`Failed to download photo (${res.status} ${res.statusText}).`);
    }
    return Buffer.from(await res.arrayBuffer());
  }
  let filePath = source;
  if (filePath.startsWith("file://")) filePath = filePath.slice("file://".length);
  if (!path.isAbsolute(filePath) && fixtureRoot) {
    filePath = path.resolve(fixtureRoot, filePath);
  }
  return fs.readFileSync(filePath);
}

async function generateAvatarVariants(buffer, outDir) {
  ensureDir(outDir);
  const written = [];
  const meta = await sharp(buffer).metadata();
  const fallbackFormat = meta.format === "png" ? "png" : "jpeg";
  const fallbackExt = fallbackFormat === "jpeg" ? "jpg" : "png";

  for (const size of SIZES) {
    const resized = sharp(buffer).resize(size, size, { fit: "cover", position: "centre" });
    for (const format of VARIANT_FORMATS) {
      const out = path.join(outDir, `avatar-${size}.${format}`);
      const pipeline = resized.clone().toFormat(format, { quality: format === "avif" ? 60 : 82 });
      await pipeline.toFile(out);
      written.push(out);
    }
    const fallbackOut = path.join(outDir, `avatar-${size}.${fallbackExt}`);
    await resized.clone().toFormat(fallbackFormat, { quality: 82 }).toFile(fallbackOut);
    written.push(fallbackOut);
  }
  return { paths: written, fallbackExt };
}

export const team = {
  label: "team",
  emoji: "👤",
  buildPlan(fields) {
    const errors = [];
    const required = ["fullName", "slug", "cohort", "position", "bio", "expertise", "photo"];
    for (const key of required) {
      if (!fields[FIELD[key]]) errors.push(`Missing required field: \`${FIELD[key]}\``);
    }
    if (errors.length) return { ok: false, errors };

    const name = fields[FIELD.fullName].trim();
    const slug = slugify(fields[FIELD.slug]);
    if (!slug) return { ok: false, errors: [`Could not derive a valid slug from input.`] };
    const cohort = fields[FIELD.cohort].trim();
    const position = fields[FIELD.position].trim();
    const expertise = parseLines(fields[FIELD.expertise]);
    if (!expertise.length) {
      return { ok: false, errors: [`Areas of expertise must list at least one item.`] };
    }
    const { entries: education, errors: eduErrors } = parseEducation(fields[FIELD.education]);
    if (eduErrors.length) return { ok: false, errors: eduErrors };

    const photoSource = extractPhotoSource(fields[FIELD.photo]);
    if (!photoSource) {
      return {
        ok: false,
        errors: [
          `Portrait photo must be an uploaded image or a direct URL. Drag a square JPG/PNG into the issue form so GitHub uploads it.`,
        ],
      };
    }

    const member = {
      name,
      position,
      slug,
      image: `/images/team/${slug}/avatar.jpg`,
      bio: fields[FIELD.bio].trim(),
      expertise,
    };
    if (fields[FIELD.email]) member.email = fields[FIELD.email].trim();
    if (fields[FIELD.note]) member.note = fields[FIELD.note].trim();
    if (education.length) member.education = education;
    const socials = buildSocials(fields);
    if (Object.keys(socials).length) member.socials = socials;

    return {
      ok: true,
      slug,
      cohort,
      member,
      photoSource,
      additional: (fields[FIELD.additional] || "").trim(),
    };
  },
  async apply(root, plan, options = {}) {
    const dataFile = path.join(root, "src/data/team.json");
    const current = readJson(dataFile);
    let next;
    try {
      next = insertTeamMember(current, plan.cohort, plan.member);
    } catch (err) {
      return { ok: false, errors: [err.message] };
    }

    let photoBuffer;
    try {
      photoBuffer = await loadPhotoBuffer(plan.photoSource, options);
    } catch (err) {
      return { ok: false, errors: [err.message] };
    }

    const avatarDir = path.join(root, "public/images/team", plan.slug);
    let variantPaths;
    let fallbackExt;
    try {
      const result = await generateAvatarVariants(photoBuffer, avatarDir);
      variantPaths = result.paths;
      fallbackExt = result.fallbackExt;
    } catch (err) {
      return { ok: false, errors: [`Failed to process portrait photo: ${err.message}`] };
    }

    const member = next
      .find((c) => c.year === plan.cohort)
      .members.find((m) => m.slug === plan.slug);
    member.image = `/images/team/${plan.slug}/avatar.${fallbackExt}`;

    const result = validateAgainst("team.schema.json", next);
    if (!result.ok) return { ok: false, errors: result.errors };

    await writeJson(dataFile, next);

    const summaryLines = [
      `**Cohort:** ${plan.cohort}`,
      `**Slug:** \`${plan.slug}\``,
      `**Position:** ${plan.member.position}`,
      `**Avatar:** ${variantPaths.length} variants generated under \`public/images/team/${plan.slug}/\``,
    ];
    if (plan.additional) summaryLines.push("", plan.additional);

    return {
      ok: true,
      paths: [dataFile, ...variantPaths],
      branch: `content/team-${plan.slug}`,
      commit: `feat(team): add ${plan.member.name}`,
      prTitle: `feat(team): add ${plan.member.name}`,
      summary: summaryLines.join("\n"),
    };
  },
};
