/**
 * Type definitions for Star Realms game data models
 */

/**
 * Represents a player in a Star Realms game
 */
export interface Player {
  name: string;
}

/**
 * Basic game information extracted from a game log (Phase 1)
 * Contains only player names and winner
 */
export interface BasicGame {
  players: string[];
  winner: string;
}
