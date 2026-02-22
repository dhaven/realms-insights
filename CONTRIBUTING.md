# Contributing to Star Realms Game Log Analyzer

This document provides guidance for AI assistants contributing to this project.

## Workflow Overview

This project uses a structured workflow based on the implementation plan defined in `plan.md`. All development work should follow this process to maintain consistency and traceability.

## Implementation Process

### 1. Select a Task

- Open `plan.md` and review the task list
- Select the **first incomplete task** from the top of the list
- Tasks are ordered by priority and dependency - always work top-down
- If a task is already assigned to a branch, skip to the next unassigned task

### 2. Create a Feature Branch

Before starting implementation, create a dedicated branch for the task:

```bash
git checkout -b feature/task-name
```

Branch naming convention:
- Use descriptive, kebab-case names
- Prefix with `feature/` for new features
- Prefix with `fix/` for bug fixes
- Prefix with `refactor/` for refactoring work

Examples:
- `feature/basic-parser-implementation`
- `feature/upload-page-ui`
- `fix/player-name-extraction`

### 3. Implement the Task

- Follow the technical guidance in `architecture.md`
- Adhere to the requirements in `requirements.md`
- Reference `star-realms-knowledge.md` for game mechanics
- Follow coding standards:
  - Write TypeScript with strict type checking
  - Include tests for parser logic (golden file tests)
  - Keep implementations simple and focused on current requirements
  - Avoid over-engineering or premature optimization

### 4. Commit Your Changes

Create clear, descriptive commits:

```bash
git add <files>
git commit -m "Implement basic game log parser

Add parseGameBasics function that extracts player names and winner
from Star Realms game logs using regex patterns.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

Commit message guidelines:
- Use imperative mood ("Add feature" not "Added feature")
- First line: brief summary (50-70 characters)
- Blank line, then detailed description if needed
- Include Co-Authored-By line for AI contributions

### 5. Push the Branch

Push your feature branch to the remote repository:

```bash
git push -u origin feature/task-name
```

### 6. Update plan.md

**IMPORTANT**: Update `plan.md` to track which branch implements which task:

```markdown
## Phase 1: Basic Parsing (Core Set Only)

### Task 1.1: Implement Basic Parser
**Status**: In Progress
**Branch**: `feature/basic-parser-implementation`
**Description**: Create parseGameBasics function to extract player names and winner...
```

Add these fields to the task:
- **Status**: In Progress (or Completed if merged)
- **Branch**: The name of your feature branch

Commit this update to the feature branch:

```bash
git add plan.md
git commit -m "Update plan.md: Track implementation branch"
git push
```

### 7. Create a Pull Request (if applicable)

If working in a collaborative environment, create a pull request for review. Otherwise, proceed to testing and validation.

### 8. Task Completion Rules

**CRITICAL**: Do not remove tasks from `plan.md` until their branches are merged into `main`.

- Tasks marked "In Progress" have an open feature branch
- Tasks marked "Completed" have been merged to `main`
- Only after merge should tasks be removed
- This maintains a complete audit trail of work

### 9. Merge to Main

This will be performed by a human supervisor

## Testing Requirements

### Golden File Tests

All parser implementations must include golden file tests:

1. Select 2-3 representative logs from `logdata/`
2. Create expected output files in `golden/`
3. Write tests that parse logs and assert output matches expected JSON
4. Include edge cases from `logdata/errors/`

### Test Before Pushing

Always run tests before pushing:

```bash
npm test
```

Ensure all tests pass before committing.

## Branch Management

### Active Branches

Keep track of active feature branches to avoid duplicate work:
- Check `plan.md` for branches already assigned to tasks
- Use `git branch -a` to see all local and remote branches

### Stale Branches

If a branch becomes stale or blocked:
- Update `plan.md` with status notes
- Consider creating a new branch if requirements changed
- Don't abandon branches without documentation

## Documentation Updates

When implementing features, update relevant documentation:
- Update `architecture.md` if technical approach changes
- Update `CLAUDE.md` if AI guidance needs revision
- Add inline code comments only where logic isn't self-evident
- Keep `requirements.md` in sync with actual implementation

## Questions and Clarifications

If task requirements are unclear:
- Review all documentation files first
- Check related game logs in `logdata/`
- Ask the project maintainer for clarification
- Document assumptions in commit messages

## Summary Checklist

Before considering a task complete:

- [ ] Created feature branch with descriptive name
- [ ] Implemented the task according to specifications
- [ ] Added or updated tests (golden files for parser)
- [ ] All tests pass locally
- [ ] Committed changes with clear messages
- [ ] Pushed branch to remote
- [ ] Updated `plan.md` with branch tracking
- [ ] Created pull request (if applicable)
- [ ] Task remains in `plan.md` until merged to `main`

---

Following this workflow ensures clean git history, traceable implementation progress, and maintainable code structure.
