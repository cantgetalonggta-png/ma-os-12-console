# Vercel redeploy + public env status

## Attempted via Grok Vercel connector

| Action | Result |
|--------|--------|
| List projects | OK — `ma-os-12-console` |
| Create plain public env vars | **403** scope `echo-ec69` |
| Create production deployment | **403** scope `echo-ec69` |

**Fix:** Reconnect the **Vercel** connector in Grok (scope must include team `echo-ec69`).

## Public (non-secret) env values for Vercel UI

```
VITE_PUBLIC_CONSOLE_URL=https://ma-os-12-console-echo-ec69.vercel.app
PUBLIC_CONSOLE_URL=https://ma-os-12-console-echo-ec69.vercel.app
VITE_PUBLIC_GITHUB_REPO=https://github.com/cantgetalonggta-png/ma-os-12-console
VITE_PUBLIC_APP_NAME=MA-OS-12 Public-Record Investigation Desk
```

Type: **plain** · Targets: Production + Preview + Development

## Alternate path

Git push to `main` triggers auto-deploy if the project is linked to GitHub.
