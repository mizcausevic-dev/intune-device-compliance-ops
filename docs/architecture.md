# Architecture

`intune-device-compliance-ops` has two layers:

1. analyzer / CLI
   - reads offline Microsoft Graph `deviceManagement/managedDevices` exports
   - computes compliance, OS drift, stale-sync, encryption, jailbreak, orphaned-device, and BYOD-scope findings
2. operator surface
   - wraps the analyzer in a recruiter-readable and buyer-readable control plane
   - exposes overview, fleet lane, compliance risk, remediation posture, verification, and docs routes

The public Pages deploy is prerendered from synthetic sample data only.
