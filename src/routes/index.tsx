import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  GitBranch,
  HelpCircle,
  Network,
  Search,
  Shield,
  Terminal,
  Users,
} from "lucide-react";
import { investigation } from "@/lib/investigation-data";
import { maOsData } from "@/lib/ma-os-data";

export const Route = createFileRoute("/")({ component: Desk });

type Tab =
  | "overview"
  | "timeline"
  | "entities"
  | "sources"
  | "claims"
  | "methods"
  | "agents"
  | "links";

const TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "timeline", label: "Timeline", icon: Activity },
  { id: "entities", label: "Entities", icon: Users },
  { id: "sources", label: "Sources", icon: FileSearch },
  { id: "claims", label: "Open Qs", icon: HelpCircle },
  { id: "methods", label: "Methods", icon: Shield },
  { id: "agents", label: "MA-OS-12", icon: Network },
  { id: "links", label: "Live links", icon: ExternalLink },
];

function Desk() {
  const [tab, setTab] = useState<Tab>("overview");
  const [q, setQ] = useState("");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<Record<string, "idle" | "running" | "done">>({});

  const filteredTimeline = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return investigation.timeline;
    return investigation.timeline.filter(
      (t) =>
        t.event.toLowerCase().includes(s) ||
        t.date.includes(s) ||
        t.source.toLowerCase().includes(s),
    );
  }, [q]);

  async function runPipeline() {
    if (running) return;
    setRunning(true);
    setLog([]);
    setStatus({});
    const lines: string[] = [];
    for (const a of maOsData.agents) {
      setStatus((p) => ({ ...p, [a.id]: "running" }));
      lines.push(`[${a.phase}/12] ${a.id} → ${a.artifact}`);
      setLog([...lines]);
      await new Promise((r) => setTimeout(r, 90));
      setStatus((p) => ({ ...p, [a.id]: "done" }));
    }
    lines.push("VERIFY ok · SOLID/MAYBE tags preserved · public-record ceiling");
    setLog([...lines]);
    setRunning(false);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-fg-subtle font-medium">
              Investigative journalism · public records only
            </p>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
              {investigation.purpose.title}
            </h1>
            <p className="text-xs text-fg-muted line-clamp-2 max-w-xl">
              {investigation.purpose.one_liner}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-medium border border-ok/30 text-ok bg-ok/10">
              <CheckCircle2 className="size-3.5" />
              Verified build
            </span>
            <button
              type="button"
              onClick={runPipeline}
              disabled={running}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[var(--radius-sm)] bg-accent text-accent-fg text-sm font-medium hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              <Terminal className="size-4" />
              {running ? "Running…" : "Run 12-agent cycle"}
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
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 space-y-6">
        {tab === "overview" && (
          <Overview log={log} status={status} />
        )}
        {tab === "timeline" && (
          <TimelinePanel q={q} setQ={setQ} items={filteredTimeline} />
        )}
        {tab === "entities" && <EntitiesPanel />}
        {tab === "sources" && <SourcesPanel />}
        {tab === "claims" && <ClaimsPanel />}
        {tab === "methods" && <MethodsPanel />}
        {tab === "agents" && <AgentsPanel status={status} />}
        {tab === "links" && <LinksPanel />}
      </main>

      <footer className="border-t border-border py-4 px-4 text-center text-xs text-fg-subtle space-y-1">
        <p>Public-record ceiling · HITL · SOLID/MAYBE · association ≠ guilt</p>
        <p>No CSAM · no private victim data beyond already-public filings · no secret loaders</p>
      </footer>
    </div>
  );
}

function Tag({ t }: { t: string }) {
  const ok = t === "SOLID";
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border",
        ok
          ? "border-ok/40 text-ok bg-ok/10"
          : "border-warn/40 text-warn bg-warn/10",
      ].join(" ")}
    >
      {t}
    </span>
  );
}

