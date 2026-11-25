import { useCallback, useEffect, useRef, useState } from 'react';
import { LEVELS } from '@/content/levels';
import { PROFILE } from '@/content/profile';
import { Button } from '@/components/ui/Button';
import { LevelShell } from '@/components/ui/LevelShell';
import { prefersReducedMotion } from '@/lib/motion';
import { useGame } from '@/game/store';

const level = LEVELS[5];
const grantBoss = () => {
  useGame.getState().grant('boss:contact');
};

/** Level 6, Final Boss (plan 5.6). Contact info is always in the HTML; the door is a closed-by-script overlay. */
export function L6FinalBoss() {
  // Server and no-JS markup is the open state; script arms the door only when motion is allowed.
  const [door, setDoor] = useState<'open' | 'closed'>('open');
  const [stamp, setStamp] = useState(false);
  const [copied, setCopied] = useState('');
  const armed = useRef(false);
  const emailRef = useRef<HTMLAnchorElement | null>(null);
  const active = useGame((s) => s.activeLevel);
  const play = useGame((s) => s.settings.play);

  useEffect(() => {
    if (prefersReducedMotion() || useGame.getState().activeLevel === 6) return;
    armed.current = true;
    setDoor('closed');
  }, []);

  const open = useCallback(() => {
    setDoor((d) => {
      if (d === 'closed' && useGame.getState().settings.play) setStamp(true);
      return 'open';
    });
  }, []);

  useEffect(() => {
    if (active === 6 && armed.current) open();
  }, [active, open]);

  const copy = async () => {
    grantBoss();
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied('Email address copied');
    } catch {
      const el = emailRef.current;
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
      setCopied('Email address selected. Press copy to finish.');
    }
  };

  const closed = door === 'closed';
  return (
    <LevelShell level={level} kanjiPosition="left" className="l6">
      <p className="l6__lead">
        Available for collaborations, remote. Tell me what you are building: a storefront, a dashboard, a 3D landing page or something stranger.
      </p>
      <div className="l6__stage" data-door={door}>
        <div className="l6__card" id="contact-card" onFocusCapture={open}>
          <p className="l6__cardlabel">Contact</p>
          <p className="l6__email">
            <a ref={emailRef} href={`mailto:${PROFILE.email}`} onClick={grantBoss}>
              {PROFILE.email}
            </a>
          </p>
          <div className="l6__row">
            <Button as="button" variant="primary" size="lg" onClick={copy}>
              Copy email
            </Button>
            <span role="status" aria-live="polite" className="l6__copied">
              {copied}
            </span>
          </div>
          <ul className="l6__links">
            <li>
              <a href={PROFILE.links.linkedin} rel="noopener noreferrer" onClick={grantBoss}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={PROFILE.links.github} rel="noopener noreferrer" onClick={grantBoss}>
                GitHub
              </a>
            </li>
            {PROFILE.resumePdf && (
              <li>
                <a href={PROFILE.resumePdf} onClick={grantBoss}>
                  Download resume (PDF)
                </a>
              </li>
            )}
          </ul>
          {stamp && play && (
            <span className="l6__stamp" aria-hidden="true">
              Boss defeated
            </span>
          )}
        </div>
        <div className="l6__door" aria-hidden="true">
          <span className="l6__exit">EXIT</span>
          <span className="l6__leaf l6__leaf--l"><i /></span>
          <span className="l6__leaf l6__leaf--r"><i /></span>
        </div>
        {closed && (
          <Button as="button" variant="door" size="lg" className="l6__open" aria-expanded={false} aria-controls="contact-card" onClick={open}>
            Open the red door
          </Button>
        )}
      </div>
      <p className="l6__thanks">Thanks for playing.</p>
    </LevelShell>
  );
}
