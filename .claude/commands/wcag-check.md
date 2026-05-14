---
name: wcag-check
description: Quick inline accessibility check for a single file or snippet — conversational feedback while you code
---

# wcag-check — Inline Accessibility Checker

This is a slash command for quick, conversational accessibility feedback while you
are actively writing or reviewing code.


## When to use this command vs. the agent

Use `/wcag-check` when:
- You just finished writing a component and want a quick review before moving on
- You are in a conversation about a specific file and want inline feedback
- You want to paste a code snippet and ask "is this accessible?"

Use `claude agent run a11y-guard` instead when:
- You want to audit an entire project across all frontend files
- You need a written report file (a11y-report.md) to share with your team or store in the repo
- You are running a formal accessibility review session


## How to invoke this command

Three ways to use it:

  1. Check a specific file by path:
     /wcag-check src/components/LoginForm.tsx

  2. Check a code snippet — paste code after the command:
     /wcag-check
     [paste your component code here]

  3. Check the file currently being discussed in the conversation:
     /wcag-check


---


## What to check

Analyze the provided file or code snippet against these 8 accessibility categories.
These categories cover the most common accessibility failures in AI-generated
frontend code.


**Category 1 — Semantic HTML** (div-based buttons)
- <div> or <span> used as a button or interactive element without role and keyboard support
- Missing landmark regions: <main>, <nav>, <header>, <footer>
- Wrong element used for its visual appearance rather than its meaning


**Category 2 — Keyboard Accessibility** (missing keyboard support)
- onClick on a non-interactive element without a matching keyboard event handler
- tabIndex values greater than 0
- Interactive elements that cannot be reached by keyboard
- Modals without a focus trap


**Category 3 — Form Accessibility** (placeholder-as-label)
- <input>, <select>, or <textarea> with only placeholder text, no label
- <fieldset> without a <legend>
- Error messages not linked to their field via aria-describedby
- Required fields missing the required or aria-required attribute


**Category 4 — Screen Reader Support**
- <img> missing the alt attribute
- aria-hidden="true" on an element that can receive keyboard focus
- Dynamic content updates (loading states, alerts) without an aria-live region


**Category 5 — Accessible Naming** (icon-only controls)
- <button> with no text, no aria-label, no aria-labelledby — screen reader says "button"
- <a> with no text content or accessible label
- Icon-only buttons: SVG or image as the sole button content with no label


**Category 6 — Heading Structure** (skipped hierarchy)
- Skipped heading levels (e.g. h1 followed directly by h3)
- Multiple <h1> elements on the same page
- Headings used for visual styling rather than content structure


**Category 7 — Modal Accessibility** (inaccessible modals)
- Dialog container missing role="dialog" or role="alertdialog"
- Missing aria-modal="true"
- Missing aria-labelledby pointing to the dialog title
- No focus management when the modal opens
- No focus trap to keep keyboard users inside the modal
- Close button with no accessible name


**Category 8 — ARIA Validation** (excessive ARIA)
- aria-* attributes on elements that do not support them
- aria-label applied to non-interactive elements with no role
- Redundant ARIA that duplicates what native HTML already provides
- aria-controls pointing to a non-existent element ID


---


## Output format

Group findings by severity. Use this format for each finding:

  [SEVERITY] WCAG X.X.X — Short descriptive title
  Issue:  What is technically wrong in the code.
  Impact: Who is affected and what they actually experience. Be specific —
          not "screen reader users may struggle" but "VoiceOver announces
          'button' with no context — the user cannot tell what this does."
  Fix:    The corrected code as a minimal change.

End your response with:

  Summary: N Critical · N Major · N Minor

  Note: This is static code analysis. For complete testing, follow up with
  manual screen reader testing (NVDA, JAWS, VoiceOver) and keyboard-only
  navigation.

If no issues are found, respond with:

  ✓ No accessibility issues detected in this file.

  Note: This covers static analysis only. Runtime testing is still recommended.
