import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Network,
  Search,
  Shield,
  Terminal,
  Users,
} from "lucide-react";
import { investigation } from "@/lib/investigation-data";
import { maOsData } from "@/lib/ma-os-data";

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
  { id: "claims", label: "Open Qs", icon: Shield },
  { id: "methods", label: "Methods", icon: Network },
  { id: "agents", label: "MA-OS-12", icon: Terminal },
  { id: "links", label: "Live links", icon: ExternalLink },
];

export function Desk() {
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
      await new Promise((r) => setTimeout(r, 60));
      setStatus((p) => ({ ...p, [a.id]: "done" }));
    }
    lines.push("VERIFY ok · SOLID/MAYBE · public-record ceiling · association ≠ guilt");
    setLog([...lines]);
    setRunning(false);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-fg-subtle font-medium">
              Public-record investigation desk · MA-OS-12
            </p>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
              {investigation.purpose.title}
            </h1>
            <p className="text-xs text-fg-muted line-clamp-2 max-w-2xl">
              {investigation.purpose.one_liner}
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
          <section className="space-y-4">
            <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5">
              <h2 className="text-sm font-semibold mb-2">Exact purpose</h2>
              <p className="text-sm text-fg-muted leading-relaxed">
                {investigation.purpose.one_liner}
              </p>
              <ul className="mt-4 space-y-2">
                {investigation.purpose.mission.map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-fg-muted">
                    <CheckCircle2 className="size-4 text-ok shrink-0 mt-0.5" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4">
                <h3 className="text-sm font-semibold mb-3">12-agent status</h3>
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
                <h3 className="text-sm font-semibold mb-3">Cycle log</h3>
                {log.length === 0 ? (
                  <p className="text-sm text-fg-subtle">Run the 12-agent cycle to simulate ingest.</p>
                ) : (
                  <pre className="text-xs font-mono text-fg-muted whitespace-pre-wrap max-h-72 overflow-y-auto">
                    {log.join("\n")}
                  </pre>
                )}
              </div>
            </div>
          </section>
        )}

        {tab === "timeline" && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <h2 className="text-lg font-semibold">Public chronology</h2>
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
              {filteredTimeline.map((t) => (
                <li
                  key={t.date + t.event.slice(0, 24)}
                  className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-fg-subtle">{t.date}</span>
                    <span
                      className={[
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        t.tag === "SOLID"
                          ? "border-ok/40 text-ok bg-ok/10"
                          : "border-warn/40 text-warn bg-warn/10",
                      ].join(" ")}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{t.event}</p>
                  <p className="mt-1 text-xs text-fg-subtle">Source: {t.source}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {tab === "entities" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Entities (public record)</h2>
            <p className="text-sm text-fg-muted">Association is not a finding of guilt.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {investigation.entities.map((e) => (
                <article
                  key={e.name}
                  className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold">{e.name}</h3>
                    <span
                      className={[
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        e.tag === "SOLID"
                          ? "border-ok/40 text-ok bg-ok/10"
                          : "border-warn/40 text-warn bg-warn/10",
                      ].join(" ")}
                    >
                      {e.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-fg-subtle uppercase tracking-wide">{e.role}</p>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">{e.status}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "sources" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Official portals & sources</h2>
            <ul className="space-y-2">
              {investigation.official_portals.map((s) => (
                <li
                  key={s.url}
                  className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 flex flex-col sm:flex-row sm:items-center gap-2 justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-fg-subtle">{s.note}</p>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-info hover:underline"
                  >
                    Open <ExternalLink className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "claims" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Open questions / claims</h2>
            <ul className="space-y-2">
              {investigation.open_questions.map((c, i) => (
                <li
                  key={i}
                  className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wide text-fg-subtle">
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed">{c.q}</p>
                  {c.next ? (
                    <p className="mt-1 text-xs text-fg-subtle">Next: {c.next}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "methods" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Methods · public-record ceiling</h2>
            <ul className="space-y-2">
              {investigation.methods.map((m) => (
                <li
                  key={m}
                  className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 text-sm text-fg-muted"
                >
                  {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "agents" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">MA-OS-12 agents</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {maOsData.agents.map((a) => (
                <article
                  key={a.id}
                  className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4"
                >
                  <p className="text-[10px] font-mono text-fg-subtle">
                    Phase {a.phase} · {a.id}
                  </p>
                  <h3 className="text-sm font-semibold mt-1">{a.role}</h3>
                  <p className="text-xs text-fg-muted mt-1">Artifact: {a.artifact}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "links" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Live links</h2>
            <ul className="space-y-2">
              {[
                {
                  name: "GitHub app",
                  url: "https://github.com/cantgetalonggta-png/ma-os-12-console",
                },
                {
                  name: "DOJ Epstein disclosures",
                  url: "https://www.justice.gov/epstein/doj-disclosures",
                },
                {
                  name: "Android APK release",
                  url: "https://github.com/cantgetalonggta-png/ma-os-12-console/releases/tag/android-debug-v1.0.0",
                },
                {
                  name: "Drive backup folder",
                  url: "https://drive.google.com/drive/folders/1vuTOIm5Q0MSZ9eaRHXR1L7DAPAcATC9V",
                },
              ].map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 text-sm hover:border-border-strong"
                  >
                    <span>{l.name}</span>
                    <ExternalLink className="size-4 text-fg-subtle" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="border-t border-border py-4 px-4 text-center text-xs text-fg-subtle space-y-1">
        <p>Public-record ceiling · SOLID/MAYBE · association ≠ guilt · HITL on sensitive identities</p>
        <p>No CSAM · No third-party secret reuse</p>
      </footer>
    </div>
  );
}
