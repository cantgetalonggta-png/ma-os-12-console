#!/usr/bin/env python3
"""
MA-OS-12 YOLO orchestrator — web workspace edition.

This sandbox ships a TanStack Start / Vercel web app, NOT an Android Studio project.
There is no MainActivity.kt / AndroidManifest.xml / gradlew here.

Pipeline (zero-prompt when --yolo):
  1. Preflight (git identity, gh auth, preview health)
  2. Swarm verify (python swarm_os)
  3. npm typecheck + production build
  4. Browser smoke (dev)
  5. Push source + status to GitHub (gh API / git)
  6. Note Vercel: platform deploys from prebuilt .vercel/output when token available

Never: clone api-keys-secret-store, force-load third-party tokens, torrent fetch,
       or invent Android APK when Gradle project is absent.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SWARM = ROOT / "artifacts" / "swarm_os"
REPORT = ROOT / "artifacts" / "YOLO_REPORT.json"


def run(cmd: list[str] | str, cwd: Path | None = None, timeout: int = 600) -> tuple[bool, str]:
    try:
        r = subprocess.run(
            cmd if isinstance(cmd, list) else cmd,
            cwd=str(cwd or ROOT),
            shell=isinstance(cmd, str),
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        out = (r.stdout or "") + (("\n" + r.stderr) if r.stderr else "")
        return r.returncode == 0, out.strip()
    except Exception as e:
        return False, str(e)


def banner(title: str) -> None:
    print("\n" + "=" * 70)
    print(f"[YOLO] {title}")
    print("=" * 70)


def main(yolo: bool) -> int:
    if not yolo:
        print("[-] Pass --yolo for unattended run")
        return 1

    report: dict = {
        "started_at": datetime.now(timezone.utc).isoformat(),
        "project": "MA-OS-12 web console",
        "android_project_present": False,
        "steps": {},
    }

    # Detect Android (expected false)
    android_hits = list(ROOT.rglob("MainActivity.kt")) + list(ROOT.rglob("AndroidManifest.xml"))
    report["android_project_present"] = bool(android_hits)
    report["android_hits"] = [str(p.relative_to(ROOT)) for p in android_hits[:10]]

    banner("1 PREFLIGHT")
    ok, out = run(["git", "config", "user.name"])
    if not ok or not out:
        run(["git", "config", "--global", "user.name", "MA-OS-12 Agent"])
        run(["git", "config", "--global", "user.email", "ma-os-12@agent.local"])
    ok_gh, gh = run(["gh", "auth", "status"])
    report["steps"]["preflight"] = {"gh_auth": ok_gh, "detail": gh[:500]}
    print("[+] gh auth" if ok_gh else "[-] gh auth missing")

    # Android companion shell
    android_dir = ROOT / "android"
    main_kt = android_dir / "app/src/main/java/com/maos12/console/MainActivity.kt"
    manifest = android_dir / "app/src/main/AndroidManifest.xml"
    report["android_project_present"] = main_kt.exists() and manifest.exists()
    report["android_hits"] = [str(main_kt.relative_to(ROOT)), str(manifest.relative_to(ROOT))] if report["android_project_present"] else []

    if report["android_project_present"]:
        banner("ANDROID SHELL")
        print("[+] MainActivity.kt + AndroidManifest.xml present")
        # Local assemble only if SDK present; else CI builds free on GHA
        sdk = os.environ.get("ANDROID_HOME") or os.environ.get("ANDROID_SDK_ROOT")
        has_local = bool(sdk and Path(sdk).exists()) or (android_dir / "local.properties").exists()
        if has_local and (android_dir / "gradlew").exists():
            ok_apk, out_apk = run([str(android_dir / "gradlew"), ":app:assembleDebug"], cwd=android_dir, timeout=900)
            report["steps"]["apk"] = {"status": "local_assembleDebug", "ok": ok_apk, "out": out_apk[-1500:]}
        else:
            print("[*] No local ANDROID_HOME — free GitHub Actions android-ci builds assembleDebug")
            report["steps"]["apk"] = {
                "status": "deferred_to_github_actions_free",
                "workflow": ".github/workflows/android-ci.yml",
                "artifact": "ma-os-12-debug-apk",
            }
    else:
        print("[*] Android shell missing")
        report["steps"]["apk"] = {"status": "missing"}

    banner("2 SWARM VERIFY")
    if (SWARM / "verify_deploy.py").exists():
        ok, out = run([sys.executable, str(SWARM / "verify_deploy.py")], timeout=120)
        report["steps"]["swarm_verify"] = {"ok": ok, "out": out[:2000]}
        print(out[-800:] if out else "")
    else:
        report["steps"]["swarm_verify"] = {"ok": False, "out": "missing"}

    banner("3 TYPECHECK + BUILD")
    ok_t, out_t = run(["npm", "run", "typecheck"], timeout=180)
    ok_b, out_b = run(["npm", "run", "build"], timeout=300)
    report["steps"]["typecheck"] = {"ok": ok_t, "out": out_t[-1500:]}
    report["steps"]["build"] = {"ok": ok_b, "out": out_b[-1500:]}
    print(f"typecheck={'PASS' if ok_t else 'FAIL'} build={'PASS' if ok_b else 'FAIL'}")

    banner("4 PREVIEW HEALTH")
    ok_p, _ = run(["curl", "-sf", "-o", "/dev/null", "http://127.0.0.1:8080/"])
    if not ok_p and (ROOT / "startup.sh").exists():
        run(["sh", str(ROOT / "startup.sh")], timeout=90)
        ok_p, _ = run(["curl", "-sf", "-o", "/dev/null", "http://127.0.0.1:8080/"])
    report["steps"]["preview"] = {"ok": ok_p}

    banner("5 GITHUB SYNC")
    # Prefer gh repo create + rsync of publishable files into a clean tree
    publish = ROOT / "artifacts" / "ma-os-12-publish"
    if publish.exists():
        shutil.rmtree(publish)
    publish.mkdir(parents=True)
    # Minimal publish set (no node_modules, no secrets)
    for rel in [
        "src",
        "public",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "vite.config.ts",
        "vercel.json",
        "startup.sh",
        "yolo_orchestrator.py",
        "android",
        "docs",
        ".github",
        "artifacts/swarm_os/README.md",
        "artifacts/swarm_os/main.py",
        "artifacts/swarm_os/verify_deploy.py",
        "artifacts/swarm_os/artifacts/DEPLOY_STATUS.md",
        "artifacts/swarm_os/artifacts/OWNED_REPOS_INDEX.json",
        "artifacts/swarm_os/artifacts/TOOLCHAIN_CATALOG.json",
        "artifacts/swarm_os/artifacts/QUARANTINE.json",
        "artifacts/swarm_os/artifacts/VERIFY_STATUS.json",
        "artifacts/APP_DEPLOY_STATUS.md",
    ]:
        src = ROOT / rel
        if not src.exists():
            continue
        dst = publish / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.is_dir():
            shutil.copytree(src, dst, dirs_exist_ok=True, ignore=shutil.ignore_patterns("node_modules", "__pycache__", ".git"))
        else:
            shutil.copy2(src, dst)

    readme = publish / "README.md"
    readme.write_text(
        """# MA-OS-12 Console

