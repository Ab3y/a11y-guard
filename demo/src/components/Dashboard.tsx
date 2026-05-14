/**
 * a11y-guard Demo: Dashboard.tsx
 *
 * This component represents a typical AI-generated dashboard page.
 * It intentionally contains accessibility violations for demonstration
 * purposes. In a real project, these would be bugs to find and fix.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 1: <div> used as a button — no role, no keyboard support
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 2.1.1 Keyboard (Level A — Critical)
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 *
 * Why it matters:
 * A <div> is not a native interactive element. It cannot receive keyboard focus
 * by default, so keyboard-only users cannot reach it with Tab. It is also not
 * announced as a button by screen readers — they may not even mention it.
 *
 * This is the "div-based button" pattern. It is extremely common in AI-generated
 * interfaces because visually it looks identical to a real button.
 *
 * The fix: Replace with a <button> element. Browsers handle all the keyboard
 * interaction and screen reader announcements automatically.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 2: aria-label applied to a non-interactive <div> with no role
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.2 Name, Role, Value (Level A — Minor / Excessive ARIA)
 *
 * Why it matters:
 * aria-label is designed to provide an accessible name for interactive elements
 * and landmarks (like <nav>, <main>, <button>). Applying it to a plain <div>
 * that has no role and is not interactive has no meaningful effect — the label
 * is in the accessibility tree but nothing references it.
 *
 * This is an example of "excessive ARIA" — adding aria attributes that look
 * helpful but do not actually improve accessibility. AI coding tools often
 * add ARIA like this when asked to "make the code more accessible."
 *
 * The fix: Either remove the aria-label, or give the div a meaningful role
 * (such as role="region") if it is intended to be a navigable page section.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 3: <canvas> chart element with no text alternative
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 1.1.1 Non-text Content (Level A — Critical)
 *
 * Why it matters:
 * A <canvas> element renders graphics as pixels. Screen readers cannot interpret
 * the visual content. Without a text alternative, a blind user who navigates to
 * this chart receives no information about the data it shows.
 *
 * The fix: Add a text alternative as the fallback content inside the canvas:
 *   <canvas id="revenue-chart">
 *     Revenue increased from $120k in January to $180k in June.
 *   </canvas>
 * Or use aria-label on the canvas: aria-label="Bar chart showing monthly revenue"
 * Or provide a data table below the chart as an alternative representation.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 4: Loading spinner with no aria-live region
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.3 Status Messages (Level AA — Major)
 *
 * Why it matters:
 * When the loading state changes, sighted users see a spinner appear or disappear.
 * Screen reader users are not automatically notified of changes to page content
 * unless those changes happen inside an aria-live region.
 *
 * Without aria-live, a screen reader user who triggers the data refresh has no
 * way of knowing whether the data is still loading or has finished loading.
 *
 * The fix: Wrap the loading indicator in an aria-live region:
 *   <div aria-live="polite" aria-atomic="true">
 *     {isLoading && <div>Loading data, please wait.</div>}
 *   </div>
 */

import React, { useState } from 'react';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);

  function handleRefresh() {
    setIsLoading(true);
    // Simulate a data fetch completing after 2 seconds
    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    // VIOLATION: No <main> landmark. Screen reader users cannot jump directly
    // to the main content area of the page. (Minor / Best Practice)
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>

        {/* VIOLATION: <div> with onClick — not a real button.
            Cannot be focused by keyboard. Not announced as a button.
            Should be <button onClick={handleRefresh}>Refresh Data</button> */}
        <div
          className="refresh-button"
          onClick={handleRefresh}
        >
          Refresh Data
        </div>

      </div>

      {/* VIOLATION: aria-label on a plain <div> with no role.
          The label has no effect. The div is not interactive or a landmark.
          This is excessive ARIA that adds noise without helping anyone. */}
      <div className="stats-section" aria-label="Key statistics">
        <div className="stat-card">
          <span className="stat-value">1,284</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">94%</span>
          <span className="stat-label">Uptime</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">$48k</span>
          <span className="stat-label">Revenue</span>
        </div>
      </div>

      {/* VIOLATION: <canvas> with no text alternative.
          A blind user navigating to this element receives no information
          about what the chart shows or what data it contains. */}
      <div className="chart-container">
        <h2>Monthly Revenue</h2>
        <canvas id="revenue-chart" width="600" height="300"></canvas>
      </div>

      {/* VIOLATION: The loading state changes but there is no aria-live region.
          Screen reader users are not notified when loading starts or finishes. */}
      {isLoading && (
        <div className="loading-spinner">
          Loading data...
        </div>
      )}

    </div>
  );
}
