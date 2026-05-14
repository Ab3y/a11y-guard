/**
 * a11y-guard Demo: LoginForm.tsx
 *
 * This component intentionally contains accessibility violations for demonstration
 * purposes. In a real project, these would be bugs to find and fix.
 *
 * This file uses TypeScript React (.tsx) — the dominant format in enterprise
 * React and Next.js codebases.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 1: Input fields use placeholder text as the only label
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 1.3.1 Info and Relationships (Level A — Critical)
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 *
 * Why it matters:
 * Placeholder text has two problems as a label substitute:
 *   1. It disappears the moment the user starts typing, leaving them with
 *      no reminder of what the field expects.
 *   2. Screen readers do not reliably announce placeholder as a label.
 *      A blind user pressing Tab to move to this field will hear "Edit text"
 *      with no indication of what information is expected.
 *
 * The fix: Add a visible <label> element linked to each input with htmlFor,
 * or add an aria-label attribute if a visible label is not possible.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 2: Submit button contains only an image with no alt text
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 * WCAG: 1.1.1 Non-text Content (Level A — Critical)
 *
 * Why it matters:
 * The button has no accessible name. The image inside it also has no alt text.
 * Screen readers announce "button" — the user has no idea what activating it will do.
 * Is it a submit button? A cancel button? A search button? Unknown.
 *
 * The fix: Add an aria-label to the button: aria-label="Sign in"
 * Also add alt text to the image: alt="" (empty alt is correct here since the
 * button's aria-label already provides the name, making the image decorative).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 3: Non-descriptive link text ("Click here")
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 2.4.4 Link Purpose in Context (Level AA — Major)
 *
 * Why it matters:
 * Screen reader users often navigate by pulling up a list of all links on the
 * page and reading through them out of context. When a link says "Click here",
 * the user has no way to know where it goes or what it does.
 *
 * The fix: Use descriptive link text: <a href="/forgot-password">Reset your password</a>
 */

import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onLogin(email, password);
  }

  return (
    <div className="login-container">
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>

        {/* VIOLATION: No <label>. Only a placeholder.
            Screen reader users hear "Edit text" — no context about what to enter. */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* VIOLATION: Same problem for the password field. */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* VIOLATION: Icon-only button. The image has no alt attribute.
            Screen readers announce "button" — no indication this submits the form. */}
        <button type="submit">
          <img src="/icons/arrow-right.svg" />
        </button>

        {/* VIOLATION: "Click here" provides no context about what the link does.
            In a screen reader link list, this is meaningless. */}
        <a href="/forgot-password">Click here</a> to reset your password.

      </form>
    </div>
  );
}
