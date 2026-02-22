## Technology Stack

**Language:** TypeScript
**Framework:** Next.js (React-based full-stack framework)

TypeScript with Next.js is chosen because:
- AI assistants have extensive training data and are highly proficient with TypeScript/React
- Large ecosystem with extensive documentation and community resources
- Type safety reduces errors and improves code quality
- Next.js handles both frontend and backend in a single project, simplifying the architecture
- Excellent tooling and developer experience

## Parser Architecture

The parser uses a **state machine** approach that processes game logs in a single pass while maintaining game state. This architecture cleanly separates pattern matching from state management and provides full context for validation.

```
Raw Log Text → State Machine Parser → Game Model
```

### Core Components

#### 1. Pattern Matchers (Stateless)

Pure functions that identify and extract data from log lines:

**Responsibilities:**
- Strip HTML color tags (e.g., `<color=#FFFF00>Card Name</color>` → `Card Name`)
- Match line patterns using regex
- Extract structured data (player names, card names, numbers)
- Parse resource changes (e.g., `+1 Trade (Trade:5)` → `{change: +1, type: "Trade", total: 5}`)

**Example patterns:**
```typescript
const TURN_START = /It is now (.+?)'s turn (\d+)/;
const CARD_PLAYED = /(.+?)\s+>\s+<color=.+?>(.+?)<\/color>/;
const ATTACK = /Attacked (.+?) for (\d+) \(New Authority:(\d+)\)/;
const GAME_END = /=== (.+?) has won the game\. ===/;
```

#### 2. State Machine Parser (Stateful)

Maintains game state while processing each line sequentially:

**State Tracked:**
```typescript
interface ParserState {
  // Player information
  players: Map<string, PlayerState>;
  currentPlayer: string | null;

  // Turn tracking
  currentTurn: number | null;

  // Current turn resources (reset each turn)
  resources: {
    trade: number;
    combat: number;
  };

  // Persistent state across turns
  bases: Map<string, Base[]>; // player → their bases in play
  authority: Map<string, number>; // player → current authority

  // Game history (for Game Model)
  turns: Turn[];
  currentTurnEvents: GameEvent[];
}
```

**Processing Flow:**
```typescript
class GameParser {
  private state: ParserState;

  parse(log: string): Game {
    // Single pass through log
    for (const line of log.split('\n')) {
      this.processLine(line);
    }
    return this.buildGameModel();
  }

  private processLine(line: string): void {
    // 1. Try pattern matchers
    if (matchTurnStart(line)) {
      this.handleTurnStart(line);
    } else if (matchCardPlayed(line)) {
      this.handleCardPlayed(line);
    }
    // ... more patterns
  }

  private handleTurnStart(line: string): void {
    // Extract data using pattern matcher
    const { player, turn } = extractTurnStart(line);

    // Validate against current state
    if (this.state.currentTurn && turn !== this.state.currentTurn + 1) {
      throw new ParseError('Turn numbers not sequential');
    }

    // Update state
    this.state.currentPlayer = player;
    this.state.currentTurn = turn;
    this.state.resources = { trade: 0, combat: 0 };

    // Record event
    this.state.currentTurnEvents.push({
      type: 'TURN_START',
      player,
      turn
    });
  }
}
```

#### 3. Game Model Builder

Transforms final parser state into the public Game Model interface:

**Structure:**
```typescript
interface Game {
  players: Player[];
  winner: Player;
  turns: Turn[];
}

interface Player {
  name: string;
}

interface Turn {
  player: Player;
  turnNumber: number;
  events: GameEvent[];
}
```

**Query Examples:**
- `game.winner` - Who won the game
- `game.players` - List of player names
- `game.turns[4].events` - All events from turn 5

### Key Design Principles

**Separation of Concerns:**
- **Pattern matchers** extract data (no state, easily testable)
- **State machine** tracks game state and validates transitions
- **Model builder** formats output

**Single Pass:**
- Process each line once
- State always available for validation
- Better performance than multi-stage pipelines

**Incremental Validation:**
- Validate state transitions as they happen
- Catch errors with full context (current line + game state)
- Fail fast with helpful error messages

## Validation

Validation ensures the parser produces a Game Model that accurately represents the actual game played.

### Golden File Testing (Automated)

For a set of log files, manually created expected outputs define what the Game Model should contain. The parser runs against these logs and compares its output to the expected result. Any mismatch indicates a parsing bug.

**Structure:**
```
logdata/
  game1.log
  game2.log
golden/
  game1.expected.json
  game2.expected.json
```

Each `.expected.json` file contains the expected Game Model for the corresponding log file. Tests parse the log and assert the output matches the expected JSON.

### Internal Consistency Checks (Automated)

The parser validates that the resulting Game Model follows Star Realms game rules:
- Both players start with 50 Authority
- Winner has Authority > 0, loser has Authority ≤ 0
- Turn numbers are sequential and alternate between players
- Resource totals in events match the running totals from the log
- Every turn has both a start and end event

These checks run automatically during parsing and flag any inconsistencies.

### Validation Phases

**Phase 1:** Golden file testing only (output is simple: player names and winner)
**Phase 2:** Add internal consistency checks as parsing expands to full game events

## Implementation Phases

### Phase 1 (Current Requirements)

**Approach:** Simple pattern matching (skip full state machine)

For Phase 1, we only need player names and winner. A full state machine is unnecessary.

**Implementation:**
```typescript
function parseGameBasics(log: string): { players: string[], winner: string } {
  // Extract players from turn start lines
  const playerSet = new Set<string>();
  const turnPattern = /It is now (.+?)'s turn/g;
  for (const match of log.matchAll(turnPattern)) {
    playerSet.add(match[1]);
  }

  // Extract winner
  const winnerMatch = log.match(/=== (.+?) has won the game\. ===/);

  return {
    players: Array.from(playerSet),
    winner: winnerMatch?.[1] || 'Unknown'
  };
}
```

**Rationale:**
- Meets all Phase 1 requirements in ~20 lines
- Fast to implement and test
- No premature complexity
- Easy to replace with full parser in Phase 2

### Phase 2 (Future)

**Approach:** Full state machine parser

Expand to capture complete game state:
- Complete turn structure with all events
- Card acquisitions with costs
- Combat and attacks with targets
- Resource tracking over time (trade, combat, authority)
- Card abilities and effects (ally abilities, scrap abilities)
- Bases in play and their lifecycle (played, used, destroyed)

**Implementation:**
```typescript
class GameParser {
  private state: ParserState = {
    players: new Map(),
    currentPlayer: null,
    currentTurn: null,
    resources: { trade: 0, combat: 0 },
    bases: new Map(),
    authority: new Map(),
    turns: [],
    currentTurnEvents: []
  };

  parse(log: string): Game {
    this.initializeState(log); // Extract players, set initial authority

    for (const line of log.split('\n')) {
      this.processLine(line);
    }

    this.validate(); // Run consistency checks
    return this.buildGameModel();
  }

  private processLine(line: string): void {
    // Pattern matching with state updates
  }

  private validate(): void {
    // Internal consistency checks
    // - Both players started with 50 authority
    // - Winner has authority > 0, loser <= 0
    // - Turn numbers sequential
    // - Resource totals match
  }
}
```

**Benefits of delaying full state machine:**
- Learn from Phase 1 implementation and real logs
- Better understand actual requirements
- Avoid over-engineering
- Can make informed architecture decisions based on data
