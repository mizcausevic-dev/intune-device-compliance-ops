import {
  DEFAULT_MIN_OS_VERSIONS,
  type ComplianceOptions,
  type ComplianceReport,
  type ComplianceState,
  type DeviceInput,
  type DeviceOwnerType,
  type Finding,
  type ManagedDevice
} from "./types.js";

const DAY_MS = 86_400_000;

const COMPLIANCE_STATES: ComplianceState[] = [
  "unknown",
  "compliant",
  "noncompliant",
  "conflict",
  "error",
  "inGracePeriod",
  "configManager"
];

const OWNER_TYPES: DeviceOwnerType[] = ["company", "personal", "unknown"];

function emptyCompliance(): Record<ComplianceState, number> {
  const out = {} as Record<ComplianceState, number>;
  for (const s of COMPLIANCE_STATES) out[s] = 0;
  return out;
}

function emptyOwner(): Record<DeviceOwnerType, number> {
  const out = {} as Record<DeviceOwnerType, number>;
  for (const s of OWNER_TYPES) out[s] = 0;
  return out;
}

export function normalizeInput(input: DeviceInput): ManagedDevice[] {
  if (Array.isArray(input)) return input;
  if ("value" in input && Array.isArray((input as { value: ManagedDevice[] }).value)) {
    return (input as { value: ManagedDevice[] }).value;
  }
  return [input as ManagedDevice];
}

/**
 * Compare a device's OS version against a minimum (loose major.minor check).
 * Returns true when the device version is BELOW the minimum.
 */
export function isOsVersionBelow(deviceVersion: string | undefined, minimum: string): boolean {
  if (!deviceVersion) return false;
  const dv = deviceVersion.split(/[.\s]/).map((x) => parseInt(x, 10));
  const mv = minimum.split(/[.\s]/).map((x) => parseInt(x, 10));
  for (let i = 0; i < mv.length; i++) {
    const d = dv[i] ?? 0;
    const m = mv[i] ?? 0;
    if (d < m) return true;
    if (d > m) return false;
  }
  return false;
}

export function analyze(input: DeviceInput, opts: ComplianceOptions = {}): ComplianceReport {
  const now = opts.now ? new Date(opts.now) : new Date();
  const staleAfter = (opts.staleAfterDays ?? 14) * DAY_MS;
  const minOs = { ...DEFAULT_MIN_OS_VERSIONS, ...(opts.minOsVersions ?? {}) };

  const devices = normalizeInput(input);
  const findings: Finding[] = [];
  const byCompliance = emptyCompliance();
  const byOwner = emptyOwner();
  const byOS: Record<string, number> = {};

  for (const d of devices) {
    const state = (d.complianceState ?? "unknown") as ComplianceState;
    byCompliance[state] = (byCompliance[state] ?? 0) + 1;

    const owner = (d.ownerType ?? d.managedDeviceOwnerType ?? "unknown") as DeviceOwnerType;
    byOwner[owner] = (byOwner[owner] ?? 0) + 1;

    const os = d.operatingSystem ?? "unknown";
    byOS[os] = (byOS[os] ?? 0) + 1;

    const ctx = {
      deviceId: d.id,
      deviceName: d.deviceName ?? "",
      user: d.userPrincipalName ?? d.userId
    };
    const finding = (code: Finding["code"], severity: Finding["severity"], message: string): Finding => {
      const f: Finding = { code, severity, message, deviceId: ctx.deviceId };
      if (ctx.deviceName) f.deviceName = ctx.deviceName;
      if (ctx.user) f.user = ctx.user;
      return f;
    };

    if (state === "noncompliant" || state === "error") {
      findings.push(finding("noncompliant-device", "high", `Device is ${state}.`));
    } else if (state === "inGracePeriod") {
      findings.push(finding("in-grace-period", "medium", "Device is in compliance grace period; will flip noncompliant if not remediated."));
    }

    if (d.jailBroken === "True") {
      findings.push(finding("jailbroken-device", "high", "Device is jailbroken / rooted."));
    }

    if (d.isEncrypted === false) {
      findings.push(finding("missing-encryption", "high", "Disk encryption is not enabled."));
    }

    if (d.lastSyncDateTime) {
      const age = now.getTime() - new Date(d.lastSyncDateTime).getTime();
      if (age > staleAfter) {
        findings.push(
          finding(
            "stale-checkin",
            age > staleAfter * 2 ? "high" : "medium",
            `Last Intune sync ${Math.round(age / DAY_MS)} day(s) ago.`
          )
        );
      }
    }

    const platformKey = d.operatingSystem as keyof typeof minOs | undefined;
    if (platformKey && platformKey in minOs && isOsVersionBelow(d.osVersion, minOs[platformKey])) {
      findings.push(
        finding(
          "outdated-os-version",
          "medium",
          `${d.operatingSystem} ${d.osVersion} is below the minimum ${minOs[platformKey]}.`
        )
      );
    }

    if (!d.userPrincipalName && !d.userId) {
      findings.push(finding("orphaned-device", "medium", "Enrolled device has no associated user."));
    }

    if (
      (owner === "personal") &&
      (state === "compliant" || state === "noncompliant" || state === "inGracePeriod")
    ) {
      findings.push(
        finding(
          "personal-device-with-corporate-policy",
          "info",
          "Personal (BYOD) device is under corporate compliance policy — confirm MAM/MDM scope."
        )
      );
    }
  }

  const ok = !findings.some((f) => f.severity === "high");

  return {
    generatedAt: now.toISOString(),
    devices: devices.length,
    byCompliance,
    byOS,
    byOwner,
    findings,
    ok
  };
}
