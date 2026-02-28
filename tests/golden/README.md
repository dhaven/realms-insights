# Golden Files

This directory contains expected output files for golden file testing.

## Purpose

Golden files define the correct/expected output for parser functions when processing specific game logs. Tests compare actual parser output against these golden files to verify correctness.

## File Naming Convention

For each fixture log file in `tests/fixtures/`, there is a corresponding expected output file:
- `tests/fixtures/normal-game.txt` → `tests/golden/normal-game.expected.json`
- `tests/fixtures/concede-game.txt` → `tests/golden/concede-game.expected.json`
- `tests/fixtures/short-game.txt` → `tests/golden/short-game.expected.json`

## File Format

Each `.expected.json` file contains the expected output from `parseGameBasics()`:

```json
{
  "players": ["Player1", "Player2"],
  "winner": "Player1"
}
```

## How to Add New Golden Files

1. Add a new game log to `tests/fixtures/`
2. Manually verify the expected output by reading the log
3. Create a corresponding `.expected.json` file in this directory
4. Ensure player names and winner match exactly what appears in the log
5. Update test suite to include the new fixture

## Verification Process

Each golden file was created by:
1. Reading the fixture log file
2. Identifying all unique player names from "It is now {PLAYER}'s turn" lines
3. Finding the winner from "=== {WINNER} has won the game. ===" line
4. Verifying the winner is in the list of players
5. Recording the expected output in JSON format
