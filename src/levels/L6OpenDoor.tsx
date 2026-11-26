import { useCallback, useEffect, useRef, useState } from 'react';
import { LEVELS } from '@/content/levels';
import { PROFILE } from '@/content/profile';
import { Button } from '@/components/ui/Button';
import { LevelShell } from '@/components/ui/LevelShell';
import { prefersReducedMotion } from '@/lib/motion';
import { useGame } from '@/game/store';

const level = LEVELS[5];
const grantDoor = () => {
  useGame.getState().grant('door:contact');
};

/** Level 6, Open Door (plan 5.6). Contact info is always in the HTML; the door is a closed-by-script overlay. */
export function L6OpenDoor() {
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
    grantDoor();
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
    <LevelShell level={level} urduPosition="right" className="l6">
      <p className="l6__lead">Whether it’s a storefront, a dashboard, a 3D landing page, an ERP or anything else, let’s connect and talk it through.</p>
      <p className="l6__chip">
        <span className="l6__chipdot" aria-hidden="true" />
        Available for collaborations, remote
      </p>
      <div className="l6__layout">
      <div className="l6__stage" data-door={door}>
        <div className="l6__card" id="contact-card" onFocusCapture={open}>
          <p className="l6__cardlabel">Contact</p>
          <p className="l6__email">
            <a ref={emailRef} href={`mailto:${PROFILE.email}`} onClick={grantDoor}>
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
              <a href={PROFILE.links.linkedin} rel="noopener noreferrer" onClick={grantDoor}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={PROFILE.links.github} rel="noopener noreferrer" onClick={grantDoor}>
                GitHub
              </a>
            </li>
            {PROFILE.resumePdf && (
              <li>
                <a href={PROFILE.resumePdf} onClick={grantDoor}>
                  Download resume (PDF)
                </a>
              </li>
            )}
          </ul>
          {stamp && play && (
            <span className="l6__stamp" aria-hidden="true">
              Door opened
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
      <div className="l6__scene" aria-hidden="true">
        <img src="/art/door.svg" width={280} height={360} alt="" loading="lazy" decoding="async" />
        <i className="l6__mote l6__mote--1" />
        <i className="l6__mote l6__mote--2" />
        <i className="l6__mote l6__mote--3" />
        <i className="l6__mote l6__mote--4" />
        <i className="l6__mote l6__mote--5" />
      </div>
      </div>
      <p className="l6__thanks">Thanks for playing.</p>
    </LevelShell>
  );
}
