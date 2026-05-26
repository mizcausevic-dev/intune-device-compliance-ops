# intune-device-compliance-ops

Operator surface for **Microsoft Intune** device compliance. Reads [Microsoft Graph deviceManagement/managedDevices](https://learn.microsoft.com/en-us/graph/api/resources/intune-devices-manageddevice) JSON exports and surfaces the things that hurt an audit:

- 🔴 **Noncompliant devices** — `complianceState in {noncompliant, error}`.
- 🔴 **Jailbroken / rooted** — `jailBroken === "True"`.
- 🔴 **Missing encryption** — `isEncrypted === false`.
- 🔴 **Severely stale check-in** — `lastSyncDateTime` > 2× the configured threshold.
- 🟠 **In grace period** — about to flip noncompliant.
- 🟠 **Outdated OS** — below a configurable per-platform minimum (defaults: Windows 10, iOS 17, iPadOS 17, macOS 14, Android 13).
- 🟠 **Orphaned device** — enrolled but no associated user.
- 🟠 **Stale check-in (moderate)** — between N and 2N days since last sync.
- ℹ️  **Personal device with corporate policy** — BYOD scope check.

> Status: v0.1.0 — Node 20/22 supported, library + CLI. Cloud Identity lane (Wave 11).

## CLI

```
npx intune-device-compliance <export.json>
    [--format json|markdown|summary]
    [--now <iso>]
    [--stale-after-days 14]
    [--fail-on-high]
    [--out FILE]
```

Input is any of:
- A single `managedDevice` object
- An array of devices
- A standard Microsoft Graph collection envelope: `{ "value": [ ... ] }`

Exit code:
- `0` — no high findings (or `--fail-on-high` not set)
- `1` — high finding AND `--fail-on-high` set
- `2` — usage / I/O error

## Capturing the input

Use the Graph CLI / REST to export your fleet:

```bash
az rest --method GET \
  --uri "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices?\$top=999" \
  > devices.json
```

(no credentials are stored in this repo; the tool runs offline against the captured JSON.)

## Library

```ts
import { analyze, toMarkdown } from "intune-device-compliance-ops";

const report = analyze(payload, {
  staleAfterDays: 14,
  minOsVersions: { Windows: "10.0", iOS: "17.0", macOS: "14.0", Android: "13.0" }
});

if (!report.ok) {
  const high = report.findings.filter((f) => f.severity === "high");
  console.error(`${high.length} devices need attention`);
}
console.log(toMarkdown(report));
```

## Composes with

- [**`entra-access-review-control-plane`**](https://github.com/mizcausevic-dev/entra-access-review-control-plane) — sibling Wave 11 surface for Microsoft Entra access reviews.

## Develop

```
npm install
npm run lint && npm run typecheck && npm run coverage && npm run build
npm run demo
```

## License

[AGPL-3.0-or-later](LICENSE)
