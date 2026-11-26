import { memo } from 'react';
import type { Project } from '@/types/content';
import { CATEGORY_LABEL } from '@/types/content';
import { CoverArt, mediaOf } from './media';

export interface TapeProps {
  project: Project;
  /** Index of the project in the featured list (0-based). */
  index: number;
  total: number;
  /** -1, 0 or 1: only copy 0 is real; the others are decorative (plan 6.7). Windowed mode passes 0 for the centre slot. */
  copy: -1 | 0 | 1;
  /** Slot id (pool index), used by the frame loop. */
  slot: number;
  current: boolean;
  eager: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, slot: number) => void;
  describedBy?: string;
}

/** One VHS tape: a spine face and a cover face with shade overlays. Styles are written by the frame loop (6.3). */
export const Tape = memo(function Tape({ project: p, index, total, copy, slot, current, eager, onClick, describedBy }: TapeProps) {
  const real = copy === 0;
  const hasArt = !!mediaOf(p.slug)?.cover;
  const private_ = p.link.kind === 'private';
  const oop = p.link.kind === 'offline';
  return (
    <a
      className={`tape tape--${p.spine}`}
      href={`/projects/${p.slug}`}
      data-slot={slot}
      data-slug={p.slug}
      data-index={index}
      data-copy={copy}
      data-current={current ? '' : undefined}
      tabIndex={real && current ? 0 : -1}
      aria-label={`${p.cardTitle}, ${CATEGORY_LABEL[p.category]}, tape ${index + 1} of ${total}`}
      aria-describedby={real ? describedBy : undefined}
      aria-hidden={real ? undefined : true}
      inert={real ? undefined : true}
      draggable={false}
      onClick={(e) => onClick(e, slot)}
    >
      <span className="tape__sp f" aria-hidden="true">
        <span className="tape__sp-art">{hasArt ? <CoverArt project={p} eager={eager} sizes="80px" /> : <span className="tape__art-fb" />}</span>
        <span className="tape__sp-title">{p.spineTitle}</span>
        <span className="tape__dot" />
        <span className="tape__vhs">VHS</span>
        <span className="shade" data-shade="sp" />
      </span>
      <span className="tape__cv f" aria-hidden="true">
        <span className="tape__band">
          <small>A MOHAMMAD HAMZA BUILD</small>
          <span className="tape__name">{p.cardTitle}</span>
          {private_ && <span className="tape__tag">PRIVATE REEL</span>}
          {oop && <span className="tape__sticker">OUT OF PRINT</span>}
        </span>
        <span className="tape__art">{hasArt ? <CoverArt project={p} eager={eager} sizes="300px" /> : <span className="tape__art-fb" />}</span>
        <span className="tape__foot">
          <span className="tape__genre">{p.genre}</span>
          <span className="tape__vhs">VHS</span>
        </span>
        <span className="shade" data-shade="cv" />
      </span>
    </a>
  );
});
