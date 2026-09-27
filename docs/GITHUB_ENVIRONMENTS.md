# GitHub Environments — MA-OS-12 (exact steps)

This maps GitHub’s “Managing environments for deployment” docs to **your** repos.

Repo is **public** → Free plan **can** use environments + environment secrets.

## What environments are for

| Environment | Use |
|-------------|-----|
| `production` | Jobs that deploy live desk / need production secrets |
| `preview` | Optional PR / branch deploys |

Jobs that say `environment: production` only see that environment’s secrets **after** protection rules pass.

**Prefer:** keep secrets in GitHub Environment Secrets or Vercel Project Env — never in chat, Drive, or committed files.

---

## Exact links (this repo)

1. Environments UI  
   https://github.com/cantgetalonggta-png/ma-os-12-console/settings/environments

2. Repo Actions secrets (fallback if not using environments)  
   https://github.com/cantgetalonggta-png/ma-os-12-console/settings/secrets/actions

3. Workflows  
   https://github.com/cantgetalonggta-png/ma-os-12-console/actions

4. Live app (Vercel, not GitHub env URL)  
   https://ma-os-12-console-echo-ec69.vercel.app

---

## Create `production` (click path)

1. Open: https://github.com/cantgetalonggta-png/ma-os-12-console/settings/environments  
2. **New environment** → name: `production` → **Configure environment**  
3. Optional protection:
   - **Required reviewers** → add yourself (or leave off for solo auto-deploy)
   - **Deployment branches** → **Selected branches** → allow `main` only  
4. Under **Environment secrets** → **Add secret**:

| Name | Value | Notes |
|------|--------|------|
| `VERCEL_TOKEN` | from https://vercel.com/account/tokens | Create token, paste **once** into this secret UI only |
| `VERCEL_ORG_ID` | team id if CLI needs it | optional |
| `VERCEL_PROJECT_ID` | `prj_Ozz5MVxosia5r1JLxa5ah8Lb4ZV7` | public project id, ok as plain |

5. Under **Environment variables** (non-secret):

| Name | Value |
|------|--------|
| `PUBLIC_CONSOLE_URL` | `https://ma-os-12-console-echo-ec69.vercel.app` |
| `VITE_PUBLIC_CONSOLE_URL` | same |

6. Save.

## Create `preview` (optional)

Same page → **New environment** → `preview`  
- Deployment branches: all, or `*`  
- Secrets: same `VERCEL_TOKEN` or a restricted one  

---

## Wire workflow (already in repo)

`.github/workflows/vercel-deploy.yml` uses:

```yaml
environment:
  name: production
  url: https://ma-os-12-console-echo-ec69.vercel.app
```

So the job can only read `secrets.VERCEL_TOKEN` from the **production** environment (if you store it there).

### Run it

1. Put `VERCEL_TOKEN` in Environment secrets (step above) **or** Actions secrets  
2. Actions → **vercel-prod-deploy** → **Run workflow**  
   or push to `main` under `src/**` / `package.json` / `vercel.json`

### If token missing

Job fails with a clear message. Do **not** paste the token into chat — only into GitHub’s secret form.

---

## mcp-stack-deploy (bridge)

Environments UI:  
https://github.com/cantgetalonggta-png/mcp-stack-deploy/settings/environments

Suggested:

| Env | Secrets (encrypted) |
|-----|---------------------|
| `production` | `BRIDGE_TOKEN`, optional `MANUS_API_KEY` for Actions only if needed |

Vercel still owns runtime env for **manus-mcp-bridge**. GitHub env secrets are for **Actions** jobs, not automatic Vercel inject.

---

## Vercel vs GitHub (don’t mix them up)

| Concern | Where |
|---------|--------|
| Runtime env for Vite / FastAPI | **Vercel** project env |
| CI deploy token for `vercel` CLI | **GitHub** environment secret `VERCEL_TOKEN` |
| Deployment Protection (SSO 302) | **Vercel** project settings |
| Required reviewers before deploy job | **GitHub** environment protection |

---

## Delete an environment

Settings → Environments → trash icon → confirm. Deletes that env’s secrets/rules.
