/** Arcade registry (plan 8.1). Reel Pong is rendered inline by the page so its text is prerendered; later games use `load`. */
export interface ArcadeGame {
  id: string;
  title: string;
  status: 'live' | 'soon';
  load?: () => Promise<{ default: React.ComponentType }>;
}

export const GAMES: readonly ArcadeGame[] = [
  { id: 'reel-pong', title: 'Reel Pong', status: 'live' },
  { id: 'reel-02', title: 'Reel 02', status: 'soon' },
  { id: 'reel-03', title: 'Reel 03', status: 'soon' },
];
