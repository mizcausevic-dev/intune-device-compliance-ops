# Changelog

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
