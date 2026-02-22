import { describe, it, expect } from 'vitest';

describe('Testing Setup', () => {
  it('should run basic assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    expect('Star Realms').toContain('Realms');
  });

  it('should work with arrays', () => {
    const players = ['Player1', 'Player2'];
    expect(players).toHaveLength(2);
    expect(players).toContain('Player1');
  });
});
