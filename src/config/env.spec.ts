import { describe, expect, it } from 'vitest';
import { parseBooleanEnv } from './env.js';

describe('parseBooleanEnv', () => {
  it('converts common boolean strings to true or false', () => {
    expect(parseBooleanEnv('true')).toBe(true);
    expect(parseBooleanEnv('TRUE')).toBe(true);
    expect(parseBooleanEnv('1')).toBe(true);
    expect(parseBooleanEnv('yes')).toBe(true);

    expect(parseBooleanEnv('false')).toBe(false);
    expect(parseBooleanEnv('FALSE')).toBe(false);
    expect(parseBooleanEnv('0')).toBe(false);
    expect(parseBooleanEnv('off')).toBe(false);
  });

  it('uses the provided default when the value is empty or invalid', () => {
    expect(parseBooleanEnv(undefined, false)).toBe(false);
    expect(parseBooleanEnv('', true)).toBe(true);
    expect(parseBooleanEnv('invalid', true)).toBe(true);
  });
});
