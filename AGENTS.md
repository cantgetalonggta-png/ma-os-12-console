# AGENTS.md — MA-OS-12 Console

Always-on rules for any coding agent (Copilot, Grok, Claude, Codex) working in this repo.

## Mission

Public-record **investigation desk** (Vite SPA). Operator-led leads are visible tracks — not fake exhibits.

## Hard rules

1. **Public-record ceiling** — DOJ, court, FOIA, archives, operator public packs, public GitHub only.
2. **Association ≠ guilt** — every claim SOLID or MAYBE with provenance.
3. **No client secrets** — only `VITE_PUBLIC_*` non-secret URLs in the browser bundle. Keys live in Vercel env / private stores.
4. **Open source allowed** under clear guidelines — see unified codespace `directives/OPEN_SOURCE_USE_POLICY.md`.
5. **Do not** load quarantined probe/dork dumps or evasion scripts into agents.
6. **Do not** deanonymize redacted victim identities.

## Stack

- Vite + React + Tailwind
- Optional Three.js / R3F for Meridian-style views
- Evidence graph JSON as data, not verdicts

## Preferred agent behavior

- Prefer reading `PURPOSE_AND_STATUS.md`, `src/`, `docs/` before large edits
- Keep SPA build lean (`vite build` → `dist`)
- Push to `main` only with working build when auto-deploy is expected

## Related monorepo

https://github.com/cantgetalonggta-png/ma-os-12-unified-codespace
