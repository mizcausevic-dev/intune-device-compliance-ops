import type { ComplianceReport, FindingSeverity } from "./types.js";

const SEVERITY_LABEL: Record<FindingSeverity, string> = {
  high: "🔴 high",
  medium: "🟠 medium",
  low: "🟡 low",
  info: "ℹ️  info"
};

const SEVERITY_RANK: Record<FindingSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
  info: 3
};

export function toMarkdown(report: ComplianceReport): string {
  const lines: string[] = [];
  lines.push(report.ok ? `# Intune device compliance ✅` : `# Intune device compliance ❌`);
  lines.push(``);
  lines.push(`Generated: \`${report.generatedAt}\``);
  lines.push(``);
  lines.push(`## Fleet`);
  lines.push(``);
  lines.push(`- Devices: **${report.devices}**`);
  lines.push(
    `- Compliance: compliant=${report.byCompliance.compliant} · noncompliant=${report.byCompliance.noncompliant} · inGracePeriod=${report.byCompliance.inGracePeriod} · error=${report.byCompliance.error} · unknown=${report.byCompliance.unknown}`
  );
  lines.push(
    `- Owner: company=${report.byOwner.company} · personal=${report.byOwner.personal} · unknown=${report.byOwner.unknown}`
  );

  const ranked = [...report.findings].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]
  );

  if (ranked.length > 0) {
    lines.push(``);
    lines.push(`## Findings (${ranked.length})`);
    lines.push(``);
    lines.push(`| severity | code | device | user | message |`);
    lines.push(`|---|---|---|---|---|`);
    for (const f of ranked) {
      lines.push(
        `| ${SEVERITY_LABEL[f.severity]} | \`${f.code}\` | ${f.deviceName ?? f.deviceId} | ${f.user ?? "—"} | ${f.message} |`
      );
    }
  } else {
    lines.push(``);
    lines.push(`No findings.`);
  }

  return lines.join("\n");
}

export function toSummary(report: ComplianceReport): string {
  const counts: Record<FindingSeverity, number> = { high: 0, medium: 0, low: 0, info: 0 };
  for (const f of report.findings) counts[f.severity] += 1;
  return `${report.devices} device${report.devices === 1 ? "" : "s"} · ${counts.high} high · ${counts.medium} medium · ${counts.info} info (${report.ok ? "ok" : "fail"})`;
}
