/**
 * a11y-guard Demo: DataTable.tsx
 *
 * This component intentionally contains accessibility violations for demonstration
 * purposes. In a real project, these would be bugs to find and fix.
 *
 * This is a typical AI-generated sortable data table. It looks and functions
 * correctly for sighted mouse users, but has gaps for keyboard and screen reader users.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 1: Table has no <caption> element
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 1.3.1 Info and Relationships (Level A — Minor)
 *
 * Why it matters:
 * When a screen reader user navigates to a table, they hear the table's accessible
 * name before entering it — like a heading for the table. Without a <caption>,
 * they have no context about what the table contains before navigating into the
 * cells. They may not know whether this table shows users, products, or orders.
 *
 * The fix: Add <caption>User accounts</caption> as the first child of <table>.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 2: Header cells (<th>) have no scope attribute
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 1.3.1 Info and Relationships (Level A — Minor)
 *
 * Why it matters:
 * The scope attribute tells screen readers whether a header cell applies to its
 * column (scope="col") or its row (scope="row"). Without scope, screen readers
 * may not correctly associate header cells with data cells in complex tables,
 * making it harder to understand which header applies to which value.
 *
 * The fix: Add scope="col" to each <th> in the header row.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 3: Sort buttons are icon-only with no accessible name
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 *
 * Why it matters:
 * The sort button contains an SVG icon marked with aria-hidden="true", which
 * correctly hides the icon from screen readers. However, that leaves the button
 * with absolutely no accessible name. Screen readers announce "button" with no
 * indication of what the button does, which column it sorts, or what the current
 * sort direction is.
 *
 * The fix: Add aria-label="Sort by name" to the button. If sort direction matters,
 * update it dynamically: aria-label="Sort by name, currently ascending".
 */

import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const DEMO_USERS: User[] = [
  { id: 1, name: 'Alice Chen',   email: 'alice@example.com', role: 'Admin',  status: 'Active'   },
  { id: 2, name: 'Bob Kato',     email: 'bob@example.com',   role: 'Editor', status: 'Active'   },
  { id: 3, name: 'Carol Davis',  email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
];

export default function DataTable() {
  const [users] = useState<User[]>(DEMO_USERS);

  function handleSort() {
    // Sorting logic would go here
    console.log('Sort triggered');
  }

  return (
    <div className="table-container">

      {/* VIOLATION: No <caption>. Screen reader users navigate to this table
          with no context about what it contains. */}
      <table>
        <thead>
          <tr>

            {/* VIOLATION: No scope="col" on any of these header cells. */}
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>
              {/* VIOLATION: The SVG is hidden from screen readers (aria-hidden="true"),
                  but the button itself has no label. Screen readers say "button" — nothing more.
                  A keyboard user cannot tell what this button will do. */}
              <button onClick={handleSort}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M7 10l5-5 5 5M7 14l5 5 5-5" stroke="currentColor" fill="none" strokeWidth="2" />
                </svg>
              </button>
            </th>

          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
