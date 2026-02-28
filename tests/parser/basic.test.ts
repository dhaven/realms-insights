import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseGameBasics } from '../../lib/parser/basic';

describe('parseGameBasics', () => {
  describe('golden file tests', () => {
    it('should match golden output for normal-game.txt', () => {
      const log = readFileSync(join(__dirname, '../fixtures/normal-game.txt'), 'utf-8');
      const expected = JSON.parse(
        readFileSync(join(__dirname, '../golden/normal-game.expected.json'), 'utf-8')
      );
      const result = parseGameBasics(log);

      expect(result.players).toEqual(expect.arrayContaining(expected.players));
      expect(result.players).toHaveLength(expected.players.length);
      expect(result.winner).toBe(expected.winner);
    });

    it('should match golden output for concede-game.txt', () => {
      const log = readFileSync(join(__dirname, '../fixtures/concede-game.txt'), 'utf-8');
      const expected = JSON.parse(
        readFileSync(join(__dirname, '../golden/concede-game.expected.json'), 'utf-8')
      );
      const result = parseGameBasics(log);

      expect(result.players).toEqual(expect.arrayContaining(expected.players));
      expect(result.players).toHaveLength(expected.players.length);
      expect(result.winner).toBe(expected.winner);
    });

    it('should match golden output for short-game.txt', () => {
      const log = readFileSync(join(__dirname, '../fixtures/short-game.txt'), 'utf-8');
      const expected = JSON.parse(
        readFileSync(join(__dirname, '../golden/short-game.expected.json'), 'utf-8')
      );
      const result = parseGameBasics(log);

      expect(result.players).toEqual(expect.arrayContaining(expected.players));
      expect(result.players).toHaveLength(expected.players.length);
      expect(result.winner).toBe(expected.winner);
    });
  });

  describe('with minimal test data', () => {
    it('should extract two players and winner', () => {
      const log = `
        It is now Alice's turn 1
        Alice ends turn 1
        It is now Bob's turn 2
        Bob ends turn 2
        === Alice has won the game. ===
      `;

      const result = parseGameBasics(log);
      expect(result.players).toEqual(expect.arrayContaining(['Alice', 'Bob']));
      expect(result.players).toHaveLength(2);
      expect(result.winner).toBe('Alice');
    });

    it('should handle player names appearing multiple times', () => {
      const log = `
        It is now Player1's turn 1
        It is now Player2's turn 2
        It is now Player1's turn 3
        It is now Player2's turn 4
        It is now Player1's turn 5
        === Player2 has won the game. ===
      `;

      const result = parseGameBasics(log);
      expect(result.players).toHaveLength(2);
      expect(result.winner).toBe('Player2');
    });
  });

  describe('error handling', () => {
    it('should throw error when no players found', () => {
      const log = `
        Some random text
        No turn information here
        === Alice has won the game. ===
      `;

      expect(() => parseGameBasics(log)).toThrow('Failed to extract players from game log');
    });

    it('should throw error when no winner found', () => {
      const log = `
        It is now Alice's turn 1
        It is now Bob's turn 2
        Game ends without winner message
      `;

      expect(() => parseGameBasics(log)).toThrow('Failed to extract winner from game log');
    });

    it('should throw error when winner is not a player', () => {
      const log = `
        It is now Alice's turn 1
        It is now Bob's turn 2
        === Charlie has won the game. ===
      `;

      expect(() => parseGameBasics(log)).toThrow('Winner "Charlie" is not in the list of players');
    });

    it('should throw error on empty log', () => {
      expect(() => parseGameBasics('')).toThrow('Failed to extract players');
    });
  });

  describe('return type structure', () => {
    it('should return object with players array and winner string', () => {
      const log = `
        It is now TestPlayer's turn 1
        It is now AI's turn 2
        === TestPlayer has won the game. ===
      `;

      const result = parseGameBasics(log);

      expect(result).toHaveProperty('players');
      expect(result).toHaveProperty('winner');
      expect(Array.isArray(result.players)).toBe(true);
      expect(typeof result.winner).toBe('string');
    });

    it('should have winner in players array', () => {
      const log = `
        It is now P1's turn 1
        It is now P2's turn 2
        === P1 has won the game. ===
      `;

      const result = parseGameBasics(log);
      expect(result.players).toContain(result.winner);
    });
  });
});
