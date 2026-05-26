# Changelog

## v1.0.0-prod — 2026-05-27

Production-readiness hardening on top of v0.1-shipped.

- Verified all CI gates pass on a clean `npm ci`: lint, typecheck, coverage (98.62% statements / 81.5% branches / 95.83% functions / 98.62% lines), build, demo, smoke, `npm audit --audit-level=high` (0 vulnerabilities).
- Confirmed AGPL-3.0-or-later licensing, `SECURITY.md`, `CODE_OF_CONDUCT.md`, weekly `dependabot.yml` for `npm` + `github-actions`.
- Confirmed CI workflow runs the Node 20 + 22 matrix and the production-status surfaces (CI / License / Deploy badges + `## Production status` block) are intact in the README.
- Live operator surface running at https://intune.kineticgain.com/ via the GitHub Pages deploy rail.
- No changes to source, README content, docs, or screenshots — those remain the v0.1-shipped surface from the build lane.

## v0.1.0 — 2026-05-27

- Initial release: operator control plane for Microsoft Intune device compliance.
- Public dashboard routes for `/`, `/fleet-lane`, `/compliance-risks`, `/remediation-posture`, `/verification`, and `/docs`.
- Static GitHub Pages deploy with `CNAME`, `robots.txt`, `sitemap.xml`, OG/Twitter meta generation, and README proof screenshots.
- Reads Microsoft Graph deviceManagement/managedDevices JSON exports (single device, array, or `{ "value": [ ... ] }` envelope).
- 8 finding codes covering noncompliance, jailbreak/root, missing encryption, OS-version drift, stale check-ins (severity scales with age), orphaned devices, grace-period flips, and BYOD-scope checks.
- Configurable per-platform minimum OS versions (defaults: Windows 10, iOS 17, iPadOS 17, macOS 14, Android 13).
- Library API: `analyze(input, opts)` → `ComplianceReport`; `toMarkdown(report)` + `toSummary(report)` formatters.
- CLI: `intune-device-compliance <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-after-days N`, `--fail-on-high`, `--out FILE`.
- Cloud Identity / Microsoft 365 lane (Wave 11) — sibling of `entra-access-review-control-plane`.
- Node 20/22 CI (lint, typecheck, coverage, build, demo, smoke, `npm audit`), AGPL-3.0-or-later, Dependabot.
