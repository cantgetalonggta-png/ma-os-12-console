# MA-OS-12 Android shell

WebView companion for the LIVE desk at:

`https://ma-os-12-console-echo-ec69.vercel.app`

## Features (v2.2)

- Default console = production Vercel alias
- Menu: Reload · Open LIVE console · LIVE status (bridge /health) · Home · Set URL · Browser · About
- UA: `MAOS12Console/2.2 BRIDGE-v1.4 DISTILL-LIVE`
- HTTPS only; cleartext blocked
- Deep link: `maos12://open?url=https://…`
- `singleTop` so deep links reuse the activity

## Build

Open `android/` in Android Studio or:

```bash
cd android && ./gradlew assembleDebug
```

## Note

If the desk or bridge returns SSO 302, turn off Vercel Authentication on the project in the dashboard. The shell cannot store deployment-protection secrets.
