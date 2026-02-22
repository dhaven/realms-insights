# Tests Directory

This directory contains all test files for the Star Realms Game Log Analyzer.

## Directory Structure

- `parser/` - Parser unit tests and golden file tests
- `fixtures/` - Sample game logs used for testing

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

## Writing Tests

Tests use Vitest. Example:

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

## Golden File Testing

Golden file tests compare parser output against expected JSON files stored in the `/golden` directory at the project root.
