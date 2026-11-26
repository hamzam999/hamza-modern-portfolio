import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToLevel } from './scroll';

/** On `/` jump with the scroll helper (focus moves to the heading); elsewhere navigate to `/#level-...`. */
export function useLevelNav(): (anchor: string) => void {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return useCallback(
    (anchor: string) => {
      if (pathname === '/') scrollToLevel(anchor);
      else navigate({ pathname: '/', hash: `#${anchor}` });
    },
    [pathname, navigate],
  );
}
