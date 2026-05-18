/**
 * a11y-check: Pre-Commit Hook Script
 * File: .claude/hooks/pre-commit.js
 *
 * PURPOSE
 * -------
 * This script runs automatically before Claude Code executes any Bash command.
 * Its job is to check whether a git commit is about to happen, and if so,
 * remind the developer of any deferred accessibility issues recorded in
 * a11y-todos.md. Nothing is blocked — the commit still runs. This is a
 * "last call" reminder so issues are not accidentally shipped.
 *
 * WHY PreToolUse INSTEAD OF PostToolUse
 * --------------------------------------
 * PostToolUse fires AFTER a tool runs — too late for a commit reminder.
 * PreToolUse fires BEFORE the tool runs, so the developer sees the warning
 * before the commit completes. If they want to fix something first, they can
 * cancel the commit and address the issue.
 *
 * WHY THE BASH MATCHER INSTEAD OF A GIT-SPECIFIC HOOK
 * -----------------------------------------------------
 * Claude Code does not have a dedicated git commit hook type. The Bash matcher
 * covers all shell commands Claude runs, including git commands. This script
 * inspects the command string and exits immediately if it is not a git commit —
 * so the overhead for all other Bash commands is negligible (a quick string check
 * and an exit).
 *
 * HOW CLAUDE CODE CALLS THIS SCRIPT
 * ----------------------------------
 * Same pattern as on-file-edit.js:
 *   1. Claude is about to run a Bash command.
 *   2. Claude Code starts this script as a child process.
 *   3. The JSON payload arrives via stdin.
 *   4. Whatever we write to stdout appears in the Claude Code terminal.
 *   5. Exit code 0 means "no problem, continue." A non-zero exit code would
 *      block the command. We always exit 0 — we inform, never block.
 *
 * THE JSON PAYLOAD STRUCTURE (PreToolUse / Bash)
 * -----------------------------------------------
 * {
 *   "tool_name": "Bash",
 *   "tool_input": {
 *     "command": "git commit -m \"my message\"",
 *     "description": "..."
 *   }
 * }
 *
 * We read tool_input.command to detect whether this is a git commit.
 */

const fs = require('fs');
const path = require('path');


// STEP 1: Collect stdin chunks — same pattern as on-file-edit.js.
// The JSON payload from Claude Code arrives as a stream.
const chunks = [];

process.stdin.on('data', function(chunk) {
  chunks.push(chunk);
});


process.stdin.on('end', function() {

  try {

    const rawData = Buffer.concat(chunks).toString();
    const payload = JSON.parse(rawData);

    // STEP 2: Extract the command string from the payload.
    // We use (payload.tool_input || {}) as a safety check in case tool_input
    // is absent. The || '' ensures command is always a string, never undefined.
    const command = (payload.tool_input || {}).command || '';

    // STEP 3: Check whether this is a git commit command.
    // If it is not, exit immediately — no output, no delay, no effect.
    // This keeps the hook invisible for all non-commit Bash commands.
    const isGitCommit = command.includes('git commit');

    if (!isGitCommit) {
      process.exit(0);
    }

    // STEP 4: Check whether an a11y-todos.md file exists in the project root.
    // process.cwd() returns the directory where Claude Code is running, which
    // is the project root. If no todos file exists, nothing has been deferred
    // and there is nothing to warn about.
    const todosPath = path.join(process.cwd(), 'a11y-todos.md');

    if (!fs.existsSync(todosPath)) {
      // No todos file means no deferred issues. Exit silently.
      process.exit(0);
    }

    // STEP 5: Read the todos file and find open items.
    // Open items are lines that start with "- [ ]" (an unchecked checkbox in
    // GitHub Flavored Markdown). Resolved items start with "- [x]".
    const todosContent = fs.readFileSync(todosPath, 'utf8');
    const allLines = todosContent.split('\n');
    const openItems = allLines.filter(function(line) {
      return line.trimStart().startsWith('- [ ]');
    });

    // STEP 6: Print the pre-commit summary.
    //
    // If there are no open items, print a positive confirmation so the developer
    // knows the check ran and everything is clear.
    //
    // If there are open items, list each one and remind the developer that they
    // can address them now or accept the known risk and commit anyway. The commit
    // is never blocked — only surfaced.

    if (openItems.length === 0) {

      process.stdout.write(
        '\n─────────────────────────────────────────\n' +
        'a11y-check: No deferred accessibility issues. Good to ship.\n' +
        '─────────────────────────────────────────\n'
      );

    } else {

      const count = openItems.length;
      const plural = count === 1 ? 'issue' : 'issues';

      process.stdout.write(
        '\n─────────────────────────────────────────\n' +
        'a11y-check: ' + count + ' deferred accessibility ' + plural + ' outstanding:\n\n' +
        openItems.map(function(item) { return '  ' + item.trim(); }).join('\n') + '\n\n' +
        'Run /wcag-check on these files before committing, or accept the known risk.\n' +
        '─────────────────────────────────────────\n'
      );

    }

  } catch (error) {
    // Something went wrong (JSON parse error, file read error, etc.).
    // Exit silently — hook errors must never block the developer's work.
  }

  // Always exit with code 0. We inform, never block.
  process.exit(0);

});
