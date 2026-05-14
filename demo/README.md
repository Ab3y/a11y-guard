# a11y-guard Demo Project

This folder contains a small frontend project with **intentional accessibility violations**
for testing and demonstrating the a11y-guard plugin.

You do not need to build or run this project. The components are used for static analysis
by the agent and slash command.

---

## What is in here

| File | Format | Violations |
|------|--------|------------|
| `index.html` | HTML | Missing `lang` attribute; global `outline: none` in CSS |
| `src/components/LoginForm.tsx` | TSX | Placeholder-only inputs; icon-only button; "Click here" link |
| `src/components/DataTable.tsx` | TSX | Icon-only sort buttons; missing table caption and scope |
| `src/components/Modal.tsx` | TSX | Div-as-dialog; no focus trap; × close button with no label |
| `src/components/Navigation.jsx` | JSX | Skipped heading levels; non-descriptive link text |
| `src/components/Dashboard.tsx` | TSX | Div-based button; excessive ARIA; canvas with no alt text |

The mix of `.tsx` and `.jsx` is intentional — it shows the plugin works with both
TypeScript and JavaScript React in the same project.

---

## How to use

Run the agent from this directory:

```bash
claude agents run a11y-guard
```

Expected output: approximately 18–20 violations across 6 files, with an `a11y-report.md`
written to this folder.

Or check a single file with the slash command:

```
/wcag-check src/components/Modal.tsx
```

---

## Learning from the violations

Each component has a comment block at the top explaining every violation in plain
English — the WCAG criterion, why it matters, and what the fix looks like. These
comments make the demo files useful as teaching examples, not just broken code.
