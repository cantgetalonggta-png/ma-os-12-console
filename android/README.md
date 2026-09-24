# MA-OS-12 Android Console Shell

Kotlin + WebView companion for the MA-OS-12 multi-agent OS control panel.

## Features
- Hardened WebView (HTTPS only, no cleartext, no file access)
- Force-dark, progress bar, toolbar actions
- Persist console URL · deep link `maos12://open?url=https://…`
- Public-record ceiling — no secrets stored

## Build (CI free path)
GitHub Actions workflow builds `assembleDebug` on `ubuntu-latest` (free minutes).

```bash
# local (requires Android SDK)
./gradlew :app:assembleDebug
```

## Install
Download the **debug APK** artifact from Actions → `android-ci` run.

## Policy
HITL · SOLID/MAYBE · class-based quarantine · no third-party secret reuse.
