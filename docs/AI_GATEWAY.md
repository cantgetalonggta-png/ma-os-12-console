# Vercel AI Gateway

```bash
npm install ai
npx vercel ai-gateway setup
# or
npx vercel ai-gateway api-keys create --name ma-os-12-desk
export AI_GATEWAY_API_KEY=  # do not commit
npm run ai:smoke
```

Auth env name: `AI_GATEWAY_API_KEY`
Default model in smoke script: `openai/gpt-5.5` (override with `AI_GATEWAY_MODEL`).
Gateway base: `https://ai-gateway.vercel.sh/v1`

Do not put the key in git.
