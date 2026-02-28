/**
 * Simple parser for extracting basic game information from Star Realms logs
 */

import { TURN_START_PATTERN, GAME_END_PATTERN } from './patterns';
import { BasicGame } from '../types/game';

/**
 * Parses a Star Realms game log and extracts basic information
 *
 * @param log - The complete game log as a string
 * @returns Object containing array of player names and the winner
 * @throws Error if unable to extract players or winner
 */
export function parseGameBasics(log: string): BasicGame {
  const players = extractPlayers(log);
  const winner = extractWinner(log);

  if (players.length === 0) {
    throw new Error('Failed to extract players from game log');
  }

  if (!winner) {
    throw new Error('Failed to extract winner from game log');
  }

  if (!players.includes(winner)) {
    throw new Error(`Winner "${winner}" is not in the list of players: ${players.join(', ')}`);
  }

  return {
    players,
    winner,
  };
}

/**
 * Extracts unique player names from turn start lines
 */
function extractPlayers(log: string): string[] {
  const playerSet = new Set<string>();
  const lines = log.split('\n');

  for (const line of lines) {
    const match = line.match(TURN_START_PATTERN);
    if (match) {
      const playerName = match[1];
      playerSet.add(playerName);
    }
  }

  return Array.from(playerSet);
}

/**
 * Extracts the winner name from the game end line
 */
function extractWinner(log: string): string | null {
  const lines = log.split('\n');

  for (const line of lines) {
    const match = line.match(GAME_END_PATTERN);
    if (match) {
      return match[1];
    }
  }

  return null;
}
