/**
 * a11y-check Demo: Navigation.jsx
 *
 * This file is intentionally kept as plain JavaScript React (.jsx) rather than
 * TypeScript React (.tsx). This demonstrates that a11y-check works with both
 * file formats in the same project.
 *
 * This component intentionally contains accessibility violations for demonstration
 * purposes. In a real project, these would be bugs to find and fix.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 1: Skipped heading hierarchy (h1 is the page title, this jumps to h3)
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 2.4.6 Headings and Labels (Level AA — Minor)
 *
 * Why it matters:
 * Screen reader users navigate pages by heading, much like a table of contents.
 * When a screen reader user asks "what headings are on this page?", they expect
 * to see a logical outline: h1 (page title), h2 (main sections), h3 (subsections).
 *
 * Jumping from h1 to h3 creates a gap. The user may assume they missed some
 * content, or that the page structure is broken.
 *
 * The fix: Use <h2> here instead of <h3>, or restructure the heading hierarchy
 * to ensure no levels are skipped.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 2: Non-descriptive link text ("Learn more", "Read more")
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 2.4.4 Link Purpose in Context (Level AA — Major)
 *
 * Why it matters:
 * Screen reader users can open a list of all links on the page and navigate
 * through them without reading the surrounding text. When every link in the
 * navigation says "Learn more" or "Read more", this list becomes useless —
 * the links are indistinguishable from each other.
 *
 * The fix: Use descriptive link text that makes sense on its own:
 *   <a href="/products">Products</a>
 *   <a href="/pricing">Pricing</a>
 *   <a href="/about">About us</a>
 *
 * Or, if the design requires "Learn more" text visually, use aria-label to
 * provide a descriptive name:
 *   <a href="/products" aria-label="Learn more about our products">Learn more</a>
 */

import React from 'react';

export default function Navigation() {
  return (
    <nav className="sidebar-nav">

      {/* VIOLATION: This jumps from the page's <h1> directly to <h3>.
          There is no <h2> on this page, creating a gap in the heading hierarchy. */}
      <h3 className="nav-section-title">Quick Links</h3>

      <ul className="nav-list">

        {/* VIOLATION: "Learn more" appears three times as link text.
            In a screen reader link list, these three links are identical. */}
        <li>
          <a href="/products">Learn more</a> about our products
        </li>
        <li>
          <a href="/pricing">Read more</a> about pricing
        </li>
        <li>
          <a href="/about">Learn more</a> about our company
        </li>

      </ul>

    </nav>
  );
}
