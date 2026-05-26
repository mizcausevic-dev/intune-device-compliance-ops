# Security Policy

`intune-device-compliance-ops` includes an offline analyzer, CLI, and public synthetic operator dashboard for Microsoft Intune device-compliance posture. It does **not** store Graph tokens, perform live tenant fetches, or expose authenticated write paths.

The input file may contain device identifiers, UPNs, serial numbers, and endpoint posture details. Treat captured exports and generated reports as sensitive tenant material.

## Supported versions

Only the latest tagged release is supported.

## Operational posture

- public Pages deployment uses **synthetic sample data only**
- no tenant credentials or live Graph exports are committed
- this repo is intended for operator-surface demonstration and offline analysis patterns
- embedded or production tenant integrations require formal tenant review and secret-handling controls

## Reporting a vulnerability

Please use GitHub Security Advisories for private disclosure:

- [Open a security advisory](https://github.com/mizcausevic-dev/intune-device-compliance-ops/security/advisories/new)

Do not file public issues for security reports.
