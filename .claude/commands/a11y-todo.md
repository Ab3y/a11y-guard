---
name: a11y-todo
description: Manage deferred accessibility issues — add, list, or resolve items in your a11y todo list
---

# /a11y-todo — Deferred Accessibility Issue Tracker

Use this command to track accessibility issues you want to fix later rather than right now.
The pre-commit hook reads `a11y-todos.md` automatically before every `git commit` and
surfaces any open items as a reminder so nothing ships overlooked.

For an immediate accessibility check on a file, use `/a11y-check` instead.
For a full project audit with a persistent report, run `claude agents run a11y-check`.

---

## Usage

```
/a11y-todo add <file> — <description>
/a11y-todo list
/a11y-todo done <file>
```

---

## What each operation does

### add

Adds a new open item to `a11y-todos.md`. Creates the file if it does not exist yet.

Example:
```
/a11y-todo add LoginForm.tsx — placeholder inputs have no labels (WCAG 4.1.2)
```

When you run this command:
1. Read `a11y-todos.md` from the project root (or note that it does not exist yet)
2. If the file does not exist, create it with this structure:
   ```
   # a11y-check — Deferred Accessibility Issues

   Issues flagged during development that have not yet been addressed.
   Run /a11y-check on any open item before shipping.

   ## Open

   ## Resolved
   ```
3. Append the new item as a checkbox line under `## Open`:
   `- [ ] LoginForm.tsx — placeholder inputs have no labels (WCAG 4.1.2)`
4. Write the updated file
5. Confirm in the chat: "Added to a11y-todos.md: LoginForm.tsx — placeholder inputs have no labels"

---

### list

Shows all open and resolved items from `a11y-todos.md`.

Example:
```
/a11y-todo list
```

When you run this command:
1. Read `a11y-todos.md` from the project root
2. If the file does not exist, respond: "No deferred accessibility issues. Your a11y-todos.md is empty or does not exist yet."
3. If it exists, print a formatted summary in the chat:
   - Count of open items and resolved items
   - All open items listed clearly
   - All resolved items listed (greyed out or with a checkmark)

---

### done

Marks an open item as resolved in `a11y-todos.md`.

Example:
```
/a11y-todo done LoginForm.tsx
```

When you run this command:
1. Read `a11y-todos.md` from the project root
2. Find all open items (`- [ ]`) that match the filename provided
3. Change matching items from `- [ ]` to `- [x]` (resolved checkbox)
4. If the item was under `## Open`, move it to `## Resolved`
5. Write the updated file
6. Confirm in the chat: "Marked as resolved: LoginForm.tsx — placeholder inputs have no labels"
7. If no matching open item is found, respond: "No open item found for LoginForm.tsx. Use /a11y-todo list to see current items."

---

## The a11y-todos.md format

```markdown
# a11y-check — Deferred Accessibility Issues

Issues flagged during development that have not yet been addressed.
Run /a11y-check on any open item before shipping.

## Open

- [ ] LoginForm.tsx — placeholder inputs have no labels (WCAG 4.1.2)
- [ ] Modal.tsx — no focus trap, close button unnamed (WCAG 2.1.2, 4.1.2)

## Resolved

- [x] Dashboard.tsx — div-based button replaced with <button> element
```

You can also edit `a11y-todos.md` manually — it is a plain markdown file.
The pre-commit hook reads it as-is, looking for lines that start with `- [ ]`.
