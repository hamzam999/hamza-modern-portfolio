import { useEffect, useState } from 'react';
import { useGame } from '@/game/store';

const HOLD_MS = 1600;

/**
 * XP gain chip (plan 3.11): slides up inside a mask, stays 1.6 s, slides out. Store-driven, decorative and not
 * announced (plan 7.5). Hidden entirely when Play mode is off. Reduced motion: durations are 0, so it just
 * appears and disappears.
 */
export function Toast() {
  const toast = useGame((s) => s.toast);
  const play = useGame((s) => s.settings.play);
  const clearToast = useGame((s) => s.clearToast);
  const [phase, setPhase] = useState<'out' | 'in'>('out');
  const [amount, setAmount] = useState(0);
  const [label, setLabel] = useState<string | undefined>();

  useEffect(() => {
    if (!toast || !play) return;
    setAmount(toast.amount);
    setLabel(toast.label);
    const raf = requestAnimationFrame(() => setPhase('in'));
    const hide = window.setTimeout(() => setPhase('out'), HOLD_MS);
    const clear = window.setTimeout(() => clearToast(), HOLD_MS + 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hide);
      window.clearTimeout(clear);
    };
  }, [toast, play, clearToast]);

  if (!play) return null;
  return (
    <div className="toast" aria-hidden="true">
      <span className="toast__mask">
        <span className="toast__chip" data-phase={phase}>
          +{amount} FR
          {label && <span className="toast__label"> · {label}</span>}
        </span>
      </span>
    </div>
  );
}
