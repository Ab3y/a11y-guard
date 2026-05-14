# Claude Code Plugin — Build Requirements

## Overview

Build a Claude Code plugin for a specific enterprise developer persona. Submit a plugin
repo, a one-page "build your own" guide, and a five-minute Loom demo.

---

## Chosen Persona

**Enterprise Accessibility QA Engineer**

This person is responsible for reviewing React and Next.js applications built by
fast-moving product teams that use AI coding tools such as Cursor, Copilot, and
Claude Code.

They are often:
- Overwhelmed by volume — reviewing hundreds of components across many repositories
- Brought in too late — after development is complete, right before a release
- Manually identifying the same repeating violations across every pull request
- Trying to educate developers while maintaining release velocity
- Unable to scale to cover every AI-generated component individually

**The staffing reality:** Enterprise accessibility teams are often a single specialist
or a very small group responsible for an entire product organisation. a11y-guard reduces
repetitive first-pass review so specialists can focus on the higher-complexity usability
and assistive technology testing that requires human judgment and lived experience.

**Personal motivation:** The author is hard of seeing and relies on browser zoom,
screen readers, and enlarged interfaces — especially at night after removing contact
lenses. Poor accessibility directly impacts productivity. This plugin is built from
that lived experience, not from an abstract concern.

---

## Plugin Scope

**Plugin name:** `a11y-guard`

**One sentence description:**
Scans frontend components for WCAG 2.1 AA violations, maps each finding to its
criterion, explains who is affected and how, suggests the minimal code fix, and
writes a structured audit report — without leaving Claude Code.

**What this plugin is NOT trying to do:**
- Replace accessibility professionals or their judgment
- Fully certify WCAG compliance
- Become a complete browser automation suite
- Replace manual screen reader testing with NVDA, JAWS, or VoiceOver

**Common AI-generated accessibility failures this plugin targets:**
- Placeholder text used instead of label elements
- Icon-only controls with no accessible name
- Div-based buttons (div with onClick but no role or keyboard support)
- Inaccessible modal implementations (missing role, focus management, focus trap)
- Excessive or invalid ARIA usage
- Skipped heading hierarchy
- Missing keyboard support

---

## Agent vs. Slash Command — Intentional Distinction

The agent and slash command serve different workflows. They are not duplicates.

**The agent** (`claude agents run a11y-guard`) is designed for:
- Project-wide audits across all frontend components
- Structured reporting with a persistent a11y-report.md output file
- Accessibility review sessions — a deliberate, dedicated audit workflow

**The slash command** (`/wcag-check`) is designed for:
- Conversational development workflows — used inline while coding
- Quick feedback on a single file or pasted snippet
- Rapid iteration: "I just wrote this component, is it accessible?"

The agent writes a file and exits. The slash command responds in chat and keeps
the conversation going. Both cover the same 8 categories, but their output format,
scope, and intended moment of use are different.

---

## Ordered Requirements

### 1. Repository Setup

- [x] Git repository initialised
- [x] Folder structure created (see structure below)

```
a11y-guard/
├── .claude/
│   ├── agents/
│   │   └── a11y-guard.md          ← Agent: project-wide audit
│   ├── commands/
│   │   └── wcag-check.md          ← Slash command: inline single-file check
│   ├── hooks/
│   │   └── on-file-edit.js        ← Hook script (Node.js, cross-platform)
│   └── settings.json              ← PostToolUse hook wiring
├── demo/
│   ├── index.html                 ← Missing lang attribute, outline:none
│   ├── src/components/
│   │   ├── LoginForm.tsx          ← Placeholder-as-label, icon-only button
│   │   ├── DataTable.tsx          ← Icon-only sort buttons, missing table semantics
│   │   ├── Modal.tsx              ← Div-as-dialog, no focus trap
│   │   ├── Navigation.jsx         ← Skipped headings, non-descriptive links
│   │   └── Dashboard.tsx          ← Div-button, excessive ARIA, canvas no alt
│   ├── package.json
│   └── README.md
├── README.md
├── GUIDE.md
└── REQUIREMENTS.md
```

---

### 2. Build the Slash Command — `.claude/commands/wcag-check.md`

**Purpose:** Conversational, inline check. Single file or snippet. Does not write a file.

- [ ] Triggers on: `/wcag-check <file>` or `/wcag-check` with pasted code
- [ ] Checks the same 8 categories as the agent
- [ ] Output format per finding:
  ```
  [SEVERITY] WCAG X.X.X — Short title
  Issue:  what is technically wrong
  Impact: who is affected and what they actually experience
  Fix:    corrected code snippet
  ```
- [ ] Ends with summary count and static analysis disclaimer
- [ ] Includes note directing users to the agent for full project audits
- [ ] File includes frontmatter: `name`, `description`

---

### 3. Build the Agent — `.claude/agents/a11y-guard.md`

**Purpose:** Project-wide audit. Writes a11y-report.md. Not conversational.

- [ ] Agent name: `a11y-guard`
- [ ] Discovers all `.jsx`, `.tsx`, `.html`, `.vue`, `.svelte` files
- [ ] Excludes: `node_modules`, `dist`, `build`, `.next`
- [ ] Analyzes each file across 8 categories:
  1. Semantic HTML — div-based buttons, missing landmarks
  2. Keyboard accessibility — onClick without keyboard handler, broken tab order
  3. Form accessibility — placeholder-as-label, missing error associations
  4. Screen reader support — missing alt text, aria-hidden on focusable elements
  5. Accessible naming — icon-only controls, unnamed buttons and links
  6. Heading structure — skipped levels, multiple H1 elements
  7. Modal accessibility — missing role, aria-modal, focus management
  8. ARIA validation — invalid and excessive ARIA usage
