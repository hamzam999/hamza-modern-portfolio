import media from '@/content/profile-media.json';
import { HamzaGlyph } from '@/components/brand/HamzaMark';
import { PROFILE } from '@/content/profile';

const portrait = (media as { portrait: { widths: number[] } | null }).portrait;

/**
 * Framed portrait slot in Origin. With media-src/profile/hamza.(jpg|png|webp) the build makes duotone prints and they
 * show here with a stamp overlay; without it, a hamza stamp portrait placeholder (no broken image, nothing invented).
 */
export function Portrait() {
  return (
    <figure className={`portrait${portrait ? ' portrait--photo' : ''}`}>
      <div className="portrait__frame">
        {portrait ? (
          <img
            src="/profile/portrait-800.webp"
            srcSet="/profile/portrait-480.webp 480w, /profile/portrait-800.webp 800w"
            sizes="(min-width: 1024px) 300px, 60vw"
            width={480}
            height={600}
            alt={`Portrait of ${PROFILE.name}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="portrait__slot" aria-hidden="true">
            <HamzaGlyph size={150} />
          </span>
        )}
        <span className="portrait__stamp" aria-hidden="true">
          <span>Mohammad Hamza</span>
          <span>Kanpur · Remote</span>
        </span>
      </div>
      <i className="strip" aria-hidden="true" />
      <figcaption className="portrait__cap" aria-hidden="true">
        Est. 2020 · Kanpur
      </figcaption>
    </figure>
  );
}
