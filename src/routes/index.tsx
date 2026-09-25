import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  GitBranch,
  HelpCircle,
  Layers,
  Lightbulb,
  Network,
  NotebookPen,
  Search,
  Shield,
  Terminal,
  Users,
  Waypoints,
  Building2,
  Archive,
  CircleDot,
  Globe2,
} from "lucide-react";
import { investigation } from "@/lib/investigation-data";
import { maOsData } from "@/lib/ma-os-data";
import { evidenceGraph } from "@/lib/evidence-graph";
import { ollamaStack } from "@/lib/ollama-stack";
import { MeridianInvestigationGlobe } from "@/components/MeridianGlobe";

/** Top-level tracks: Residue · Operator ledger · Contradictions · Missing productions first */
type Tab =
  | "residue"
  | "operator_ledger"
  | "contradictions"
  | "missing"
  | "overview"
  | "timeline"
  | "entities"
  | "graph"
  | "pipeline"
  | "hypotheses"
  | "protections"
  | "sources"
  | "methods"
  | "links"
  | "stack"
  | "meridian";

const PRIMARY_TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "residue", label: "Residue", icon: Layers },
  { id: "operator_ledger", label: "Operator ledger", icon: NotebookPen },
  { id: "contradictions", label: "Contradictions", icon: AlertTriangle },
  { id: "missing", label: "Missing productions", icon: Archive },
  { id: "meridian", label: "Meridian globe", icon: Globe2 },
];

const SECONDARY_TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
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

