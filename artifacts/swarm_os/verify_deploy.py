#!/usr/bin/env python3
"""Single-shot verify + deploy status for MA-OS-12."""
import json, subprocess, sys, ast
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
ART = ROOT / "artifacts"

def syntax_ok():
    bad = []
    for p in (ROOT / "MA_OS_CODE_MODULES").glob("*.py"):
        try:
            ast.parse(p.read_text())
        except SyntaxError as e:
            bad.append((str(p), str(e)))
    return bad

def main():
    r1 = subprocess.run([sys.executable, str(ROOT / "main.py")], capture_output=True, text=True)
    r2 = subprocess.run([sys.executable, str(ART / "SKILL_TREE_ENGINE.py")], capture_output=True, text=True)
    bad = syntax_ok()
    report = {}
    try:
        # last JSON object in stdout
        lines = r1.stdout.strip().splitlines()
        # find first { ... matching report
        blob = r1.stdout
        start = blob.find("{")
        end = blob.find("}\nSUPER_OBJECT")
        if start >= 0:
            report = json.loads(blob[start:end+1] if end > start else blob[start:blob.find("}", start)+1])
    except Exception as e:
        report = {"parse_error": str(e), "stdout_head": r1.stdout[:500]}
    status = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "main_exit": r1.returncode,
        "tree_exit": r2.returncode,
        "syntax_errors": bad,
        "report": report,
        "tree_stdout": r2.stdout.strip().splitlines(),
        "artifacts": {
            "INVESTIGATION_METHODS": (ART/"INVESTIGATION_METHODS.json").exists(),
            "OWNED_REPOS_INDEX": (ART/"OWNED_REPOS_INDEX.json").exists(),
            "TOOLCHAIN_CATALOG": (ART/"TOOLCHAIN_CATALOG.json").exists(),
            "SUPER_OBJECT": (ART/"SUPER_OBJECT.json").exists(),
            "skill_index_n": len(json.loads((ART/"skill_index.json").read_text())),
        },
        "ok": r1.returncode == 0 and r2.returncode == 0 and not bad,
    }
    (ART / "VERIFY_STATUS.json").write_text(json.dumps(status, indent=2, default=str))
    line = f"{status['ts']} VERIFY ok={status['ok']} agents={report.get('completed_agents') and len(report.get('completed_agents'))} plugins={report.get('plugins_loaded')} tree={r2.stdout.strip()[:80]!r}"
    with open(ART / "VERIFY_LOG.md", "a") as f:
        f.write(line + "\n")
    print(json.dumps(status, indent=2, default=str)[:2000])
    return 0 if status["ok"] else 1

if __name__ == "__main__":
    raise SystemExit(main())
