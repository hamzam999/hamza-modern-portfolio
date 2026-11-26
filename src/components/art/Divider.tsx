export type DividerKind = 'sprocket' | 'perf' | 'tear' | 'ticket';

const TICKET_TEXT = 'ADMIT ONE · LEVEL 06 · OPEN DOOR · ADMIT ONE · LEVEL 06 · OPEN DOOR · ADMIT ONE';

/** Decorative strip between two levels (CSS only, no motion). aria-hidden; never focusable. */
export function Divider({ kind, tone }: { kind: DividerKind; tone?: 'accent' }) {
  return (
    <div aria-hidden="true" className={`divider divider--${kind}${tone ? ` divider--${tone}` : ''}`}>
      {kind === 'ticket' && <span className="divider__text">{TICKET_TEXT}</span>}
    </div>
  );
}
