# OPS STATUS (auto)

Updated by Grok automation.

## Desk

- Production deploy: READY
- Commit: `42a5e2c5` (and later status commits)
- Alias: https://ma-os-12-console-echo-ec69.vercel.app
- HTTP: may be 302 if Vercel Authentication is On

## Bridge

- Code: `mcp-stack-deploy` / `manus-mcp-bridge` **v1.4.0** (autoresearch loop)
- Vercel project often mis-wired to **ma-os-12-console** → ERROR deploys
- Fix once: Git = mcp-stack-deploy, Root = `manus-mcp-bridge`, SSO Off

## Grok Vercel connector

- Read: OK
- Write (team scope echo-ec69): **403** — cannot set SSO/env via API until team-scoped OAuth

## Operator one-click (only if still blocked)

1. https://vercel.com/echo-ec69/manus-mcp-bridge/settings/git
2. https://vercel.com/echo-ec69/manus-mcp-bridge/settings/deployment-protection
3. https://vercel.com/echo-ec69/ma-os-12-console/settings/deployment-protection
