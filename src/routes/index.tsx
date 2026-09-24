import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Cpu,
  GitBranch,
  Network,
  Search,
  Shield,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";
import { maOsData, type SkillAtom } from "@/lib/ma-os-data";

export const Route = createFileRoute("/")({ component: Home });

type TabId = "overview" | "agents" | "skills" | "methods" | "repos" | "governance";

const TABS: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "agents", label: "Agents", icon: Cpu },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "methods", label: "Methods", icon: Search },
  { id: "repos", label: "Repos", icon: GitBranch },
  { id: "governance", label: "Governance", icon: Shield },
];

function Home() {
  const [tab, setTab] = useState<TabId>("overview");
  const [query, setQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runLog, setRunLog] = useState<string[]>([]);
  const [agentStatus, setAgentStatus] = useState<Record<string, "idle" | "running" | "done">>({});

  const filteredAtoms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return maOsData.atoms;
    return maOsData.atoms.filter(
      (a) =>
        a.skill.toLowerCase().includes(q) ||
        a.trigger.toLowerCase().includes(q) ||
        a.capability.toLowerCase().includes(q),
    );
  }, [query]);

  async function simulateRun() {
    if (running) return;
    setRunning(true);
    setRunLog([]);
    setAgentStatus({});
    const logs: string[] = [];
    for (const agent of maOsData.agents) {
      setAgentStatus((s) => ({ ...s, [agent.id]: "running" }));
      logs.push(`[phase ${agent.phase}] ${agent.id} → ${agent.artifact}`);
      setRunLog([...logs]);
      await new Promise((r) => setTimeout(r, 120));
      setAgentStatus((s) => ({ ...s, [agent.id]: "done" }));
    }
    logs.push("SUPER_OBJECT packed · verify ok");
    setRunLog([...logs]);
    setRunning(false);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated flex items-center justify-center shrink-0">
              <Network className="size-4 text-accent" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
                MA-OS-12
              </h1>
              <p className="text-xs text-fg-muted truncate">
                Multi-Agent Operating System · investigation swarm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill ok={maOsData.verify.ok} />
            <button
              type="button"
              onClick={simulateRun}
              disabled={running}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[var(--radius-sm)] bg-accent text-accent-fg text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              <Terminal className="size-4" />
              {running ? "Running…" : "Run swarm"}
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-1 pb-2 min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={[
                    "inline-flex items-center gap-1.5 h-9 px-3 rounded-[var(--radius-sm)] text-sm font-medium transition-colors",
                    active
                      ? "bg-bg-subtle text-fg border border-border-strong"
                      : "text-fg-muted hover:text-fg hover:bg-bg-elevated",
                  ].join(" ")}
                >
                  <Icon className="size-3.5" strokeWidth={1.75} />
                  {label}
                </button>
              );
            })}
          </div>
        </nav>
        <PhasesStrip status={agentStatus} />
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 space-y-6">
        {tab === "overview" && (
          <Overview
            runLog={runLog}
            agentStatus={agentStatus}
            onSelectAgent={(id) => {
              setSelectedAgent(id);
              setTab("agents");
            }}
          />
        )}
        {tab === "agents" && (
          <AgentsPanel
            selected={selectedAgent}
            onSelect={setSelectedAgent}
            status={agentStatus}
          />
        )}
        {tab === "skills" && (
          <SkillsPanel
            query={query}
            setQuery={setQuery}
            atoms={filteredAtoms}
            total={maOsData.atoms.length}
          />
        )}
        {tab === "methods" && <MethodsPanel />}
        {tab === "repos" && <ReposPanel />}
        {tab === "governance" && <GovernancePanel />}
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-fg-subtle">
        {maOsData.meta.policy}
      </footer>
    </div>
  );
}


