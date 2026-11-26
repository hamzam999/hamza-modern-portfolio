import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  computeXP,
  levelClearId,
  nextPongWinId,
  parseEvent,
  type EventId,
  type EventLog,
  type LevelNum,
} from './rules';
import { safeStorage, STORAGE_KEY } from './storage';

export const STORE_VERSION = 1;

export interface Settings {
  /** Play mode: XP, toasts and stamps. */
  play: boolean;
  motion: 'system' | 'on' | 'off';
  cursor: 'custom' | 'classic';
  shelfView: 'auto' | 'shelf' | 'grid';
}

export interface PongRecord {
  wins: number;
  losses: number;
  difficulty: 'easy' | 'normal' | 'hard';
  accessible: boolean;
}

/** Call-to-action toast text for the contact event (Round 4: replaces the old "Door opened" wording). */
export const DOOR_TOAST = 'Let’s connect: pick email or LinkedIn';

export interface Toast {
  /** Increments per toast so repeated gains re-trigger the animation. */
  id: number;
  amount: number;
  /** Optional message shown under the amount (the contact call to action). */
  label?: string;
}

interface Persisted {
  events: EventLog;
  settings: Settings;
  pong: PongRecord;
  arcadeSeen: boolean;
}

interface Session {
  /** Active level 1..6, 0 before the tracker reports. */
  activeLevel: 0 | LevelNum;
  /** True while a ruler jump scroll is running: no XP for levels passed through. */
  jumping: boolean;
  toast: Toast | null;
  /** Message for the polite live region (#game-status). */
  announcement: string;
  /** Vermilion dot on the passport button until it is opened. */
  passportDot: boolean;
  /** Passport dialog open state: the XP counter, menu and footer all open the same dialog. */
  passportOpen: boolean;
  /** Derived from events; kept in state so subscribers re-render on change only. */
  xp: number;
}

interface Actions {
  /** Records an event. Returns the XP gained (0 if duplicate, capped, or Play mode is off). */
  grant: (id: EventId) => number;
  grantPongWin: () => number;
  setSettings: (patch: Partial<Settings>) => void;
  setActiveLevel: (n: 0 | LevelNum) => void;
  setJumping: (v: boolean) => void;
  clearToast: () => void;
  clearPassportDot: () => void;
  setPassportOpen: (open: boolean) => void;
  markArcadeSeen: () => void;
  recordPong: (patch: Partial<PongRecord>) => void;
  /** Full reset to defaults (tests, version migration). */
  reset: () => void;
  /** Clears progress only (XP events, arcade flag, Pong tally); Play, Motion, cursor and Pong preferences stay. */
  resetProgress: () => void;
}

export type GameState = Persisted & Session & Actions;

export const DEFAULT_SETTINGS: Settings = { play: true, motion: 'system', cursor: 'custom', shelfView: 'auto' };
export const DEFAULT_PONG: PongRecord = { wins: 0, losses: 0, difficulty: 'normal', accessible: false };

