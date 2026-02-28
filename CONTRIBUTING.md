# Contributing to Star Realms Game Log Analyzer

This document provides guidance for AI assistants contributing to this project.

## Workflow Overview

This project uses a structured workflow based on the implementation plan defined in `plan.md`. All development work should follow this process to maintain consistency and traceability.

## Implementation Process

### 0. Choose Your Task Priority (Do This First!)

**Before starting any work**, always check for open pull requests and choose the highest priority task:

```bash
gh pr list
```

Work on tasks in this priority order:

---

#### **Priority 1: Review PRs Without Reviews** (Highest Priority)

If there are open PRs that have **no code reviews yet**, review them first.

**Action:** Use the `/review` command to provide a comprehensive code review:

```bash
# In Claude Code, type:
/review <pr-number>
```

The review will follow the guidelines in `CODE_REVIEW.md`, focusing on:
- Does the PR achieve its goals from `plan.md`?
- Code quality, testing, and architecture alignment
- Security and correctness

**After reviewing:** Provide one of three outcomes:
- **Approve** if the PR meets all criteria
- **Request Changes** if issues must be fixed
- **Comment** for optional suggestions

---

#### **Priority 2: Address Code Reviews on Your PRs**

If there are open PRs **with code reviews** that you created, address the feedback.

**Action:** Follow this process:

1. **Reflect deeply on the review:**
   - Read the PR description and all review comments carefully
   - Check out the PR branch locally: `gh pr checkout <number>`
   - Review the code changes: `gh pr diff <number>`
   - Understand the reviewer's concerns and suggestions
   - Consider the context of the changes and their impact

2. **Decide on a course of action:**
   - Determine which review comments should be addressed
   - Identify changes that would improve the code
   - Consider any architectural or design implications
   - Plan what changes need to be made

3. **Implement necessary changes:**
   - Make the required code changes
   - Run tests to ensure nothing breaks: `npm test`
   - Commit changes with clear messages referencing the review
   - Push changes to the PR branch: `git push`

4. **Communicate your actions (optional):**
   - If you're not implementing a suggestion, add a comment explaining why
   - Use `gh pr comment <number> --body "explanation"` to add comments
   - Mark conversations as resolved if appropriate

---

#### **Priority 3: Work on a New Task** (Lowest Priority)

**Only if** there are no PRs to review (Priority 1) and no code reviews to address (Priority 2), proceed to select a new task from `plan.md`.

### 1. Select a Task

**After** checking for open PRs (see step 0 above):

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

### 7. Create a Pull Request

After pushing your branch and updating `plan.md`, create a pull request for review:

```bash
gh pr create --title "Brief description" --body "$(cat <<'EOF'
## Summary
- Key change 1
- Key change 2

## Test Plan
- [ ] Run test suite: npm test
- [ ] Verify feature manually
- [ ] Check edge cases

Related to task X.X in plan.md
EOF
)"
```

The PR will be reviewed according to the workflow in step 0. Other contributors (AI or human) will check for open PRs before starting new work and will review or address your PR.

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

Before starting any work, follow the priority order from step 0:

- [ ] **Priority 1**: Checked for open PRs: `gh pr list`
- [ ] **Priority 1**: If PRs exist without reviews, used `/review` to review them (see `CODE_REVIEW.md`)
- [ ] **Priority 2**: If PRs exist with reviews on my work, addressed the feedback
- [ ] **Priority 3**: Only if no PRs need attention, selected a new task from `plan.md`

When implementing a task:

- [ ] Created feature branch with descriptive name
- [ ] Implemented the task according to specifications
- [ ] Added or updated tests (golden files for parser)
- [ ] All tests pass locally
- [ ] Committed changes with clear messages
- [ ] Pushed branch to remote
- [ ] Updated `plan.md` with branch tracking
- [ ] Created pull request
- [ ] Task remains in `plan.md` until merged to `main`

---

Following this workflow ensures clean git history, traceable implementation progress, and maintainable code structure.