function PhasesStrip({ status }: { status: Record<string, "idle" | "running" | "done"> }) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-3">
      <div className="flex gap-1 overflow-x-auto">
        {maOsData.agents.map((a) => {
          const st = status[a.id] ?? "idle";
          const tone =
            st === "done"
              ? "border-ok/40 bg-ok/10 text-ok"
              : st === "running"
                ? "border-info/40 bg-info/10 text-info"
                : "border-border bg-bg-elevated text-fg-subtle";
          return (
            <div
              key={a.id}
              title={a.role}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-mono font-medium ${tone}`}
            >
              {a.phase}.{a.id.slice(0, 3)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-medium border",
        ok
          ? "border-ok/30 text-ok bg-ok/10"
          : "border-danger/30 text-danger bg-danger/10",
      ].join(" ")}
    >
      <CheckCircle2 className="size-3.5" />
      {ok ? "Verified" : "Fail"}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 sm:p-5">
      <p className="text-xs font-medium text-fg-muted uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-fg-subtle">{hint}</p> : null}
    </div>
  );
}

function Overview({
  runLog,
  agentStatus,
  onSelectAgent,
}: {
  runLog: string[];
  agentStatus: Record<string, "idle" | "running" | "done">;
  onSelectAgent: (id: string) => void;
}) {
  const v = maOsData.verify;
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Agents" value={`${v.agents}/12`} hint="Pipeline complete" />
        <StatCard label="Plugins" value={v.plugins} hint="Skills + integrity" />
        <StatCard label="Skill atoms" value={v.atoms} hint="Routable graph" />
        <StatCard label="Repos indexed" value={maOsData.repos.length} hint="Pointers only" />
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-semibold">Agent pipeline</h2>
            <span className="text-xs text-fg-subtle">12 phases</span>
          </div>
          <ol className="space-y-1.5">
            {maOsData.agents.map((a) => {
              const st = agentStatus[a.id] ?? "idle";
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onSelectAgent(a.id)}
                    className="w-full flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2 text-left hover:bg-bg-subtle transition-colors"
                  >
                    <span className="size-6 rounded-full border border-border text-[10px] font-mono flex items-center justify-center text-fg-muted tabular-nums shrink-0">
                      {a.phase}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{a.id}</span>
                      <span className="block text-xs text-fg-subtle truncate">{a.role}</span>
                    </span>
                    <StatusDot status={st} />
                    <ChevronRight className="size-4 text-fg-subtle shrink-0" />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4 sm:p-5">
            <h2 className="text-sm font-semibold mb-3">Toolchain</h2>
            <ul className="space-y-2">
              {Object.entries(maOsData.toolchain).map(([key, val]) => (
                <li
                  key={key}
                  className="flex gap-3 rounded-[var(--radius-md)] border border-border bg-bg p-3"
                >
                  <Wrench className="size-4 text-fg-muted mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium font-mono">{key}</p>
                    <p className="text-xs text-fg-muted leading-relaxed mt-0.5">
                      {val.purpose || "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Boxes className="size-4 text-fg-muted" />
              <h2 className="text-sm font-semibold">Run log</h2>
            </div>
            {runLog.length === 0 ? (
              <p className="text-sm text-fg-subtle">
                Press Run swarm to simulate the 12-phase pipeline.
              </p>
            ) : (
              <pre className="text-xs font-mono text-fg-muted whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                {runLog.join("\n")}
              </pre>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusDot({ status }: { status: "idle" | "running" | "done" }) {
  const cls =
    status === "done"
      ? "bg-ok"
      : status === "running"
        ? "bg-info animate-pulse"
        : "bg-fg-subtle/40";
  return <span className={`size-2 rounded-full shrink-0 ${cls}`} />;
}

function AgentsPanel({
  selected,
  onSelect,
  status,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  status: Record<string, "idle" | "running" | "done">;
}) {
  const agent = maOsData.agents.find((a) => a.id === selected) ?? maOsData.agents[0];
  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-2 sm:p-3 h-fit">
        {maOsData.agents.map((a) => {
          const active = a.id === agent.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              className={[
                "w-full text-left rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors",
                active ? "bg-bg-subtle border border-border-strong" : "hover:bg-bg",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-fg-subtle tabular-nums">
                  {String(a.phase).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium">{a.id}</span>
                <StatusDot status={status[a.id] ?? "idle"} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5 sm:p-6 space-y-4">
        <div>
          <p className="text-xs font-mono text-fg-subtle">Phase {agent.phase}</p>
          <h2 className="text-xl font-semibold tracking-tight mt-1">{agent.id}</h2>
          <p className="text-sm text-fg-muted mt-2 leading-relaxed">{agent.role}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-md)] border border-border bg-bg p-4">
            <p className="text-xs text-fg-muted mb-1">Output artifact</p>
            <p className="text-sm font-mono font-medium break-all">{agent.artifact}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border bg-bg p-4">
            <p className="text-xs text-fg-muted mb-1">Subsystems</p>
            <p className="text-sm text-fg-muted">
              Self-heal · Plugin discovery · Evolution · RL loop
            </p>
          </div>
        </div>
        <p className="text-sm text-fg-subtle leading-relaxed">
          Each agent publishes on the bus, receives rewards, and can be healed on
          failure. Plugins load from the skill root with class-based quarantine —
          aggressive filenames are not blocked when the operational class is lawful.
        </p>
      </div>
    </div>
  );
}

function SkillsPanel({
  query,
  setQuery,
  atoms,
  total,
}: {
  query: string;
  setQuery: (v: string) => void;
  atoms: SkillAtom[];
  total: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Skill tree</h2>
          <p className="text-sm text-fg-muted">
            {atoms.length} of {total} atoms · graph edges {maOsData.graph_edges.length}+
          </p>
        </div>
        <label className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Route query…"
            className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border bg-bg-elevated text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {atoms.map((a) => (
          <article
            key={a.id}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 hover:border-border-strong transition-colors"
          >
            <h3 className="text-sm font-semibold font-mono truncate">{a.skill}</h3>
            <p className="mt-1 text-xs text-fg-subtle font-mono truncate">{a.trigger}</p>
            <p className="mt-2 text-xs text-fg-muted leading-relaxed line-clamp-3">
              {a.capability}
            </p>
          </article>
        ))}
      </div>
      {atoms.length === 0 ? (
        <p className="text-sm text-fg-subtle text-center py-8">No skills match that query.</p>
      ) : null}
    </div>
  );
}

function MethodsPanel() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-1">Investigation methods</h2>
        <p className="text-sm text-fg-muted mb-4">
          Ingested from Drive backup · public-record ceiling
        </p>
        <div className="flex flex-wrap gap-2">
          {maOsData.tools.map((t) => (
            <span
              key={t}
              className="inline-flex items-center h-8 px-3 rounded-full border border-border bg-bg-elevated text-xs font-medium text-fg-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-semibold mb-3">Squad archetypes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {maOsData.squads.map((s) => (
            <div
              key={s}
              className="rounded-[var(--radius-md)] border border-border bg-bg-elevated p-4 text-sm font-medium"
            >
              {s}
            </div>
          ))}
          {maOsData.squads.length === 0 ? (
            <p className="text-sm text-fg-subtle">No squad labels in dump.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function ReposPanel() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Owned repositories</h2>
        <p className="text-sm text-fg-muted">
          Pointer catalog only — originals not rewritten · secrets not cloned
        </p>
      </div>
      <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-bg-elevated text-fg-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 font-medium">Repository</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {maOsData.repos.map((r) => (
              <tr key={r.name} className="border-t border-border hover:bg-bg-elevated/50">
                <td className="px-4 py-3">
                  {"url" in r && r.url ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-info hover:underline"
                    >
                      {r.name}
                    </a>
                  ) : (
                    <span className="font-mono">{r.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-fg-muted capitalize">{r.visibility}</td>
                <td className="px-4 py-3 text-fg-muted max-w-xs truncate">{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GovernancePanel() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5 sm:p-6">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Shield className="size-4" /> Continuous primary
        </h2>
        <ul className="space-y-3">
          {maOsData.governance.map((g) => (
            <li key={g} className="flex gap-3 text-sm">
              <CheckCircle2 className="size-4 text-ok shrink-0 mt-0.5" />
              <span className="text-fg-muted">{g}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5 sm:p-6">
        <h2 className="text-sm font-semibold mb-4">Classes not executed</h2>
        <ul className="space-y-2">
          {maOsData.quarantine_classes.map((c) => (
            <li
              key={c}
              className="rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2 text-sm font-mono text-fg-muted"
            >
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-fg-subtle leading-relaxed">
          Rhetoric and aggressive filenames are not quarantine triggers. Operational
          class is. Investigation methods stay loadable.
        </p>
      </div>
    </div>
  );
}
