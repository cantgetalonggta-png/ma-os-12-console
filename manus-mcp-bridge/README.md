# manus-mcp-bridge

Vercel Root Directory for project **manus-mcp-bridge**.

Public-record MCP HTTP shim:

- `GET /health` — status (no secrets)
- `POST /` — tools `public_record_get` | `desk_status`
- Optional env `MCP_BRIDGE_TOKEN` (set in Vercel project env)
- Allowlist: justice.gov, courtlistener.com, web.archive.org, govinfo.gov, sec.gov

Repo also has local `mcp-http-bridge/` (loopback README). This folder is the deployable serverless surface.
