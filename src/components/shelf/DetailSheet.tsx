import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PROJECTS } from '@/content/projects';
import { projectOpenId } from '@/game/rules';
import { useGame } from '@/game/store';
import { prefersReducedMotion } from '@/lib/motion';
import { IconClose } from '@/components/icons/Icons';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { InkMask } from './InkMask';

export interface SheetState {
  backgroundLocation?: unknown;
  /** Plain rectangle of the clicked cover (a DOMRect does not survive history serialisation everywhere). */
  originRect?: { top: number; left: number; right: number; bottom: number };
  /** True when the sheet was pushed from the shelf in this session, so Close can pop it (plan 4.4). */
  fromShelf?: boolean;
}

const CLOSE_MS = 700;
const FALLBACK = 'inset(35% 38% 30% 38% round 3px)';

function insetFrom(r: { top: number; left: number; right: number; bottom: number } | null | undefined): string {
  if (!r) return FALLBACK;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const px = (n: number) => `${Math.max(0, Math.round(n))}px`;
  return `inset(${px(r.top)} ${px(vw - r.right)} ${px(vh - r.bottom)} ${px(r.left)} round 2px)`;
}

/** Cover rectangle of the tape for `slug` right now (the target of the close animation). */
function coverRect(slug: string) {
  const el = document.querySelector<HTMLElement>(`[data-shelf] a.tape[data-slug="${slug}"][data-copy="0"] .tape__cv`);
  const r = el?.getBoundingClientRect();
  return r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight ? r : null;
}

/** Puts focus back where the sheet came from: the copy-0 tape, else the archive index link (plan 6.8). */
function restoreFocus(slug: string) {
  const el =
    document.querySelector<HTMLElement>(`[data-shelf] a.tape[data-slug="${slug}"][data-copy="0"]`) ??
    document.querySelector<HTMLElement>(`.tape-grid a[href="/projects/${slug}"], .archive a[href="/projects/${slug}"]`);
  el?.focus({ preventScroll: true });
}

/** Modal route element: `/projects/:slug` over the page it was opened from (plan 4.4, 6.8). */
export default function DetailSheet() {
  const { slug = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as SheetState;
  const project = useMemo(() => PROJECTS.find((p) => p.slug === slug), [slug]);
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const reduced = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useLayoutEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    reduced.current = prefersReducedMotion();
    dlg.style.setProperty('--clip-from', reduced.current ? 'inset(0 round 0)' : insetFrom(state.originRect));
    dlg.showModal();
    document.documentElement.classList.add('sheet-open');
    // Heavy work (mask filter) starts after the dialog is shown: next frame.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => dlg.setAttribute('data-state', 'open')));
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('sheet-open');
      if (dlg.open) dlg.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (project) useGame.getState().grant(projectOpenId(project.slug));
  }, [project]);

  const close = useCallback(() => {
    const dlg = ref.current;
    if (!dlg || closing.current) return;
    closing.current = true;
    const leave = () => {
      if (stateRef.current.fromShelf) navigate(-1);
      else navigate('/#level-archive');
      // Wait for the page route to render, then return focus.
      requestAnimationFrame(() => requestAnimationFrame(() => restoreFocus(slug)));
    };
    if (reduced.current) return leave();
    const to = coverRect(slug);
    dlg.style.setProperty('--clip-from', to ? insetFrom(to) : FALLBACK);
    dlg.setAttribute('data-state', 'closing');
    window.setTimeout(leave, CLOSE_MS);
  }, [navigate, slug]);

  if (!project) return null;
  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={`pd-${project.slug}`}
      data-sheet
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <button type="button" className="sheet__close" autoFocus onClick={close}>
        <IconClose aria-hidden="true" />
        Close
      </button>
      <div className="sheet__body">
        <ProjectDetail project={project} headingLevel={2} showPageLink reveal={!prefersReducedMotion()} poster={<InkMask project={project} animate={!prefersReducedMotion()} />} />
      </div>
    </dialog>
  );
}
