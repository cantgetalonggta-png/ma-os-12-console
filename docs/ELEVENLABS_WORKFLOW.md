# ElevenLabs workflow (no secrets in tree)

## Secrets

| Name | Where | Notes |
|------|--------|--------|
| `ELEVENLABS_API_KEY` | GitHub → Settings → Secrets and variables → Actions | Required for `.github/workflows/elevenlabs-tts.yml` |
| Same name | Vercel → Project → Environment Variables → Production | Only if a **server** route needs TTS. Never `VITE_*`. |

Do **not** commit API keys. Do **not** put keys in `VITE_*` (browser-exposed).

## Public voice IDs

See `config/elevenlabs-voices.json`. Voice IDs are not secrets.

## Run TTS from Actions

1. Actions → **elevenlabs-tts** → Run workflow
2. Paste text, pick voice ID from config
3. Download artifact `elevenlabs-tts`

## Local (operator machine only)

```bash
export ELEVENLABS_API_KEY=...   # from your password manager, not from git
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","model_id":"eleven_multilingual_v2"}' \
  --output out.mp3
```

## Audio production laws (investigation desk)

See `audio_laws` in `config/elevenlabs-voices.json` and `AGENTS.md`.
