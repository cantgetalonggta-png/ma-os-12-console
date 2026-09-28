/**
 * Vercel AI Gateway smoke. Reads AI_GATEWAY_API_KEY from env.
 * Does not print the key. Exits 2 if missing.
 */
import { generateText } from 'ai';

const key = process.env.AI_GATEWAY_API_KEY;
if (!key) {
  console.error('AI_GATEWAY_API_KEY missing. Set it locally or in Vercel env.');
  console.error('Create: npx vercel ai-gateway api-keys create --name ma-os-12-desk');
  process.exit(2);
}

const model = process.env.AI_GATEWAY_MODEL || 'openai/gpt-5.5';
const prompt =
  process.env.AI_GATEWAY_PROMPT ||
  'Invent a new holiday and describe its traditions.';

const { text } = await generateText({ model, prompt });
console.log(text);
