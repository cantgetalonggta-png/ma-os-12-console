#!/usr/bin/env python3
"""AUTOMATIONCREW one-shot / loop for Epstein investigation desk base."""
from __future__ import annotations
import argparse, json, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEARN = ROOT / "self" / "LEARNING_LOG.md"
STATUS = ROOT / "AUTOMATIONCREW" / "LAST_CYCLE.json"

DESK = "https://ma-os-12-console-echo-ec69.vercel.app"
BRIDGE = "https://manus-mcp-bridge-echo-ec69.vercel.app/health"

def probe(url: str) -> dict:
    try:
        with urllib.request.urlopen(url, timeout=12) as r:
            body = r.read()[:500]
            return {"url": url, "status": r.status, "ok": 200 <= r.status < 400, "snippet": body[:120].decode("utf-8", "ignore")}
    except Exception as e:
        return {"url": url, "ok": False, "error": type(e).__name__}

def cycle() -> dict:
    ts = datetime.now(timezone.utc).isoformat()
    results = {
        "ts": ts,
        "crew": "AUTOMATIONCREW",
        "base": "ma-os-12-console",
        "probes": [probe(DESK), probe(BRIDGE)],
        "tasks": ["T01_ingest_stub", "T02_distill_stub", "T03_deploy_gate", "T04_self_learn", "T05_dual_export_external", "T06_status"],
        "dual_tts": {"n1": "rex", "n2": "helios", "style": "unhinged_conversational"},
        "deployment_activation": "green" if all(p.get("ok") for p in []) else "check_probes",
    }
    # fix deployment_activation from probes
    results["deployment_activation"] = "green" if all(p.get("ok") for p in results["probes"]) else "degraded"
    STATUS.parent.mkdir(parents=True, exist_ok=True)
    STATUS.write_text(json.dumps(results, indent=2))
    LEARN.parent.mkdir(parents=True, exist_ok=True)
    with LEARN.open("a") as f:
        f.write(f"\n## {ts}\n- cycle ok={results['deployment_activation']}\n- probes={json.dumps(results['probes'])}\n")
    print(json.dumps(results, indent=2))
    return results

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--once", action="store_true")
    ap.add_argument("--loop", action="store_true")
    ap.add_argument("--interval", type=int, default=3600)
    args = ap.parse_args()
    if args.loop:
        while True:
            cycle()
            time.sleep(args.interval)
    else:
        cycle()

if __name__ == "__main__":
    main()
