/** XP rules (plan 7.2). Pure and unit tested: XP is derived from recorded events, never stored. */

export type LevelNum = 1 | 2 | 3 | 4 | 5 | 6;
export const LEVEL_NUMS = [1, 2, 3, 4, 5, 6] as const satisfies readonly LevelNum[];

export type LevelEventId = `level:${LevelNum}:${'enter' | 'clear'}`;
export type ProjectEventId = `project:${string}:open`;
export type PongWinEventId = `arcade:pong:win:${number}`;
export type EventId = LevelEventId | ProjectEventId | PongWinEventId | 'boss:contact';

/** ISO timestamp per granted event id. */
export type EventLog = Readonly<Record<string, string>>;

export const XP = {
  enter: 40,
  clear: 60,
  project: 20,
  projectMax: 10,
  pongFirst: 120,
  pongNext: 30,
  pongCap: 300,
  boss: 100,
} as const;

/** 6 x 40 + 6 x 60 + 10 x 20 + 300 + 100 */
export const MAX_XP = 6 * (XP.enter + XP.clear) + XP.project * XP.projectMax + XP.pongCap + XP.boss;

export const levelEnterId = (n: LevelNum): LevelEventId => `level:${n}:enter`;
export const levelClearId = (n: LevelNum): LevelEventId => `level:${n}:clear`;
export const projectOpenId = (slug: string): ProjectEventId => `project:${slug}:open`;
export const pongWinId = (n: number): PongWinEventId => `arcade:pong:win:${n}`;

export type ParsedEvent =
  | { kind: 'enter'; level: LevelNum }
  | { kind: 'clear'; level: LevelNum }
  | { kind: 'project'; slug: string }
  | { kind: 'pong'; n: number }
  | { kind: 'boss' };

const LEVEL_RE = /^level:([1-6]):(enter|clear)$/;
const PROJECT_RE = /^project:([a-z0-9-]+):open$/;
const PONG_RE = /^arcade:pong:win:([1-9]\d{0,2})$/;

/** Returns null for anything that is not a known event id (unknown ids are ignored everywhere). */
export function parseEvent(id: string): ParsedEvent | null {
  const l = LEVEL_RE.exec(id);
  if (l) return { kind: l[2] as 'enter' | 'clear', level: Number(l[1]) as LevelNum };
  const p = PROJECT_RE.exec(id);
  if (p?.[1]) return { kind: 'project', slug: p[1] };
  const w = PONG_RE.exec(id);
  if (w) return { kind: 'pong', n: Number(w[1]) };
  if (id === 'boss:contact') return { kind: 'boss' };
  return null;
}

/** XP is a pure function of the event log, so rule changes migrate cleanly and edited storage cannot exceed the cap. */
export function computeXP(events: EventLog): number {
  let xp = 0;
  const projects: Array<{ at: string; slug: string }> = [];
  let pongWins = 0;
  for (const [id, at] of Object.entries(events)) {
    const e = parseEvent(id);
    if (!e) continue;
    switch (e.kind) {
      case 'enter': xp += XP.enter; break;
      case 'clear': xp += XP.clear; break;
      case 'project': projects.push({ at, slug: e.slug }); break;
      case 'pong': pongWins += 1; break;
      case 'boss': xp += XP.boss; break;
    }
  }
  xp += Math.min(projects.length, XP.projectMax) * XP.project;
  if (pongWins > 0) xp += Math.min(XP.pongFirst + (pongWins - 1) * XP.pongNext, XP.pongCap);
  return Math.min(xp, MAX_XP);
}

export function clearedLevels(events: EventLog): readonly LevelNum[] {
  return LEVEL_NUMS.filter((n) => levelClearId(n) in events);
}

export const isRunComplete = (events: EventLog): boolean => clearedLevels(events).length === LEVEL_NUMS.length;

export const nextPongWinId = (events: EventLog): PongWinEventId => {
  let n = 1;
  while (pongWinId(n) in events) n += 1;
  return pongWinId(n);
};