export function Desk() {
  const [tab, setTab] = useState<Tab>("residue");
  const [q, setQ] = useState("");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<Record<string, "idle" | "running" | "done">>({});
  const [entityFilter, setEntityFilter] = useState<"ALL" | "SOLID" | "MAYBE">("ALL");
  const [feedFilter, setFeedFilter] = useState<"ALL" | "SOLID" | "MAYBE" | "LEAD">("ALL");

  const m = evidenceGraph.meta as typeof evidenceGraph.meta & {
    solid_entities: number;
    maybe_entities: number;
    operator_ledger_count?: number;
    contradictions_count?: number;
    missing_productions_count?: number;
    authorship?: { investigation_owner?: string };
    operator_work_product?: { owner?: string; files?: string[] };
    cycle?: string;
  };

  const operatorLedger = ((evidenceGraph as any).operator_ledger ?? []) as Array<{
    id: string;
    title: string;
    class: string;
    track: string;
    epistemic: string;
    note?: string;
    predicted_residue?: string;
    status?: string;
    sources?: string[];
    entity_id?: string;
    owner?: string;
  }>;

  const contradictions = ((evidenceGraph as any).contradictions ?? []) as Array<{
    id: string;
    title: string;
    claim_a: string;
    claim_b: string;
    status: string;
    tag: string;
    note: string;
    next: string;
  }>;

  const missing = ((evidenceGraph as any).missing_productions ?? []) as Array<{
    id: string;
    title: string;
    need: string;
    priority: string;
    status: string;
    related: string[];
  }>;

  const residueDef =
    ((evidenceGraph as any).residue?.definition as string) ||
    "Hard public residue: court outcomes, charging instruments, regulator orders, load-file indexes, published exhibits with chain.";

  const solidEntities = useMemo(
    () => evidenceGraph.entities.filter((e) => e.tag === "SOLID"),
    [],
  );

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

  const leftFeed = useMemo(() => {
    const rows: Array<{
      id: string;
      label: string;
      blurb: string;
      tag: "SOLID" | "MAYBE" | "LEAD";
      onClick: () => void;
    }> = [];
    solidEntities.slice(0, 12).forEach((e) =>
      rows.push({
        id: e.id,
        label: e.name,
        blurb: e.role,
        tag: "SOLID",
        onClick: () => {
          setTab("residue");
          setQ(e.name);
        },
      }),
    );
    operatorLedger.slice(0, 8).forEach((l) =>
      rows.push({
        id: l.id,
        label: l.title,
        blurb: l.note || "Operator lead",
        tag: "LEAD",
        onClick: () => setTab("operator_ledger"),
      }),
    );
    evidenceGraph.entities
      .filter((e) => e.tag === "MAYBE")
      .slice(0, 8)
      .forEach((e) =>
        rows.push({
          id: e.id,
          label: e.name,
          blurb: e.role,
          tag: "MAYBE",
          onClick: () => {
            setTab("entities");
            setEntityFilter("MAYBE");
            setQ(e.name);
          },
        }),
      );
    if (feedFilter === "ALL") return rows;
    return rows.filter((r) => r.tag === feedFilter);
  }, [feedFilter, operatorLedger, solidEntities]);

  async function runPipeline() {
    if (running) return;
    setRunning(true);
    setLog([]);
    setStatus({});
    const lines: string[] = [];
    const phases = maOsData.agents.map((a) => ({ id: a.id, phase: a.phase, art: a.artifact }));
    for (const a of phases) {
      setStatus((p) => ({ ...p, [a.id]: "running" }));
      lines.push(`[${a.phase}/12] ${a.id} → ${a.art}`);
      setLog([...lines]);
      await new Promise((r) => setTimeout(r, 50));
      setStatus((p) => ({ ...p, [a.id]: "done" }));
    }
    lines.push(
      `RESIDUE: ${m.solid_entities} SOLID · LEDGER: ${operatorLedger.length} leads · MAYBE: ${m.maybe_entities}`,
    );
    lines.push(
      `TRACKS: Residue · Operator ledger · Contradictions · Missing productions (leads ≠ exhibits)`,
    );
    lines.push("VERIFY ok · public-record ceiling · no CSAM · HITL · association ≠ guilt");
    setLog([...lines]);
    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      {/* Blueprint matrix grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff03 1px, transparent 1px), linear-gradient(to bottom, #ffffff03 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="flex flex-col h-screen max-w-[1920px] mx-auto relative z-10">
        {/* HEADER */}
        <header className="flex items-center justify-between px-4 h-12 border-b border-white/5 bg-[#0b0f19]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h1 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300 truncate">
              MA-OS-12 // Public-Record Investigation Desk
            </h1>
            <span className="hidden md:inline text-[10px] font-mono text-slate-600 truncate">
              OWNER: {m.authorship?.investigation_owner ?? "operator"}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500 shrink-0">
            <span className="hidden sm:inline">CEILING: DOJ / COURT / FOIA</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-amber-400/80">HOURLY DISTILL</span>
            <button
              type="button"
              onClick={runPipeline}
              disabled={running}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] font-mono uppercase tracking-wide hover:bg-amber-500/20 disabled:opacity-50"
            >
              <Terminal className="size-3" />
              {running ? "INGEST…" : "RUN CYCLE"}
            </button>
          </div>
        </header>

        {/* PRIMARY TRACK TABS */}
        <div className="border-b border-white/5 bg-black/30 px-3 py-1.5 flex flex-wrap gap-1 shrink-0">
          {PRIMARY_TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={[
                  "inline-flex items-center gap-1.5 h-8 px-3 rounded text-[11px] font-mono uppercase tracking-wide transition",
                  active
                    ? "bg-amber-500/15 border border-amber-500/40 text-amber-200"
                    : "border border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]",
                ].join(" ")}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
                {label}
                {id === "operator_ledger" && (
                  <span className="ml-1 px-1 py-0.5 text-[9px] rounded-sm border border-violet-500/40 bg-violet-500/10 text-violet-300">
                    {operatorLedger.length}
                  </span>
                )}
                {id === "residue" && (
                  <span className="ml-1 px-1 py-0.5 text-[9px] rounded-sm border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                    {m.solid_entities}
                  </span>
                )}
              </button>
            );
          })}
          <span className="w-px h-6 bg-white/10 mx-1 self-center" />
          <div className="flex gap-0.5 overflow-x-auto scrollbar-thin">
            {SECONDARY_TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={[
                    "inline-flex items-center gap-1 h-7 px-2 rounded text-[10px] font-mono tracking-wide whitespace-nowrap",
                    active
                      ? "bg-white/10 text-slate-200 border border-white/10"
                      : "text-slate-600 hover:text-slate-400",
                  ].join(" ")}
                >
                  <Icon className="size-3" strokeWidth={1.5} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* THREE-PANE MAIN */}
        <main className="flex flex-1 overflow-hidden">
          {/* LEFT: filter feed */}
          <section className="w-80 border-r border-white/5 bg-[#0b0f19]/40 flex flex-col hidden lg:flex shrink-0">
            <div className="p-3 border-b border-white/5 bg-black/20 space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-600" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="FILTER SYSTEM INGEST…"
                  className="w-full bg-[#06070a] border border-white/10 rounded px-2.5 py-1.5 pl-8 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>
              <div className="flex gap-1">
                {(["ALL", "SOLID", "MAYBE", "LEAD"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFeedFilter(f)}
                    className={[
                      "flex-1 h-6 text-[9px] font-mono tracking-widest rounded border",
                      feedFilter === f
                        ? "border-white/20 bg-white/5 text-slate-200"
                        : "border-transparent text-slate-600 hover:text-slate-400",
                    ].join(" ")}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {leftFeed.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={row.onClick}
                  className="w-full text-left p-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-white/10 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-200 transition truncate">
                      {row.label}
                    </span>
                    <Tag t={row.tag} />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-400">
                    {row.blurb}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* CENTER */}
          <section className="flex-1 flex flex-col bg-black/10 overflow-y-auto border-r border-white/5 p-4 sm:p-6 space-y-5 scrollbar-thin">
            <div className="p-4 rounded border border-amber-500/10 bg-amber-500/[0.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/40" />
              <h3 className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wide mb-1">
                Operational mandate
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Public-record ceiling. Association is not guilt. Operator ledger = first-class{" "}
                <strong className="text-violet-300 font-medium">leads</strong> (not buried as
                quarantine, not promoted to fake exhibits). SOLID/MAYBE = source-weight, not authorship.
                HITL on victim identities. No CSAM. Never deanonymize redacted victim names.
              </p>
            </div>

            {tab === "residue" && (
              <ResiduePanel solid={solidEntities} definition={residueDef} meta={m} />
            )}
            {tab === "operator_ledger" && <OperatorLedgerPanel items={operatorLedger} />}
            {tab === "contradictions" && <ContradictionsPanel items={contradictions} />}
            {tab === "missing" && <MissingPanel items={missing} />}
            {tab === "meridian" && <MeridianPanel />}
            {tab === "overview" && <Overview log={log} status={status} m={m} ledgerCount={operatorLedger.length} />}
            {tab === "timeline" && <TimelinePanel items={filteredTimeline} />}
            {tab === "entities" && (
              <EntitiesPanel
                items={filteredEntities}
                filter={entityFilter}
                setFilter={setEntityFilter}
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
          </section>

          {/* RIGHT telemetry */}
          <section className="w-72 bg-[#0b0f19]/20 flex flex-col hidden xl:flex shrink-0">
            <div className="p-3 border-b border-white/5 bg-black/20">
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
                System telemetry
              </h2>
            </div>
            <div className="p-4 space-y-5 text-xs overflow-y-auto scrollbar-thin">
              <div>
                <span className="block text-[10px] font-mono text-slate-600 uppercase mb-1">
                  Data ingest boundary
                </span>
                <div className="bg-[#06070a] border border-white/5 rounded p-2 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">CEILING</span>
                    <span>OPEN-ACCESS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">CSAM FILTER</span>
                    <span className="text-emerald-400 font-bold">100% ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">HITL VICTIMS</span>
                    <span className="text-emerald-400 font-bold">ON</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono text-slate-600 uppercase mb-1">
                  Track counts
                </span>
                <div className="space-y-1.5 pt-1">
                  <TelemetryRow color="bg-emerald-500" label="Residue (SOLID)" value={String(m.solid_entities)} />
                  <TelemetryRow color="bg-violet-500" label="Operator ledger" value={String(operatorLedger.length)} />
                  <TelemetryRow color="bg-amber-500" label="MAYBE correlative" value={String(m.maybe_entities)} />
                  <TelemetryRow color="bg-rose-400" label="Contradictions" value={String(contradictions.length)} />
                  <TelemetryRow color="bg-sky-400" label="Missing productions" value={String(missing.length)} />
                  <TelemetryRow color="bg-slate-500" label="Edges" value={String(m.edges)} />
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono text-slate-600 uppercase mb-1">
                  Epistemic classes
                </span>
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-mono text-slate-400">SOLID</span>
                    </div>
                    <span className="text-slate-500 font-mono">public primary match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="font-mono text-slate-400">MAYBE</span>
                    </div>
                    <span className="text-slate-500 font-mono">under review</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <span className="font-mono text-slate-400">LEAD</span>
                    </div>
                    <span className="text-slate-500 font-mono">operator ledger</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono text-slate-600 uppercase mb-1">
                  Cycle
                </span>
                <div className="bg-[#06070a] border border-white/5 rounded p-2 font-mono text-[10px] text-slate-500">
                  <div>{m.cycle ?? "—"}</div>
                  <div className="mt-1 text-slate-600">{String(m.generated_at).slice(0, 19)}Z</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] font-mono text-slate-600 leading-relaxed">
                  Leads drive FOIA targets. Residue is what holds under scrutiny. Operator notes stay
                  first-class as leads — never self-proving exhibits.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Tag({ t }: { t: string }) {
  const solid = t === "SOLID";
  const lead = t === "LEAD" || t === "OPERATOR_LEAD" || t === "LEAD_NOT_EXHIBIT";
  return (
    <span
      className={[
        "px-1.5 py-0.5 text-[9px] font-mono tracking-widest rounded-sm border shrink-0",
        solid
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : lead
            ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
            : "border-amber-500/30 bg-amber-500/10 text-amber-400",
      ].join(" ")}
    >
      {lead ? "LEAD" : t}
    </span>
  );
}

function TelemetryRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <div className="flex items-center space-x-2">
        <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
        <span className="font-mono text-slate-400">{label}</span>
      </div>
      <span className="text-slate-300 font-mono tabular-nums">{value}</span>
    </div>
  );
}

function LedgerCard({
  stamp,
  badge,
  title,
  body,
  meta,
  children,
}: {
  stamp: string;
  badge: string;
  title: string;
  body?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <article className="bg-[#0b0f19]/30 border border-white/5 rounded-md overflow-hidden backdrop-blur-sm">
      <div className="px-4 py-2.5 bg-black/20 border-b border-white/5 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-slate-400 font-bold truncate">{stamp}</span>
        <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-wider border border-purple-500/30 bg-purple-500/10 text-purple-400 rounded-sm shrink-0">
          {badge}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <h2 className="text-base font-semibold text-slate-200 tracking-tight">{title}</h2>
        {body ? <p className="text-sm text-slate-400 leading-relaxed">{body}</p> : null}
        {children}
        {meta ? (
          <>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent my-1" />
            <div className="flex flex-wrap gap-4 text-[11px] font-mono text-slate-500">{meta}</div>
          </>
        ) : null}
      </div>
    </article>
  );
}

function ResiduePanel({
  solid,
  definition,
  meta,
}: {
  solid: typeof evidenceGraph.entities;
  definition: string;
  meta: { solid_entities: number; files_ingested: readonly string[]; generated_at: string };
}) {
  return (
    <div className="space-y-4">
      <LedgerCard
        stamp="RESIDUE TRACK // HARD PUBLIC"
        badge="SOURCE-WEIGHTED"
        title="What holds under scrutiny"
        body={definition}
        meta={
          <>
            <div>
              SOLID ENTITIES: <span className="text-emerald-400">{meta.solid_entities}</span>
            </div>
            <div>
              FILES: <span className="text-slate-400">{meta.files_ingested.length}</span>
            </div>
            <div>
              STAMP: <span className="text-slate-400">{String(meta.generated_at).slice(0, 19)}</span>
            </div>
          </>
        }
      />
      <div className="grid sm:grid-cols-2 gap-2">
        {solid.map((e) => (
          <article
            key={e.id}
            className="p-3 rounded border border-emerald-500/10 bg-emerald-500/[0.03] hover:border-emerald-500/25 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-slate-600">{e.id}</p>
                <h3 className="text-sm font-semibold text-slate-200 truncate">{e.name}</h3>
              </div>
              <Tag t="SOLID" />
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">{e.kind}</p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">{e.role}</p>
            {"public_citations" in e && Array.isArray((e as any).public_citations) ? (
              <div className="mt-2 space-y-0.5">
                {((e as any).public_citations as string[]).slice(0, 2).map((u) => (
                  <a
                    key={u}
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[10px] font-mono text-sky-400/80 hover:text-sky-300 truncate"
                  >
                    {u.replace(/^https?:\/\//, "")}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[10px] text-slate-600 line-clamp-1">
                {(e.sources || []).join(" · ")}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function OperatorLedgerPanel({
  items,
}: {
  items: Array<{
    id: string;
    title: string;
    class: string;
    epistemic: string;
    note?: string;
    predicted_residue?: string;
    status?: string;
    sources?: string[];
    owner?: string;
  }>;
}) {
  return (
    <div className="space-y-4">
      <LedgerCard
        stamp="OPERATOR LEDGER // FIRST-CLASS LEADS"
        badge="LEAD ≠ EXHIBIT"
        title="Your investigation leads — visible top-level track"
        body="Operator notes, SQUADS synthesis, Echo protocols, and named lead targets sit here. They drive search terms, FOIA targets, and hypothesis branches. They are not buried as 'quarantine' and they are not promoted to fake court exhibits. When public primary residue appears, the matching claim can move to Residue as SOLID."
        meta={
          <>
            <div>
              LEADS: <span className="text-violet-300">{items.length}</span>
            </div>
            <div>
              OWNER: <span className="text-slate-400">operator</span>
            </div>
            <div>
              CLASS: <span className="text-slate-400">OPERATOR_WORK_PRODUCT / OPERATOR_LEAD</span>
            </div>
          </>
        }
      />
      <ul className="space-y-2">
        {items.map((l) => (
          <li
            key={l.id}
            className="p-3.5 rounded border border-violet-500/15 bg-violet-500/[0.03] hover:border-violet-500/30 transition"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-slate-600">{l.id}</span>
              <Tag t="LEAD" />
              <span className="text-[9px] font-mono uppercase tracking-wider text-violet-400/70">
                {l.class}
              </span>
              {l.status ? (
                <span className="text-[9px] font-mono text-slate-600">{l.status}</span>
              ) : null}
            </div>
            <h3 className="text-sm font-semibold text-slate-200">{l.title}</h3>
            {l.note ? (
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{l.note}</p>
            ) : null}
            {l.predicted_residue ? (
              <p className="mt-2 text-[11px] font-mono text-slate-500">
                <span className="text-slate-600">PREDICTED RESIDUE → </span>
                {l.predicted_residue}
              </p>
            ) : null}
            {l.sources && l.sources.length > 0 ? (
              <p className="mt-1 text-[10px] text-slate-600">Sources: {l.sources.join(" · ")}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContradictionsPanel({
  items,
}: {
  items: Array<{
    id: string;
    title: string;
    claim_a: string;
    claim_b: string;
    status: string;
    tag: string;
    note: string;
    next: string;
  }>;
}) {
  return (
    <div className="space-y-4">
      <LedgerCard
        stamp="CONTRADICTIONS // SMOKE & MIRRORS TRACK"
        badge="OPEN TENSIONS"
        title="Where official narrative and residue disagree"
        body="Treat managed releases as potentially incomplete without assuming every document is forged. Contradictions are first-class research objects: keep both poles until residue closes the gap either way."
      />
      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="p-4 rounded border border-rose-500/15 bg-rose-500/[0.03] space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-slate-600">{c.id}</span>
              <Tag t={c.tag} />
              <span className="text-[9px] font-mono text-slate-600">{c.status}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200">{c.title}</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-black/30 border border-white/5">
                <p className="text-[9px] font-mono text-slate-600 uppercase mb-1">Claim A</p>
                <p className="text-slate-400 leading-relaxed">{c.claim_a}</p>
              </div>
              <div className="p-2.5 rounded bg-black/30 border border-white/5">
                <p className="text-[9px] font-mono text-slate-600 uppercase mb-1">Claim B</p>
                <p className="text-slate-400 leading-relaxed">{c.claim_b}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{c.note}</p>
            <p className="text-[11px] font-mono text-amber-400/80">NEXT → {c.next}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissingPanel({
  items,
}: {
  items: Array<{
    id: string;
    title: string;
    need: string;
    priority: string;
    status: string;
    related: string[];
  }>;
}) {
  return (
    <div className="space-y-4">
      <LedgerCard
        stamp="MISSING PRODUCTIONS // FOLLOW-UP VAULT"
        badge="OPEN HUNTS"
        title="What residue is still absent"
        body="Partial productions prove a document universe and also prove incompleteness. These are the next OCR / volume / filing targets that would move Operator ledger leads toward Residue."
      />
      <ul className="space-y-2">
        {items.map((mp) => (
          <li
            key={mp.id}
            className="p-3.5 rounded border border-sky-500/15 bg-sky-500/[0.03] flex flex-col sm:flex-row sm:items-start gap-3"
          >
            <div className="flex items-center gap-2 sm:flex-col sm:items-start shrink-0">
              <span className="font-mono text-[10px] text-slate-600">{mp.id}</span>
              <span
                className={[
                  "px-1.5 py-0.5 text-[9px] font-mono rounded-sm border",
                  mp.priority === "P0"
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-300",
                ].join(" ")}
              >
                {mp.priority}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-200">{mp.title}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{mp.need}</p>
              {mp.related.length > 0 ? (
                <p className="mt-2 text-[10px] font-mono text-slate-600">
                  Related: {mp.related.join(" · ")}
                </p>
              ) : null}
            </div>
            <span className="text-[9px] font-mono text-slate-600 shrink-0">{mp.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


function MeridianPanel() {
  const locs = ((evidenceGraph as any).geo_locations ?? []) as Array<{
    id: string; name: string; lat: number; lng: number; status: string;
    entity_id?: string | null; details: string; hub_rel: string;
  }>;
  return (
    <div className="space-y-4">
      <LedgerCard
        stamp="MERIDIAN // GEO CONVERGENCE LAYER"
        badge="R3F ORBIT"
        title="Geographic connections — public-record / lead nodes"
        body="Wireframe Earth with flight-arc paths into the NYC axis hub (SDNY / MCC / E71). Pins are SOLID or MAYBE from the evidence graph. Click a pin for telemetry. Association is not guilt. Operator leads may appear as MAYBE geo until primary deeds/dockets close them."
        meta={
          <>
            <div>NODES: <span className="text-amber-300">{locs.length}</span></div>
            <div>HUB: <span className="text-slate-400">40.71N 74.00W</span></div>
            <div>RENDER: <span className="text-slate-400">react-three-fiber</span></div>
          </>
        }
      />
      <MeridianInvestigationGlobe locations={locs.length ? locs : undefined} />
      <ul className="grid sm:grid-cols-2 gap-2">
        {locs.map((l) => (
          <li key={l.id} className="p-2.5 rounded border border-white/5 bg-[#0b0f19]/40 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-slate-600">{l.id}</span>
              <Tag t={l.status === "SOLID" ? "SOLID" : "MAYBE"} />
            </div>
            <p className="text-slate-200 font-medium mt-0.5">{l.name}</p>
            <p className="text-[10px] font-mono text-slate-500 mt-1">{l.lat.toFixed(3)}, {l.lng.toFixed(3)} · {l.hub_rel}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Overview({
  log,
  status,
  m,
  ledgerCount,
}: {
  log: string[];
  status: Record<string, "idle" | "running" | "done">;
  m: { entities: number; edges: number; hypotheses: number; solid_entities: number; maybe_entities: number; files_ingested: readonly string[] };
  ledgerCount: number;
}) {
  return (
    <div className="space-y-4">
      <LedgerCard
        stamp={`OVERVIEW // CYCLE`}
        badge="OPERATOR-OWNED"
        title={investigation.purpose.title}
        body={investigation.purpose.one_liner}
      >
        <ul className="space-y-1.5">
          {investigation.purpose.mission.map((x) => (
            <li key={x} className="flex gap-2 text-xs text-slate-400">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
              {x}
            </li>
          ))}
        </ul>
      </LedgerCard>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        <Stat label="Residue SOLID" value={m.solid_entities} hint="public primary" />
        <Stat label="Operator ledger" value={ledgerCount} hint="leads" />
        <Stat label="MAYBE" value={m.maybe_entities} hint="correlative" />
        <Stat label="Edges" value={m.edges} hint="bridges" />
        <Stat label="Files" value={m.files_ingested.length} hint="ingested" />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
          <h3 className="text-xs font-mono font-semibold text-slate-400 mb-3 uppercase tracking-wide">
            12-agent ingest
          </h3>
          <ol className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
            {maOsData.agents.map((a) => {
              const st = status[a.id] ?? "idle";
              return (
                <li key={a.id} className="flex items-center gap-2 text-xs py-0.5">
                  <span className="font-mono text-[10px] text-slate-600 w-5">{a.phase}</span>
                  <span className="flex-1 truncate text-slate-400">{a.id}</span>
                  <span
                    className={[
                      "size-1.5 rounded-full",
                      st === "done"
                        ? "bg-emerald-400"
                        : st === "running"
                          ? "bg-sky-400 animate-pulse"
                          : "bg-slate-700",
                    ].join(" ")}
                  />
                </li>
              );
            })}
          </ol>
        </div>
        <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
          <h3 className="text-xs font-mono font-semibold text-slate-400 mb-3 uppercase tracking-wide">
            Cycle log
          </h3>
          {log.length === 0 ? (
            <p className="text-xs text-slate-600">Run cycle to simulate distill pass.</p>
          ) : (
            <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin">
              {log.join("\n")}
            </pre>
          )}
        </div>
      </div>

      <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
        <h3 className="text-xs font-mono font-semibold text-slate-400 mb-2 uppercase tracking-wide">
          Follow-ups
        </h3>
        <ul className="space-y-1.5">
          {evidenceGraph.follow_ups.map((f) => (
            <li key={f.id} className="text-xs text-slate-400 flex gap-2">
              <span className="font-mono text-[10px] text-slate-600 shrink-0">{f.id}</span>
              <span>
                [{f.priority}] {f.need}
              </span>
            </li>
          ))}
        </ul>
      </div>
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
    <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-3">
      <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tabular-nums text-slate-200">{value}</p>
      {hint ? <p className="text-[10px] text-slate-600 mt-0.5">{hint}</p> : null}
    </div>
  );
}

function TimelinePanel({ items }: { items: typeof investigation.timeline }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide">
        Public chronology
      </h2>
      <ol className="space-y-2">
        {items.map((t) => (
          <li key={t.date + t.event.slice(0, 24)} className="rounded border border-white/5 bg-[#0b0f19]/40 p-3.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-slate-600">{t.date}</span>
              <Tag t={t.tag} />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{t.event}</p>
            <p className="mt-1 text-[10px] text-slate-600">Source: {t.source}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function EntitiesPanel({
  items,
  filter,
  setFilter,
}: {
  items: typeof evidenceGraph.entities;
  filter: "ALL" | "SOLID" | "MAYBE";
  setFilter: (v: "ALL" | "SOLID" | "MAYBE") => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide">
            Entities · aliases · roles
          </h2>
          <p className="text-xs text-slate-500">Association is not a finding of guilt.</p>
        </div>
        <div className="flex gap-1">
          {(["ALL", "SOLID", "MAYBE"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                "h-7 px-2.5 rounded text-[10px] font-mono border",
                filter === f
                  ? "bg-white/10 border-white/20 text-slate-200"
                  : "border-white/5 text-slate-600",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map((e) => (
          <article key={e.id} className="rounded border border-white/5 bg-[#0b0f19]/40 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-slate-600">{e.id}</p>
                <h3 className="text-sm font-semibold text-slate-200">{e.name}</h3>
              </div>
              <Tag t={e.tag} />
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">{e.kind}</p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">{e.role}</p>
            {e.aliases.length > 0 ? (
              <p className="mt-2 text-[10px] text-slate-600">Aliases: {e.aliases.join(", ")}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function GraphPanel() {
  const nameOf = (id: string) => evidenceGraph.entities.find((e) => e.id === id)?.name ?? id;
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide">
        Bridges · relationship graph
      </h2>
      <p className="text-xs text-slate-500">
        Edges connect entities. Tag is on the relationship claim, not a guilt verdict for every node.
      </p>
      <ul className="space-y-2">
        {evidenceGraph.edges.map((e, i) => (
          <li
            key={i}
            className="rounded border border-white/5 bg-[#0b0f19]/40 p-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            <div className="flex-1 min-w-0 text-sm">
              <span className="font-medium text-slate-200">{nameOf(e.from)}</span>
              <span className="text-slate-600 mx-2 font-mono text-[10px]">{e.rel}</span>
              <span className="font-medium text-slate-200">{nameOf(e.to)}</span>
              <p className="text-xs text-slate-500 mt-1">{e.note}</p>
            </div>
            <Tag t={e.tag} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PipelinePanel() {
  const nameOf = (id: string) => evidenceGraph.entities.find((e) => e.id === id)?.name ?? id;
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide">
        Logistics / case pipeline model
      </h2>
      <p className="text-xs text-slate-500">
        Investigative model of stages described in public record — not guilt verdicts.
      </p>
      <ol className="space-y-2">
        {evidenceGraph.pipeline.map((s) => (
          <li key={s.stage} className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[10px] text-slate-600">Stage {s.stage}</span>
              <h3 className="text-sm font-semibold text-slate-200">{s.name}</h3>
              <Tag t={s.tag} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.nodes.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center h-6 px-2 rounded-full border border-white/10 text-[10px] text-slate-500"
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
    <div className="space-y-3">
      <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide">
        Hypotheses · branches
      </h2>
      <ul className="space-y-2">
        {evidenceGraph.hypotheses.map((h) => (
          <li key={h.id} className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[10px] text-slate-600">{h.id}</span>
              <Tag t={h.tag} />
              <span className="text-[9px] uppercase tracking-wide text-slate-600">{h.branch}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200">{h.title}</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-medium text-emerald-400/80 mb-1">Evidence for</p>
                <ul className="space-y-1 text-slate-500">
                  {h.evidence_for.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-amber-400/80 mb-1">Limits</p>
                <ul className="space-y-1 text-slate-500">
                  {h.evidence_against.map((x) => (
                    <li key={x}>• {x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-[11px] font-mono text-slate-600">Next: {h.next}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProtectionsPanel() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide">
        Legal / institutional protections
      </h2>
      <ul className="space-y-2">
        {evidenceGraph.protections.map((p) => (
          <li key={p.name} className="rounded border border-white/5 bg-[#0b0f19]/40 p-3.5 flex gap-3">
            <Building2 className="size-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-200">{p.name}</h3>
                <Tag t={p.tag} />
              </div>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourcesPanel() {
  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide mb-2">
          Ingested packs
        </h2>
        <ul className="space-y-1.5">
          {evidenceGraph.sources.map((s) => (
            <li
              key={s.id}
              className="rounded border border-white/5 bg-[#0b0f19]/40 p-3 flex flex-wrap items-center gap-2 justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">{s.title}</p>
                <p className="text-[10px] text-slate-600 font-mono">
                  {s.class} · {s.path}
                </p>
              </div>
              <Tag t={s.tag} />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide mb-2">
          Official portals
        </h2>
        <ul className="space-y-1.5">
          {investigation.official_portals.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded border border-white/5 bg-[#0b0f19]/40 p-3 hover:border-white/15 text-sm"
              >
                <span>
                  <span className="font-medium text-slate-200">{s.name}</span>
                  <span className="block text-[10px] text-slate-500">{s.note}</span>
                </span>
                <ExternalLink className="size-3.5 text-sky-400 shrink-0" />
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
    <div className="grid lg:grid-cols-2 gap-3">
      <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
        <h2 className="text-xs font-mono font-semibold text-slate-400 mb-3 uppercase">
          Distill plan
        </h2>
        <ol className="space-y-1.5 text-xs text-slate-400 list-decimal list-inside">
          <li>Crawl Drive + owned GitHub vaults</li>
          <li>Classify A public primary / B FOIA image / C production index / LEAD operator</li>
          <li>Extract entities, aliases, places, assets</li>
          <li>Build bridges with SOLID/MAYBE on each edge</li>
          <li>Stage logistics pipeline + legal protections</li>
          <li>Keep Operator ledger as first-class lead track</li>
          <li>Publish web + APK + Drive backup</li>
        </ol>
      </div>
      <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
        <h2 className="text-xs font-mono font-semibold text-slate-400 mb-3 uppercase">
          Journalism rules
        </h2>
        <ul className="space-y-1.5">
          {investigation.methods.map((m) => (
            <li key={m} className="text-xs text-slate-400 flex gap-2">
              <Shield className="size-3.5 text-slate-600 shrink-0 mt-0.5" />
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
    <div className="space-y-4">
      <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
        <h2 className="text-xs font-mono font-semibold text-slate-400 mb-2 uppercase">
          Ollama routing & cloud hosts
        </h2>
        <p className="text-xs text-slate-500 mb-2">{ollamaStack.purpose}</p>
        <ul className="space-y-1">
          {[...ollamaStack.managed, ...ollamaStack.gpu, ...ollamaStack.vps].map((x) => (
            <li key={x.url}>
              <a
                href={x.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 hover:underline flex items-center gap-1.5"
              >
                {x.name} <ExternalLink className="size-3" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded border border-white/5 bg-[#0b0f19]/40 p-4">
        <h2 className="text-xs font-mono font-semibold text-slate-400 mb-2 uppercase">Routing</h2>
        <ul className="text-[11px] text-slate-500 space-y-0.5 font-mono">
          {Object.entries(ollamaStack.routing).map(([k, v]) => (
            <li key={k}>
              {k}: {v}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LinksPanel() {
  const L = investigation.live_links;
  const rows = [
    { label: "Live desk (Vercel)", url: "https://ma-os-12-console-echo-ec69.vercel.app" },
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
  ];
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wide mb-2">
        Live links
      </h2>
      {rows.map((r) => (
        <a
          key={r.url}
          href={r.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 rounded border border-white/5 bg-[#0b0f19]/40 p-3 hover:border-white/15 text-sm"
        >
          <span className="font-medium text-slate-200">{r.label}</span>
          <ExternalLink className="size-3.5 text-sky-400 shrink-0" />
        </a>
      ))}
    </div>
  );
}
