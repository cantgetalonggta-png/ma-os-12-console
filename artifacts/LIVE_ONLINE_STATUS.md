# LIVE ONLINE DEPLOY STATUS — NO SIMULATION

**Mode:** `ENABLE_LIVE_FETCH=1` · real `aiohttp` HTTP to public endpoints  
**Simulation:** **OFF**

## Public endpoint probes (this session)

| Endpoint | Result |
|----------|--------|
| CourtListener API | HTTP **200** (then **429** under parallel load — expected) |
| Wayback CDX | HTTP **200** / intermittent **503** |
| govinfo | HTTP **200** |
| crt.sh | HTTP **502** (upstream at probe time) |

## Swarm live behavior

- 12 Citation_Seekers hitting CourtListener, Wayback, govinfo, etc.
- Network resilience: full-jitter backoff on 429/503
- Diagnostic codes written to ledger (`ERR_HTTP_429_RATE_LIMIT`, etc.)
- GOD meta orchestrator + ontology + global search plans

## Launch

```bash
cd hierarchical_osint_swarm
pip install -r requirements.txt   # includes aiohttp
ENABLE_LIVE_FETCH=1 python deploy_god_osint.py --live --workers 12
```

## Console (Vercel production READY)

- Project: `ma-os-12-console`
- Latest production deployment state: **READY**
- Repo: https://github.com/cantgetalonggta-png/ma-os-12-console

## Compliance

Public-record only. Rate limits respected via backoff. No dark web / auth bypass.
