---
name: gh-cli
description: Use this skill when the user asks to create pull requests, review PRs, manage GitHub issues, check PR status, view diffs, merge PRs, or perform any GitHub-related operations. Activated by phrases like "create a PR", "review pull request", "check issues", "view PR", or mentions of GitHub workflows.
---

# GitHub CLI (gh) Skill

This skill provides comprehensive guidance for using the GitHub CLI (`gh`) to interact with GitHub repositories, manage pull requests, issues, and perform repository operations.

## Overview

The GitHub CLI (`gh`) is a command-line tool for GitHub interactions. It enables PR management, code review, issue tracking, and repository operations directly from the terminal.

## Authentication for AI Agents

**CRITICAL**: AI agents must use different authentication methods depending on their role.

### Authentication Decision Tree

Before using any `gh` command, determine which token to use:

```
┌─────────────────────────────────────┐
│ What is the agent doing?            │
└─────────────────────────────────────┘
               │
               ├─── Reviewing a PR? ──────────────────────► Use GitHub App Token
               │    - Posting code reviews                  (Section 1 below)
               │    - Approving/requesting changes
               │    - Commenting on PRs as a reviewer
               │
               └─── Implementing code? ───────────────────► Use User Token
                    - Creating PRs                          (Section 2 below)
                    - Pushing commits
                    - Merging branches
                    - Managing issues
                    - Any other git/gh operations
```

### Section 1: Authentication for Code Review (GitHub App Token)

**When to use**: When the agent is acting as a **code reviewer**.

**Why**: This authenticates as a separate "bot" identity, avoiding the limitation that users cannot review their own PRs.

**Usage**:

```bash
# Source .env file to load credentials
source .env

# Generate and export GitHub App token (expires in 1 hour)
export GH_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)

# Verify authentication
gh auth status
# Should show: "Logged in to github.com as your-app-name[bot]"

# Now review PRs with the bot identity
gh pr review 123 --approve --body "LGTM! Tests pass and code follows project standards."
gh pr review 456 --request-changes --body "Please address the following issues..."
```

**Example complete workflow**:

```bash
# 1. Authenticate as GitHub App
source .env
export GH_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)

# 2. List open PRs
gh pr list

# 3. Review a PR
gh pr view 1                    # Read PR description
gh pr checkout 1                # Check out the branch
gh pr diff 1                    # Review changes
npm test                        # Run tests

# 4. Post review
gh pr review 1 --approve --body "Changes look good!"
```

### Section 2: Authentication for Code Implementation (User Token)

**When to use**: When the agent is **implementing code, creating PRs, or performing git operations**.

**Why**: These operations should be attributed to you (the repository owner), not the bot.

**Usage**:

```bash
# Source .env file to load credentials
source .env

# Export user token
export GH_TOKEN="$GITHUB_USER_TOKEN"

# Verify authentication
gh auth status
# Should show: "Logged in to github.com as YOUR_USERNAME"

# Now perform implementation tasks
gh pr create --title "..." --body "..."
git push origin feature-branch
gh issue create --title "..."
```

**Example complete workflow**:

```bash
# 1. Authenticate as user
source .env
export GH_TOKEN="$GITHUB_USER_TOKEN"

# 2. Create feature branch and implement code
git checkout -b feature/new-feature
# ... make code changes ...
git add .
git commit -m "Implement new feature"

# 3. Push and create PR
git push -u origin feature/new-feature
gh pr create --title "Add new feature" --body "$(cat <<'EOF'
## Summary
- Implemented feature X
- Added tests

## Test Plan
- [x] Run test suite
EOF
)"
```

### Quick Reference Table

| Task | Token Type | Command |
|------|------------|---------|
| Review PR | GitHub App | `export GH_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)` |
| Approve PR | GitHub App | Same as above |
| Create PR | User | `export GH_TOKEN="$GITHUB_USER_TOKEN"` |
| Push commits | User | Same as above |
| Merge PR | User | Same as above |
| Create issue | User | Same as above |

## GitHub CLI Commands Reference

### Pull Request Operations

#### Creating a Pull Request

```bash
# Basic PR creation (opens editor for title and body)
gh pr create

# Create PR with inline title and body
gh pr create --title "Add feature X" --body "Description of changes"

# Create PR with body from file or heredoc (RECOMMENDED)
gh pr create --title "Short title" --body "$(cat <<'EOF'
## Summary
- Implemented feature X
- Added tests for Y
- Updated documentation

## Test Plan
- [ ] Run test suite: npm test
- [ ] Verify feature works in dev environment
- [ ] Check edge cases

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# Create draft PR
gh pr create --draft --title "WIP: Feature X"

# Create PR targeting specific base branch
gh pr create --base main --title "Feature X"

# Create PR with reviewers
gh pr create --reviewer username1,username2
```

**Best Practices for PR Creation:**
- Keep titles under 70 characters
- Use the PR body for detailed descriptions, not the title
- Include a Summary section with bullet points of changes
- Add a Test Plan section with verification steps
- Review ALL commits that will be in the PR, not just the latest one
- Use `git log <base-branch>..HEAD` to see all commits in your branch
- Use `git diff <base-branch>...HEAD` to see all changes since branching

#### Viewing Pull Requests

```bash
# List open PRs
gh pr list

# List all PRs (including closed)
gh pr list --state all

# View specific PR details
gh pr view 123

# View PR in browser
gh pr view 123 --web

# View PR diff
gh pr diff 123

# View PR checks/status
gh pr checks 123
```

#### Reviewing Pull Requests

```bash
# Check out a PR locally for testing
gh pr checkout 123

# Add review comment
gh pr review 123 --comment --body "Looks good!"

# Approve PR
gh pr review 123 --approve --body "LGTM!"

# Request changes
gh pr review 123 --request-changes --body "Please address X"

# Add inline code comments (interactive)
gh pr review 123
```

