# Code Review Guidelines

This document provides comprehensive guidelines for reviewing pull requests in this project.

## Overview

Code reviews ensure that:
- PRs achieve their stated goals from `plan.md`
- Code quality remains high
- Architecture patterns are followed
- Security vulnerabilities are avoided
- Tests adequately cover changes

## Primary Review Criteria

### 1. Alignment with plan.md Goals

**CRITICAL**: The most important aspect of any review is verifying the PR achieves its stated goals.

- Locate the task in `plan.md` that this PR implements
- Read the task description and acceptance criteria carefully
- Verify that the PR fully addresses the task requirements
- Check if the implementation matches the intended scope (not over-engineered or incomplete)
- Confirm the PR doesn't introduce features outside the task scope

**Example assessment:**
```
Task 1.1 in plan.md states: "Extract player names and winner from game logs"

✓ PR correctly extracts player names from turn start lines
✓ PR correctly identifies winner from game end line
✗ PR is missing error handling for malformed logs (mentioned in task)
→ Request changes to add error handling
```

### 2. Code Quality

- **Readability**: Is the code clear and self-documenting?
- **Type Safety**: Does TypeScript strict mode pass without `any` types?
- **Simplicity**: Is the solution as simple as possible for the requirements?
- **Naming**: Are variables, functions, and types well-named?
- **Structure**: Is code organized logically?

### 3. Testing

- **Test Coverage**: Are there tests for the new functionality?
- **Golden Files**: For parser changes, are golden file tests included?
- **Edge Cases**: Are error cases and edge cases tested?
- **Tests Pass**: Did the reviewer verify tests pass locally?

### 4. Architecture Alignment

- **Follows architecture.md**: Does the implementation match the documented architecture?
- **Pattern Consistency**: Does it follow existing patterns in the codebase?
- **No Premature Optimization**: Is the code appropriately simple for current needs?
- **Dependencies**: Are new dependencies justified and minimal?

### 5. Security and Correctness

- **Input Validation**: Are user inputs validated appropriately?
- **Error Handling**: Are errors handled gracefully?
- **Resource Management**: Are resources properly managed (no memory leaks)?
- **Security Issues**: No XSS, injection vulnerabilities, or unsafe operations?

### 6. Documentation

- **Comments**: Are complex sections explained (but not over-commented)?
- **README/Docs**: Are documentation files updated if needed?
- **API Changes**: Are interface changes documented?

## Review Process

Follow these steps when reviewing a PR:

1. **Read the PR description and related task in plan.md**
   - Understand what the PR is trying to accomplish
   - Find the corresponding task in `plan.md`
   - Note the acceptance criteria

2. **Check out the branch locally**: `gh pr checkout <number>`
   - Get the code on your local machine for testing

3. **Review the diff**: `gh pr diff <number>` or use your IDE
   - Read through all changes carefully
   - Look for potential issues or improvements

4. **Run the tests**: `npm test`
   - Verify all existing tests still pass
   - Check that new tests are included and passing

5. **Test manually** if applicable
   - For UI changes, test the interface
   - For parser changes, try with sample logs

6. **Provide feedback** using one of these outcomes:

## Review Outcomes

### Approve

Use when the PR meets all criteria:

```bash
gh pr review <number> --approve --body "LGTM!

✓ Meets all goals from plan.md Task X.X
✓ Tests pass and cover edge cases
✓ Code is clear and follows project patterns
✓ No security concerns"
```

### Request Changes

Use when issues must be fixed before merge:

```bash
gh pr review <number> --request-changes --body "Great progress! A few items to address:

1. Task X.X in plan.md requires error handling for malformed logs
2. Please add golden file tests for edge cases in logdata/errors/
3. The parsePlayerNames function could be simplified (see inline comment)

Once these are addressed, I'll re-review."
```

### Comment (No Approval)

Use for suggestions that don't block merge:

```bash
gh pr review <number> --comment --body "Nice work! A few optional suggestions:

- Consider extracting the regex patterns to constants for reusability
- The variable name 'data' could be more specific

Not blocking, but worth considering for future improvements."
```

## What to Avoid in Reviews

- **Don't approve PRs that don't meet plan.md goals** - This is the primary criterion
- **Don't request changes for stylistic preferences** - Follow existing patterns
- **Don't suggest over-engineering** - Keep it simple for current requirements
- **Don't approve without testing** - Always verify tests pass
- **Don't be vague** - Give specific, actionable feedback with examples

## Review Turnaround

- Aim to review PRs within the same work session when possible
- Prioritize PR reviews over starting new tasks
- Re-review promptly after changes are pushed

## Common Review Patterns

### Parser Implementation Reviews

When reviewing parser changes:
- Verify golden file tests are included
- Check against sample logs in `logdata/`
- Test with edge cases from `logdata/errors/`
- Ensure regex patterns are correct and efficient
- Verify error handling for malformed input

### UI Implementation Reviews

When reviewing UI changes:
- Test the interface manually
- Verify responsive design (if applicable)
- Check for accessibility issues
- Ensure consistent styling with existing components

### Test Implementation Reviews

When reviewing test changes:
- Verify tests actually test the intended functionality
- Check that tests are deterministic (not flaky)
- Ensure edge cases are covered
- Verify test names clearly describe what they test

## Using the /review Command

The `/review` command in Claude Code will automatically follow these guidelines. Simply use:

```
/review <pr-number>
```

This will trigger a comprehensive code review that:
- Checks alignment with plan.md goals
- Reviews code quality and architecture
- Verifies testing coverage
- Provides specific, actionable feedback

---

Following these guidelines ensures consistent, high-quality code reviews that maintain project standards and help contributors improve their work.
