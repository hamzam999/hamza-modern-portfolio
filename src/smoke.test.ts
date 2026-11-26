import { describe, expect, it } from 'vitest';
import { PROFILE } from './content/profile';

describe('smoke', () => {
  it('profile has no phone field', () => {
    expect('phone' in PROFILE).toBe(false);
  });
});
