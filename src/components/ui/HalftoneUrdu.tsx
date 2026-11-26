interface Props {
  text: string;
  className?: string;
}

/**
 * Giant halftone Urdu word. Real Nastaliq text (so the browser shapes and joins the letters) painted through a
 * dot grid with background-clip: text. Decorative: aria-hidden, lang="ur" dir="rtl", never takes space in the flow.
 * Size comes from --fs-urdu; the parent must clip overflow.
 */
export function HalftoneUrdu({ text, className }: Props) {
  return (
    <span aria-hidden="true" lang="ur" dir="rtl" className={`halftone urdu${className ? ` ${className}` : ''}`}>
      {text}
    </span>
  );
}
