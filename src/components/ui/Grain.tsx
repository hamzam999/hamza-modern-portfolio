import { useEffect, useState } from 'react';

/**
 * Fixed paper-grain overlay (plan 3.9). Rendered once in the app shell. On low-end devices the blend mode is
 * dropped (cheaper compositing); the check runs in an effect so server and client markup match.
 */
export function Grain() {
  const [flat, setFlat] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) || (nav.deviceMemory && nav.deviceMemory <= 4)) setFlat(true);
  }, []);
  return <div className={`grain${flat ? ' grain--flat' : ''}`} aria-hidden="true" />;
}
