/**
 * Validation functions for parsed game data
 */

import { BasicGame } from '../types/game';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates that a BasicGame object follows Star Realms game rules
 *
 * @param game - The parsed game data to validate
 * @throws ValidationError if validation fails
 */
export function validateBasicGame(game: BasicGame): void {
  validatePlayerCount(game.players);
  validatePlayerNames(game.players);
  validateWinner(game.winner, game.players);
}

/**
 * Validates that exactly 2 players exist
 */
function validatePlayerCount(players: string[]): void {
  if (players.length !== 2) {
    throw new ValidationError(
      `Star Realms is a 2-player game. Found ${players.length} player(s): ${players.join(', ')}`
    );
  }
}

/**
 * Validates that all player names are non-empty strings
 */
function validatePlayerNames(players: string[]): void {
  for (let i = 0; i < players.length; i++) {
    const name = players[i];
    if (typeof name !== 'string') {
      throw new ValidationError(
        `Player at index ${i} is not a string: ${typeof name}`
      );
    }
    if (name.trim() === '') {
      throw new ValidationError(
        `Player at index ${i} has an empty or whitespace-only name`
      );
    }
  }
}

/**
 * Validates that the winner is one of the players
 */
function validateWinner(winner: string, players: string[]): void {
  if (!players.includes(winner)) {
    throw new ValidationError(
      `Winner "${winner}" is not in the list of players: ${players.join(', ')}`
    );
  }
}
