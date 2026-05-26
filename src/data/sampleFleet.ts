// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeviceInput } from "../types.js";

export interface FleetLanePacket {
  deviceId: string;
  owner: string;
  lane: string;
  businessRole: string;
  nextAction: string;
  note: string;
}

export interface RemediationPacket {
  packetId: string;
  lane: string;
  owner: string;
  completenessScore: number;
  status: "red" | "yellow" | "green";
  blocker: string;
  launchWindowHours: number;
  decisionNote: string;
}

export const sampleFleetPayload: DeviceInput = {
  value: [
    {
      id: "dev-kg-100",
      deviceName: "exec-win-01",
      userPrincipalName: "alex.exec@kineticgain.example",
      operatingSystem: "Windows",
      osVersion: "10.0.22631.4317",
      complianceState: "compliant",
      jailBroken: "False",
      isEncrypted: true,
      enrolledDateTime: "2025-11-01T10:00:00Z",
      lastSyncDateTime: "2026-05-28T22:15:00Z",
      ownerType: "company"
    },
    {
      id: "dev-kg-204",
      deviceName: "sales-ios-02",
      userPrincipalName: "brooke.sales@kineticgain.example",
      operatingSystem: "iOS",
      osVersion: "15.6",
      complianceState: "noncompliant",
      jailBroken: "False",
      isEncrypted: true,
      enrolledDateTime: "2024-04-10T10:00:00Z",
      lastSyncDateTime: "2026-05-22T12:00:00Z",
      ownerType: "company"
    },
    {
      id: "dev-kg-309",
      deviceName: "byod-android-07",
      userPrincipalName: "casey.ops@kineticgain.example",
      operatingSystem: "Android",
      osVersion: "14.0",
      complianceState: "compliant",
      jailBroken: "True",
      isEncrypted: true,
      enrolledDateTime: "2025-06-01T10:00:00Z",
      lastSyncDateTime: "2026-05-28T18:00:00Z",
      ownerType: "personal"
    },
    {
      id: "dev-kg-411",
      deviceName: "finance-mbp-04",
      userPrincipalName: "drew.finance@kineticgain.example",
      operatingSystem: "macOS",
      osVersion: "14.5",
      complianceState: "compliant",
      jailBroken: "False",
      isEncrypted: false,
      enrolledDateTime: "2025-10-01T10:00:00Z",
      lastSyncDateTime: "2026-04-12T12:00:00Z",
      ownerType: "company"
    },
    {
      id: "dev-kg-512",
      deviceName: "shared-kiosk-east",
      operatingSystem: "Windows",
      osVersion: "10.0.19045",
      complianceState: "inGracePeriod",
      jailBroken: "False",
      isEncrypted: true,
      enrolledDateTime: "2025-08-01T10:00:00Z",
      lastSyncDateTime: "2026-05-28T01:00:00Z",
      ownerType: "company"
    }
  ]
};

export const fleetLanePackets: FleetLanePacket[] = [
  {
    deviceId: "dev-kg-100",
    owner: "Executive IT",
    lane: "Executive endpoints",
    businessRole: "Lead laptop / privileged operator endpoint",
    nextAction: "Preserve green posture and archive current compliance proof for the next audit packet.",
    note: "Healthy company-owned Windows endpoint used as the baseline control lane."
  },
  {
    deviceId: "dev-kg-204",
    owner: "Sales Operations IT",
    lane: "Mobile sales fleet",
    businessRole: "Revenue-critical iPhone for traveling seller",
    nextAction: "Clear noncompliance and raise iOS version before the next travel launch window.",
    note: "Noncompliant iOS posture creates immediate access and rollout risk."
  },
  {
    deviceId: "dev-kg-309",
    owner: "BYOD Governance",
    lane: "Personal Android / BYOD",
    businessRole: "Personal Android under corporate policy scope",
    nextAction: "Review root/jailbreak posture and confirm BYOD policy boundaries before allowing continued access.",
    note: "BYOD scope is active, but the device is rooted and needs immediate operator review."
  },
  {
    deviceId: "dev-kg-411",
    owner: "Finance Platform Support",
    lane: "Finance workstation fleet",
    businessRole: "MacBook handling finance workflows and approvals",
    nextAction: "Restore encryption and re-establish sync hygiene before the next finance close period.",
    note: "Encryption gap and stale sync make this the highest evidence-risk device in the sample."
  },
  {
    deviceId: "dev-kg-512",
    owner: "Storefront Operations",
    lane: "Shared kiosk / frontline device",
    businessRole: "Shared kiosk without named user mapping",
    nextAction: "Attach ownership, resolve grace-period posture, and keep kiosk access from drifting into blind spots.",
    note: "Shared kiosk is close to flipping noncompliant and has no attached user."
  }
];

export const remediationPackets: RemediationPacket[] = [
  {
    packetId: "DP-14",
    lane: "Mobile sales fleet",
    owner: "Sales Operations IT",
    completenessScore: 58,
    status: "red",
    blocker: "Noncompliant iOS device below minimum version still attached to active seller workflow",
    launchWindowHours: 12,
    decisionNote: "Do not treat mobile revenue access as healthy until the noncompliance and OS drift are remediated."
  },
  {
    packetId: "DP-21",
    lane: "Finance workstation fleet",
    owner: "Finance Platform Support",
    completenessScore: 63,
    status: "red",
    blocker: "Encryption disabled and last Intune sync is far beyond the stale threshold",
    launchWindowHours: 20,
    decisionNote: "Hold finance-adjacent privileged work until encryption and sync posture are restored."
  },
  {
    packetId: "DP-29",
    lane: "Personal Android / BYOD",
    owner: "BYOD Governance",
    completenessScore: 70,
    status: "yellow",
    blocker: "Rooted personal device remains under corporate compliance policy",
    launchWindowHours: 30,
    decisionNote: "Confirm BYOD policy scope and access controls before allowing continued production access."
  },
  {
    packetId: "DP-38",
    lane: "Shared kiosk / frontline device",
    owner: "Storefront Operations",
    completenessScore: 81,
    status: "yellow",
    blocker: "Grace-period device has no named user and needs ownership proof",
    launchWindowHours: 48,
    decisionNote: "Kiosk can remain online briefly, but only with ownership and grace-period remediation queued."
  },
  {
    packetId: "DP-44",
    lane: "Executive endpoints",
    owner: "Executive IT",
    completenessScore: 97,
    status: "green",
    blocker: "No active blocker",
    launchWindowHours: 72,
    decisionNote: "Control lane is safe for archive and audit-ready endpoint proof."
  }
];
