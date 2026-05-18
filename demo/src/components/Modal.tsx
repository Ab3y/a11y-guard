/**
 * a11y-check Demo: Modal.tsx
 *
 * This component intentionally contains accessibility violations for demonstration
 * purposes. In a real project, these would be bugs to find and fix.
 *
 * This is a typical AI-generated confirmation modal. It looks correct visually,
 * but has multiple accessibility gaps that make it unusable for some users.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 1: Dialog container is a <div> with no role="dialog"
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 *
 * Why it matters:
 * When a modal opens, screen readers need to know it is a dialog so they can
 * announce it correctly and adjust their navigation mode. Without role="dialog",
 * this is just another div — the screen reader user may not realise a modal
 * has opened at all and continue interacting with content behind it.
 *
 * The fix: Add role="dialog" to the inner modal container.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 2: No aria-modal="true"
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 *
 * Why it matters:
 * Even with role="dialog", some screen readers (especially desktop screen readers
 * like NVDA and JAWS) will continue reading content behind the modal unless
 * aria-modal="true" is present. Without it, the user can interact with both the
 * modal and the page underneath simultaneously.
 *
 * The fix: Add aria-modal="true" to the dialog container.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 3: No aria-labelledby pointing to the dialog title
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 *
 * Why it matters:
 * When a dialog opens, screen readers announce its accessible name. Without
 * aria-labelledby, the dialog has no name. The user does not hear what the
 * dialog is about when it opens.
 *
 * The fix: Add aria-labelledby="modal-title" to the dialog container,
 * and id="modal-title" to the heading element inside it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 4: No focus management — focus does not move into the dialog on open
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 2.4.3 Focus Order (Level AA — Major)
 *
 * Why it matters:
 * When a modal opens, keyboard focus should move into the dialog. Without this,
 * a keyboard user's focus remains on whatever element was focused before the
 * modal opened — which is now hidden behind the overlay and no longer visible.
 * The user is effectively stuck.
 *
 * The fix: Use a useRef on the modal container and call .focus() on it inside
 * a useEffect that runs when isOpen changes to true.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 5: No focus trap — keyboard users can Tab out of the modal
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 2.1.2 No Keyboard Trap (Level A — Major in this context)
 *
 * Why it matters:
 * When a modal is open, pressing Tab should cycle through only the elements inside
 * the modal. Without a focus trap, Tab will eventually move focus outside the modal
 * to elements behind the overlay. The user can interact with the page while the
 * modal is still open.
 *
 * The fix: Add a keydown event listener that intercepts Tab and Shift+Tab to keep
 * focus cycling within the dialog's focusable elements.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VIOLATION 6: Close button uses the × symbol with no accessible name
 * ─────────────────────────────────────────────────────────────────────────────
 * WCAG: 4.1.2 Name, Role, Value (Level A — Critical)
 *
 * Why it matters:
 * The × character is not reliably announced as "close" by screen readers. Some
 * announce it as "times", some as "multiplication sign", some skip it. The user
 * does not know this button will close the dialog.
 *
 * The fix: Add aria-label="Close dialog" to the button.
 */

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({ isOpen, title, message, onConfirm, onCancel }: ModalProps) {

  // Do not render anything if the modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    // VIOLATION: Plain <div> — no role="dialog", no aria-modal, no aria-labelledby.
    // Screen readers do not recognise this as a dialog.
    <div className="modal-overlay" onClick={onCancel}>

      {/* Stop clicks inside the modal from closing it via the overlay click handler */}
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >

        <div className="modal-header">

          {/* This id would be referenced by aria-labelledby on the dialog container,
              but that connection is missing because the container has no aria-labelledby. */}
          <h3 id="modal-title">{title}</h3>

          {/* VIOLATION: The × character is the button's only content.
              Screen readers may announce "times" or "multiplication sign" instead of "Close". */}
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>

        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>

      </div>
    </div>
  );
}
