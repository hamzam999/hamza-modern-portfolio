import manifestJson from '@/content/media-manifest.json';
import type { MediaManifest, MediaManifestEntry, Project } from '@/types/content';
import { PosterFallback } from '@/components/projects/PosterFallback';

const MANIFEST = manifestJson as MediaManifest;

export const mediaOf = (slug: string): MediaManifestEntry | undefined => MANIFEST[slug];

const srcset = (slug: string, kind: 'hero' | 'cover' | 'mobile', widths: readonly number[], ext: 'avif' | 'webp') =>
  widths.map((w) => `/projects/${slug}/${kind}-${w}.${ext} ${w}w`).join(', ');

interface CoverProps {
  project: Pick<Project, 'slug' | 'media' | 'cardTitle' | 'spine'>;
  /** The first tapes load eagerly at low priority (plan 6.4); the rest are lazy. */
  eager?: boolean;
  sizes?: string;
  className?: string;
}

/** Duotone cover art (decorative: the link carries the label). Renders nothing when no screenshot exists. */
export function CoverArt({ project, eager = false, sizes = '300px', className }: CoverProps) {
  const m = mediaOf(project.slug)?.cover;
  if (!m) return null;
  const widths = m.widths;
  const big = Math.max(...widths);
  const small = Math.min(...widths);
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(project.slug, 'cover', widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(project.slug, 'cover', widths, 'webp')} sizes={sizes} />
      <img
        className={className}
        src={`/projects/${project.slug}/cover-${big}.webp`}
        width={small}
        height={Math.round(small / 0.823)}
        alt=""
        decoding="async"
        draggable={false}
        loading={eager ? 'eager' : 'lazy'}
        {...(eager ? { fetchPriority: 'low' as const } : {})}
        style={{ objectPosition: `${project.media.focal.x * 100}% ${project.media.focal.y * 100}%` }}
      />
    </picture>
  );
}

interface HeroProps {
  project: Pick<Project, 'slug' | 'media' | 'cardTitle' | 'spine' | 'title'>;
  size?: 'card' | 'hero';
  eager?: boolean;
}

/** True-colour 16:10 hero (project page, sheet poster). Falls back to the typographic poster. */
export function ProjectHero({ project, size = 'hero', eager = false }: HeroProps) {
  const m = mediaOf(project.slug)?.hero;
  if (!m) return <PosterFallback project={project} size={size} />;
  const widths = m.widths;
  const big = Math.max(...widths);
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(project.slug, 'hero', widths, 'avif')} sizes="(min-width: 1024px) 60vw, 100vw" />
      <source type="image/webp" srcSet={srcset(project.slug, 'hero', widths, 'webp')} sizes="(min-width: 1024px) 60vw, 100vw" />
      <img
        className="pd__img"
        src={`/projects/${project.slug}/hero-${big}.webp`}
        width={big}
        height={Math.round(big / m.ratio)}
        alt={project.media.alt}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
      />
    </picture>
  );
}
