import { useGame } from '@/game/store';
import { clearedLevels, computeXP, isRunComplete, MAX_XP, LEVEL_NUMS, type LevelNum } from '@/game/rules';
import { LEVELS } from '@/content/levels';
import { IconClose } from '@/components/icons/Icons';
import { Stamp, formatStampDate } from '@/components/ui/Stamp';
import { ModalDialog } from './ModalDialog';
import { ResetProgress, SettingsToggles } from './Settings';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Passport dialog (plan 7.3): seven stamp slots with text status, total XP, run-complete card, settings, reset. */
export function PassportDialog({ open, onClose }: Props) {
  const events = useGame((s) => s.events);
  const xp = useGame((s) => s.xp);
  const play = useGame((s) => s.settings.play);
  const cleared = clearedLevels(events);
  const arcadeWin = events['arcade:pong:win:1'];

  return (
    <ModalDialog open={open} onClose={onClose} labelledBy="passport-title" className="passport">
      <div className="passport__scroll">
        <div className="passport__head">
          <h2 id="passport-title" className="passport__title">Passport</h2>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="Close passport">
            <IconClose />
          </button>
        </div>
        <p className="passport__intro">Your run so far: XP and a stamp for each level. Nothing is locked.</p>
        <p className="passport__xp">
          <span className="tabular">{String(computeXP(events)).padStart(4, '0')}</span> of {MAX_XP} frames
          {!play && <span> (Play mode is off, so progress is paused)</span>}
          <span className="sr-only"> Total experience points: {xp}.</span>
        </p>
        {isRunComplete(events) && (
          <div className="passport__done">
            <strong>Run complete.</strong> All six levels cleared.
          </div>
        )}
        <ul className="passport__slots">
          {LEVEL_NUMS.map((n: LevelNum) => {
            const level = LEVELS[n - 1];
            const at = events[`level:${n}:clear`];
            const got = cleared.includes(n);
            return (
              <li key={n} className="passport__slot">
                <div className="passport__stamp" aria-hidden="true">
                  <Stamp level={n} state={got ? 'set' : 'empty'} date={at} />
                </div>
                <p>
                  Level {n}, {level?.name}: {got && at ? `cleared on ${formatStampDate(at)}` : 'not yet'}
                </p>
              </li>
            );
          })}
          <li className="passport__slot">
            <div className="passport__stamp" aria-hidden="true">
              <Stamp level="arcade" state={arcadeWin ? 'set' : 'empty'} date={arcadeWin} />
            </div>
            <p>Arcade, Reel Pong champion: {arcadeWin ? `won on ${formatStampDate(arcadeWin)}` : 'not yet'}</p>
          </li>
        </ul>
        <h3 className="passport__sub">Settings</h3>
        <SettingsToggles />
        <div className="passport__foot">
          <ResetProgress />
        </div>
      </div>
    </ModalDialog>
  );
}
