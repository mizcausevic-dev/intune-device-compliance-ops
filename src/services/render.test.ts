// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  renderComplianceRisks,
  renderDocs,
  renderFleetLane,
  renderOverview,
  renderRemediationPosture,
  renderVerification
} from "./render.js";

describe("render", () => {
  test("overview contains control-plane framing", () => {
    expect(renderOverview()).toContain("Intune device compliance, stale sync drift");
  });

  test("detail pages expose their lane names", () => {
    expect(renderFleetLane()).toContain("Fleet Lane");
    expect(renderComplianceRisks()).toContain("Compliance Risks");
    expect(renderRemediationPosture()).toContain("Remediation Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderDocs()).toContain("Offline Graph export analysis");
  });
});
