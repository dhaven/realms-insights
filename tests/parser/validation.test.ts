import { describe, it, expect } from 'vitest';
import { validateBasicGame, ValidationError } from '../../lib/parser/validation';
import { BasicGame } from '../../lib/types/game';

describe('validateBasicGame', () => {
  describe('valid games', () => {
    it('should pass validation for a valid 2-player game', () => {
      const game: BasicGame = {
        players: ['Alice', 'Bob'],
        winner: 'Alice'
      };

      expect(() => validateBasicGame(game)).not.toThrow();
    });

    it('should pass validation when winner is second player', () => {
      const game: BasicGame = {
        players: ['Player1', 'Player2'],
        winner: 'Player2'
      };

      expect(() => validateBasicGame(game)).not.toThrow();
    });

    it('should pass validation with player names containing spaces', () => {
      const game: BasicGame = {
        players: ['John Smith', 'Jane Doe'],
        winner: 'John Smith'
      };

      expect(() => validateBasicGame(game)).not.toThrow();
    });

    it('should pass validation with player names containing special characters', () => {
      const game: BasicGame = {
        players: ['Player_1', 'Player-2'],
        winner: 'Player_1'
      };

      expect(() => validateBasicGame(game)).not.toThrow();
    });
  });

  describe('player count validation', () => {
    it('should throw ValidationError when no players exist', () => {
      const game: BasicGame = {
        players: [],
        winner: 'Alice'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Star Realms is a 2-player game. Found 0 player(s):'
      );
    });

    it('should throw ValidationError when only 1 player exists', () => {
      const game: BasicGame = {
        players: ['Alice'],
        winner: 'Alice'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Star Realms is a 2-player game. Found 1 player(s): Alice'
      );
    });

    it('should throw ValidationError when 3 players exist', () => {
      const game: BasicGame = {
        players: ['Alice', 'Bob', 'Charlie'],
        winner: 'Alice'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Star Realms is a 2-player game. Found 3 player(s): Alice, Bob, Charlie'
      );
    });

    it('should throw ValidationError when more than 3 players exist', () => {
      const game: BasicGame = {
        players: ['P1', 'P2', 'P3', 'P4', 'P5'],
        winner: 'P1'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Star Realms is a 2-player game. Found 5 player(s):'
      );
    });
  });

  describe('player name validation', () => {
    it('should throw ValidationError when player name is empty string', () => {
      const game: BasicGame = {
        players: ['', 'Bob'],
        winner: 'Bob'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Player at index 0 has an empty or whitespace-only name'
      );
    });

    it('should throw ValidationError when player name is only whitespace', () => {
      const game: BasicGame = {
        players: ['Alice', '   '],
        winner: 'Alice'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Player at index 1 has an empty or whitespace-only name'
      );
    });

    it('should throw ValidationError when player name is only tabs', () => {
      const game: BasicGame = {
        players: ['\t\t', 'Bob'],
        winner: 'Bob'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Player at index 0 has an empty or whitespace-only name'
      );
    });

    it('should throw ValidationError when both player names are empty', () => {
      const game: BasicGame = {
        players: ['', ''],
        winner: ''
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Player at index 0 has an empty or whitespace-only name'
      );
    });
  });

  describe('winner validation', () => {
    it('should throw ValidationError when winner is not in player list', () => {
      const game: BasicGame = {
        players: ['Alice', 'Bob'],
        winner: 'Charlie'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Winner "Charlie" is not in the list of players: Alice, Bob'
      );
    });

    it('should throw ValidationError when winner is empty string', () => {
      const game: BasicGame = {
        players: ['Alice', 'Bob'],
        winner: ''
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Winner "" is not in the list of players: Alice, Bob'
      );
    });

    it('should throw ValidationError when winner has different casing', () => {
      const game: BasicGame = {
        players: ['Alice', 'Bob'],
        winner: 'alice'
      };

      expect(() => validateBasicGame(game)).toThrow(ValidationError);
      expect(() => validateBasicGame(game)).toThrow(
        'Winner "alice" is not in the list of players: Alice, Bob'
      );
    });
  });

  describe('ValidationError type', () => {
    it('should throw ValidationError with correct name property', () => {
      const game: BasicGame = {
        players: ['Alice'],
        winner: 'Alice'
      };

      try {
        validateBasicGame(game);
        expect.fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).name).toBe('ValidationError');
      }
    });

    it('should be catchable as Error', () => {
      const game: BasicGame = {
        players: ['Alice'],
        winner: 'Alice'
      };

      try {
        validateBasicGame(game);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('integration scenarios', () => {
    it('should validate all rules in correct order', () => {
      // If player count fails first, we get player count error
      const game1: BasicGame = {
        players: [''], // empty name but also only 1 player
        winner: ''
      };
      expect(() => validateBasicGame(game1)).toThrow('Star Realms is a 2-player game');

      // If player count passes but name validation fails, we get name error
      const game2: BasicGame = {
        players: ['', 'Bob'], // 2 players but one empty
        winner: 'Bob'
      };
      expect(() => validateBasicGame(game2)).toThrow('empty or whitespace-only name');

      // If both pass but winner validation fails, we get winner error
      const game3: BasicGame = {
        players: ['Alice', 'Bob'],
        winner: 'Charlie'
      };
      expect(() => validateBasicGame(game3)).toThrow('Winner "Charlie" is not in the list of players');
    });
  });
});
