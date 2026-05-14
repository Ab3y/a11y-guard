# Claude Code Plugin — Build Requirements

## Overview

Build a Claude Code plugin for a specific enterprise developer persona, submit a plugin repo, a one-page "build your own" guide, and a ≤5-minute Loom demo.

---

## Chosen Persona

**Security Engineer triaging dependency CVEs**

- Works at a mid-to-large company with many Node.js / Python services
- Runs `npm audit` / `pip-audit` regularly but drowns in output
- Needs to decide: patch now, accept risk, or escalate — for each finding
- Pain: copy-pasting CVE IDs into NVD, cross-referencing GHSA, writing triage notes by hand

---

## Ordered Requirements

### 1. Define the Plugin Scope

- [ ] Name the plugin: `cve-triage`
- [ ] Write one sentence describing what it does: _"Runs dependency audit, looks up each CVE, and produces a prioritized triage report with recommended actions — directly in Claude Code."_
- [ ] Confirm the plugin will NOT require external paid APIs (use public NVD/GHSA endpoints)

---

### 2. Set Up the Repository

- [ ] Create directory `CC-Plugin/` (already your working directory)
- [ ] Initialize a git repo: `git init`
- [ ] Create the following folder structure:

```
CC-Plugin/
├── README.md
├── GUIDE.md
├── .claude/
│   ├── settings.json          ← hook config lives here
│   └── agents/
│       └── cve-triage.md      ← the agent definition
├── skills/
│   └── triage-cve.md          ← the skill definition
└── mcp/                       ← optional: MCP server config (if needed)
```

---

### 3. Build the Skill — `skills/triage-cve.md`

The skill encapsulates the reusable triage logic Claude applies per CVE.

- [ ] Skill triggers on: user types `/triage-cve` or agent invokes it
- [ ] Skill must accept: a CVE ID (e.g. `CVE-2023-44487`) or a raw `npm audit --json` / `pip-audit --json` blob
- [ ] Skill must produce a structured output per finding:
  - CVE ID + CVSS score (fetched from `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=<ID>`)
  - Affected package + current version + fixed version
  - Exploit availability (check GHSA via `https://api.github.com/advisories?ghsa_id=<ID>`)
  - Recommended action: one of `PATCH_NOW` / `SCHEDULE` / `ACCEPT_RISK` / `ESCALATE`
  - One-line rationale for the recommendation
- [ ] Skill must be callable standalone and from within the agent
- [ ] Skill file must include: `name`, `description`, `trigger`, `steps` frontmatter

---

### 4. Build the Agent — `.claude/agents/cve-triage.md`

The agent orchestrates a full audit-to-report flow.

- [ ] Agent name: `cve-triage`
- [ ] Agent description: runs dependency audit, triages every finding, writes a report
- [ ] Agent steps (in order):
  1. Detect package manager: check for `package.json`, `requirements.txt`, `Pipfile`, `pyproject.toml`
  2. Run the appropriate audit command (`npm audit --json` or `pip-audit --json --output json`)
  3. Parse JSON output — extract all CVE IDs and affected packages
  4. For each CVE, invoke the `triage-cve` skill
  5. Sort findings by priority: `PATCH_NOW` first, then `ESCALATE`, then `SCHEDULE`, then `ACCEPT_RISK`
  6. Write output to `cve-triage-report.md` in the project root
  7. Print a summary table to the terminal (CVE ID | Package | CVSS | Action)
- [ ] Agent must handle: no vulnerabilities found (exit cleanly), network errors (degrade gracefully), mixed monorepo (multiple package files)
- [ ] Agent file must include: `name`, `description`, `model`, `tools` frontmatter

---

### 5. Add a Hook — `.claude/settings.json`

The hook gives the plugin automatic value without the user having to ask.