#### Managing Pull Requests

```bash
# Merge a PR (after approval)
gh pr merge 123

# Merge with squash
gh pr merge 123 --squash

# Merge with rebase
gh pr merge 123 --rebase

# Delete branch after merge
gh pr merge 123 --delete-branch

# Close PR without merging
gh pr close 123

# Reopen closed PR
gh pr reopen 123

# Mark draft as ready for review
gh pr ready 123
```

### Issue Operations

```bash
# List issues
gh issue list

# View specific issue
gh issue view 456

# Create new issue
gh issue create --title "Bug: X" --body "Description"

# Close issue
gh issue close 456

# Reopen issue
gh issue reopen 456

# Add comment to issue
gh issue comment 456 --body "Update on this issue"
```

### Repository Operations

```bash
# View repository in browser
gh repo view --web

# Clone repository
gh repo clone owner/repo

# Fork repository
gh repo fork

# View repository README
gh repo view
```

### API Access

For advanced operations, use the GitHub API directly:

```bash
# Get PR comments
gh api repos/owner/repo/pulls/123/comments

# Get PR review comments
gh api repos/owner/repo/pulls/123/reviews

# List repository workflows
gh api repos/owner/repo/actions/workflows
```

## General Best Practices

### Pull Request Best Practices

- Keep titles concise and descriptive
- Write detailed PR descriptions with context
- Include a summary of changes
- Add test plan or verification steps
- Link related issues using `#issue-number`
- Request reviewers when creating the PR
- Respond to review comments promptly

### Code Review Best Practices

**IMPORTANT**: Before reviewing, authenticate with the GitHub App token (see Authentication Section 1).

When reviewing a PR:

1. **Authenticate properly**: Use GitHub App token, not user token
   ```bash
   source .env
   export GH_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)
   ```
2. **View the diff**: Use `gh pr diff <number>`
3. **Check out locally**: Use `gh pr checkout <number>` to test
4. **Run tests**: Execute test suite to verify changes
5. **Review code quality**:
   - Follows project conventions
   - Includes appropriate tests
   - No security issues
   - Performance implications considered
6. **Provide feedback**: Use `gh pr review` with specific, actionable comments
7. **Approve or request changes**: Based on review findings

## Common Workflows

### Workflow 1: Create a Feature Branch and PR

```bash
# Create and switch to new feature branch
git checkout -b feature/my-feature

# Make changes, commit
git add <files>
git commit -m "Implement feature X"

# Push branch to remote
git push -u origin feature/my-feature

# Create PR
gh pr create --title "Add feature X" --body "$(cat <<'EOF'
## Summary
- Implemented feature X
- Added tests for Y
- Updated documentation

## Test Plan
- [ ] Run test suite
- [ ] Verify feature manually
- [ ] Check edge cases
EOF
)"
```

### Workflow 2: Review a PR (as Code Reviewer)

```bash
# STEP 1: Authenticate as GitHub App
source .env
export GH_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)
gh auth status  # Verify shows "[bot]" identity

# STEP 2: Review the PR
# List open PRs
gh pr list

# View PR details
gh pr view 123

# Check out locally to test
gh pr checkout 123

# Run tests
npm test  # or your test command

# View diff
gh pr diff 123

# STEP 3: Post review
# Approve if good
gh pr review 123 --approve --body "Changes look good. Tests pass."

# Or request changes
gh pr review 123 --request-changes --body "Please address X before merging"
```

### Workflow 3: Merge an Approved PR

```bash
# Verify PR is approved and checks pass
gh pr checks 123

# Merge PR (choose merge strategy)
gh pr merge 123 --squash --delete-branch

# Update local main branch
git checkout main
git pull origin main
```

## Troubleshooting

### Authentication Issues

```bash
# Check current authentication status
gh auth status

# Verify you're using the correct token
echo $GH_TOKEN | cut -c1-10  # Show first 10 chars (ghp_ or ghs_)

# If using wrong token type, re-export the correct one:
# For code implementation:
source .env && export GH_TOKEN="$GITHUB_USER_TOKEN"

# For code review:
source .env && export GH_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)
```

**Common authentication errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot review your own PR" | Using user token for review | Use GitHub App token instead |
| "Resource not accessible by integration" | GitHub App lacks permissions | Check app permissions in GitHub settings |
| "Bad credentials" | Token expired or invalid | Regenerate token in GitHub settings |
| ".env file not found" | Missing .env configuration | Copy `.env.example` to `.env` and fill in |
| "Private key file not found" | Wrong path in .env | Verify `GITHUB_APP_PRIVATE_KEY_PATH` is correct |

### PR Creation Fails

```bash
# Ensure branch is pushed
git push -u origin feature/branch-name

# Verify remote is set
git remote -v

# Try creating PR with explicit base
gh pr create --base main
```

### View PR in Different Formats

```bash
# JSON output for scripting
gh pr view 123 --json title,body,state

# View specific fields
gh pr view 123 --json reviews --jq '.reviews[].state'
```

## Quick Reference

| Task | Command |
|------|---------|
| List open PRs | `gh pr list` |
| View PR | `gh pr view <number>` |
| Create PR | `gh pr create` |
| Review PR | `gh pr review <number>` |
| Merge PR | `gh pr merge <number>` |
| View diff | `gh pr diff <number>` |
| Checkout PR | `gh pr checkout <number>` |
| List issues | `gh issue list` |
| Create issue | `gh issue create` |

## Additional Resources

- Official docs: `gh help` or `gh <command> --help`
- GitHub CLI manual: https://cli.github.com/manual/
- GitHub CLI repository: https://github.com/cli/cli