Web control panel for the 12-agent Multi-Agent Operating System.

## Run

```bash
npm install
npm run dev   # 0.0.0.0:8080
npm run build
python3 yolo_orchestrator.py --yolo
```

## Swarm backend (optional)

```bash
python3 artifacts/swarm_os/verify_deploy.py
```

## Policy

Public-record ceiling · HITL · SOLID/MAYBE · class-based quarantine.
No third-party secret reuse. Not an Android APK project.
"""
    )

    # Create or update public repo
    repo = "ma-os-12-console"
    owner = "cantgetalonggta-png"
    full = f"{owner}/{repo}"
    exists, _ = run(["gh", "repo", "view", full])
    if not exists:
        ok_c, out_c = run(
            [
                "gh",
                "repo",
                "create",
                full,
                "--public",
                "--description",
                "MA-OS-12 multi-agent OS control panel — TanStack Start + swarm verify. Public-record ceiling.",
                "--source",
                str(publish),
                "--remote",
                "origin",
                "--push",
            ],
            cwd=publish,
            timeout=180,
        )
        # gh create --source needs git init first sometimes
        if not ok_c:
            run(["git", "init"], cwd=publish)
            run(["git", "checkout", "-b", "main"], cwd=publish)
            run(["git", "add", "."], cwd=publish)
            run(["git", "commit", "-m", "feat: MA-OS-12 console initial publish"], cwd=publish)
            ok_c2, out_c2 = run(
                ["gh", "repo", "create", full, "--public", "--source=.", "--remote=origin", "--push"],
                cwd=publish,
                timeout=180,
            )
            report["steps"]["github"] = {"create": ok_c2, "out": (out_c + "\n" + out_c2)[-1500:]}
        else:
            report["steps"]["github"] = {"create": True, "out": out_c[-1500:]}
    else:
        # clone shallow + copy + push
        tmp = ROOT / "artifacts" / "tmp_repo_push"
        if tmp.exists():
            shutil.rmtree(tmp)
        ok_cl, out_cl = run(["gh", "repo", "clone", full, str(tmp), "--", "--depth", "1"], timeout=120)
        if ok_cl:
            # wipe tracked content except .git
            for child in tmp.iterdir():
                if child.name == ".git":
                    continue
                if child.is_dir():
                    shutil.rmtree(child)
                else:
                    child.unlink()
            for child in publish.iterdir():
                dest = tmp / child.name
                if child.is_dir():
                    shutil.copytree(child, dest, dirs_exist_ok=True)
                else:
                    shutil.copy2(child, dest)
            run(["git", "add", "-A"], cwd=tmp)
            run(["git", "commit", "-m", f"chore: YOLO sync {datetime.now(timezone.utc).isoformat()}"], cwd=tmp)
            ok_push, out_push = run(["git", "push", "origin", "HEAD:main"], cwd=tmp, timeout=120)
            report["steps"]["github"] = {"push": ok_push, "out": out_push[-1500:]}
        else:
            report["steps"]["github"] = {"clone": False, "out": out_cl[-800:]}

    banner("6 VERCEL / GROK.ME")
    # CLI token absent in sandbox; platform auto-deploys app-builder builds
    ok_v, out_v = run(["vercel", "whoami"])
    report["steps"]["vercel"] = {
        "cli_auth": ok_v,
        "note": "App Builder platform deploys production from .vercel/output when gates pass. CLI token not required for grok.me publish.",
        "out": out_v[-500:],
        "prebuilt": (ROOT / ".vercel" / "output").exists(),
    }
    print("[*] Vercel CLI auth:", "yes" if ok_v else "no — relying on platform grok.me deploy")

    report["finished_at"] = datetime.now(timezone.utc).isoformat()
    report["ok"] = bool(
        report["steps"].get("build", {}).get("ok")
        and report["steps"].get("typecheck", {}).get("ok")
    )
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2))
    print(json.dumps({"ok": report["ok"], "report": str(REPORT)}, indent=2))
    return 0 if report["ok"] else 2


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--yolo", action="store_true")
    args = ap.parse_args()
    raise SystemExit(main(args.yolo))
