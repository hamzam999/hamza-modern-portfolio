import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';

interface ScrollState {
  progress: number;
  currentSection: number;
  velocity: number;
  direction: 'up' | 'down' | 'idle';
}

interface ScrollContextType {
  getState: () => ScrollState;
  subscribe: (callback: (state: ScrollState) => void) => () => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScrollContext must be used within ScrollProvider');
  return ctx;
}

export function ScrollProvider({ children, sectionCount = 6 }: { children: React.ReactNode; sectionCount?: number }) {
  const stateRef = useRef<ScrollState>({
    progress: 0,
    currentSection: 0,
    velocity: 0,
    direction: 'idle',
  });
  const listenersRef = useRef<Set<(state: ScrollState) => void>>(new Set());
  const prevScrollRef = useRef(0);
  const rafRef = useRef<number>(0);

  const subscribe = useCallback((callback: (state: ScrollState) => void) => {
    listenersRef.current.add(callback);
    return () => { listenersRef.current.delete(callback); };
  }, []);

  const getState = useCallback(() => stateRef.current, []);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
      const velocity = scrollY - prevScrollRef.current;
      const direction: 'up' | 'down' | 'idle' = velocity > 0 ? 'down' : velocity < 0 ? 'up' : 'idle';
      const currentSection = progress * sectionCount;

      prevScrollRef.current = scrollY;

      const newState: ScrollState = { progress, currentSection, velocity, direction };
      stateRef.current = newState;

      listenersRef.current.forEach(cb => cb(newState));
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sectionCount]);

  return (
    <ScrollContext.Provider value={{ getState, subscribe }}>
      {children}
    </ScrollContext.Provider>
  );
}