- [ ] Every finding includes: WCAG criterion + Issue + User Impact + Fix
- [ ] Writes a11y-report.md with summary table, grouped findings, disclaimer
- [ ] Prints terminal summary on completion
- [ ] File includes frontmatter: `name`, `description`, `model`, `tools`

---

### 4. Add the Hook — `.claude/hooks/on-file-edit.js` + `.claude/settings.json`

- [ ] Hook script: Node.js, no dependencies, fully commented for teaching
- [ ] Comments explain how Claude Code hook payloads work (stdin JSON)
- [ ] Checks `tool_input.file_path` for frontend file extensions
- [ ] Prints one-line reminder to run `/wcag-check` on the modified file
- [ ] Silent on errors — hook failures must never block Claude Code
- [ ] Settings wired to `PostToolUse` on both `Edit` and `Write` tool matchers

---

### 5. Write the README

- [ ] 700–900 words
- [ ] Sections: Problem / Why I Built This / Who This Is For / How It Works /
      Accessibility Categories / Prerequisites / Install / Try It /
      Sample Output / Understanding the Report / Contributing
- [ ] Agent vs. slash command distinction clearly explained
- [ ] Fresh-clone install in under 5 minutes
- [ ] Copy-paste commands for Mac/Linux and Windows

---

### 6. Validate on a Fresh Clone

- [ ] Clone to a new temp directory
- [ ] Follow README exactly — no undocumented steps
- [ ] `claude agents list` shows `a11y-guard`
- [ ] `/wcag-check demo/src/components/LoginForm.tsx` returns violations
- [ ] `claude agents run a11y-guard` inside `demo/` finds 18+ violations, writes a11y-report.md
- [ ] Hook fires when Claude Code edits a `.tsx` or `.jsx` file
- [ ] Fix anything that requires setup not in the README

---

### 7. Write the Guide — `GUIDE.md`

- [ ] 800 words or fewer
- [ ] Written for an a11y engineer at the same company
- [ ] Peer-to-peer tone — not a tutorial
- [ ] Examples are accessibility-specific workflows
- [ ] Covers the three-file minimum
- [ ] Includes an 8-step copy-paste scaffold
- [ ] Common mistakes section (3 bullets)

---

### 8. Prepare the Demo Project

| File | Format | Key violations planted |
|------|--------|------------------------|
| `index.html` | HTML | Missing `lang` (3.1.1); global `outline:none` (2.4.7) |
| `LoginForm.tsx` | TSX | Placeholder-only inputs (1.3.1, 4.1.2); icon-only button (4.1.2); "Click here" link (2.4.4) |
| `DataTable.tsx` | TSX | Icon-only sort buttons (4.1.2); no caption or scope (1.3.1) |
| `Modal.tsx` | TSX | No role="dialog" (4.1.2); no focus trap (2.1.2); × close button (4.1.2) |
| `Navigation.jsx` | JSX | h1 to h3 skip (2.4.6); "Learn more" links (2.4.4) |
| `Dashboard.tsx` | TSX | div onClick (2.1.1); invalid ARIA (4.1.2); canvas no alt (1.1.1); spinner no aria-live (4.1.3) |

Mix of TSX and JSX is intentional — demonstrates the plugin works with both formats.

---

### 9. Record the Loom (5 minutes maximum)

- [ ] 0:00–0:30 — Persona, the vibe-coded UI problem, personal motivation
- [ ] 0:30–2:00 — Hook fires, /wcag-check Modal.tsx, claude agents run a11y-guard, open a11y-report.md
- [ ] 2:00–3:30 — How it was built: static analysis decision, steering Claude Code for user impact
- [ ] 3:30–4:30 — GUIDE.md walkthrough: three-file minimum, 8-step scaffold
- [ ] 4:30–5:00 — Repo link, what to build next (PR-diff mode)

---

### 10. Final Submission Checklist

- [ ] Repo public on GitHub
- [ ] README: what / who / install / try in under 5 minutes
- [ ] Fresh-clone install verified
- [ ] GUIDE.md is 800 words or fewer
- [ ] Loom is public and 5 minutes or under
- [ ] Three deliverables linked: repo URL, guide (in repo), Loom URL

---

## Non-Negotiables

- Agent does real work — no stubs, no TODO placeholders
- Plugin installs from README alone — no undocumented steps
- Loom is public and watchable without a Loom account
- Guide is written for the accessibility engineer, not for Anthropic

---

## Coding Standards

All code in this plugin follows these standards:

**Simple and human-readable.** No clever one-liners. If a longer version is clearer,
use it. Variable names are full English words (filePath, not fp; payload, not p).

**Document the WHY, not the WHAT.** Comments explain why a decision was made, not
just what the line does. "We collect stdin in chunks because Node.js receives stream
data in pieces, not all at once" is useful. "Collects data" is not.

**Written to teach.** Every file in .claude/ is a teaching artifact. A developer
reading it for the first time should finish understanding not just what it does but
why it is structured the way it is.

**Demo components are teaching examples.** Each has a comment block at the top listing
every intentional violation with its WCAG criterion and a plain-English explanation
of why it matters.