const defaults = (): Persisted & Pick<Session, 'xp'> => ({
  events: {},
  settings: { ...DEFAULT_SETTINGS },
  pong: { ...DEFAULT_PONG },
  arcadeSeen: false,
  xp: 0,
});

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Validates stored data field by field so a hand-edited value can never break the app. */
function sanitize(raw: unknown): Persisted {
  const d = defaults();
  if (!isRecord(raw)) return d;
  if (isRecord(raw.events)) {
    for (const [k0, v] of Object.entries(raw.events)) {
      const k = k0 === 'boss:contact' ? 'door:contact' : k0; // id renamed in round 2
      if (parseEvent(k) && typeof v === 'string') (d.events as Record<string, string>)[k] = v;
    }
  }
  if (isRecord(raw.settings)) {
    const s = raw.settings;
    if (typeof s.play === 'boolean') d.settings.play = s.play;
    if (s.motion === 'system' || s.motion === 'on' || s.motion === 'off') d.settings.motion = s.motion;
    if (s.cursor === 'custom' || s.cursor === 'classic') d.settings.cursor = s.cursor;
    if (s.shelfView === 'auto' || s.shelfView === 'shelf' || s.shelfView === 'grid') d.settings.shelfView = s.shelfView;
  }
  if (isRecord(raw.pong)) {
    const p = raw.pong;
    if (typeof p.wins === 'number' && p.wins >= 0) d.pong.wins = Math.floor(p.wins);
    if (typeof p.losses === 'number' && p.losses >= 0) d.pong.losses = Math.floor(p.losses);
    if (p.difficulty === 'easy' || p.difficulty === 'normal' || p.difficulty === 'hard') d.pong.difficulty = p.difficulty;
    if (typeof p.accessible === 'boolean') d.pong.accessible = p.accessible;
  }
  if (typeof raw.arcadeSeen === 'boolean') d.arcadeSeen = raw.arcadeSeen;
  return d;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...defaults(),
      activeLevel: 0,
      jumping: false,
      toast: null,
      announcement: '',
      passportDot: false,
      passportOpen: false,

      grant: (id) => {
        const s = get();
        if (!s.settings.play || id in s.events || !parseEvent(id)) return 0;
        const events = { ...s.events, [id]: new Date().toISOString() };
        const xp = computeXP(events);
        const gained = xp - s.xp;
        const parsed = parseEvent(id);
        const clear = parsed?.kind === 'clear' ? parsed.level : null;
        const patch: Partial<GameState> = { events, xp };
        if (gained > 0) patch.toast = { id: (s.toast?.id ?? 0) + 1, amount: gained, ...(id === 'door:contact' ? { label: DOOR_TOAST } : {}) };
        if (clear !== null) {
          patch.passportDot = true;
          patch.announcement = `Level ${clear} cleared. Stamp added to your passport.`;
          if (clear === 3) patch.announcement += ' Arcade unlocked: Reel Pong.';
        }
        set(patch);
        return gained;
      },
      grantPongWin: () => get().grant(nextPongWinId(get().events)),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setActiveLevel: (n) => set((s) => (s.activeLevel === n ? s : { activeLevel: n })),
      setJumping: (v) => set({ jumping: v }),
      clearToast: () => set({ toast: null }),
      clearPassportDot: () => set({ passportDot: false }),
      setPassportOpen: (open) => set(open ? { passportOpen: true, passportDot: false } : { passportOpen: false }),
      markArcadeSeen: () => set({ arcadeSeen: true }),
      recordPong: (patch) => set((s) => ({ pong: { ...s.pong, ...patch } })),
      resetProgress: () =>
        set((s) => ({
          events: {},
          xp: 0,
          arcadeSeen: false,
          pong: { ...s.pong, wins: 0, losses: 0 },
          toast: null,
          announcement: '',
          passportDot: false,
          jumping: false,
        })),
      reset: () => set({ ...defaults(), toast: null, announcement: '', passportDot: false, jumping: false }),
    }),
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => safeStorage),
      // Same initial state on server and client; main.tsx rehydrates after hydrateRoot (plan 4.2).
      skipHydration: true,
      partialize: (s): Persisted => ({ events: s.events, settings: s.settings, pong: s.pong, arcadeSeen: s.arcadeSeen }),
      // An unknown version resets to defaults.
      migrate: () => defaults(),
      merge: (persisted, current) => {
        const p = sanitize(persisted);
        return { ...current, ...p, xp: computeXP(p.events) };
      },
    },
  ),
);

export const selectUnlockedArcade = (s: Pick<GameState, 'events'>): boolean => levelClearId(3) in s.events;

/** Keeps multiple tabs in sync (plan 7.5). Returns the cleanup function. */
export function attachStorageSync(target: Pick<Window, 'addEventListener' | 'removeEventListener'>): () => void {
  const onStorage = (e: Event) => {
    const key = (e as StorageEvent).key;
    if (key === STORAGE_KEY || key === null) void useGame.persist.rehydrate();
  };
  target.addEventListener('storage', onStorage);
  return () => target.removeEventListener('storage', onStorage);
}
