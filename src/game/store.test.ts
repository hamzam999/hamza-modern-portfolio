import { beforeEach, describe, expect, it, vi } from 'vitest';
import { __clearMemoryStorage, safeStorage, STORAGE_KEY } from './storage';
import { attachStorageSync, useGame } from './store';

beforeEach(() => {
  vi.unstubAllGlobals();
  __clearMemoryStorage();
  useGame.getState().reset();
});

describe('grant', () => {
  it('grants once and derives xp', () => {
    expect(useGame.getState().grant('level:1:enter')).toBe(40);
    expect(useGame.getState().grant('level:1:enter')).toBe(0);
    expect(useGame.getState().xp).toBe(40);
    expect(useGame.getState().toast?.amount).toBe(40);
  });
  it('caps projects at ten', () => {
    for (let i = 0; i < 12; i++) useGame.getState().grant(`project:p${i}:open`);
    expect(useGame.getState().xp).toBe(200);
  });
  it('announces level clears and the arcade unlock only', () => {
    useGame.getState().grant('level:2:enter');
    expect(useGame.getState().announcement).toBe('');
    useGame.getState().grant('level:3:clear');
    expect(useGame.getState().announcement).toContain('Level 3 cleared');
    expect(useGame.getState().announcement).toContain('Arcade unlocked');
  });
  it('stops granting when Play mode is off', () => {
    useGame.getState().setSettings({ play: false });
    expect(useGame.getState().grant('boss:contact')).toBe(0);
    expect(useGame.getState().xp).toBe(0);
  });
  it('numbers pong wins', () => {
    expect(useGame.getState().grantPongWin()).toBe(120);
    expect(useGame.getState().grantPongWin()).toBe(30);
  });
});

describe('persistence', () => {
  it('survives a reload (rehydrate)', async () => {
    useGame.getState().grant('boss:contact');
    useGame.getState().setSettings({ cursor: 'classic' });
    const saved = String(safeStorage.getItem(STORAGE_KEY) ?? '');
    useGame.setState({ events: {}, xp: 0, settings: { play: true, motion: 'system', cursor: 'custom', shelfView: 'auto' } });
    safeStorage.setItem(STORAGE_KEY, saved);
    await useGame.persist.rehydrate();
    expect(useGame.getState().xp).toBe(100);
    expect(useGame.getState().settings.cursor).toBe('classic');
  });
  it('works when localStorage throws', async () => {
    const boom = () => {
      throw new Error('blocked');
    };
    vi.stubGlobal('localStorage', { getItem: boom, setItem: boom, removeItem: boom });
    expect(() => useGame.getState().grant('level:1:enter')).not.toThrow();
    expect(useGame.getState().xp).toBe(40);
    await expect(useGame.persist.rehydrate()).resolves.not.toThrow();
    expect(useGame.getState().xp).toBe(40);
  });
  it('resets to defaults on an unknown version', async () => {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, state: { events: { 'boss:contact': 'x' } } }));
    await useGame.persist.rehydrate();
    expect(useGame.getState().xp).toBe(0);
  });
  it('ignores tampered values', async () => {
    safeStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, state: { events: { 'boss:contact': 'x', evil: 'y' }, settings: { play: 'yes' } } }),
    );
    await useGame.persist.rehydrate();
    expect(useGame.getState().xp).toBe(100);
    expect(useGame.getState().settings.play).toBe(true);
  });
  it('syncs another tab through storage events', async () => {
    const target = new EventTarget() as unknown as Window;
    const off = attachStorageSync(target);
    safeStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state: { events: { 'level:2:clear': 'x' } } }));
    target.dispatchEvent(Object.assign(new Event('storage'), { key: STORAGE_KEY }));
    await new Promise((r) => setTimeout(r, 0));
    expect(useGame.getState().xp).toBe(60);
    off();
  });
});

describe('resetProgress', () => {
  it('clears progress but keeps settings and Pong preferences', () => {
    const g = useGame.getState();
    g.setSettings({ play: false, motion: 'off', cursor: 'classic' });
    g.recordPong({ wins: 3, losses: 2, difficulty: 'hard', accessible: true });
    g.grant('level:1:enter');
    g.markArcadeSeen();
    useGame.getState().resetProgress();
    const s = useGame.getState();
    expect(s.xp).toBe(0);
    expect(s.events).toEqual({});
    expect(s.arcadeSeen).toBe(false);
    expect(s.pong).toEqual({ wins: 0, losses: 0, difficulty: 'hard', accessible: true });
    expect(s.settings).toEqual({ play: false, motion: 'off', cursor: 'classic', shelfView: 'auto' });
  });
});
