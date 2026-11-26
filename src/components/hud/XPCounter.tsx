import { useEffect, useRef } from 'react';
import { MAX_XP } from '@/game/rules';
import { useGame } from '@/game/store';

function Digit({ from, to }: { from: string; to: string }) {
  const rolling = from !== to;
  return (
    <span className="digit">
      <span key={to} className={`digit__col${rolling ? ' digit__col--roll' : ''}`}>
        {rolling && <span>{from}</span>}
        <span>{to}</span>
      </span>
      {dot && <span className="xp__dot" aria-hidden="true" />}
    </button>
  );
}

/**
 * Film-frame XP counter (plan 3.11): `FR 0340`, digits roll inside masks. A button that opens the Passport
 * (Round 4). Hidden when Play mode is off; the menu and footer still reach the Passport then.
 */
export function XPCounter() {
  const xp = useGame((s) => s.xp);
  const play = useGame((s) => s.settings.play);
  const dot = useGame((s) => s.passportDot);
  const setOpen = useGame((s) => s.setPassportOpen);
  const text = String(xp).padStart(4, '0');
  const prev = useRef(text);
  const from = prev.current;
  useEffect(() => {
    prev.current = text;
  }, [text]);
  if (!play) return null;
  return (
    <button
      type="button"
      className="xp"
      aria-haspopup="dialog"
      aria-label={`Open passport, ${xp} frames${dot ? ', new stamp' : ''}`}
      title={`${xp} of ${MAX_XP} frames. Open your passport.`}
      onClick={() => setOpen(true)}
    >
      <span className="xp__fr" aria-hidden="true">FR</span>
      <span className="xp__digits" aria-hidden="true">
        {[...text].map((d, i) => (
          <Digit key={i} from={from[i] ?? d} to={d} />
        ))}
      </span>
      {dot && <span className="xp__dot" aria-hidden="true" />}
    </button>
  );
}