- [ ] Add a `PostToolUse` hook that fires after any `Bash` tool call containing `npm install` or `pip install`
- [ ] Hook behavior: after a package install, automatically invoke the `cve-triage` agent
- [ ] Hook must be scoped to project settings (`.claude/settings.json`), not global
- [ ] Hook config shape:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Packages changed — running CVE triage...' && claude agent run cve-triage"
          }
        ]
      }
    ]
  }
}
```

- [ ] Verify hook only fires on install commands (use substring match on the tool input)

---

### 6. Write the README

The README must enable a fresh-clone install in under 5 minutes.

- [ ] Section: **What this is** (2-3 sentences, mention the persona explicitly)
- [ ] Section: **Prerequisites** (Claude Code CLI installed, Node.js or Python project)
- [ ] Section: **Install** — exact commands, no ambiguity:
  1. Clone the repo
  2. Copy `.claude/` into the target project root
  3. Copy `skills/triage-cve.md` into the target project's `.claude/skills/`
  4. Verify with `claude agent list` — `cve-triage` should appear
- [ ] Section: **Try it** — one command to run a demo: `claude agent run cve-triage`
- [ ] Section: **Hook setup** — explain the auto-trigger on package install
- [ ] Section: **Output** — show a sample `cve-triage-report.md` snippet
- [ ] Keep total README under 400 words

---

### 7. Validate on a Fresh Clone

- [ ] Clone the repo into a new temp directory
- [ ] Follow README instructions exactly — do not use prior environment knowledge
- [ ] Confirm: `claude agent list` shows `cve-triage`
- [ ] Confirm: `claude agent run cve-triage` runs without errors on a project with known vulnerabilities (use a pinned old package for the demo)
- [ ] Confirm: hook fires after `npm install` or `pip install`
- [ ] Confirm: `cve-triage-report.md` is written to disk
- [ ] Fix any step that requires undocumented setup

---

### 8. Write the "Build Your Own Plugin" Guide — `GUIDE.md`

One page (≤800 words), written for a security engineer at the same company who wants to build a plugin for a different workflow (e.g. secret scanning, license compliance, SAST triage).

- [ ] Section: **What a Claude Code plugin is** (3 sentences max — agents, skills, hooks, settings)
- [ ] Section: **Choose your workflow** — prompt: _"Pick one repetitive task you do at least weekly. Can you describe its inputs and outputs in 2 sentences? If yes, it's a plugin candidate."_
- [ ] Section: **The three-file minimum**:
  1. An agent file (the orchestrator)
  2. A skill file (a reusable sub-step)
  3. A settings.json hook (the trigger)
- [ ] Section: **Step-by-step scaffold** — 8 numbered steps from "create the folder" to "run `claude agent list`"
- [ ] Section: **Common mistakes** (3 bullets: wrong file location, missing frontmatter fields, hook not scoped to project)
- [ ] Section: **Where to go deeper** — link to official Claude Code plugin docs
- [ ] Tone: peer-to-peer, not tutorial-voice; assume the reader writes code daily

---

### 9. Prepare the Demo Project

- [ ] Create a small `demo/` folder in the repo containing a `package.json` pinned to a version with known CVEs (e.g. `lodash@4.17.15`, `axios@0.21.1`)
- [ ] Include a `demo/README.md` explaining: "Use this folder to test the plugin. It intentionally pins vulnerable packages."
- [ ] Ensure `npm install` inside `demo/` reproduces real `npm audit` findings

---

### 10. Record the Loom (≤5 minutes, single take preferred)

Strict time budget — rehearse before recording:

- [ ] **0:00–0:30 — Who & What**: Name the persona, state the pain, state what the plugin does
- [ ] **0:30–2:00 — Live Demo**:
  - `cd demo && npm install` → show hook firing automatically
  - `claude agent run cve-triage` → show agent running, CVEs being looked up
  - Open `cve-triage-report.md` → show the structured output
- [ ] **2:00–3:30 — How you built it**:
  - One interesting decision (e.g. why a skill instead of inline agent logic)
  - One moment where you had to steer Claude Code (be specific)
- [ ] **3:30–4:30 — Walking a customer through GUIDE.md**:
  - Open `GUIDE.md` on screen
  - Walk through the "three-file minimum" section
  - Show the scaffold steps
- [ ] **4:30–5:00 — Wrap**: where to find the repo, one sentence on what you'd build next
- [ ] Upload to Loom, set to public link, copy URL

---

### 11. Final Submission Checklist

- [ ] Repo is public on GitHub (or tarball ready)
- [ ] README explains what / who / install / try in under 5 minutes
- [ ] Plugin installs cleanly from a fresh clone (re-verified in step 7)
- [ ] `GUIDE.md` is complete and ≤800 words
- [ ] Loom link is public and ≤5 minutes
- [ ] Three deliverables in one place: repo URL, guide (in repo), Loom URL

---

## Non-Negotiables (Disqualifiers)

- Agent must do real work — no stubs, no "TODO: implement"
- Plugin must install from README alone — no undocumented steps
- Loom must be public and watchable without a Loom account
- Guide must be written for the customer's engineer, not for Anthropic

---

## Suggested Build Order

1. Demo project (`demo/` folder) — gives you real CVE data to test against immediately
2. Skill (`triage-cve.md`) — smallest unit, easiest to test in isolation
3. Agent (`cve-triage.md`) — builds on the skill
4. Hook (`settings.json`) — wire up the trigger last
5. README — write after you've run the full flow yourself
6. GUIDE.md — write after README, reuse structure
7. Loom — record last, after everything works
