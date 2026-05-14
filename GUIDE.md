# Build Your Own Claude Code Plugin

*A guide for enterprise accessibility engineers who want to automate a different workflow*

---

## What a Claude Code plugin is

A plugin is three things working together. An **agent** does the heavy lifting — it
reads files, runs logic across an entire project, and writes output. A **slash command**
is a quick one-off check you run during a conversation. A **hook** is a trigger that
fires automatically when something happens, like when a file is edited. Together they
turn a repetitive manual task into a command you run in seconds.

---

## Is your workflow a good plugin candidate?

Ask yourself: can I describe this task in two sentences — what goes in, and what comes out?

If yes, it is a plugin candidate. Some accessibility-specific examples:

- "I paste a VPAT section and get a gap analysis against WCAG 2.1 AA." ✓
- "I give it a pull request diff and it flags which changed components introduced new
  accessibility regressions." ✓
- "I point it at a component and it generates NVDA and JAWS test cases for the most
  likely screen reader interactions." ✓

If you cannot describe the inputs and outputs clearly, the task is probably not ready
to automate yet. Define it first, then build the plugin.

---

## The three-file minimum

You need three files to build a working plugin.

**1. The agent file** — `.claude/agents/your-plugin.md`

This is where the orchestration logic lives. The agent reads files, runs analysis,
and produces output. You write it as a set of clear numbered steps. Claude Code
follows those steps using real tools: Glob to find files, Read to open them, Write
to save results, Bash to run commands. Run it with `claude agent run your-plugin`.

**2. The slash command file** — `.claude/commands/your-command.md`

This is a reusable prompt for a single, focused task. A developer invokes it with
`/your-command` during a conversation to get quick inline feedback. The output stays
in the chat — no file is written. It is the "quick check" version of your agent.

**3. The settings file** — `.claude/settings.json`

This wires up your hooks. Hooks run shell commands automatically in response to
Claude Code events: after a tool runs (`PostToolUse`), before a prompt is submitted
(`UserPromptSubmit`), or when a session starts or stops. For most plugins, a
`PostToolUse` hook on the `Edit` tool is enough — it fires after any file is edited.

---

## Scaffold in 8 steps

Follow these steps from an empty directory to a working plugin.

**Step 1** — Create the plugin folders inside your project root:
```bash
mkdir -p .claude/agents .claude/commands .claude/hooks
```

**Step 2** — Create the agent file. Add a YAML frontmatter block at the top:
```
---
name: your-plugin
description: One sentence explaining what this agent does
model: claude-sonnet-4-6
tools:
  - Read
  - Write
  - Glob
  - Bash
---
```

**Step 3** — Write the agent body as numbered steps. Be explicit: describe what
to find, what to look for, what to produce, and where to write the output.

**Step 4** — Create the slash command file with frontmatter:
```
---
name: your-command
description: One sentence explaining what this command does
---
```

**Step 5** — Write the slash command body. Describe the single task it performs and
the exact output format you want. Reference the agent for the full version.

**Step 6** — Create the hook script at `.claude/hooks/your-hook.js`. Read stdin,
check whether the modified file is relevant, print a message to stdout if it is.
Keep it simple and always exit with code 0 so failures are silent.

**Step 7** — Create `.claude/settings.json` and wire up the hook.

`PostToolUse` fires *after* a tool runs — right for file-edit alerts:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/your-hook.js" }]
      }
    ]
  }
}
```

`PreToolUse` fires *before* a tool runs — right for pre-commit checks or blocking
dangerous operations. a11y-guard uses this on the `Bash` matcher to surface deferred
accessibility todos before every `git commit`. The hook inspects the command string
and exits silently for any command that is not a git commit:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/pre-commit.js" }]
      }
    ]
  }
}
```

**Step 8** — Verify the install:
```bash
claude agent list
```
Your agent should appear in the list. If it does not, check the most common mistakes below.

---

## Common mistakes

**Wrong folder location.** Agents must be in `.claude/agents/`, slash commands in
`.claude/commands/`. A file in the wrong folder will not appear in `claude agent list`
and will not autocomplete as a slash command. Double-check the path.

**Missing or malformed frontmatter.** The `name` and `description` fields in the
YAML block are required. Claude Code uses them to register the agent or command.
If the frontmatter block is missing, misformatted, or has a typo in the field name,
the file will be silently ignored.

**Hook scoped to the wrong settings file.** There are two settings locations:
`.claude/settings.json` (project-level, applies only when you are in this project)
and `~/.claude/settings.json` (global, applies in every project). Put your hook in
the project-level file unless you genuinely want it everywhere.

---

## Where to go deeper

- [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) —
  full reference for agents, slash commands, hooks, and settings
- The a11y-guard source in this repo — read `.claude/agents/a11y-guard.md` and
  trace through the logic to see how a real agent is structured
- The hook script at `.claude/hooks/on-file-edit.js` — fully commented, explains
  exactly how Claude Code hook payloads work
