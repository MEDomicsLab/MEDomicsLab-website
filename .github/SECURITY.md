<!--suppress HtmlDeprecatedAttribute -->
<div align="center">
   <p align="center">
      <br>
      <a href="https://medomicslab.com/">
         <img src="/docs/assets/banner/medomicslab-banner.webp" alt="MEDomicsLab banner" width="320">
      </a>
   </p>
   <h4 align="center">
      Official MEDomicsLab's Website.
      <br>
      <a href="https://medomicslab.com/">Live site</a>
   </h4>
</div>

<div align="center">

<a href="https://medomicslab.com/">
   <img alt="Live" src="https://img.shields.io/static/v1?label=Site&message=medomicslab.com&color=472727&labelColor=FF8C00&style=for-the-badge&logo=googlechrome&logoColor=white">
</a>

<img alt="React" src="https://img.shields.io/static/v1?label=React&message=18&color=472727&labelColor=FF8C00&style=for-the-badge&logo=react&logoColor=white">

<img alt="Vite" src="https://img.shields.io/static/v1?label=Vite&message=7&color=472727&labelColor=FF8C00&style=for-the-badge&logo=vite&logoColor=white">

<img alt="Tailwind" src="https://img.shields.io/static/v1?label=Tailwind&message=v4&color=472727&labelColor=FF8C00&style=for-the-badge&logo=tailwindcss&logoColor=white">

<img alt="ESLint" src="https://img.shields.io/static/v1?label=ESLint&message=passing&color=472727&labelColor=FF8C00&style=for-the-badge&logo=eslint&logoColor=white">

<img alt="Playwright" src="https://img.shields.io/static/v1?label=Playwright&message=e2e&color=472727&labelColor=FF8C00&style=for-the-badge&logo=playwright&logoColor=white">

<img alt="License" src="https://img.shields.io/static/v1?label=License&message=MIT&color=472727&labelColor=FF8C00&style=for-the-badge&logo=opensourceinitiative&logoColor=white">

</div>

# Security Policy

This repository contains only the public marketing/research site for the MEDomicsLab. It is a static Vite + React 18 single-page app: **no backend, no database, no authentication, and no user data** is collected or stored by the site itself.

## Scope

In scope:

- The website code in this repository (Vite/React app, build output served from `dist/`).
- The CI workflows under `.github/workflows/`.
- Dependency vulnerabilities affecting the production bundle.

Out of scope:

- Third-party services linked from the site (publishers, DOI providers, social platforms, embedded video stream).
- Research datasets, none are stored in this repository, and none must ever be added (see "Research data" below).
- The `medomics.app` hosting infrastructure (report directly to the site administrator).

## Reporting a vulnerability

Please **do not open a public GitHub issue** for security problems.

- Preferred channel: [GitHub private vulnerability reporting](https://github.com/simonprovost/medomicslab/security/advisories/new).
- Email fallback: **simon.gilbert.provost@gmail.com**

Please include:

1. A description of the issue and its potential impact.
2. Steps to reproduce, ideally with a minimal proof of concept.
3. Affected URL(s) / commit / file(s).
4. Whether the issue is already publicly known.

We will acknowledge your report within **72 hours** and aim to provide a status update within **7 days**. Coordinated disclosure is appreciated, please give us a reasonable window to ship a fix before going public.

## Research data

No real-world clinical or patient datasets are shared through this repository. Please **do not** include any in pull requests, issues, screenshots, attachments, or markdown content. If you spot any such material in the repository or on the site, treat it as a security concern and report it via the channels above.

## Supported versions

Only the `main` branch (deployed at <https://medomics.app/>) is supported.
