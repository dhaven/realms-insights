# Star Realms Game Log Analyzer - Implementation Plan

**Tech Stack**: TypeScript + Next.js (per architecture.md)
**Parser Design**: State Machine Parser (per architecture.md)
**Validation**: Golden file testing + internal consistency checks

**Key Architectural Decision**: Phase 1 uses simple regex extraction (~20 lines). Phase 2+ implements full state machine parser when requirements are concrete.

---

## Phase 1: Project Setup

### Task 1.1: Initialize Next.js Project
**Status**: Completed
**Branch**: feature/initialize-nextjs-project
**Goal**: Set up TypeScript Next.js project structure
- Run `npx create-next-app@latest` with TypeScript
- Configure project with App Router
- Set up directory structure: `app/`, `lib/`, `tests/`, `logdata/`, `golden/`
- Verify development server runs

### Task 1.2: Install Dependencies and Configure Testing
**Status**: Completed
**Branch**: feature/setup-testing-framework
**Goal**: Set up testing framework for golden file tests
- Install testing library (Jest or Vitest)
- Configure TypeScript for tests
- Create test directory structure
- Add test scripts to package.json

### Task 1.3: Select Sample Game Logs
**Status**: Completed
**Branch**: feature/select-sample-game-logs
**Goal**: Identify real Star Realms logs for testing
- Review existing logs in `logdata/` directory
- Select at least 2-3 logs with different characteristics
- Copy to `tests/fixtures/` for golden file tests
- Document log format observations

## Phase 2: Simple Parser (Phase 1 Requirements)

### Task 2.1: Implement Basic Pattern Matching Functions
**Goal**: Create utility functions for pattern extraction
- Create `lib/parser/patterns.ts`
- Implement `stripHtmlTags()` function
- Implement regex patterns for turn start and game end
- Write unit tests for pattern matching

### Task 2.2: Implement Simple Parser
**Goal**: Extract player names and winner using regex
- Create `lib/parser/basic.ts`
- Implement `parseGameBasics(log: string)` function
- Extract players from turn start lines: `/It is now (.+?)'s turn/g`
- Extract winner from: `/=== (.+?) has won the game\. ===/`
- Return `{ players: string[], winner: string }`

### Task 2.3: Define Basic Game Model Types
**Goal**: Create TypeScript interfaces for Phase 1 output
- Create `lib/types/game.ts`
- Define `Player` interface with `name` field
- Define `BasicGame` interface with `players` and `winner` fields
- Export types for use in UI and tests

## Phase 3: Validation - Golden File Testing

### Task 3.1: Create Expected Output Files
**Goal**: Manually define correct parsing results for Phase 1
- Create `tests/golden/` directory
- Create expected output JSON for each test log
- Structure: `{ players: ["Player1", "Player2"], winner: "Player1" }`
- Verify against actual game logs manually

### Task 3.2: Implement Golden File Test Suite
**Goal**: Automate validation of parser output
- Create test file `tests/parser-basic.test.ts`
- Load each fixture log file
- Parse log using `parseGameBasics()`
- Load corresponding `.expected.json`
- Assert parsed output matches expected output exactly

### Task 3.3: Add Basic Validation
**Goal**: Validate parser output follows basic rules
- Check that exactly 2 players exist
- Check that winner is one of the players
- Check that player names are non-empty strings
- Add validation function that runs after parsing

## Phase 4: Next.js UI - Upload Page

### Task 4.1: Create Upload Page Component
**Goal**: Build home page with upload form
- Create `app/page.tsx` as upload page
- Add textarea for game log input
- Add submit button
- Add placeholder text with instructions

### Task 4.2: Implement Client-Side Form Handling
**Goal**: Handle form submission with validation
- Make component a Client Component (`'use client'`)
- Add form state management (useState)
- Validate textarea is not empty
- Display error messages for validation failures

### Task 4.3: Create API Route for Log Processing
**Goal**: Process uploaded log on server side
- Create `app/api/parse/route.ts` API endpoint
- Accept POST request with log text
- Call `parseGameBasics()` on server
- Return parsed game data as JSON
- Handle parsing errors with appropriate HTTP status codes

### Task 4.4: Implement Upload Flow
**Goal**: Submit log and navigate to results
- Call `/api/parse` endpoint on form submit
- Handle loading state during request
- On success, navigate to game page with data
- On failure, display error message to user

## Phase 5: Next.js UI - Game Overview Page

### Task 5.1: Create Game Overview Page Component
**Goal**: Display parsed game results
- Create `app/game/page.tsx` for overview
- Use URL search params or route params to pass data
- Handle missing data (redirect to home)

### Task 5.2: Display Game Information
**Goal**: Show player names and winner
- Display both player names clearly
- Highlight the winner prominently
- Add clear visual hierarchy
- Use semantic HTML

