/* Public-record investigation corpus — no secrets */
export const investigation = {
  "purpose": {
    "title": "Epstein Public-Record Investigation Desk",
    "one_liner": "Operator-owned public-record desk: Residue (SOLID primaries) · Operator ledger (first-class leads, not fake exhibits) · Contradictions · Missing productions. Association \u2260 guilt. No CSAM.",
    "mission": [
      "Aggregate only public-record sources (courts, DOJ, FOIA, reputable news)",
      "Map entities with association \u2260 guilt",
      "Tag every claim SOLID or MAYBE with provenance",
      "Surface gaps for further public FOIA / archive work",
      "Never publish victim private data or CSAM; HITL on sensitive identities"
    ],
    "not_for": [
      "Conspiracy without evidence",
      "Doxxing private individuals from non-public sources",
      "Loading third-party leaked credentials"
    ]
  },
  "official_portals": [
    {
      "name": "DOJ Epstein Disclosures",
      "url": "https://www.justice.gov/epstein/doj-disclosures",
      "tier": "primary",
      "note": "Official DOJ disclosure library"
    },
    {
      "name": "SDNY Epstein charging (2019)",
      "url": "https://www.justice.gov/usao-sdny/pr/jeffrey-epstein-charged-manhattan-federal-court-sex-trafficking-minors",
      "tier": "primary",
      "note": "Federal charging announcement"
    },
    {
      "name": "Maxwell conviction (DOJ)",
      "url": "https://www.justice.gov/usao-sdny/pr/ghislaine-maxwell-found-guilty-manhattan-federal-court-conspiring-jeffrey-epstein",
      "tier": "primary",
      "note": "Maxwell jury verdict press release"
    },
    {
      "name": "CourtListener RECAP",
      "url": "https://www.courtlistener.com/",
      "tier": "primary",
      "note": "Public PACER dockets via RECAP"
    },
    {
      "name": "AP Epstein hub",
      "url": "https://apnews.com/hub/jeffrey-epstein",
      "tier": "secondary",
      "note": "Wire timeline and ongoing coverage"
    },
    {
      "name": "NYT Epstein files timeline",
      "url": "https://www.nytimes.com/2026/03/16/nyregion/epstein-files-timeline.html",
      "tier": "secondary",
      "note": "Editorial timeline (2026)"
    }
  ],
  "timeline": [
    {
      "date": "2005-03",
      "event": "Palm Beach PD opens investigation after parent complaint involving a 14-year-old",
      "tag": "SOLID",
      "source": "AP / Palm Beach records"
    },
    {
      "date": "2006-07",
      "event": "Palm Beach County grand jury indictment (state solicitation charge)",
      "tag": "SOLID",
      "source": "Court records"
    },
    {
      "date": "2007-09",
      "event": "Non-prosecution agreement negotiated with SDFL (Acosta era) \u2014 later heavily criticized",
      "tag": "SOLID",
      "source": "DOJ OPR review / court"
    },
    {
      "date": "2008",
      "event": "Epstein pleads to state charges; work-release arrangement becomes public flashpoint",
      "tag": "SOLID",
      "source": "State court / news"
    },
    {
      "date": "2019-07-06",
      "event": "Arrested at Teterboro; SDNY sex-trafficking of minors + conspiracy charges",
      "tag": "SOLID",
      "source": "SDNY"
    },
    {
      "date": "2019-08-10",
      "event": "Death in MCC New York custody; medical examiner rules suicide; public controversy continues",
      "tag": "SOLID",
      "source": "NYC OCME / DOJ"
    },
    {
      "date": "2021-12-29",
      "event": "Ghislaine Maxwell convicted on five of six counts",
      "tag": "SOLID",
      "source": "SDNY"
    },
    {
      "date": "2022-06-28",
      "event": "Maxwell sentenced to 20 years federal prison",
      "tag": "SOLID",
      "source": "SDNY"
    },
    {
      "date": "2024-01",
      "event": "Giuffre v. Maxwell sealed materials begin unsealing in waves",
      "tag": "SOLID",
      "source": "SDNY civil docket"
    },
    {
      "date": "2025-02",
      "event": "AG Bondi releases flight logs / contact materials already largely public \u2014 criticism over scope",
      "tag": "SOLID",
      "source": "DOJ / AP"
    },
    {
      "date": "2025-07",
      "event": "DOJ/FBI memo: no 'client list'; limited additional criminal findings beyond Maxwell",
      "tag": "SOLID",
      "source": "DOJ memo (disputed publicly)"
    },
    {
      "date": "2025-11",
      "event": "Epstein Files Transparency Act passes Congress; signed into law",
      "tag": "SOLID",
      "source": "Congress / AP"
    },
    {
      "date": "2025-12",
      "event": "DOJ begins Transparency Act releases (rolling tranches)",
      "tag": "SOLID",
      "source": "DOJ"
    },
    {
      "date": "2026-01-30",
      "event": "Major DOJ tranche: millions of pages + media described in press briefings",
      "tag": "SOLID",
      "source": "DOJ / NBC"
    }
  ],
  "entities": [
    {
      "name": "Jeffrey Epstein",
      "role": "Deceased defendant; sex trafficking charges (SDNY 2019)",
      "status": "deceased_2019",
      "tag": "SOLID"
    },
    {
      "name": "Ghislaine Maxwell",
      "role": "Convicted co-conspirator; 20-year sentence",
      "status": "incarcerated",
      "tag": "SOLID"
    },
    {
      "name": "SDNY / USAO",
      "role": "Prosecuting office (2019 charges, Maxwell trial)",
      "status": "institution",
      "tag": "SOLID"
    },
    {
      "name": "Palm Beach PD",
      "role": "Originating local investigation (2005)",
      "status": "institution",
      "tag": "SOLID"
    },
    {
      "name": "Alex Acosta",
      "role": "Former SDFL USA; non-prosecution agreement era",
      "status": "public_figure",
      "tag": "SOLID"
    },
    {
      "name": "Virginia Giuffre",
      "role": "Plaintiff / accuser in civil litigation (public filings)",
      "status": "deceased_2025_reported",
      "tag": "SOLID"
    }
  ],
  "open_questions": [
    {
      "q": "Full accounting of non-prosecution agreement scope and who was covered",
      "tag": "MAYBE",
      "next": "OPR report + FOIA litigation dockets"
    },
    {
      "q": "Completeness of Transparency Act releases vs. redaction classes",
      "tag": "MAYBE",
      "next": "Compare DOJ indexes to FOIA production logs"
    },
    {
      "q": "Associates named in civil depositions vs. criminal charges",
      "tag": "MAYBE",
      "next": "Crosswalk unsealed Giuffre materials with SDNY indictments only"
    }
  ],
  "methods": [
    "OSINT cycle: Collect \u2192 Normalize \u2192 Distill \u2192 Classify \u2192 Verify (SOLID/MAYBE)",
    "Primary source preference: DOJ, PACER/RECAP, state courts",
    "Secondary: AP, major papers \u2014 never sole proof",
    "Association \u2260 guilt; name appearance in files \u2260 criminal finding",
    "HITL before publishing victim-identifying details beyond already-public filings",
    "Integrity: hash public PDFs; NCD/diff on release waves"
  ],
  "swarm_agents": [
    "Crawler",
    "Extractor",
    "Normalizer",
    "Distiller",
    "Classifier",
    "Ontologist",
    "Architect",
    "SkillTree",
    "SpecWriter",
    "OSBuilder",
    "Analyst",
    "Refiner"
  ],
  "live_links": {
    "github_app": "https://github.com/cantgetalonggta-png/ma-os-12-console",
    "apk_release": "https://github.com/cantgetalonggta-png/ma-os-12-console/releases/tag/android-debug-v1.0.0",
    "swarm_catalog": "https://github.com/cantgetalonggta-png/live-online-agent-swarm/tree/main/ma-os-12",
    "doj_disclosures": "https://www.justice.gov/epstein/doj-disclosures",
    "apk_ci": "https://github.com/cantgetalonggta-png/ma-os-12-console/actions/workflows/android-ci.yml"
  }
}
export type Investigation = typeof investigation;
