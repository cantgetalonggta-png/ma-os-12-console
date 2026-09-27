/** Drive screenshot distill — lawful load vs quarantine. Names only for blocked packs. */
export type DistillClass = "LAWFUL" | "QUARANTINE" | "OPERATOR_LEAD";
export type DistillItem = {
  name: string;
  folder: "SKILLS" | "Codespaces docs" | "Learn 240" | "attachment";
  klass: DistillClass;
  reason: string;
  load: boolean;
};
export const DRIVE_DISTILL = {
  generated_at: "2026-09-27T01:57:00Z",
  source: "operator Drive screenshots + attached PDFs",
  policy:
    "Public-record + lawful IDE/OSINT docs load. Cracked binaries, SQLi dumpers, leaked-key scrapers, unblockers, credential files, and stalking-method packs are quarantined.",
  secrets_warning:
    "Codespaces.PDF shows GitHub Codespaces user-secret NAMES. Values were not copied. Rotate those secrets.",
  counts: { lawful: 0, quarantine: 0, lead: 0 },
  items: [] as DistillItem[],
};
export const TOOLING_LAWFUL = {
  copilot_shortcuts: [
    { keys: "Ctrl+Alt+I", action: "Open Chat view" },
    { keys: "Ctrl+I", action: "Inline chat" },
    { keys: "Ctrl+N", action: "New chat session" },
    { keys: "Ctrl+Shift+Alt+I", action: "Switch Chat to agents" },
    { keys: "Tab", action: "Accept inline suggestion" },
    { keys: "Escape", action: "Dismiss suggestion" },
  ],
  copilot_cli: "Copilot CLI background sessions from VS Code Chat. Lawful IDE workflow only.",
  debugger_api: "VS Code debugger extension API: configs, steps, breakpoints, stacks, watches.",
  codespaces: "Dotfiles optional · GPG signing · Settings Sync. Secrets stay in GitHub encrypted store.",
  codex_fork: "Public Apache-2.0 fork of openai/codex. Not a license to run quarantined packs.",
  ollama: "Local inference docs — operator-owned models only.",
  swarm_evolution: {
    v1: { breadcrumbs: 42, solid: 4, maybe: 38 },
    v2_god: { breadcrumbs: 594, solid: 493, maybe: 101, solid_ratio: 0.83 },
  },
};
