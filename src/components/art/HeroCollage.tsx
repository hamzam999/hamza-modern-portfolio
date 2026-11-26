import { PROJECTS } from '@/content/projects';

const PRINTS = [
  { slug: 'gesim', cls: 'a', note: 'Shopify, eSIM storefront' },
  { slug: 'lammles', cls: 'b', note: 'Checkout, Shopify Functions' },
  { slug: 'nighat-ahmad-official', cls: 'c', note: 'Official site' },
] as const;

/**
 * Hero collage: project screenshots as taped prints, a ticket stub, a film reel and stickers. Purely decorative
 * (aria-hidden, empty alts). Idle motion is CSS transforms only and is off under reduced motion.
 */
export function HeroCollage() {
  return (
    <div className="collage" aria-hidden="true">
      {PRINTS.map((p, i) => {
        const project = PROJECTS.find((x) => x.slug === p.slug);
        return (
          <figure key={p.slug} className={`print print--${p.cls}`}>
            <img
              src={`/projects/${p.slug}/print-360.webp`}
              srcSet={`/projects/${p.slug}/print-360.webp 360w, /projects/${p.slug}/print-720.webp 720w`}
              sizes="(min-width: 1024px) 270px, 42vw"
              width={360}
              height={270}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <figcaption>
              <b>{project?.cardTitle ?? p.slug}</b> {p.note}
            </figcaption>
            <i className="strip" />
          </figure>
        );
      })}
      <div className="stub">
        <span className="stub__top">Admit one</span>
        <span className="stub__no">No. 0001</span>
        <span className="stub__bot">Level 01 · Spawn</span>
      </div>
      <img className="film-reel" src="/art/reel.svg" width={240} height={240} alt="" loading="lazy" decoding="async" />
      <span className="sticker sticker--a">6+ yrs</span>
      <span className="sticker sticker--b">144 FPS</span>
      <span className="sticker sticker--c">Shopify Functions</span>
    </div>
  );
}
