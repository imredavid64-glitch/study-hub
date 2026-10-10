import { describe, it, expect } from 'vitest';
import { cn } from '../../src/ui/theme.js';

describe('cn utility', () => {
  it('joins class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
  });

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });
});

describe('App types', () => {
  it('has correct config structure', async () => {
    const { TABS, LEARN_MODES, THEMES } = await import('../../src/core/config.js');
    expect(TABS.length).toBeGreaterThan(0);
    expect(LEARN_MODES.length).toBe(5);
    expect(THEMES.length).toBe(3);
  });
});