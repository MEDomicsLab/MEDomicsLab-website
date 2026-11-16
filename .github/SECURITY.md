<!--suppress HtmlDeprecatedAttribute -->
<p align="center">
  <a href="https://medomicslab.com/">
    <img src="https://raw.githubusercontent.com/MEDomicsLab/MEDomicsLab-website/refs/heads/main/docs/assets/banner/medomicslab-website-header.webp" width="100%" alt="MEDomicsLab Website banner with previews of the lab’s website">
  </a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/MEDomicsLab/MEDomicsLab-website/refs/heads/main/docs/assets/icons/lucide/house.svg" width="20" height="20" alt="" align="absmiddle">&nbsp;<a href="https://medomicslab.com/">Live Website</a>
</p>

# Security Policy

This repository contains only the public marketing/research site for the MEDomicsLab. It is a static Vite + React 18 single-page app: **no backend, no database, no authentication, and no user data** is collected or stored by the site itself.

## <img src="https://raw.githubusercontent.com/MEDomicsLab/MEDomicsLab-website/refs/heads/main/docs/assets/icons/lucide/compass.svg" width="32" alt="" align="absmiddle"> Scope

In scope:

- The website code in this repository (Vite/React app, build output served from `dist/`).
- The CI workflows under `.github/workflows/`.
- Dependency vulnerabilities affecting the production bundle.

Out of scope:

- Third-party services linked from the site (publishers, DOI providers, social platforms, embedded video stream).
- Research datasets, none are stored in this repository, and none must ever be added (see "Research data" below).
- The `medomicslab.com` hosting infrastructure (report directly to the site administrator).

## <img src="https://raw.githubusercontent.com/MEDomicsLab/MEDomicsLab-website/refs/heads/main/docs/assets/icons/lucide/shield-check.svg" width="32" alt="" align="absmiddle"> Reporting a vulnerability

Please **do not open a public GitHub issue** for security problems.

Report vulnerabilities by email to [medomics.info@gmail.com](mailto:medomics.info@gmail.com).

Please include:

1. A description of the issue and its potential impact.
2. Steps to reproduce, ideally with a minimal proof of concept.
3. Affected URL(s) / commit / file(s).
4. Whether the issue is already publicly known.

We will acknowledge your report within **72 hours** and aim to provide a status update within **7 days**. Coordinated disclosure is appreciated, please give us a reasonable window to ship a fix before going public.

## <img src="https://raw.githubusercontent.com/MEDomicsLab/MEDomicsLab-website/refs/heads/main/docs/assets/icons/lucide/database.svg" width="32" alt="" align="absmiddle"> Research data

No real-world clinical or patient datasets are shared through this repository. Please **do not** include any in pull requests, issues, screenshots, attachments, or markdown content. If you spot any such material in the repository or on the site, treat it as a security concern and report it via the channels above.

## <img src="https://raw.githubusercontent.com/MEDomicsLab/MEDomicsLab-website/refs/heads/main/docs/assets/icons/lucide/info.svg" width="32" alt="" align="absmiddle"> Supported versions

Only the `main` branch (deployed at <https://medomicslab.com/>) is supported.
