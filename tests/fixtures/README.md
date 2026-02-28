# Test Fixtures - Game Log Format Observations

This directory contains sample Star Realms game logs selected for testing the parser.

## Selected Logs

### 1. normal-game.txt
- **Source**: `logdata/core_set/test1`
- **Size**: 524 lines
- **Players**: "Player" vs "Hard AI"
- **Characteristics**: Standard core set game with normal win condition
- **End Condition**: Authority reduced to -1, normal victory message

### 2. concede-game.txt
- **Source**: `logdata/errors/concede1`
- **Size**: 1063 lines (long game, 40+ turns)
- **Players**: "marcuseth" vs "Randomosity"
- **Characteristics**: Long game ending in concession
- **End Condition**: Player concedes: `marcuseth(0) conceded`

### 3. short-game.txt
- **Source**: `logdata/errors/25-11-2022-01`
- **Size**: 136 lines
- **Players**: "MAX1478" vs "YL5943"
- **Characteristics**: Very short game with abrupt ending
- **End Condition**: Game ends suddenly (possibly disconnect or early concede)

## Log Format Patterns

Based on analysis of these logs, the following patterns have been identified:

### Player Identification
- Turn start pattern: `It is now {PLAYER_NAME}'s turn {TURN_NUMBER}`
- Examples:
  - `It is now Player's turn 2`
  - `It is now Hard AI's turn 3`
  - `It is now marcuseth's turn 41`

### Winner Detection
- Standard win pattern: `=== {PLAYER_NAME} has won the game. ===`
- Examples:
  - `=== Player has won the game. ===`
  - `=== Randomosity has won the game. ===`
  - `=== YL5943 has won the game. ===`

### Game End Conditions Observed
1. **Normal Victory**: Authority reduced to 0 or below, followed by winner message
2. **Concede**: Pattern `{PLAYER}(0) conceded` followed by winner message
3. **Abrupt End**: Winner message appears without clear preceding context

### HTML-like Color Tags
All cards include color tags that need to be stripped:
- Pattern: `<color=#XXXXXX>Card Name</color>`
- Color codes vary by faction (e.g., `#800080` purple, `#FFFF00` yellow, `#4CC417` green, etc.)

### Authority Tracking
Authority changes shown in parentheses:
- Attack example: `Attacked Player for 1 (New Authority:49)`
- Authority gain: `{PLAYER}  >  {CARD} +2 Authority (Authority:91)`

### Turn Structure
1. Turn announcement: `It is now {PLAYER}'s turn {NUMBER}`
2. Play actions
3. Turn end: `{PLAYER} ends turn {NUMBER}`
4. Draw phase: `Drew {N} cards.`
5. `Refresh ally indicators`

## Testing Strategy

These three logs provide diverse test cases:
- **Different player name formats**: Simple names, AI names, alphanumeric IDs
- **Different game lengths**: 136 lines, 524 lines, 1063 lines
- **Different end conditions**: Normal win, concede, abrupt end
- **Edge cases**: Handling of special characters, HTML tags, various player naming conventions

The parser should successfully extract player names and winner from all three logs despite their differences.
