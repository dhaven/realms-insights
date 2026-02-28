import { describe, it, expect } from 'vitest';
import {
  stripHtmlTags,
  TURN_START_PATTERN,
  GAME_END_PATTERN,
  extractPlayerFromTurnStart,
  extractWinner,
} from '../../lib/parser/patterns';

describe('stripHtmlTags', () => {
  it('should remove color tags from card names', () => {
    expect(stripHtmlTags('<color=#FFFF00>Imperial Frigate</color>')).toBe('Imperial Frigate');
  });

  it('should remove multiple color tags from a line', () => {
    const input = '<color=#800080>Scout</color> +1 Trade and <color=#FF0000>Viper</color>';
    const expected = 'Scout +1 Trade and Viper';
    expect(stripHtmlTags(input)).toBe(expected);
  });

  it('should handle different color codes', () => {
    expect(stripHtmlTags('<color=#4CC417>Blob Fighter</color>')).toBe('Blob Fighter');
    expect(stripHtmlTags('<color=#1589FF>Trade Raft</color>')).toBe('Trade Raft');
    expect(stripHtmlTags('<color=#FF0000>Missile Bot</color>')).toBe('Missile Bot');
  });

  it('should handle lowercase hex codes', () => {
    expect(stripHtmlTags('<color=#ff0000>Test</color>')).toBe('Test');
    expect(stripHtmlTags('<color=#abc123>Test</color>')).toBe('Test');
  });

  it('should return unchanged text if no tags present', () => {
    expect(stripHtmlTags('No tags here')).toBe('No tags here');
  });

  it('should handle empty string', () => {
    expect(stripHtmlTags('')).toBe('');
  });
});

describe('TURN_START_PATTERN', () => {
  it('should match standard turn start line', () => {
    const line = "        It is now Player's turn 2";
    const match = line.match(TURN_START_PATTERN);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('Player');
    expect(match![2]).toBe('2');
  });

  it('should match AI player turn', () => {
    const line = "        It is now Hard AI's turn 3";
    const match = line.match(TURN_START_PATTERN);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('Hard AI');
    expect(match![2]).toBe('3');
  });

  it('should match player names with special characters', () => {
    const line = "        It is now marcuseth's turn 41";
    const match = line.match(TURN_START_PATTERN);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('marcuseth');
    expect(match![2]).toBe('41');
  });

  it('should match alphanumeric player names', () => {
    const line = "        It is now MAX1478's turn 5";
    const match = line.match(TURN_START_PATTERN);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('MAX1478');
    expect(match![2]).toBe('5');
  });

  it('should not match non-turn lines', () => {
    expect("Player ends turn 2".match(TURN_START_PATTERN)).toBeNull();
    expect("Attacked Player for 1".match(TURN_START_PATTERN)).toBeNull();
  });
});

describe('GAME_END_PATTERN', () => {
  it('should match standard win message', () => {
    const line = "        === Player has won the game. ===";
    const match = line.match(GAME_END_PATTERN);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('Player');
  });

  it('should match AI winner', () => {
    const line = "        === Hard AI has won the game. ===";
    const match = line.match(GAME_END_PATTERN);
    expect(match).not.toBeNull();
    expect(match![1]).toBe('Hard AI');
  });

  it('should match player names with various formats', () => {
    const line1 = "        === Randomosity has won the game. ===";
    const match1 = line1.match(GAME_END_PATTERN);
    expect(match1).not.toBeNull();
    expect(match1![1]).toBe('Randomosity');

    const line2 = "        === YL5943 has won the game. ===";
    const match2 = line2.match(GAME_END_PATTERN);
    expect(match2).not.toBeNull();
    expect(match2![1]).toBe('YL5943');
  });

  it('should not match similar but incorrect lines', () => {
    expect("Player has won the game.".match(GAME_END_PATTERN)).toBeNull();
    expect("=== Player wins ===".match(GAME_END_PATTERN)).toBeNull();
    expect("Player wins the game".match(GAME_END_PATTERN)).toBeNull();
  });
});

describe('extractPlayerFromTurnStart', () => {
  it('should extract player name from valid turn start line', () => {
    expect(extractPlayerFromTurnStart("        It is now Player's turn 2")).toBe('Player');
    expect(extractPlayerFromTurnStart("        It is now Hard AI's turn 1")).toBe('Hard AI');
    expect(extractPlayerFromTurnStart("        It is now MAX1478's turn 7")).toBe('MAX1478');
  });

  it('should return null for non-matching lines', () => {
    expect(extractPlayerFromTurnStart("Player ends turn 2")).toBeNull();
    expect(extractPlayerFromTurnStart("Random text")).toBeNull();
    expect(extractPlayerFromTurnStart("")).toBeNull();
  });
});

describe('extractWinner', () => {
  it('should extract winner name from valid game end line', () => {
    expect(extractWinner("        === Player has won the game. ===")).toBe('Player');
    expect(extractWinner("        === Randomosity has won the game. ===")).toBe('Randomosity');
    expect(extractWinner("        === YL5943 has won the game. ===")).toBe('YL5943');
  });

  it('should return null for non-matching lines', () => {
    expect(extractWinner("Player has won")).toBeNull();
    expect(extractWinner("=== Winner ===")).toBeNull();
    expect(extractWinner("")).toBeNull();
  });
});