function Overview({
  log,
  status,
}: {
  log: string[];
  status: Record<string, "idle" | "running" | "done">;
}) {
  const p = investigation.purpose;
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5 sm:p-6">
        <h2 className="text-sm font-semibold mb-2">Exact purpose</h2>
        <p className="text-sm text-fg-muted leading-relaxed">{p.one_liner}</p>
        <ul className="mt-4 space-y-2">
          {p.mission.map((m) => (
            <li key={m} className="flex gap-2 text-sm text-fg-muted">
              <CheckCircle2 className="size-4 text-ok shrink-0 mt-0.5" />
              {m}
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-fg-subtle mb-2">Not for</p>
          <ul className="space-y-1">
            {p.not_for.map((n) => (
              <li key={n} className="text-xs text-fg-subtle">
                — {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Timeline events" value={investigation.timeline.length} />
        <Stat label="Entities mapped" value={investigation.entities.length} />
        <Stat label="Primary portals" value={investigation.official_portals.filter((x) => x.tier === "primary").length} />
        <Stat label="Agents" value="12/12" />
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4">
          <h3 className="text-sm font-semibold mb-3">Pipeline status</h3>
          <ol className="space-y-1">
            {maOsData.agents.map((a) => {
              const st = status[a.id] ?? "idle";
              return (
                <li key={a.id} className="flex items-center gap-2 text-sm py-1">
                  <span className="font-mono text-xs text-fg-subtle w-6">{a.phase}</span>
                  <span className="flex-1 truncate">{a.id}</span>
                  <span
                    className={[
                      "size-2 rounded-full",
                      st === "done" ? "bg-ok" : st === "running" ? "bg-info animate-pulse" : "bg-fg-subtle/40",
                    ].join(" ")}
                  />
                </li>
              );
            })}
          </ol>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4">
          <h3 className="text-sm font-semibold mb-3">Cycle log</h3>
          {log.length === 0 ? (
            <p className="text-sm text-fg-subtle">Run the 12-agent cycle to simulate collect → verify.</p>
          ) : (
            <pre className="text-xs font-mono text-fg-muted whitespace-pre-wrap max-h-64 overflow-y-auto">
              {log.join("\n")}
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
      <p className="text-xs text-fg-muted uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function TimelinePanel({
  q,
  setQ,
  items,
}: {
  q: string;
  setQ: (v: string) => void;
  items: typeof investigation.timeline;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Public chronology</h2>
        <label className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter timeline…"
            className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border bg-bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
      </div>
      <ol className="space-y-3">
        {items.map((t) => (
          <li
            key={t.date + t.event.slice(0, 24)}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs text-fg-subtle">{t.date}</span>
              <Tag t={t.tag} />
            </div>
            <p className="text-sm leading-relaxed">{t.event}</p>
            <p className="mt-1 text-xs text-fg-subtle">Source: {t.source}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function EntitiesPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Entity map</h2>
      <p className="text-sm text-fg-muted">
        Names appear from public filings and institutions. Association is not a finding of guilt.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {investigation.entities.map((e) => (
          <article
            key={e.name}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{e.name}</h3>
              <Tag t={e.tag} />
            </div>
            <p className="mt-1 text-sm text-fg-muted">{e.role}</p>
            <p className="mt-2 text-xs font-mono text-fg-subtle">{e.status}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function SourcesPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Official & secondary portals</h2>
      <ul className="space-y-2">
        {investigation.official_portals.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 hover:border-border-strong transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium flex items-center gap-2">
                  {s.name}
                  <ExternalLink className="size-3.5 text-fg-subtle" />
                </p>
                <p className="text-xs text-fg-muted mt-0.5">{s.note}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wide font-semibold text-fg-subtle">
                {s.tier}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClaimsPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Open questions (MAYBE)</h2>
      <p className="text-sm text-fg-muted">
        Tracked gaps for further public research — not conclusions.
      </p>
      <ul className="space-y-3">
        {investigation.open_questions.map((c) => (
          <li
            key={c.q}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
          >
            <div className="flex gap-2 items-start">
              <Tag t={c.tag} />
              <div>
                <p className="text-sm font-medium leading-relaxed">{c.q}</p>
                <p className="mt-1 text-xs text-fg-subtle">Next step: {c.next}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MethodsPanel() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold mb-3">Journalism methods</h2>
        <ul className="space-y-2">
          {investigation.methods.map((m) => (
            <li key={m} className="text-sm text-fg-muted flex gap-2">
              <Shield className="size-4 text-fg-subtle shrink-0 mt-0.5" />
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold mb-3">Skill atoms (sample)</h2>
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {maOsData.atoms.slice(0, 12).map((a) => (
            <li key={a.id} className="text-xs border border-border rounded-[var(--radius-sm)] p-2 bg-bg">
              <p className="font-mono font-medium">{a.skill}</p>
              <p className="text-fg-subtle mt-0.5 line-clamp-2">{a.capability}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AgentsPanel({ status }: { status: Record<string, "idle" | "running" | "done"> }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">MA-OS-12 agent pipeline</h2>
      <p className="text-sm text-fg-muted">
        The desk is powered by the 12-agent multi-agent OS: crawl public sources → distill →
        classify → ontology → skill tree → verify.
      </p>
      <div className="grid sm:grid-cols-2 gap-2">
        {maOsData.agents.map((a) => (
          <div
            key={a.id}
            className="rounded-[var(--radius-md)] border border-border bg-bg-elevated p-3 flex gap-3"
          >
            <span className="font-mono text-xs text-fg-subtle">{String(a.phase).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{a.id}</p>
              <p className="text-xs text-fg-muted truncate">{a.role}</p>
            </div>
            <span
              className={[
                "size-2 rounded-full mt-1.5",
                (status[a.id] ?? "idle") === "done"
                  ? "bg-ok"
                  : (status[a.id] ?? "idle") === "running"
                    ? "bg-info animate-pulse"
                    : "bg-fg-subtle/40",
              ].join(" ")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LinksPanel() {
  const L = investigation.live_links;
  const rows = [
    { label: "GitHub app source", url: L.github_app },
    { label: "Android debug APK release", url: L.apk_release },
    { label: "Android CI workflow", url: L.apk_ci },
    { label: "Swarm catalogs (MA-OS-12)", url: L.swarm_catalog },
    { label: "DOJ Epstein disclosures", url: L.doj_disclosures },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Live links</h2>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 hover:border-border-strong text-sm"
            >
              <span className="font-medium">{r.label}</span>
              <ExternalLink className="size-4 text-info shrink-0" />
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-fg-subtle">
        Grok App Builder publishes the web app to a public grok.me preview/production link when
        platform deploy runs. Vercel CLI token is not required for that path.
      </p>
    </div>
  );
}
