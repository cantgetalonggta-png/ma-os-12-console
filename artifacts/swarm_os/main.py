#!/usr/bin/env python3
"""Boot the 12-agent swarm OS against already-materialized artifacts."""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from MA_OS_CODE_MODULES.supervisor import Supervisor
from artifacts.SKILL_TREE_ENGINE import SkillTreeEngine

def load_store():
    art = ROOT / "artifacts"
    store = {}
    mapping = {
        "RAW_TEXT_DUMP": "RAW_TEXT_DUMP.json",
        "NORMALIZED_TEXT_DUMP": "NORMALIZED_TEXT_DUMP.json",
        "DISTILLED_COMPONENTS": "DISTILLED_COMPONENTS.json",
        "CLASSIFIED_COMPONENTS": "CLASSIFIED_COMPONENTS.json",
        "ONTOLOGY": "ONTOLOGY.json",
        "UNIFIED_SYSTEM_FRAMEWORK": "UNIFIED_SYSTEM_FRAMEWORK.json",
        "SKILL_TREE": "SKILL_ATOMS.json",
        "EXECUTABLE_SYSTEM_SPEC": "EXECUTABLE_SYSTEM_SPEC.md",
        "MULTI_AGENT_OS_SPEC": "MULTI_AGENT_OS_SPEC.md",
        "EMERGENT_INSIGHTS": "EMERGENT_INSIGHTS.md",
        "INVESTIGATION_METHODS": "INVESTIGATION_METHODS.json",
        "QUARANTINE": "QUARANTINE.json",
        "OWNED_REPOS_INDEX": "OWNED_REPOS_INDEX.json",
        "TOOLCHAIN_CATALOG": "TOOLCHAIN_CATALOG.json",
    }
    for k, fn in mapping.items():
        p = art / fn
        if p.suffix == ".json":
            store[k] = json.loads(p.read_text())
        else:
            store[k] = {"text": p.read_text()[:2000], "path": str(p)}
    return store

def main():
    store = load_store()
    tree = SkillTreeEngine()
    store["CRAWL_MANIFEST"] = {
        "folder": "workspace-backup-2026-09-24",
        "folder_id": "1QlRcio2CaNsq6YmtL-RUbGaemJP9TlII",
        "skills": len(tree.atoms),
    }
    sup = Supervisor(store)
    report = sup.run()
    super_obj = {
        "system": "MA-OS-12",
        "source_folder": "workspace-backup-2026-09-24",
        "report": report,
        "artifacts_present": list(store.keys()),
        "skill_route_demo": [a["skill"] for a in tree.route("self healing plugin discovery ontology swarm")],
    }
    out = ROOT / "artifacts" / "SUPER_OBJECT.json"
    # full pack
    full = {
        "meta": {"name": "MA-OS SUPER_OBJECT", "version": "1.0.0", "generated_at": "2026-09-24T14:40:00Z"},
        "report": report,
        "ontology": store.get("ONTOLOGY"),
        "framework": store.get("UNIFIED_SYSTEM_FRAMEWORK"),
        "classified_quarantine": json.loads((ROOT/"artifacts"/"QUARANTINE.json").read_text()),
        "skill_graph": json.loads((ROOT/"artifacts"/"SKILL_GRAPH.json").read_text()),
        "distilled": store.get("DISTILLED_COMPONENTS"),
        "normalized_rules": store.get("NORMALIZED_TEXT_DUMP"),
        "insights_head": store.get("EMERGENT_INSIGHTS"),
        "investigation_methods": store.get("INVESTIGATION_METHODS"),
        "quarantine_policy": store.get("QUARANTINE"),
        "crawl": store.get("CRAWL_MANIFEST"),
        "skill_route_demo": super_obj["skill_route_demo"],
        "owned_repos": store.get("OWNED_REPOS_INDEX"),
        "toolchain": store.get("TOOLCHAIN_CATALOG"),
        "verify": {
            "agents": len(report.get("completed_agents", [])),
            "plugins": report.get("plugins_loaded"),
            "plugins_blocked": report.get("plugins_blocked"),
            "skill_atoms": len(tree.atoms),
            "secret_store_cloned": False,
            "generated_at": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        },
    }
    out.write_text(json.dumps(full, indent=2, default=str))
    print(json.dumps(report, indent=2))
    print("SUPER_OBJECT", out, "bytes", out.stat().st_size)

if __name__ == "__main__":
    main()
