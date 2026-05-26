import { complianceRisks, fleetLane, summary } from "../src/services/intuneDeviceComplianceOpsService.js";

console.log("intune-device-compliance-ops demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(JSON.stringify(fleetLane().map((lane) => ({ deviceName: lane.deviceName, owner: lane.owner, complianceState: lane.complianceState })), null, 2));
console.log(JSON.stringify(complianceRisks().slice(0, 3), null, 2));
