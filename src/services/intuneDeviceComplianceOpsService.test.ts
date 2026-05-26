// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  complianceRisks,
  fleetLane,
  payload,
  remediationPosture,
  summary,
  verification
} from "./intuneDeviceComplianceOpsService.js";

describe("intuneDeviceComplianceOpsService", () => {
  test("summary reflects the sample fleet posture", () => {
    expect(summary()).toMatchObject({
      devices: 5,
      healthyDevices: 3,
      noncompliantDevices: 1,
      byodDevices: 1
    });
    expect(summary().highFindings).toBeGreaterThanOrEqual(3);
  });

  test("fleet lane keeps all synthetic devices mapped to owners", () => {
    const lanes = fleetLane();
    expect(lanes).toHaveLength(5);
    expect(lanes.some((lane) => lane.deviceName === "finance-mbp-04" && lane.owner === "Finance Platform Support")).toBe(true);
  });

  test("compliance risks sort high severity first", () => {
    const risks = complianceRisks();
    expect(risks[0]?.severity).toBe("high");
    expect(risks.some((risk) => risk.code === "missing-encryption")).toBe(true);
  });

  test("remediation posture and verification stay populated", () => {
    expect(remediationPosture()).toHaveLength(5);
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
