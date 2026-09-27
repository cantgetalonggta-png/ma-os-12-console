# AUTOMATIONCREW — Epstein Investigation Desk

**Base directory / codespace root:** `ma-os-12-console` (MA-OS-12 Epstein Public-Record Investigation Desk)

Combines: AUTO-DEPLOY · SELF-LEARNING · DEPLOYMENT_ACTIVATION · DEPLOYMENT-AUTOMATION · AUTOMATED-DEVELOPMENT

## Run one cycle locally
```bash
python scripts/crew_cycle.py --once
```

## Continuous (until paused)
```bash
python scripts/crew_cycle.py --loop --interval 3600
```

## Config
- `config/self.agents_config.yaml`
- `config/self.tasks_config.yaml`
- `self/LEARNING_LOG.md` (appended each cycle)
