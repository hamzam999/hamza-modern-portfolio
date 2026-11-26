import { useId, useState } from 'react';
import { useGame } from '@/game/store';
import { useSystemReducedMotion } from '@/lib/motion';

function Toggle({ label, hint, checked, onChange, disabled }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const id = useId();
  return (
    <div className="toggle">
      <input id={id} type="checkbox" role="switch" className="toggle__input" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} aria-describedby={hint ? `${id}-h` : undefined} />
      <label htmlFor={id} className="toggle__label">
        <span className="toggle__text">{label}</span>
        <span className="toggle__track" aria-hidden="true">
          <span className="toggle__thumb" />
        </span>
      </label>
      {hint && (
        <p id={`${id}-h`} className="toggle__hint">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Play mode, Motion and Classic cursor (plan 7.6). Shared by the menu, passport and footer. */
export function SettingsToggles() {
  const settings = useGame((s) => s.settings);
  const setSettings = useGame((s) => s.setSettings);
  const system = useSystemReducedMotion();
  return (
    <div className="settings">
      <Toggle label="Play mode" hint="XP, stamps and toasts. Nothing is locked either way." checked={settings.play} onChange={(play) => setSettings({ play })} />
      <Toggle
        label="Motion"
        hint={system ? 'Off, because your system asks for reduced motion.' : undefined}
        disabled={system}
        checked={settings.motion !== 'off' && !system}
        onChange={(on) => setSettings({ motion: on ? 'system' : 'off' })}
      />
      <Toggle label="Classic cursor" checked={settings.cursor === 'classic'} onChange={(c) => setSettings({ cursor: c ? 'classic' : 'custom' })} />
    </div>
  );
}

/** Two-step reset: the first press asks, the second confirms. */
export function ResetProgress() {
  const reset = useGame((s) => s.resetProgress);
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button type="button" className="btn btn--secondary" onClick={() => setAsking(true)}>
        Reset progress
      </button>
    );
  }
  return (
    <div className="reset" role="group" aria-label="Confirm reset">
      <p className="reset__text">This clears your XP and stamps on this device.</p>
      <button
        type="button"
        className="btn btn--door on-accent"
        onClick={() => {
          reset();
          setAsking(false);
        }}
      >
        Yes, reset
      </button>
      <button type="button" className="btn btn--ghost" onClick={() => setAsking(false)}>
        Cancel
      </button>
    </div>
  );
}
