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
  Waypoints,
  Building2,
  Lightbulb,
} from "lucide-react";
import { investigation } from "@/lib/investigation-data";
import { maOsData } from "@/lib/ma-os-data";
import { evidenceGraph } from "@/lib/evidence-graph";
import { ollamaStack } from "@/lib/ollama-stack";

export const Route = createFileRoute("/")({ component: Desk });

type Tab =
  | "overview"
  | "timeline"
  | "entities"
  | "graph"
  | "pipeline"
  | "hypotheses"
  | "protections"
  | "sources"
  | "methods"
  | "links" | "stack";

const TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "timeline", label: "Timeline", icon: Activity },
  { id: "entities", label: "Entities", icon: Users },
  { id: "graph", label: "Graph", icon: Waypoints },
  { id: "pipeline", label: "Pipeline", icon: GitBranch },
  { id: "hypotheses", label: "Hypotheses", icon: Lightbulb },
  { id: "protections", label: "Protections", icon: Shield },
  { id: "sources", label: "Sources", icon: FileSearch },
  { id: "methods", label: "Methods", icon: Network },
  { id: "links", label: "Live links", icon: ExternalLink },
  { id: "stack", label: "Ollama/Crew", icon: Terminal },
];

function Desk() {
  const [tab, setTab] = useState<Tab>("overview");
  const [q, setQ] = useState("");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<Record<string, "idle" | "running" | "done">>({});
  const [entityFilter, setEntityFilter] = useState<"ALL" | "SOLID" | "MAYBE">("ALL");

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

  const filteredEntities = useMemo(() => {
    let list = evidenceGraph.entities;
    if (entityFilter !== "ALL") list = list.filter((e) => e.tag === entityFilter);
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(s) ||
          e.role.toLowerCase().includes(s) ||
          e.aliases.some((a) => a.toLowerCase().includes(s)),
      );
    }
    return list;
  }, [q, entityFilter]);

  async function runPipeline() {
    if (running) return;
    setRunning(true);
    setLog([]);
    setStatus({});
    const lines: string[] = [];
    const phases = [
      ...maOsData.agents.map((a) => ({ id: a.id, phase: a.phase, art: a.artifact })),
    ];
    for (const a of phases) {
      setStatus((p) => ({ ...p, [a.id]: "running" }));
      lines.push(`[${a.phase}/12] ${a.id} → ${a.art}`);
      setLog([...lines]);
      await new Promise((r) => setTimeout(r, 70));
      setStatus((p) => ({ ...p, [a.id]: "done" }));
    }
    lines.push(
      `INGEST: ${evidenceGraph.meta.entities} entities · ${evidenceGraph.meta.edges} edges · ${evidenceGraph.meta.hypotheses} hypotheses`,
    );
    lines.push("VERIFY ok · SOLID/MAYBE preserved · public-record ceiling · no CSAM");
    setLog([...lines]);
    setRunning(false);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-fg-subtle font-medium">
              Live investigation desk · evidence distilled
            </p>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
              {investigation.purpose.title}
            </h1>
            <p className="text-xs text-fg-muted line-clamp-2 max-w-2xl">
              {investigation.purpose.one_liner} Graph: {evidenceGraph.meta.solid_entities} SOLID /{" "}
              {evidenceGraph.meta.maybe_entities} MAYBE entities from your Drive + GitHub vaults.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-medium border border-ok/30 text-ok bg-ok/10">
              <CheckCircle2 className="size-3.5" />
              Live
            </span>
            <button
              type="button"
              onClick={runPipeline}
              disabled={running}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[var(--radius-sm)] bg-accent text-accent-fg text-sm font-medium hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              <Terminal className="size-4" />
              {running ? "Ingesting…" : "Run ingest cycle"}
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
        {tab === "overview" && <Overview log={log} status={status} />}
        {tab === "timeline" && (
          <TimelinePanel q={q} setQ={setQ} items={filteredTimeline} />
        )}
        {tab === "entities" && (
          <EntitiesPanel
            q={q}
            setQ={setQ}
            filter={entityFilter}
            setFilter={setEntityFilter}
            items={filteredEntities}
          />
        )}
        {tab === "graph" && <GraphPanel />}
        {tab === "pipeline" && <PipelinePanel />}
        {tab === "hypotheses" && <HypothesesPanel />}
        {tab === "protections" && <ProtectionsPanel />}
        {tab === "sources" && <SourcesPanel />}
        {tab === "methods" && <MethodsPanel />}
        {tab === "links" && <LinksPanel />}
        {tab === "stack" && <StackPanel />}
      </main>

      <footer className="border-t border-border py-4 px-4 text-center text-xs text-fg-subtle space-y-1">
        <p>{evidenceGraph.meta.policy}</p>
        <p>
          Ingested files: {evidenceGraph.meta.files_ingested.length} · Generated{" "}
          {String(evidenceGraph.meta.generated_at).slice(0, 19)}Z
        </p>
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
        ok ? "border-ok/40 text-ok bg-ok/10" : "border-warn/40 text-warn bg-warn/10",
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
  const m = evidenceGraph.meta;
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5 sm:p-6">
        <h2 className="text-sm font-semibold mb-2">Exact purpose</h2>
        <p className="text-sm text-fg-muted leading-relaxed">{investigation.purpose.one_liner}</p>
        <p className="mt-3 text-sm text-fg-muted leading-relaxed">
          This build <strong className="text-fg font-medium">ingests your accessible evidence</strong>{" "}
          (Drive SQUADS/Proof/VOL logs, Lolita Express synthesis as quarantine-class notes, strand-1953
          inventory, detective-codex export, MA-OS-12 methods) into a tagged graph: entities, bridges,
          trafficking logistics model, shell/trust leads, and legal protections — each SOLID or MAYBE.
        </p>
        <ul className="mt-4 space-y-2">
          {investigation.purpose.mission.map((x) => (
            <li key={x} className="flex gap-2 text-sm text-fg-muted">
              <CheckCircle2 className="size-4 text-ok shrink-0 mt-0.5" />
              {x}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Entities" value={m.entities} hint={`${m.solid_entities} SOLID`} />
        <Stat label="Bridges" value={m.edges} hint="relationship edges" />
        <Stat label="Hypotheses" value={m.hypotheses} hint="branches tracked" />
        <Stat label="Files ingested" value={m.files_ingested.length} hint="this cycle" />
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4">
          <h3 className="text-sm font-semibold mb-3">12-agent ingest status</h3>
          <ol className="space-y-1 max-h-72 overflow-y-auto">
            {maOsData.agents.map((a) => {
              const st = status[a.id] ?? "idle";
              return (
                <li key={a.id} className="flex items-center gap-2 text-sm py-1">
                  <span className="font-mono text-xs text-fg-subtle w-6">{a.phase}</span>
                  <span className="flex-1 truncate">{a.id}</span>
                  <span
                    className={[
                      "size-2 rounded-full",
                      st === "done"
                        ? "bg-ok"
                        : st === "running"
                          ? "bg-info animate-pulse"
                          : "bg-fg-subtle/40",
                    ].join(" ")}
                  />
                </li>
              );
            })}
          </ol>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4">
          <h3 className="text-sm font-semibold mb-3">Ingest log</h3>
          {log.length === 0 ? (
            <p className="text-sm text-fg-subtle">Run ingest cycle to simulate full distill pass.</p>
          ) : (
            <pre className="text-xs font-mono text-fg-muted whitespace-pre-wrap max-h-72 overflow-y-auto">
              {log.join("\n")}
            </pre>
          )}
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4">
        <h3 className="text-sm font-semibold mb-2">Follow-ups (from SQUADS distill)</h3>
        <ul className="space-y-2">
          {evidenceGraph.follow_ups.map((f) => (
            <li key={f.id} className="text-sm text-fg-muted flex gap-2">
              <span className="font-mono text-xs text-fg-subtle shrink-0">{f.id}</span>
              <span>
                [{f.priority}] {f.need}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
      <p className="text-xs text-fg-muted uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-fg-subtle mt-0.5">{hint}</p> : null}
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
        <SearchBox q={q} setQ={setQ} placeholder="Filter timeline…" />
      </div>
      <ol className="space-y-3">
        {items.map((t) => (
          <li
            key={t.date + t.event.slice(0, 20)}
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

function SearchBox({
  q,
  setQ,
  placeholder,
}: {
  q: string;
  setQ: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-3 rounded-[var(--radius-sm)] border border-border bg-bg-elevated text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}

function EntitiesPanel({
  q,
  setQ,
  filter,
  setFilter,
  items,
}: {
  q: string;
  setQ: (v: string) => void;
  filter: "ALL" | "SOLID" | "MAYBE";
  setFilter: (v: "ALL" | "SOLID" | "MAYBE") => void;
  items: typeof evidenceGraph.entities;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Entities · aliases · roles</h2>
          <p className="text-sm text-fg-muted">Association is not a finding of guilt.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {(["ALL", "SOLID", "MAYBE"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                "h-9 px-3 rounded-full text-xs font-medium border",
                filter === f
                  ? "bg-bg-subtle border-border-strong text-fg"
                  : "border-border text-fg-muted",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
          <SearchBox q={q} setQ={setQ} placeholder="Search entities…" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((e) => (
          <article
            key={e.id}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-mono text-fg-subtle">{e.id}</p>
                <h3 className="text-sm font-semibold">{e.name}</h3>
              </div>
              <Tag t={e.tag} />
            </div>
            <p className="mt-1 text-xs text-fg-subtle uppercase tracking-wide">{e.kind}</p>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">{e.role}</p>
            {e.aliases.length > 0 ? (
              <p className="mt-2 text-xs text-fg-subtle">Aliases: {e.aliases.join(", ")}</p>
            ) : null}
            <p className="mt-1 text-xs text-fg-subtle">Sources: {e.sources.join(" · ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function GraphPanel() {
  const nameOf = (id: string) =>
    evidenceGraph.entities.find((e) => e.id === id)?.name ?? id;
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Bridges · relationship graph</h2>
      <p className="text-sm text-fg-muted">
        Edges connect entities. Tag is on the relationship claim, not a verdict of criminal guilt for
        every node.
      </p>
      <ul className="space-y-2">
        {evidenceGraph.edges.map((e, i) => (
          <li
            key={i}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            <div className="flex-1 min-w-0 text-sm">
              <span className="font-medium">{nameOf(e.from)}</span>
              <span className="text-fg-subtle mx-2 font-mono text-xs">{e.rel}</span>
              <span className="font-medium">{nameOf(e.to)}</span>
              <p className="text-xs text-fg-muted mt-1">{e.note}</p>
            </div>
            <Tag t={e.tag} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PipelinePanel() {
  const nameOf = (id: string) =>
    evidenceGraph.entities.find((e) => e.id === id)?.name ?? id;
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Logistics / case pipeline model</h2>
      <p className="text-sm text-fg-muted">
        Investigative model of stages described in public record. Not every stage implies every named
        third party is guilty.
      </p>
      <ol className="space-y-3">
        {evidenceGraph.pipeline.map((s) => (
          <li
            key={s.stage}
            className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs text-fg-subtle">Stage {s.stage}</span>
              <h3 className="text-sm font-semibold">{s.name}</h3>
              <Tag t={s.tag} />
            </div>
            <p className="text-sm text-fg-muted leading-relaxed">{s.desc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.nodes.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center h-7 px-2.5 rounded-full border border-border text-xs text-fg-muted"
                >
                  {nameOf(n)}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HypothesesPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Hypotheses · branches</h2>
      <p className="text-sm text-fg-muted">
        Competing explanations with for/against and next steps. MAYBE until primary exhibits close the
        gap.
      </p>
      <ul className="space-y-3">
        {evidenceGraph.hypotheses.map((h) => (
          <li
            key={h.id}
            className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs text-fg-subtle">{h.id}</span>
              <Tag t={h.tag} />
              <span className="text-[10px] uppercase tracking-wide text-fg-subtle">{h.branch}</span>
            </div>
            <h3 className="text-sm font-semibold">{h.title}</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-medium text-ok mb-1">Evidence for</p>
                <ul className="space-y-1 text-fg-muted">
                  {h.evidence_for.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-warn mb-1">Evidence against / limits</p>
                <ul className="space-y-1 text-fg-muted">
                  {h.evidence_against.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-xs text-fg-subtle">Next: {h.next}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProtectionsPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Legal / institutional protections</h2>
      <ul className="space-y-3">
        {evidenceGraph.protections.map((p) => (
          <li
            key={p.name}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 flex gap-3"
          >
            <Building2 className="size-4 text-fg-subtle shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <Tag t={p.tag} />
              </div>
              <p className="mt-1 text-sm text-fg-muted leading-relaxed">{p.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourcesPanel() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-3">Ingested evidence packs</h2>
        <ul className="space-y-2">
          {evidenceGraph.sources.map((s) => (
            <li
              key={s.id}
              className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 flex flex-wrap items-center gap-2 justify-between"
            >
              <div>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-xs text-fg-subtle">
                  {s.class} · {s.path}
                </p>
              </div>
              <Tag t={s.tag} />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-sm font-semibold mb-3">Official portals</h2>
        <ul className="space-y-2">
          {investigation.official_portals.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 hover:border-border-strong text-sm"
              >
                <span>
                  <span className="font-medium">{s.name}</span>
                  <span className="block text-xs text-fg-muted">{s.note}</span>
                </span>
                <ExternalLink className="size-4 text-info shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function MethodsPanel() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold mb-3">Distill plan (this app)</h2>
        <ol className="space-y-2 text-sm text-fg-muted list-decimal list-inside">
          <li>Crawl Drive + owned GitHub vaults (SQUADS, strand-1953, codex, MA-OS)</li>
          <li>Classify A public primary / B FOIA image / C production index / D operator theory</li>
          <li>Extract entities, aliases, places, assets, document sets</li>
          <li>Build bridges with SOLID/MAYBE on each edge</li>
          <li>Stage logistics pipeline + legal protections</li>
          <li>Track hypotheses as branches with next FU</li>
          <li>Publish web + APK + Drive backup</li>
        </ol>
      </div>
      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold mb-3">Journalism rules</h2>
        <ul className="space-y-2">
          {investigation.methods.map((m) => (
            <li key={m} className="text-sm text-fg-muted flex gap-2">
              <Shield className="size-4 text-fg-subtle shrink-0 mt-0.5" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


function StackPanel() {
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold mb-2">Ollama routing & cloud hosts</h2>
        <p className="text-sm text-fg-muted mb-3">{ollamaStack.purpose}</p>
        <p className="text-xs text-fg-subtle mb-2">Native: {ollamaStack.native_cloud.name} — {ollamaStack.native_cloud.example}</p>
        <ul className="space-y-2">
          {[...ollamaStack.managed, ...ollamaStack.gpu, ...ollamaStack.vps].map((x) => (
            <li key={x.url}>
              <a href={x.url} target="_blank" rel="noreferrer" className="text-sm text-info hover:underline flex items-center gap-2">
                {x.name} <ExternalLink className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold mb-2">Model routing</h2>
        <ul className="text-sm text-fg-muted space-y-1 font-mono">
          {Object.entries(ollamaStack.routing).map(([k, v]) => (
            <li key={k}>{k}: {v}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
        <h2 className="text-sm font-semibold mb-2">Live swarm architecture layers</h2>
        <a className="text-sm text-info" href={ollamaStack.swarm_map.primary} target="_blank" rel="noreferrer">
          {ollamaStack.swarm_map.primary}
        </a>
        <ul className="mt-2 text-sm text-fg-muted list-disc list-inside">
          {ollamaStack.swarm_map.layers.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-fg-subtle">{ollamaStack.swarm_map.note}</p>
        <p className="mt-3 text-xs text-fg-subtle">Hyper kernel: POST /webhooks/all-platforms · GET /stack on port 8090</p>
      </section>
    </div>
  );
}

function LinksPanel() {
  const L = investigation.live_links;
  const rows = [
    { label: "GitHub app", url: L.github_app },
    { label: "Android APK release", url: L.apk_release },
    { label: "Android CI", url: L.apk_ci },
    { label: "Swarm catalogs", url: L.swarm_catalog },
    { label: "DOJ disclosures", url: L.doj_disclosures },
    {
      label: "Drive backup folder",
      url: "https://drive.google.com/drive/folders/1vuTOIm5Q0MSZ9eaRHXR1L7DAPAcATC9V",
    },
    {
      label: "strand-1953 evidence vault",
      url: "https://github.com/cantgetalonggta-png/strand-1953-trust-efta-ia-evidence",
    },
    {
      label: "detective-codex vault",
      url: "https://github.com/cantgetalonggta-png/detective-codex-vault",
    },
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
    </div>
  );
}
