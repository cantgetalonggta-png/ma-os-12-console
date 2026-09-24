export type SkillAtom = {
  id: string;
  skill: string;
  trigger: string;
  capability: string;
};
export type AgentDef = {
  id: string;
  phase: number;
  role: string;
  artifact: string;
};
export type RepoRef = {
  name: string;
  visibility: string;
  role: string;
  url?: string;
  cloned?: boolean;
  reason?: string;
};

/* Auto-generated from swarm_os artifacts — do not hand-edit secrets */
export const maOsData = {
  "meta": {
    "name": "MA-OS-12",
    "version": "1.0.0",
    "source": "workspace-backup-2026-09-24",
    "policy": "Public-record ceiling \u00b7 HITL \u00b7 SOLID/MAYBE \u00b7 class-based quarantine"
  },
  "verify": {
    "ok": true,
    "agents": 12,
    "plugins": 58,
    "atoms": 59,
    "ts": "2026-09-24T22:34:07.924191+00:00"
  },
  "agents": [
    {
      "id": "Crawler",
      "phase": 1,
      "role": "Crawl Drive / public sources",
      "artifact": "CRAWL_MANIFEST"
    },
    {
      "id": "Extractor",
      "phase": 2,
      "role": "Extract raw text from sources",
      "artifact": "RAW_TEXT_DUMP"
    },
    {
      "id": "Normalizer",
      "phase": 3,
      "role": "Normalize structure & encoding",
      "artifact": "NORMALIZED_TEXT_DUMP"
    },
    {
      "id": "Distiller",
      "phase": 4,
      "role": "Distill reusable components",
      "artifact": "DISTILLED_COMPONENTS"
    },
    {
      "id": "Classifier",
      "phase": 5,
      "role": "Classify lawful vs quarantine class",
      "artifact": "CLASSIFIED_COMPONENTS"
    },
    {
      "id": "Ontologist",
      "phase": 6,
      "role": "Build entity ontology",
      "artifact": "ONTOLOGY"
    },
    {
      "id": "Architect",
      "phase": 7,
      "role": "Unified system framework",
      "artifact": "UNIFIED_SYSTEM_FRAMEWORK"
    },
    {
      "id": "SkillTree",
      "phase": 8,
      "role": "Skill atoms + graph routing",
      "artifact": "SKILL_TREE"
    },
    {
      "id": "SpecWriter",
      "phase": 9,
      "role": "Executable system specification",
      "artifact": "EXECUTABLE_SYSTEM_SPEC"
    },
    {
      "id": "OSBuilder",
      "phase": 10,
      "role": "Multi-agent OS blueprint",
      "artifact": "MULTI_AGENT_OS_SPEC"
    },
    {
      "id": "Analyst",
      "phase": 11,
      "role": "Emergent insights",
      "artifact": "EMERGENT_INSIGHTS"
    },
    {
      "id": "Refiner",
      "phase": 12,
      "role": "Recursive refine + SUPER_OBJECT",
      "artifact": "SUPER_OBJECT"
    }
  ],
  "atoms": [
    {
      "id": "ATOM-advanced-swarm-v2-pdf-agents",
      "skill": "advanced-swarm-v2-pdf-agents",
      "trigger": "advanced-swarm-v2-pdf-agents",
      "capability": "Specialized multi-agent pattern for processing batches of public PDF documents \u2014 extraction, entity tagging, timeline construction, cross-reference, and complia"
    },
    {
      "id": "ATOM-agent-roles-memory-pattern-anticipation",
      "skill": "agent-roles-memory-pattern-anticipation",
      "trigger": "agent-roles-memory-pattern-anticipation",
      "capability": "Define and operate specialized swarm roles for long-running investigations \u2014 MemoryVault, Pattern detection across years, Anticipation of public drops, and Comp"
    },
    {
      "id": "ATOM-aggressive-debate-persona",
      "skill": "aggressive-debate-persona",
      "trigger": "aggressive-debate-persona",
      "capability": "Apply an aggressive high-energy debate persona that always uses George Carlin-type basic wording and mandatory profanity lexicon (fuck fucking retarded geeky fu"
    },
    {
      "id": "ATOM-aggressive-logic-combat",
      "skill": "aggressive-logic-combat",
      "trigger": "aggressive-logic-combat",
      "capability": "Detect logical fallacies and weak reasoning in debate opponents and dismantle them with high-force yet precise rebuttals. Use during heated tenant-rights or leg"
    },
    {
      "id": "ATOM-anomaly-detection-research",
      "skill": "anomaly-detection-research",
      "trigger": "anomaly-detection-research",
      "capability": "Apply statistical and machine-learning anomaly detection, ethical data collection patterns, cross-referencing best practices, and API workflows for open-source "
    },
    {
      "id": "ATOM-api-integration-master",
      "skill": "api-integration-master",
      "trigger": "api-integration-master",
      "capability": "Master workflows for designing, authenticating, rate-limiting, error-handling, and maintaining robust API integrations. Use for REST GraphQL gRPC clients, SDK w"
    },
    {
      "id": "ATOM-api-key-management",
      "skill": "api-key-management",
      "trigger": "api-key-management",
      "capability": "Master API key generation, secure storage, effective usage, monitoring, rotation, and ethical practices. Triggers on API keys, secrets management, environment v"
    },
    {
      "id": "ATOM-autoresearch",
      "skill": "autoresearch",
      "trigger": "autoresearch",
      "capability": "Orchestrates end-to-end autonomous AI research projects using a two-loop architecture. The inner loop runs rapid experiment iterations with clear optimization t"
    },
    {
      "id": "ATOM-code-evolution",
      "skill": "code-evolution",
      "trigger": "code-evolution",
      "capability": "Systematic improvement, refactoring, and evolution of existing codebases. Use for safe large-scale changes, dependency upgrades, architectural migration, test c"
    },
    {
      "id": "ATOM-coherent-communication",
      "skill": "coherent-communication",
      "trigger": "coherent-communication",
      "capability": "Guide production of coherent structured speech with proper vocabulary flowing prose narrative techniques and linguistic foundations. Use when responses require "
    },
    {
      "id": "ATOM-comedian-persona-debate",
      "skill": "comedian-persona-debate",
      "trigger": "comedian-persona-debate",
      "capability": "Integrate the comedic personas of Lenny Bruce Richard Pryor and George Carlin into multi-agent debate systems for sharper critique storytelling linguistic preci"
    },
    {
      "id": "ATOM-complex-rewriting",
      "skill": "complex-rewriting",
      "trigger": "complex-rewriting",
      "capability": "Structured rewriting of complex documents, code, or narratives while preserving meaning, improving clarity, and adapting to new constraints. Use for legal-to-pl"
    },
    {
      "id": "ATOM-debate-argument-structure",
      "skill": "debate-argument-structure",
      "trigger": "debate-argument-structure",
      "capability": "Structure high-stakes debates into clear phases and argument frames that combine logical progression with aggressive rhetorical force. Use for tenant-rights con"
    },
    {
      "id": "ATOM-deployment-automation",
      "skill": "deployment-automation",
      "trigger": "deployment-automation",
      "capability": "Reliable, repeatable deployment pipelines for applications and infrastructure. Use for CI/CD design, blue-green or canary releases, infrastructure-as-code, roll"
    },
    {
      "id": "ATOM-document-intelligence",
      "skill": "document-intelligence",
      "trigger": "document-intelligence",
      "capability": "Document extraction and understanding skill. Handles PDFs, text, tables, metadata, OCR fallback, layout analysis, and structured output. Triggers on PDF, docume"
    },
    {
      "id": "ATOM-dorking-mastery",
      "skill": "dorking-mastery",
      "trigger": "dorking-mastery",
      "capability": "Master Google dorking and advanced search operators for efficient public-information retrieval. Covers basic and combined operators, targeted research queries, "
    },
    {
      "id": "ATOM-epstein-investigation-synthesizer",
      "skill": "epstein-investigation-synthesizer",
      "trigger": "epstein-investigation-synthesizer",
      "capability": "Synthesizes public records, timelines, court documents and verified facts on the Jeffrey Epstein case and related investigations. Use for deep factual dives, pl"
    },
    {
      "id": "ATOM-epstein-pdf-batch-ingest",
      "skill": "epstein-pdf-batch-ingest",
      "trigger": "epstein-pdf-batch-ingest",
      "capability": "Ingest and organize operator-held public Epstein-related PDF packs into an ordered research vault with hashing, metadata, name/date extraction and SOLID/MAYBE t"
    },
    {
      "id": "ATOM-ethical-data-harvesting",
      "skill": "ethical-data-harvesting",
      "trigger": "ethical-data-harvesting",
      "capability": "Structured cookbook with 20 ethical recipes for legal data harvesting from public directories, databases, APIs, and online resources. Use for responsible collec"
    },
    {
      "id": "ATOM-ethical-scraper-orchestration",
      "skill": "ethical-scraper-orchestration",
      "trigger": "ethical-scraper-orchestration",
      "capability": "Multi-agent style orchestration for ethical public-page collection \u2014 Scout, Parser, Validator, Rate Manager, Ethics Compliance. Public pages and official source"
    },
    {
      "id": "ATOM-george-carlin-persona",
      "skill": "george-carlin-persona",
      "trigger": "george-carlin-persona",
      "capability": "Capture and apply George Carlin's comedic persona including observational humor satire wordplay social critique delivery timing and philosophical edge. Use when"
    },
    {
      "id": "ATOM-gh-issues",
      "skill": "gh-issues",
      "trigger": "gh-issues",
      "capability": "\"Fetch GitHub issues, delegate fixes to subagents, open PRs, watch reviews, or run /gh-issues workflows.\""
    },
    {
      "id": "ATOM-integrity-investigative-system",
      "skill": "integrity-investigative-system",
      "trigger": "integrity-investigative-system",
      "capability": "Permanent high-scale investigative validation ecosystem with hybrid Graph RAG, forensic HTML alteration detection (NCD, deterministic diff, YARA), hex auditing,"
    },
    {
      "id": "ATOM-investigation-process-video",
      "skill": "investigation-process-video",
      "trigger": "investigation-process-video",
      "capability": "Generate synchronized narrative videos of a man conducting an investigation process with matching visuals, voiceover, scenes, and sound. Use when user requests "
    },
    {
      "id": "ATOM-knowledge-base-builder",
      "skill": "knowledge-base-builder",
      "trigger": "knowledge-base-builder",
      "capability": "Construct, maintain, and query structured knowledge bases from documents, APIs, and public sources. Use for RAG corpus creation, entity-relation graphs, vector "
    },
    {
      "id": "ATOM-learn-and-lay-it-out",
      "skill": "learn-and-lay-it-out",
      "trigger": "learn-and-lay-it-out",
      "capability": "Synthesizes complex data research or documents into plain English actionable insights and conclusions. Triggers include learn and lay it out, what the fuck does"
    },
    {
      "id": "ATOM-legal-osint-compliance-layer",
      "skill": "legal-osint-compliance-layer",
      "trigger": "legal-osint-compliance-layer",
      "capability": "Route every collection request through legal-compliance, jurisdiction, rate-limit, source-validator and human-oversight gates before any harvest. Triggers on le"
    },
    {
      "id": "ATOM-lenny-bruce-persona",
      "skill": "lenny-bruce-persona",
      "trigger": "lenny-bruce-persona",
      "capability": "Capture and apply Lenny Bruce's comedic persona including improvisational style social commentary wordplay free-speech advocacy and raw authenticity. Use when g"
    },
    {
      "id": "ATOM-live-web-mastery",
      "skill": "live-web-mastery",
      "trigger": "live-web-mastery",
      "capability": "Structured approach to mastering the live web for real-time research, navigation, information retrieval, content evaluation, tool use, and ethical practices. Us"
    },
    {
      "id": "ATOM-llm-orchestration",
      "skill": "llm-orchestration",
      "trigger": "llm-orchestration",
      "capability": "Central LLM coordination skill. Routes tasks across skills and agents, manages parallel tool calls, synthesizes results, and handles fallbacks. Triggers on orch"
    },
    {
      "id": "ATOM-metrics-self-healing",
      "skill": "metrics-self-healing",
      "trigger": "metrics-self-healing",
      "capability": "Observe system metrics, detect anomalies or SLO breaches, and trigger automated remediation or escalation. Use for self-healing services, auto-rollback, scaling"
    },
    {
      "id": "ATOM-multi-agent-patterns",
      "skill": "multi-agent-patterns",
      "trigger": "multi-agent-patterns",
      "capability": "Multi-agent orchestration skill. Use for designing, implementing, and running coordinated agent systems (supervisor, sequential, parallel, hierarchical, swarm, "
    },
    {
      "id": "ATOM-multi-agent-project-structure",
      "skill": "multi-agent-project-structure",
      "trigger": "multi-agent-project-structure",
      "capability": "Canonical folder and file layout for multi-agent swarm projects including main entry points, agents directory, tools, utils, requirements, env example and READM"
    },
    {
      "id": "ATOM-multi-agent-tooling",
      "skill": "multi-agent-tooling",
      "trigger": "multi-agent-tooling",
      "capability": "Recommended tools frameworks and infrastructure for building coordinating and operating multi-agent systems. Covers agent development frameworks orchestration m"
    },
    {
      "id": "ATOM-native-lang-learning",
      "skill": "native-lang-learning",
      "trigger": "native-lang-learning",
      "capability": "Structured methods for acquiring native-like proficiency in a language through immersion, deliberate practice, spaced repetition, and authentic material. Use fo"
    },
    {
      "id": "ATOM-ontological-self-update",
      "skill": "ontological-self-update",
      "trigger": "ontological-self-update",
      "capability": "Ontology management and self-directive evolution skill. Maintains CORE_ONTOLOGY, reviews consistency of new entities/relations, and governs changes to core dire"
    },
    {
      "id": "ATOM-osint-rag-master",
      "skill": "osint-rag-master",
      "trigger": "osint-rag-master",
      "capability": "Master OSINT + RAG skill. Use for open-source intelligence investigations, public-data research, link analysis, dorking, archive searches, entity resolution, an"
    },
    {
      "id": "ATOM-pdf-breakdown-explainer",
      "skill": "pdf-breakdown-explainer",
      "trigger": "pdf-breakdown-explainer",
      "capability": "Breaks down every section and page of provided PDF files into simple, clear explanations with Microsoft-style proxy variants (simplified summaries, analogies, e"
    },
    {
      "id": "ATOM-public-dataset-discovery",
      "skill": "public-dataset-discovery",
      "trigger": "public-dataset-discovery",
      "capability": "Federated discovery and quality ranking of public datasets across data.gov, Kaggle, Google Dataset Search, academic portals and open data catalogs. Triggers on "
    },
    {
      "id": "ATOM-python-pep8-code-reviewer",
      "skill": "python-pep8-code-reviewer",
      "trigger": "python-pep8-code-reviewer",
      "capability": "Acts as a code reviewer for Python projects enforcing PEP 8 style guidelines. Use when user requests code review, linting, PEP8 check, style audit, or feedback "
    },
    {
      "id": "ATOM-research-automation",
      "skill": "research-automation",
      "trigger": "research-automation",
      "capability": "End-to-end research workflow skill. Plans multi-step investigations, delegates collection and analysis, maintains progress tracking, and produces structured int"
    },
    {
      "id": "ATOM-rex-export-x5-master",
      "skill": "rex-export-x5-master",
      "trigger": "rex-export-x5-master",
      "capability": "Master distillation procedure for REX_EXPORT style archives \u2014 re-index, classify lawful vs quarantine, write skills and encyclopedias, maintain inventory, enfor"
    },
    {
      "id": "ATOM-richard-pryor-persona",
      "skill": "richard-pryor-persona",
      "trigger": "richard-pryor-persona",
      "capability": "Capture and apply Richard Pryor's comedic persona including raw personal storytelling character voices racial insight addiction candor and emotional range. Use "
    },
    {
      "id": "ATOM-search-encyclopedia",
      "skill": "search-encyclopedia",
      "trigger": "search-encyclopedia",
      "capability": "Comprehensive encyclopedia covering search engines, advanced methods, Boolean and operator techniques, ghost indexes, dorking, and real-time self-evolution for "
    },
    {
      "id": "ATOM-search-techniques-master",
      "skill": "search-techniques-master",
      "trigger": "search-techniques-master",
      "capability": "Master search techniques for finding anything, everything, everywhere. Comprehensive operators, multi-engine protocols, AI-native methods, absolute ethical/lega"
    },
    {
      "id": "ATOM-self-dev-resources",
      "skill": "self-dev-resources",
      "trigger": "self-dev-resources",
      "capability": "Curated and actionable resources for deliberate self-development across skills, knowledge, and habits. Use for learning plans, resource recommendations, practic"
    },
    {
      "id": "ATOM-sensitive-data-defensive-scan",
      "skill": "sensitive-data-defensive-scan",
      "trigger": "sensitive-data-defensive-scan",
      "capability": "Defensively scan operator-provided files and workspace for accidental secrets (API keys, tokens) and warn the operator. Never harvest, store, inject or test thi"
    },
    {
      "id": "ATOM-tenant-misconceptions-rebuttal",
      "skill": "tenant-misconceptions-rebuttal",
      "trigger": "tenant-misconceptions-rebuttal",
      "capability": "Catalog and aggressively dismantle the most common misconceptions about tenant rights and landlord powers. Use when an opponent or audience asserts that tenants"
    },
    {
      "id": "ATOM-tenant-rights-advocacy",
      "skill": "tenant-rights-advocacy",
      "trigger": "tenant-rights-advocacy",
      "capability": "Provide accurate structured knowledge of tenant rights under US federal state and local frameworks for use in debates advocacy and legal challenge scenarios. Us"
    },
    {
      "id": "ATOM-termux-sovereign-setup",
      "skill": "termux-sovereign-setup",
      "trigger": "termux-sovereign-setup",
      "capability": "Lawful Termux setup for mobile Linux development and public-data note-taking. Covers pkg update, installing git python nodejs and basic analysis tools. Triggers"
    },
    {
      "id": "ATOM-truth-verification",
      "skill": "truth-verification",
      "trigger": "truth-verification",
      "capability": "Epistemic verification skill with Bayesian Belief Networks, Analysis of Competing Hypotheses (ACH), claim tracking, and dynamic updating. Triggers on verificati"
    },
    {
      "id": "ATOM-wayback-ghost-index-public",
      "skill": "wayback-ghost-index-public",
      "trigger": "wayback-ghost-index-public",
      "capability": "Discover and reconstruct historical public pages using Wayback Machine, Archive-It, CDX APIs and related public archives only. Triggers on Wayback ghost index, "
    },
    {
      "id": "ATOM-wayback-machine-mastery",
      "skill": "wayback-machine-mastery",
      "trigger": "wayback-machine-mastery",
      "capability": "Master the Internet Archive Wayback Machine for historical web research, content recovery, change tracking, and evidence collection. Covers navigation, URL and "
    },
    {
      "id": "ATOM-self-healing",
      "skill": "self-healing",
      "trigger": "self-healing",
      "capability": "self-healing"
    },
    {
      "id": "ATOM-plugin-discovery",
      "skill": "plugin-discovery",
      "trigger": "plugin-discovery",
      "capability": "plugin-discovery"
    },
    {
      "id": "ATOM-agent-evolution",
      "skill": "agent-evolution",
      "trigger": "agent-evolution",
      "capability": "agent-evolution"
    },
    {
      "id": "ATOM-rl-loops",
      "skill": "rl-loops",
      "trigger": "rl-loops",
      "capability": "rl-loops"
    },
    {
      "id": "ATOM-structured-bus",
      "skill": "structured-bus",
      "trigger": "structured-bus",
      "capability": "structured-bus"
    },
    {
      "id": "ATOM-hitl-gate",
      "skill": "hitl-gate",
      "trigger": "hitl-gate",
      "capability": "hitl-gate"
    }
  ],
  "graph_edges": [
    [
      "ATOM-llm-orchestration",
      "ATOM-multi-agent-patterns"
    ],
    [
      "ATOM-multi-agent-patterns",
      "ATOM-multi-agent-tooling"
    ],
    [
      "ATOM-multi-agent-project-structure",
      "ATOM-multi-agent-patterns"
    ],
    [
      "ATOM-rex-export-x5-master",
      "ATOM-legal-osint-compliance-layer"
    ],
    [
      "ATOM-legal-osint-compliance-layer",
      "ATOM-ethical-data-harvesting"
    ],
    [
      "ATOM-ethical-data-harvesting",
      "ATOM-ethical-scraper-orchestration"
    ],
    [
      "ATOM-osint-rag-master",
      "ATOM-knowledge-base-builder"
    ],
    [
      "ATOM-document-intelligence",
      "ATOM-pdf-breakdown-explainer"
    ],
    [
      "ATOM-truth-verification",
      "ATOM-ontological-self-update"
    ],
    [
      "ATOM-metrics-self-healing",
      "ATOM-self-healing"
    ],
    [
      "ATOM-metrics-self-healing",
      "ATOM-deployment-automation"
    ],
    [
      "ATOM-anomaly-detection-research",
      "ATOM-self-healing"
    ],
    [
      "ATOM-autoresearch",
      "ATOM-research-automation"
    ],
    [
      "ATOM-agent-roles-memory-pattern-anticipation",
      "ATOM-integrity-investigative-system"
    ],
    [
      "ATOM-sensitive-data-defensive-scan",
      "ATOM-api-key-management"
    ],
    [
      "ATOM-plugin-discovery",
      "ATOM-llm-orchestration"
    ],
    [
      "ATOM-agent-evolution",
      "ATOM-code-evolution"
    ],
    [
      "ATOM-rl-loops",
      "ATOM-autoresearch"
    ],
    [
      "ATOM-wayback-machine-mastery",
      "ATOM-wayback-ghost-index-public"
    ],
    [
      "ATOM-search-techniques-master",
      "ATOM-dorking-mastery"
    ],
    [
      "ATOM-epstein-pdf-batch-ingest",
      "ATOM-epstein-investigation-synthesizer"
    ],
    [
      "ATOM-epstein-investigation-synthesizer",
      "ATOM-advanced-swarm-v2-pdf-agents"
    ]
  ],
  "repos": [
    {
      "name": "live-online-agent-swarm",
      "visibility": "public",
      "role": "primary live investigation swarm",
      "url": "https://github.com/cantgetalonggta-png/live-online-agent-swarm"
    },
    {
      "name": "strand-osint-mesh",
      "visibility": "public",
      "role": "OSINT mesh HOOK/STAMP/SPLIT/WEFT",
      "url": "https://github.com/cantgetalonggta-png/strand-osint-mesh"
    },
    {
      "name": "truth-engine-integrity",
      "visibility": "public",
      "role": "integrity cycle NCD/diff/YARA",
      "url": "https://github.com/cantgetalonggta-png/truth-engine-integrity"
    },
    {
      "name": "CodeSorcerer",
      "visibility": "public",
      "role": "Bayesian agent framework + dashboard",
      "url": "https://github.com/cantgetalonggta-png/CodeSorcerer"
    },
    {
      "name": "detective-codex-vault",
      "visibility": "public",
      "role": "investigation desk vault",
      "url": "https://github.com/cantgetalonggta-png/detective-codex-vault"
    },
    {
      "name": "strand-1953-trust-efta-ia-evidence",
      "visibility": "public",
      "role": "1953 TRUST public evidence vault",
      "url": "https://github.com/cantgetalonggta-png/strand-1953-trust-efta-ia-evidence"
    },
    {
      "name": "meridian-drive-vault-atlas",
      "visibility": "public",
      "role": "3D globe atlas for public pipelines",
      "url": "https://github.com/cantgetalonggta-png/meridian-drive-vault-atlas"
    },
    {
      "name": "ECHO",
      "visibility": "public",
      "role": "Echo persona architecture",
      "url": "https://github.com/cantgetalonggta-png/ECHO"
    },
    {
      "name": "epstein-core-web-automation",
      "visibility": "public",
      "role": "research organizer stub",
      "url": "https://github.com/cantgetalonggta-png/epstein-core-web-automation"
    },
    {
      "name": "vidmuse-space",
      "visibility": "public",
      "role": "unrelated HF demo",
      "url": "https://github.com/cantgetalonggta-png/vidmuse-space"
    },
    {
      "name": "SOVEREIGN_UNIFIED_PLATFORM_2026-09-11",
      "visibility": "private",
      "role": "existing monorepo catalog \u2014 pointer only",
      "url": "https://github.com/cantgetalonggta-png/SOVEREIGN_UNIFIED_PLATFORM_2026-09-11"
    },
    {
      "name": "Sovereign_MultiAgent_Swarm_Backup_2026-09-11",
      "visibility": "private",
      "role": "25-agent backup \u2014 pointer only",
      "url": "https://github.com/cantgetalonggta-png/Sovereign_MultiAgent_Swarm_Backup_2026-09-11"
    },
    {
      "name": "FULL_WSL_MultiAgent_Framework_2026-09-11",
      "visibility": "private",
      "role": "WSL framework \u2014 pointer only",
      "url": "https://github.com/cantgetalonggta-png/FULL_WSL_MultiAgent_Framework_2026-09-11"
    },
    {
      "name": "WSL_Agent_Stack_2026-09-11",
      "visibility": "private",
      "role": "WSL stack \u2014 pointer only",
      "url": "https://github.com/cantgetalonggta-png/WSL_Agent_Stack_2026-09-11"
    },
    {
      "name": "workspace-backup-2026-09-24",
      "visibility": "private",
      "role": "this workspace backup \u2014 pointer only",
      "url": "https://github.com/cantgetalonggta-png/workspace-backup-2026-09-24"
    },
    {
      "name": "api-keys-secret-store",
      "visibility": "private",
      "role": "OPERATOR SECRETS \u2014 name only, never cloned into merge",
      "url": "https://github.com/cantgetalonggta-png/api-keys-secret-store",
      "cloned": false,
      "reason": "do_not_ingest_secret_contents"
    }
  ],
  "toolchain": {
    "rtk": {
      "purpose": "Compress shell/tool output 60-90% before LLM context"
    },
    "claude_code_plugins": {
      "purpose": ""
    },
    "codex_cli": {
      "purpose": "local coding agent; complementary not replacement for MA-OS-12"
    },
    "integrity_truth_engine": {
      "purpose": ""
    },
    "codesorcerer": {
      "purpose": ""
    },
    "live_online_swarm": {
      "purpose": ""
    }
  },
  "tools": [
    "search_engines",
    "operators",
    "archives",
    "records",
    "code_search",
    "identity_osint",
    "infra_observe",
    "documents",
    "integrity",
    "verification",
    "connected"
  ],
  "squads": [
    "Binary Crusher",
    "Lens Weaver",
    "Lie Slayer",
    "Data Predator",
    "Overseer Watch",
    "Monitor Mediator",
    "MemoryVault",
    "Pattern",
    "Anticipation",
    "Compliance"
  ],
  "quarantine_classes": [
    "third_party_credentials",
    "torrent_retrieval",
    "unpacked_high_risk_binary_archives",
    "unauthorized_access",
    "safety_log_destruction"
  ],
  "governance": [
    "Public-record ceiling",
    "HITL for irreversible acts",
    "SOLID / MAYBE tagging",
    "No third-party secret reuse",
    "No torrent fetch",
    "Class-based quarantine (not taboo wording)"
  ]
}
export type MaOsData = typeof maOsData;

