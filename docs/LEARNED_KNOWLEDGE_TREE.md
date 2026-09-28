# LEARNED_KNOWLEDGE_TREE — connector calls

Updated 2026-09-27. No secrets in this file.

## Vercel echo-ec69 403 (verified)

Symptom: `Not authorized: Trying to access resource under scope "echo-ec69"`.

Verified matrix in this Grok session:

| Call | Args | Result |
|------|------|--------|
| list_projects | none / search only | OK — returns ma-os-12-console, ma-os-12-unified-codespace |
| list_deployments | app=ma-os-12-console only | OK — READY deploys |
| list_projects | slug=echo-ec69 | 403 |
| list_deployments | teamId=team_kgQcPVmumwtmK3MdAGlxKJtg | 403 |
| get_team | teamId=team_kgQcPVmumwtmK3MdAGlxKJtg | 403 (error still names scope echo-ec69) |
| list_teams | none | empty list |

Rule this session must use: **never pass `slug` or `teamId`**. Those parameters force the echo-ec69 scope check. Omit both. Filter by project name / app instead.

Rule this session cannot bypass: slug-scoped *admin* (env writes, team settings, AI Gateway key create on that team) needs the operator to reconnect the Vercel connector and accept scope echo-ec69 on the consent screen. That is OAuth, not a code trick.

IDs (public):
- team accountId on projects: `team_kgQcPVmumwtmK3MdAGlxKJtg`
- project: `prj_Ozz5MVxosia5r1JLxa5ah8Lb4ZV7` (ma-os-12-console)
- production host: `https://ma-os-12-console-echo-ec69.vercel.app`

## MCP connect (simple, no keys in repo)

Official remotes:
- Vercel: `https://mcp.vercel.com`  — `npx -y add-mcp https://mcp.vercel.com`
- LiveKit docs: `https://docs.livekit.io/mcp`

This Grok chat already has GitHub + Drive + Vercel REST tools. VS Code file `.vscode/mcp.json` adds local HTTP bridge + GitHub stdio. Tokens stay in VS Code inputs, not in git.

## AutomationCrew (verified from repo)

- Workflow: `.github/workflows/automationcrew-hourly.yml` (cron hourly + workflow_dispatch)
- Script: `scripts/crew_cycle.py --once`
- LAST_CYCLE.json last written 2026-09-27T08:24:30Z `deployment_activation: green`
- Probes: desk 200, manus-mcp-bridge /health 200

## Still blocked without operator

- Vercel connector re-auth for echo-ec69 admin
- AI_GATEWAY_API_KEY in env (not in git)
- xai-credits
- Supabase connector missing
