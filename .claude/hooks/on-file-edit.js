/**
 * a11y-guard: Hook Script
 * File: .claude/hooks/on-file-edit.js
 *
 * PURPOSE
 * -------
 * This script runs automatically after Claude Code edits or writes a frontend
 * file. Its job is simple: remind the developer to run /wcag-check on the file
 * that was just modified.
 *
 * HOW CLAUDE CODE CALLS THIS SCRIPT
 * ----------------------------------
 * Claude Code hooks work like this:
 *
 *   1. A tool runs (in our case, the Edit or Write tool).
 *   2. Claude Code starts this script as a child process.
 *   3. Claude Code sends a JSON description of what just happened through stdin
 *      (standard input — the same channel you use when you pipe data to a program).
 *   4. Anything this script writes to stdout appears in the Claude Code terminal.
 *   5. If this script exits with a non-zero code, Claude Code treats it as a
 *      hook error. We always exit with 0 so a failure here never blocks work.
 *
 * THE JSON PAYLOAD (what Claude Code sends via stdin)
 * ---------------------------------------------------
 * The payload is a JSON object that looks like this:
 *
 *   {
 *     "tool_name": "Edit",
 *     "tool_input": {
 *       "file_path": "/path/to/the/modified/file.tsx",
 *       ... other fields depending on the tool
 *     },
 *     "tool_output": { ... }
 *   }
 *
 * We only care about tool_input.file_path — the path of the file that was changed.
 *
 * WHY NODE.JS
 * -----------
 * Node.js is available in almost every frontend development environment. It gives
 * us a cross-platform way to read stdin and check file extensions without relying
 * on bash (which behaves differently on Mac, Linux, and Windows).
 */


// STEP 1: Collect the incoming data from Claude Code.
//
// stdin arrives as a stream, which means the data may come in multiple pieces
// (called "chunks") rather than all at once. We store each piece in this array
// and combine them once the stream is finished.
const chunks = [];


// STEP 2: Listen for each chunk of data as it arrives.
//
// The 'data' event fires each time a new chunk arrives from Claude Code.
// We push it into the chunks array to save it for later.
process.stdin.on('data', function(chunk) {
  chunks.push(chunk);
});


// STEP 3: Process the data once all chunks have arrived.
//
// The 'end' event fires when Claude Code has finished sending the payload.
// At this point we can safely combine all the chunks and parse the JSON.
process.stdin.on('end', function() {

  // We wrap everything in try/catch so that if anything goes wrong —
  // malformed JSON, unexpected payload structure, anything — the script
  // exits silently. Hook failures should never interrupt the developer's work.
  try {

    // Combine all the chunks into a single Buffer, then convert to a string,
    // then parse it as JSON to get the payload object.
    const rawData = Buffer.concat(chunks).toString();
    const payload = JSON.parse(rawData);

    // Extract the file path from the payload.
    // We use (payload.tool_input || {}) as a safety check: if tool_input is
    // missing or null for any reason, we fall back to an empty object so
    // that .file_path returns undefined instead of throwing an error.
    // The || '' at the end ensures filePath is always a string, never undefined.
    const filePath = (payload.tool_input || {}).file_path || '';

    // STEP 4: Check whether the modified file is a frontend component type
    // that a11y-guard covers.
    //
    // We use a regular expression to test the file extension:
    //   \. matches a literal dot
    //   (jsx|tsx|html|vue|svelte) matches any of these extensions
    //   $ means "end of string" so we match the extension at the end of the path
    const isFrontendFile = /\.(jsx|tsx|html|vue|svelte)$/.test(filePath);

    if (isFrontendFile) {

      // Extract just the filename from the full path for a cleaner message.
      // We split on both forward slashes (Mac/Linux paths) and backslashes
      // (Windows paths) using the regex /[/\\]/, then take the last segment.
      const filename = filePath.split(/[/\\]/).pop();

      // STEP 5: Print the alert to stdout.
      //
      // stdout is what appears in Claude Code's terminal output — and crucially,
      // Claude reads it too. We use this to surface a structured message that
      // Claude will present to the developer as a conversational prompt.
      //
      // WHY CLAUDE IS THE INTERMEDIARY
      // Hook scripts are non-interactive: they cannot pause and wait for user
      // input. They run, print, and exit. So instead of trying to prompt the
      // developer directly from the script, we print a message that Claude reads
      // and then presents as a choice in the conversation. Claude can then offer
      // three options on our behalf: fix now, defer to the todo list, or skip.
      //
      // The three options Claude will present:
      //   1. Fix now   → run /wcag-check <file> immediately
      //   2. Defer     → run /a11y-todo add <file> to track it for later
      //   3. Skip      → acknowledge and move on (nothing written)
      //
      // The separator lines make this message visually distinct in the terminal
      // so it does not get lost in other Claude Code output.
      process.stdout.write(
        '\n─────────────────────────────────────────\n' +
        'a11y-guard: ' + filename + ' was modified.\n' +
        'Check accessibility now, defer it, or skip:\n' +
        '  • Fix now  → /wcag-check ' + filePath + '\n' +
        '  • Defer    → /a11y-todo add ' + filename + ' — describe the issue\n' +
        '  • Skip     → just say "skip" to continue\n' +
        '─────────────────────────────────────────\n'
      );

    }

  } catch (error) {
    // Something went wrong (most likely a JSON parse error).
    // We exit silently — hook errors should never block Claude Code.
    // Exit code 0 tells Claude Code everything is fine.
  }

  // Always exit with code 0.
  process.exit(0);

});
