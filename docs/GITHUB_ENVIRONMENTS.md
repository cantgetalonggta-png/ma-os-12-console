# GitHub Environments — MA-OS-12 (exact steps)

Maps GitHub’s “Managing environments for deployment” docs to **your** repos.

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

2. Repo Actions secrets (fallback)  
   https://github.com/cantgetalonggta-png/ma-os-12-console/settings/secrets/actions

3. Workflows  
   https://github.com/cantgetalonggta-png/ma-os-12-console/actions

4. Live app  
   https://ma-os-12-console-echo-ec69.vercel.app

5. Vercel project env (runtime for Vite)  
   https://vercel.com/echo-ec69/ma-os-12-console/settings/environment-variables

---

## Create `production` (click path)

1. Open: https://github.com/cantgetalonggta-png/ma-os-12-console/settings/environments  
2. **New environment** → name: `production` → **Configure environment**  
   - If the environment already exists (auto-created by a workflow run), open it and configure.
3. Optional protection:
   - **Required reviewers** → add yourself (or leave off for solo auto-deploy)
   - **Deployment branches** → **Selected branches** → allow `main` only  
4. Under **Environment secrets** → **Add secret** (encrypted):

| Name | Value | Notes |
|------|--------|------|
| `VERCEL_TOKEN` | from https://vercel.com/account/tokens | Paste **only** in GitHub secret UI |
| `VERCEL_ORG_ID` | optional team/org id for CLI | optional |
| `VERCEL_PROJECT_ID` | `prj_Ozz5MVxosia5r1JLxa5ah8Lb4ZV7` | public project id |

5. Under **Environment variables** (non-secret, `vars.*` in Actions):

| Name | Value |
|------|--------|
| `VITE_PUBLIC_CONSOLE_URL` | `https://ma-os-12-console-echo-ec69.vercel.app` |
| `PUBLIC_CONSOLE_URL` | `https://ma-os-12-console-echo-ec69.vercel.app` |
| `VITE_PUBLIC_GITHUB_REPO` | `https://github.com/cantgetalonggta-png/ma-os-12-console` |
| `VITE_PUBLIC_APP_NAME` | `MA-OS-12 Public-Record Investigation Desk` |

6. Save.

### Same non-secret vars on **Vercel** (required for Vite client build)

GitHub env vars do **not** automatically inject into Vercel builds from Git integration. Put the same four public values in:

https://vercel.com/echo-ec69/ma-os-12-console/settings/environment-variables  
→ Production (and Preview if you want) → **Plain** / not Sensitive.

Repo already documents them in `.env.example`.

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

The job reads `secrets.VERCEL_TOKEN` from the **production** environment (or repo Actions secrets).

### Run it

1. Put `VERCEL_TOKEN` in Environment secrets **or** Actions secrets  
2. Actions → **vercel-prod-deploy** → **Run workflow**  
   or push to `main` under `src/**` / `package.json` / `vercel.json`

### If token missing

Job fails with a clear message. Do **not** paste the token into chat.

---

## Auto-create note (from GitHub docs)

Running a workflow that references an environment that does not exist **creates** that environment with the referenced name. Configure secrets/rules afterward in Settings → Environments.

---

## mcp-stack-deploy (bridge)

Environments UI:  
https://github.com/cantgetalonggta-png/mcp-stack-deploy/settings/environments

| Env | Secrets (encrypted) |
|-----|---------------------|
| `production` | `BRIDGE_TOKEN`, optional `MANUS_API_KEY` for Actions only |

Runtime keys for the live bridge still live in **Vercel** project env.

---

## Three different “protections” (do not mix)

| Concern | Where |
|---------|--------|
| Runtime env for Vite / FastAPI | **Vercel** project env |
| CI deploy token for `vercel` CLI | **GitHub** environment secret `VERCEL_TOKEN` |
| Browser SSO / 302 login wall | **Vercel** Deployment Protection (`ssoProtection`) |
| Required reviewers before Actions deploy job | **GitHub** environment protection |

---

## Delete an environment

Settings → Environments → trash → confirm. Deletes that env’s secrets/rules.
