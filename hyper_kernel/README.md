# MA-OS Hyper-Automation Kernel

FastAPI webhook kernel + CrewAI YAML configs + Ollama multi-provider routing.

## Quick start
```bash
pip install -r requirements.txt
python main.py
# health: http://127.0.0.1:8090/health
# stack:  http://127.0.0.1:8090/stack
# webhook: POST /webhooks/all-platforms
```

## Env
- `GITHUB_TOKEN` / `GH_TOKEN`
- `VERCEL_TOKEN` (optional)
- `OLLAMA_HOST` (default http://127.0.0.1:11434)
- `ENABLE_CREWAI=1` when crewai installed

## Ollama cloud
See `GET /stack` for Elestio, Koyeb, RunPod, Ollama Cloud native offload, etc.

Policy: public-record ceiling · no secret-store clone.
