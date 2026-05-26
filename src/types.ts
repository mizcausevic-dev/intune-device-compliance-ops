// Operator surface for Microsoft Intune device compliance.
// Input: Microsoft Graph deviceManagement/managedDevices JSON
// Reference: https://learn.microsoft.com/en-us/graph/api/resources/intune-devices-manageddevice

export type ComplianceState =
  | "unknown"
  | "compliant"
  | "noncompliant"
  | "conflict"
  | "error"
  | "inGracePeriod"
  | "configManager";

export type ManagementAgent =
  | "eas"
  | "mdm"
  | "easMdm"
  | "intuneClient"
  | "easIntuneClient"
  | "configurationManagerClient"
  | "configurationManagerClientMdm"
  | "configurationManagerClientMdmEas"
  | "unknown"
  | "jamf"
  | "googleCloudDevicePolicyController";

export type DeviceOwnerType = "company" | "personal" | "unknown";
export type OperatingSystem =
  | "Windows"
  | "iOS"
  | "iPadOS"
  | "macOS"
  | "Android"
  | "AndroidEnterprise"
  | "ChromeOS"
  | "Linux"
  | string;

export interface ManagedDevice {
  id: string;
  deviceName?: string;
  userPrincipalName?: string;
  userId?: string;
  managementAgent?: ManagementAgent;
  operatingSystem?: OperatingSystem;
  osVersion?: string;
  complianceState?: ComplianceState;
  jailBroken?: "Unknown" | "True" | "False";
  isEncrypted?: boolean;
  isSupervised?: boolean;
  enrolledDateTime?: string;
  lastSyncDateTime?: string;
  managedDeviceOwnerType?: DeviceOwnerType;
  ownerType?: DeviceOwnerType;
  serialNumber?: string;
}

export type DeviceInput =
  | ManagedDevice
  | ManagedDevice[]
  | { value: ManagedDevice[] };

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "noncompliant-device"
  | "jailbroken-device"
  | "missing-encryption"
  | "stale-checkin"
  | "outdated-os-version"
  | "orphaned-device"
  | "personal-device-with-corporate-policy"
  | "in-grace-period";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  deviceId: string;
  deviceName?: string;
  user?: string;
}

export interface ComplianceReport {
  generatedAt: string;
  devices: number;
  byCompliance: Record<ComplianceState, number>;
  byOS: Record<string, number>;
  byOwner: Record<DeviceOwnerType, number>;
  findings: Finding[];
  /** True iff no `high` severity findings. */
  ok: boolean;
}

export interface ComplianceOptions {
  now?: string;
  /** Devices whose lastSyncDateTime is > N days ago → `stale-checkin`. Default 14. */
  staleAfterDays?: number;
  /** Minimum acceptable OS-version per platform. Comparisons are loose semver (major.minor). */
  minOsVersions?: Partial<Record<"Windows" | "iOS" | "iPadOS" | "macOS" | "Android", string>>;
}

export const DEFAULT_MIN_OS_VERSIONS: Required<NonNullable<ComplianceOptions["minOsVersions"]>> = {
  Windows: "10.0",
  iOS: "17.0",
  iPadOS: "17.0",
  macOS: "14.0",
  Android: "13.0"
};
