import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called after the dialog has fully closed and focus has returned to the trigger. */
  onAfterClose?: () => void;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/** Closing waits for the CSS transition (zero under reduced motion), then calls el.close(). */
function closeAnimated(el: HTMLDialogElement, done: () => void) {
  if (!el.open) return done();
  el.removeAttribute('data-open');
  const ms = parseFloat(getComputedStyle(el).transitionDuration) * (getComputedStyle(el).transitionDuration.endsWith('ms') ? 1 : 1000);
  const finish = () => {
    el.removeEventListener('transitionend', finish);
    if (el.open) el.close();
    done();
  };
  if (!(ms > 2)) return finish();
  el.addEventListener('transitionend', finish, { once: true });
  window.setTimeout(finish, ms + 100);
}

/**
 * Native modal `<dialog>`: top layer, inert background, focus trap and Escape come from the platform.
 * Focus returns to the trigger on close. Click on the backdrop (the dialog element itself) closes.
 */
export function ModalDialog({ open, onClose, onAfterClose, labelledBy, className, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const after = useRef(onAfterClose);
  after.current = onAfterClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('data-open', '')));
    } else if (!open && el.open) {
      closeAnimated(el, () => after.current?.());
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`dialog ${className ?? ''}`}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        // Keep Tab inside the dialog (wraps first <-> last).
        if (e.key !== 'Tab') return;
        const items = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'),
        ).filter((n) => n.offsetParent !== null || n === document.activeElement || n.matches('input'));
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === e.currentTarget)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
