import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { mediaOf } from '@/components/shelf/media';
import { ModalDialog } from '@/components/hud/ModalDialog';
import { IconClose } from '@/components/icons/Icons';
import type { FullPageImage, Project } from '@/types/content';

type Device = 'desktop' | 'mobile';
const DEVICES: readonly Device[] = ['desktop', 'mobile'];
const LABEL: Record<Device, string> = { desktop: 'Desktop', mobile: 'Mobile' };

const host = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

interface Props {
  project: Project;
  /** Heading level used by the surrounding page (the section title is one below the project title). */
  headingLevel: 1 | 2;
}

/**
 * "Full-page layout": the whole homepage of a live site, desktop in a browser frame and mobile in a phone frame.
 * Each frame has a fixed viewport height and scrolls the tall image inside it (CSS only, so it works without JS).
 * Wide containers show both frames; narrow ones become Desktop | Mobile tabs once hydrated (before that they stack).
 * The images are lazy, so the home page never fetches them. Renders nothing for projects without captures.
 */
export function FullPageLayout({ project: p, headingLevel }: Props) {
  const full = mediaOf(p.slug)?.full;
  const uid = useId();
  const [tab, setTab] = useState<Device>('desktop');
  const [js, setJs] = useState(false);
  const [lb, setLb] = useState<Device | null>(null);
  const [lbShown, setLbShown] = useState<Device | null>(null);
  const tabRefs = useRef<Record<Device, HTMLButtonElement | null>>({ desktop: null, mobile: null });
  useEffect(() => setJs(true), []);

  const devices = DEVICES.filter((d) => full?.[d]);
  if (!full || devices.length === 0 || p.link.kind !== 'live') return null;
  const Heading = headingLevel === 1 ? 'h2' : 'h3';
  const hostname = host(p.link.url);
  const activeTab = devices.includes(tab) ? tab : devices[0]!;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = devices.indexOf(activeTab);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % devices.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + devices.length) % devices.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = devices.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const d = devices[next]!;
    setTab(d);
    tabRefs.current[d]?.focus();
  };

  const src = (img: FullPageImage) => `/projects/${p.slug}/${img.file}`;
  const alt = (d: Device) => `Full-page ${d} layout of ${p.title} homepage`;
  const openFull = (d: Device) => {
    setLbShown(d);
    setLb(d);
  };
  const shown = lbShown ? full[lbShown] : undefined;

  return (
    <section className={`fpl${js ? ' fpl--js' : ''}`} aria-labelledby={`${uid}-h`}>
      <Heading id={`${uid}-h`} className="pd__h">Full-page layout</Heading>
      <p className="fpl__intro">
        The whole homepage at desktop and phone width. Scroll inside a frame to read down the page.
      </p>
      {devices.length > 1 && (
        <div className="fpl__tabs" role="tablist" aria-label="Layout device">
          {devices.map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              id={`${uid}-t-${d}`}
              aria-selected={activeTab === d}
              aria-controls={`${uid}-p-${d}`}
              tabIndex={activeTab === d ? 0 : -1}
              ref={(el) => {
                tabRefs.current[d] = el;
              }}
              onClick={() => setTab(d)}
              onKeyDown={onKey}
            >
              {LABEL[d]}
            </button>
          ))}
        </div>
      )}
      <div className="fpl__frames">
        {devices.map((d) => {
          const img = full[d]!;
          return (
            <div
              key={d}
              className={`fpl__panel fpl__panel--${d}`}
              role="tabpanel"
              id={`${uid}-p-${d}`}
              aria-labelledby={`${uid}-t-${d}`}
              data-active={activeTab === d}
            >
              <div className={`fpl__frame fpl__frame--${d}`}>
                <div className="fpl__bar">
                  <span className="fpl__dots" aria-hidden="true"><i /><i /><i /></span>
                  <span className="fpl__host">{hostname}</span>
                  <button type="button" className="fpl__open" onClick={() => openFull(d)} aria-haspopup="dialog">
                    Open full size<span className="sr-only"> ({d})</span>
                  </button>
                </div>
                <div className="fpl__scroll" tabIndex={0} role="region" aria-label={`${LABEL[d]} layout, scrollable`}>
                  <img src={src(img)} width={img.width} height={img.height} alt={alt(d)} loading="lazy" decoding="async" />
                  {img.cropped && <p className="fpl__more">Continues on the live site</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ModalDialog open={lb !== null} onClose={() => setLb(null)} labelledBy={`${uid}-lbt`} className="fpl-lb">
        <div className="fpl-lb__inner">
          <div className="fpl-lb__head">
            <h2 id={`${uid}-lbt`} className="fpl-lb__title">
              {p.title} · {lbShown ? LABEL[lbShown] : ''} layout
            </h2>
            <a className="fpl-lb__link" href={p.link.url} rel="noopener noreferrer" target="_blank">
              Visit {hostname}<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <button type="button" className="iconbtn" onClick={() => setLb(null)} aria-label="Close full-size layout">
              <IconClose />
            </button>
          </div>
          <div className="fpl-lb__scroll" tabIndex={0} role="region" aria-label="Full-size layout, scrollable">
            {shown && lbShown && (
              <img className={`fpl-lb__img fpl-lb__img--${lbShown}`} src={src(shown)} width={shown.width} height={shown.height} alt={alt(lbShown)} decoding="async" />
            )}
            {shown?.cropped && <p className="fpl__more">Continues on the live site</p>}
          </div>
        </div>
      </ModalDialog>
    </section>
  );
}
