# MA-OS-12 MCP HTTP bridge

Loopback MCP JSON-RPC for public-record tools only.

## Security

- Binds `127.0.0.1` only.
- Optional `MCP_BRIDGE_TOKEN` from process environment (not repo files).
- Does not read Drive key dumps or credential packs.
- `public_record_get` allowlists DOJ / CourtListener / Wayback / govinfo / SEC.

## Run

```bash
python3 server.py
# GET http://127.0.0.1:8788/health
```

## VS Code

See `.vscode/mcp.json` — `${input:mcp-bridge-token}` and `${input:github-token}`.

## Tools

| Tool | Purpose |
|------|---------|
| `public_record_get` | GET allowlisted public URL |
| `desk_status` | Status without secrets |
