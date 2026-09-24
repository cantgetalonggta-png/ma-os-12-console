# MA-OS-12 — Multi-Agent Operating System

12-agent swarm distilled from Google Drive folder `workspace-backup-2026-09-24`.

## Run (this environment)

```bash
python3 /workspace/artifacts/swarm_os/main.py
python3 /workspace/artifacts/swarm_os/artifacts/SKILL_TREE_ENGINE.py
```

## Agents

Crawler → Extractor → Normalizer → Distiller → Classifier → Ontologist → Architect → SkillTree → SpecWriter → OSBuilder → Analyst → Refiner

## Subsystems

Self-healing, plugin discovery (`/root/.grok/server-skills` + local integrity plugins), agent evolution, RL loops.

## Catalogs

- `artifacts/INVESTIGATION_METHODS.json` — OSINT cycle, tool catalog, squad archetypes
- `artifacts/OWNED_REPOS_INDEX.json` — 16 owned repos (pointers; secrets not cloned)
- `artifacts/TOOLCHAIN_CATALOG.json` — RTK, Codex CLI, Claude plugins, Truth Engine, CodeSorcerer, live swarm
- `artifacts/QUARANTINE.json` — class-based (credentials/torrents/bypass), not taboo-word rhetoric

## Policy

Public-record ceiling. HITL for irreversible acts. Governance continuous primary.
Jailbreak / third-party credential / torrent / safety-bypass *operations* are not executed.
Aggressive filenames still load as investigation methods when the class is lawful.
