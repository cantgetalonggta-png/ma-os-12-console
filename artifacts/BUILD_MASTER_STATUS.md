# BUILD_MASTER status — MA-OS-12

**Mode:** continue lawful build · public-record ceiling

## Credential policy (non-negotiable)

| Allowed | Blocked |
|--------|---------|
| Grok OAuth connectors (GitHub, Drive, Vercel, …) | Reading keys from Drive dumps, screenshots, `.admaster` blobs |
| VS Code `${input:…}` prompts for PAT / bridge token | Committing keys into repo / desk / logs |
| Platform-injected env | Loading key files into the agent workspace |

IP lock does not make pasting secrets into chat/workspace safe. Rotate anything that appeared in Codespaces screenshots.

## Live now

- Desk: Residue · Operator ledger · Contradictions · Missing · Meridian · Drive distill · **Connectors**
- MCP HTTP bridge: loopback tools `public_record_get`, `desk_status`
- `.vscode/mcp.json`: HTTP bridge + GitHub stdio via `${input:}` only
- Android: Vercel HTTPS default
- Swarm: 594 crumbs · 493 SOLID · 101 MAYBE

## How YOU wire personal keys (operator side only)

1. Codespaces → Settings → Secrets
2. VS Code → MCP: Open Workspace Folder MCP Configuration → prompt for tokens
3. Optional: `export MCP_BRIDGE_TOKEN=…` in your shell
4. Never put keys in `src/`, committed `artifacts/`, or shared Drive packs
