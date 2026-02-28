/**
 * Pattern matching utilities for Star Realms game log parsing
 */

/**
 * Strips HTML-like color tags from game log text
 * Example: "<color=#FFFF00>Imperial Frigate</color>" -> "Imperial Frigate"
 */
export function stripHtmlTags(text: string): string {
  return text.replace(/<color=#[0-9A-Fa-f]{6}>|<\/color>/g, '');
}

/**
 * Regular expression to match turn start lines
 * Pattern: "It is now {PLAYER_NAME}'s turn {TURN_NUMBER}"
 * Groups: [1] = player name, [2] = turn number
 */
export const TURN_START_PATTERN = /It is now (.+?)'s turn (\d+)/;

/**
 * Regular expression to match game end/winner lines
 * Pattern: "=== {PLAYER_NAME} has won the game. ==="
 * Groups: [1] = winner name
 */
export const GAME_END_PATTERN = /=== (.+?) has won the game\. ===/;

/**
 * Extracts player name from a turn start line
 * Returns null if the line doesn't match the pattern
 */
export function extractPlayerFromTurnStart(line: string): string | null {
  const match = line.match(TURN_START_PATTERN);
  return match ? match[1] : null;
}

/**
 * Extracts winner name from a game end line
 * Returns null if the line doesn't match the pattern
 */
export function extractWinner(line: string): string | null {
  const match = line.match(GAME_END_PATTERN);
  return match ? match[1] : null;
}
