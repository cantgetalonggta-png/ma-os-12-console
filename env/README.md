# env/

Names only. Real values live in Vercel project env and operator secret store.
Never commit master.env with live keys.

Required names for worker (values not stored here):
LIVEKIT_URL
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
XAI_API_KEY

Public names already in .env.example:
VITE_PUBLIC_CONSOLE_URL
PUBLIC_CONSOLE_URL
VITE_PUBLIC_GITHUB_REPO
VITE_PUBLIC_APP_NAME
