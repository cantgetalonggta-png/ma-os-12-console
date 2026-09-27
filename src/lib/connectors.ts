/** Connector map — status only. No secrets. */

export const GROK_CONNECTED = [
  { id: "github", name: "GitHub", use: "Repos, Android push, Vercel auto-deploy" },
  { id: "drive", name: "Google Drive", use: "SKILLS / Codespaces docs / REPOSITORIES ingest" },
  { id: "vercel", name: "Vercel", use: "Production desk" },
  { id: "hyperframes", name: "HyperFrames", use: "Optional investigation video" },
  { id: "voice", name: "Voice", use: "Optional narration" },
  { id: "automations", name: "Automations", use: "Hourly LIVE-GOD distill" },
  { id: "supabase", name: "SUPABASE_SERVICE", use: "Platform-injected; not from Drive dumps" },
] as const;

export const AVAILABLE_TO_CONNECT = [
  "Gmail",
  "Google Calendar",
  "Outlook",
  "Box",
  "Notion",
  "Linear",
  "Figma",
  "Netlify",
] as const;

export const NOT_AUTO_WIRED = [
  "Coinbase",
  "Robinhood",
  "Interactive Brokers (IBKR)",
  "Webull",
  "etoro",
  "X Money",
  "X Ads",
  "Stripe",
] as const;

export const MCP_BRIDGE = {
  name: "maOs12HttpBridge",
  transport: "http",
  config: ".vscode/mcp.json",
  keys: "VS Code ${input:} prompts or process env — never Drive key files",
  tools: ["public_record_get", "desk_status"],
};
