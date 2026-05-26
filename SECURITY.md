# Security Policy

`intune-device-compliance-ops` is a pure-transform library and CLI: it reads JSON device exports from Microsoft Graph (or synthetic data) and emits a structured findings report. No network listener, no remote fetch, no Graph token storage, no execution of user-supplied code.

The input file contains device identifiers, UPNs, serial numbers, and OS versions — sensitive in your tenant. The report includes UPNs and serial numbers in finding rows; be deliberate about where you store the input and the output.

## Supported versions

Only the latest tagged release is supported.

## Reporting a vulnerability

Please use GitHub Security Advisories for private disclosure:

- [Open a security advisory](https://github.com/mizcausevic-dev/intune-device-compliance-ops/security/advisories/new)

Do not file public issues for security reports.