### Task 5.3: Add Navigation
**Goal**: Allow return to upload page
- Add "Upload Another Game" button
- Link back to home page (`/`)

## Phase 6: Styling and Polish

### Task 6.1: Style Upload Page
**Goal**: Make upload page visually appealing
- Style textarea (monospace font, appropriate size)
- Style submit button with hover/active states
- Add responsive layout
- Improve error message styling (red, clear)

### Task 6.2: Style Game Overview Page
**Goal**: Make results clear and attractive
- Style player names prominently (large, bold)
- Style winner announcement with emphasis
- Add visual distinction (colors, icons, trophy emoji)
- Ensure responsive design for mobile

### Task 6.3: Add Loading and Transition States
**Goal**: Improve UX feedback
- Add loading spinner during parse request
- Add success/error toast notifications
- Smooth page transitions

## Phase 7: Error Handling and Edge Cases

### Task 7.1: Handle Parsing Failures
**Goal**: Gracefully handle malformed logs
- Test parser with logs from `logdata/errors/`
- Add try-catch in parser with helpful error messages
- Display user-friendly errors in UI
- Add "Try Again" option that clears form

### Task 7.2: Test Edge Cases
**Goal**: Ensure robustness across scenarios
- Test with empty log
- Test with partial/incomplete log
- Test with very long log (1000+ lines)
- Test with logs containing special characters
- Update parser to handle discovered issues

## Phase 8: Testing and Documentation

### Task 8.1: Expand Test Coverage
**Goal**: Add comprehensive automated tests
- Add more golden file test cases (aim for 5-10 logs)
- Add unit tests for pattern matching functions
- Add API route tests
- Achieve good code coverage on parser

### Task 8.2: Manual End-to-End Testing
**Goal**: Verify complete user flow works
- Test upload → parse → view flow end-to-end
- Test with multiple real game logs
- Test on different browsers (Chrome, Firefox, Safari)
- Test on mobile devices

### Task 8.3: Create Documentation
**Goal**: Document project setup and usage
- Add README with setup instructions (`npm install`, `npm run dev`)
- Document how to run tests
- Document how to add new golden test files
- Include example log snippet in README

---

## Phase 9+: State Machine Parser (Future - Phase 2 Requirements)

**Note**: The following phases implement the full state machine parser for comprehensive game analysis. Only proceed when Phase 2 requirements are confirmed.

### Task 9.1: Design Parser State Structure
**Goal**: Define complete state tracking interface
- Create `lib/parser/state.ts`
- Define `ParserState` interface with:
  - Player tracking (Map of players to PlayerState)
  - Current turn and current player
  - Resource tracking (trade, combat)
  - Bases in play (Map of player to Base[])
  - Authority tracking (Map of player to number)
  - Turn history and events
- Define all event types needed for Phase 2

### Task 9.2: Implement Pattern Matchers
**Goal**: Create pattern matching functions for all line types
- Expand `lib/parser/patterns.ts`
- Add patterns for: card played, card acquired, attack, base destroyed, scrap, etc.
- Add extractors for each pattern
- Write unit tests for each pattern matcher

### Task 9.3: Implement State Machine Core
**Goal**: Build the main GameParser class
- Create `lib/parser/state-machine.ts`
- Implement `GameParser` class with state
- Implement `parse(log: string): Game` method
- Implement `processLine(line: string)` dispatcher
- Handle state initialization

### Task 9.4: Implement State Transition Handlers
**Goal**: Add handler methods for each event type
- Implement `handleTurnStart()`
- Implement `handleCardPlayed()`
- Implement `handleCardAcquired()`
- Implement `handleAttack()`
- Implement `handleBaseDestroyed()`
- Implement `handleTurnEnd()`
- Each handler: extract data, validate, update state, record event

### Task 9.5: Implement State Validation
**Goal**: Add internal consistency checks
- Implement `validate()` method
- Check: both players start with 50 Authority
- Check: winner has Authority > 0, loser <= 0
- Check: turn numbers sequential and alternate
- Check: resource totals match log totals
- Check: every turn has start and end event

### Task 9.6: Implement Full Game Model Builder
**Goal**: Build complete Game Model from parser state
- Update `buildGameModel()` to include full turn data
- Structure turns with all events
- Include player stats (final authority, cards acquired, etc.)
- Calculate derived statistics

### Task 9.7: Update Golden File Tests
**Goal**: Expand test suite for Phase 2
- Create new expected JSON files with full game data
- Update test suite to validate complete Game Model
- Add tests for specific scenarios (base lifecycle, scrap abilities, etc.)
- Ensure all Phase 2 features are tested

### Task 9.8: Performance Optimization
**Goal**: Ensure parser handles large logs efficiently
- Profile parser performance
- Optimize pattern matching if needed
- Consider caching compiled regexes
- Test with very long logs (50+ turn games)
