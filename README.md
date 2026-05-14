# a11y-guard

A Claude Code plugin that reviews AI-generated frontend code for accessibility issues,
explains who is affected and how, and suggests practical fixes — without leaving your editor.

`Claude Code` · `WCAG 2.1 AA` · `Static Analysis`


---


## The Problem

AI coding tools (Cursor, Copilot, Claude Code) generate React and Next.js components in
seconds. Accessibility does not come included.

These tools routinely produce the same failures:

- Placeholder text used instead of label elements
- Icon-only controls with no accessible name
- Div-based buttons that cannot be reached by keyboard
- Inaccessible modal implementations with no role, focus management, or focus trap
- Excessive or invalid ARIA added without understanding its effect
- Skipped heading hierarchy that breaks screen reader navigation
- Missing keyboard support for interactive elements

Enterprise accessibility teams are often responsible for reviewing hundreds of components
across many repositories with limited staffing. Issues discovered late — after development,
after QA, after a legal complaint — are significantly more expensive to fix.

a11y-guard shifts accessibility review earlier into the development workflow.


---


## Why I Built This

I am hard of seeing. I rely on browser zoom, screen readers, and enlarged interfaces
to use computers — especially at night after removing contact lenses. When a developer
ships an inaccessible interface, it is not just a compliance problem for their company.
It is a wall that prevents me from completing basic tasks.

This plugin is built from that lived experience. The goal is to make the gap between
fast AI-generated code and accessible user experiences smaller.


---


## Who This Is For

- **Enterprise Accessibility QA Engineers** responsible for reviewing high component
  volume with limited staffing — use the agent to automate first-pass review so you
  can focus on complex usability and assistive technology testing
- **Frontend developers** building with AI tools who want inline accessibility
  guardrails while coding
- **Teams** that want to shift accessibility review earlier without adding a manual
  review bottleneck

**What this plugin is not:** It is not a replacement for professional accessibility
review, manual screen reader testing (NVDA, JAWS, VoiceOver), or WCAG certification.
The hard work of accessibility still requires human judgment. This handles the
repetitive mechanical part.


---


## How It Works

### The Agent — for audits and review sessions

```bash
claude agent run a11y-guard
```

Scans every `.jsx`, `.tsx`, `.html`, `.vue`, and `.svelte` file in the project across
8 accessibility categories. For each violation it explains the technical issue, who is
affected, and the exact minimal fix. Writes a persistent `a11y-report.md` to the project
root. Use this at the start of a review session, before a release, or after a sprint
of AI-assisted development.

### The Slash Command — for inline development feedback

```
/wcag-check src/components/LoginForm.tsx
```

Quick conversational check on a single file or pasted snippet. Responds in the chat
and keeps the conversation going — no file is written. Use this while coding to get
immediate feedback before finishing a component.

### The Hook — automatic reminders

After Claude Code edits any frontend file, a hook fires automatically and prints a
one-line reminder to run `/wcag-check` on the modified file. The hook does not
auto-fix anything — accessibility remediation stays in the developer's hands.


---


## Accessibility Categories

Both the agent and the slash command check these 8 categories:

| Category | What it checks |
|---|---|
| Semantic HTML | Div-based buttons, missing landmark regions |
| Keyboard accessibility | onClick without keyboard handler, broken tab order |
| Form accessibility | Placeholder-as-label, missing error associations |
| Screen reader support | Missing alt text, aria-hidden on focusable elements |
| Accessible naming | Icon-only controls, unnamed buttons and links |
| Heading structure | Skipped levels, multiple H1 elements |
| Modal accessibility | Missing role, aria-modal, focus management, focus trap |
| ARIA validation | Invalid or excessive ARIA usage |


---


## Prerequisites

- [Claude Code CLI](https://claude.ai/code) installed and authenticated
  Verify: `claude --version`
- Node.js 18 or later (required for the hook script)
  Verify: `node --version`
- A frontend project containing `.jsx`, `.tsx`, `.html`, `.vue`, or `.svelte` files


---


## Install

**Step 1 — Clone this repo**

```bash
git clone https://github.com/Ab3y/a11y-guard.git
```

**Step 2 — Copy the plugin into your project**

Mac / Linux:
```bash
cp -r a11y-guard/.claude /path/to/your-project/.claude
```

Windows (PowerShell):
```powershell
Copy-Item -Recurse a11y-guard\.claude your-project\.claude
```

The `.claude/` folder contains the agent, slash command, hook script, and settings.
No `npm install` is required.

**Step 3 — Verify the install**

```bash
cd your-project
claude agent list
```

You should see `a11y-guard` in the list.


---


## Try It

**Run a full project audit:**
```bash
claude agent run a11y-guard
```
This scans every frontend file and writes `a11y-report.md` to your project root.

**Check a single file inline:**
```
/wcag-check src/components/LoginForm.tsx
```

**Try the demo project:**
```bash
cd demo
claude agent run a11y-guard
```
The `demo/` folder contains intentional violations. You should see approximately
18–20 findings across 6 files.


---


## Sample Output

`a11y-report.md` looks like this:

```markdown
## Critical Findings (Level A — Must Fix)

**[LoginForm.tsx:28] WCAG 4.1.2 — Input has no accessible name**
Issue:  <input type="email" placeholder="Email address" /> has no associated label,
        no aria-label, and no aria-labelledby.
Impact: Screen reader users hear "Edit text" with no context about what information
        this field expects. The placeholder disappears when they start typing, leaving
        them with no label at all.
Fix:    <label htmlFor="email">Email address</label>
        <input id="email" type="email" placeholder="Email address" />
```


---


## Understanding the Report

`a11y-report.md` is a **static code analysis** report. It identifies issues visible
in the source code. It cannot check:

- Colour contrast ratios (requires computed CSS)
- Focus indicator visibility (requires rendered output)
- How a screen reader actually announces content (requires runtime testing)

Use this report as a first pass. Follow up with manual testing using NVDA, JAWS, or
VoiceOver before a release. This is a tool to reduce repetitive review work, not to
replace the accessibility review process.


---


## Contributing and Extending

- To add a new accessibility check, extend the agent prompt in
  `.claude/agents/a11y-guard.md`
- To build a different plugin workflow for your team, see `GUIDE.md`
- Pull requests welcome — especially for Vue and Svelte-specific patterns and
  additional ARIA validation rules
