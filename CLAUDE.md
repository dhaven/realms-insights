# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Star Realms game log analyzer** web application. Users upload game logs (copied from the Star Realms mobile/desktop app) and receive a parsed view showing player names, winner, and eventually detailed game statistics.

**Status**: Pre-implementation (planning phase). No code written yet - only documentation exists.

## Key Documentation Files

Read these files to understand the project:

1. **requirements.md** - User-facing features and interaction flow
2. **architecture.md** - Technical stack, parser design, validation strategy
3. **plan.md** - Detailed implementation roadmap with atomic tasks
4. **star-realms-knowledge.md** - Game rules and mechanics reference
5. **CONTRIBUTING.md** - Workflow for AI contributors implementing tasks

## How to Implement Tasks

When asked to "implement the next task" or similar requests, follow this workflow:

### 1. Read CONTRIBUTING.md
The complete contribution workflow is documented in `CONTRIBUTING.md`. Always follow that process.

### 2. Select Task from plan.md
- Open `plan.md` and find the **first incomplete task** from the top
- Tasks are prioritized - always work top-down
- Skip tasks already assigned to a branch

### 3. Follow the Branch Workflow
**CRITICAL**: Never implement directly on `main`. Always use feature branches:

```bash
# Create feature branch
git checkout -b feature/descriptive-name

# Implement the task
# ... write code, tests, etc ...

# Commit changes
git add <files>
git commit -m "Clear description of changes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push branch
git push -u origin feature/descriptive-name

# Update plan.md to track the branch
# Add "Status: In Progress" and "Branch: feature/descriptive-name" to the task
git add plan.md
git commit -m "Update plan.md: Track implementation branch"
git push
```

### 4. Task Tracking Rules
- **Before merge**: Task stays in `plan.md` marked as "In Progress" with branch name
- **After merge**: Task can be marked "Completed" or removed from `plan.md`
- Never remove tasks before their branches are merged to `main`
- This maintains a complete audit trail

### 5. What NOT to Do
- ❌ Don't implement on `main` branch directly
- ❌ Don't skip updating `plan.md` with branch tracking
- ❌ Don't remove tasks from `plan.md` before merge
- ❌ Don't work on multiple tasks simultaneously (finish one first)

**Summary**: When implementing tasks, always create a feature branch, implement, commit, push, and update plan.md with branch tracking. See CONTRIBUTING.md for complete details.

## Technology Stack

- **Language**: TypeScript
- **Framework**: Next.js (App Router)
- **Testing**: Golden file testing (parser output validation)

## Parser Architecture

The parser uses a **state machine approach** that processes logs in a single pass while maintaining game state.

```
Raw Log Text → State Machine Parser → Game Model
```

### Phase 1 Implementation (Simple)
For initial requirements (player names + winner), uses simple regex extraction:

```typescript
function parseGameBasics(log: string): { players: string[], winner: string } {
  // Extract players from turn start lines
  const playerSet = new Set<string>();
  for (const match of log.matchAll(/It is now (.+?)'s turn/g)) {
    playerSet.add(match[1]);
  }

  // Extract winner
  const winnerMatch = log.match(/=== (.+?) has won the game\. ===/);
  return { players: Array.from(playerSet), winner: winnerMatch?.[1] };
}
```

**Rationale**: ~20 lines meets all Phase 1 requirements. Full state machine is premature.

### Phase 2 Implementation (State Machine)
For comprehensive parsing, implements full state machine:

**Pattern Matchers** (stateless):
- Strip HTML tags
- Match line patterns with regex
- Extract structured data
- Pure functions, easily testable

**State Machine Parser** (stateful):
- Tracks current player, turn, resources
- Tracks persistent state (bases in play, authority)
- Validates state transitions as they occur
- Single pass through log with full context

**Game Model Builder**:
- Transforms parser state into public API format
- Calculates derived statistics
- Formats for UI consumption

## Implementation Phases

### Phase 1 (Current Requirements)
Minimal viable parser:
- Extract player names from log
- Identify winner from `=== X has won the game. ===` line
- Display results on overview page

### Phase 2 (Future)
Full game tracking:
- Complete turn structure
- Card acquisitions with costs
- Combat and attacks
- Resource tracking over time

## Validation Strategy

### Golden File Testing
- Sample logs stored in `logdata/` (organized by expansion/game mode)
- Expected outputs in `golden/*.expected.json`
- Tests parse logs and assert output matches expected JSON
- Any mismatch indicates parsing bug

### Internal Consistency Checks
- Both players start with 50 Authority
- Winner has Authority > 0, loser has Authority ≤ 0
- Turn numbers are sequential and alternate between players
- Resource totals match running totals from log

## Game Log Format

Star Realms logs are plain text with embedded HTML color tags. Key patterns:

```
It is now PLAYER's turn N          # Turn start
PLAYER  >  <color=#XXXXXX>Card</color> +X Trade (Trade:Y)  # Card play
Acquired <color=#XXXXXX>Card</color>   # Card purchase
Attacked PLAYER for X (New Authority:Y)  # Attack
PLAYER ends turn N                 # Turn end
=== PLAYER has won the game. ===   # Game end
```

**Player name formats**:
- Can appear in turn start lines: `It is now MAX1478's turn 1`
- Can appear in action lines: `MAX1478 > <color=...>Card</color>`
- Can appear in attack lines: `Attacked YL5943 for 4`

## Directory Structure

```
/
├── logdata/              # Sample game logs (organized by expansion)
│   ├── core_set/
│   ├── colony_wars/
│   ├── frontier/
│   ├── errors/          # Edge cases and malformed logs
│   └── ...
├── golden/              # Expected parser outputs (will be created)
├── CLAUDE.md            # AI guidance for this project
├── CONTRIBUTING.md      # AI contributor workflow (branch creation, task tracking)
├── requirements.md      # Feature requirements
├── architecture.md      # Technical design
├── plan.md             # Implementation roadmap with task list
└── star-realms-knowledge.md  # Game rules reference
```

## Important Notes

### When Implementing the Parser
1. Start with Phase 1 scope only (player names + winner)
2. Create golden test files for at least 2-3 sample logs before implementing
3. Test against logs in `logdata/errors/` for edge cases
4. Color tags must be stripped before parsing line content
5. Player names can contain alphanumeric characters and may vary in format

### Next.js Structure (To Be Created)
- `app/page.tsx` - Upload page with textarea
- `app/game/page.tsx` - Game overview/results page
- `app/api/parse/route.ts` - Server-side parsing endpoint
- `lib/parser/` - Parser implementation (tokenizer, event parser, game model)
- `tests/` - Golden file tests and unit tests
