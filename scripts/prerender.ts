import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  complianceRisks,
  fleetLane,
  payload,
  remediationPosture,
  summary,
  verification
} from "../src/services/intuneDeviceComplianceOpsService.js";
import {
  renderComplianceRisks,
  renderDocs,
  renderFleetLane,
  renderOverview,
  renderRemediationPosture,
  renderVerification
} from "../src/services/render.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "site");

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, "api", "dashboard"), { recursive: true });
fs.copyFileSync(path.join(root, "CNAME"), path.join(outputDir, "CNAME"));

const pages: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("fleet-lane", "index.html")]: renderFleetLane(),
  [path.join("compliance-risks", "index.html")]: renderComplianceRisks(),
  [path.join("remediation-posture", "index.html")]: renderRemediationPosture(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs()
};

for (const [relativePath, html] of Object.entries(pages)) {
  const fullPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, html, "utf8");
}

const apiPayloads: Record<string, unknown> = {
  [path.join("api", "dashboard", "summary.json")]: summary(),
  [path.join("api", "fleet-lane.json")]: fleetLane(),
  [path.join("api", "compliance-risks.json")]: complianceRisks(),
  [path.join("api", "remediation-posture.json")]: remediationPosture(),
  [path.join("api", "verification.json")]: verification(),
  [path.join("api", "sample.json")]: payload()
};

for (const [relativePath, data] of Object.entries(apiPayloads)) {
  const fullPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}
