---
name: gh-cli
description: Use this skill when the user asks to create pull requests, review PRs, manage GitHub issues, check PR status, view diffs, merge PRs, or perform any GitHub-related operations. Activated by phrases like "create a PR", "review pull request", "check issues", "view PR", or mentions of GitHub workflows.
---

# GitHub CLI (gh) Skill

This skill provides a reference guide for using the GitHub CLI (`gh`) to interact with GitHub repositories.

## Overview

The GitHub CLI (`gh`) is a command-line tool for GitHub interactions including PR management, code review, issue tracking, and repository operations.

## Authentication

**Two authentication methods are available:**

### 1. Personal Access Token (PAT)
```bash
# Load token from .env and authenticate
source .env
echo "$GITHUB_USER_TOKEN" > /tmp/gh-token.txt
gh auth login --with-token < /tmp/gh-token.txt
rm /tmp/gh-token.txt
```

**Characteristics:**
- No expiration
- Attributes work to the repository owner
- Use for: Creating PRs, pushing commits, managing issues

### 2. GitHub App Token
```bash
# Generate fresh token and authenticate
source .env
NEW_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)
echo "$NEW_TOKEN" > /tmp/gh-token.txt
gh auth login --with-token < /tmp/gh-token.txt
rm /tmp/gh-token.txt
```

**Characteristics:**
- Expires after 1 hour (regenerate as needed)
- Uses bot identity
- Use for: Posting code reviews, approving PRs

**Note**: Individual agents (coder, reviewer) will choose the appropriate authentication method for their tasks.

## GitHub CLI Commands Reference

### Pull Request Operations

#### Creating a Pull Request

```bash
# Basic PR creation (opens editor for title and body)
gh pr create

# Create PR with inline title and body
gh pr create --title "Add feature X" --body "Description of changes"

# Create PR with body from heredoc
gh pr create --title "Short title" --body "$(cat <<'EOF'
## Summary
- Implemented feature X
- Added tests for Y
- Updated documentation

## Test Plan
- [ ] Run test suite: npm test
- [ ] Verify feature works in dev environment
- [ ] Check edge cases
EOF
)"

# Create draft PR
gh pr create --draft --title "WIP: Feature X"

# Create PR targeting specific base branch
gh pr create --base main --title "Feature X"

# Create PR with reviewers
gh pr create --reviewer username1,username2
```

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

# Add review comment (no approval/rejection)
gh pr review 123 --comment --body "Looks good!"

# Approve PR
gh pr review 123 --approve --body "LGTM!"

# Request changes
gh pr review 123 --request-changes --body "Please address X"

# Add comment to PR (not a review)
gh pr comment 123 --body "Additional context"
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

## Authentication Management

### Check Authentication Status

```bash
# Check if logged in and with which account
gh auth status

# Log out (to switch tokens)
gh auth logout
```

### Common Authentication Issues

| Error | Solution |
|-------|----------|
| "Not logged in" | Authenticate using PAT or GitHub App token |
| "Bad credentials" | Token expired (GitHub App) or invalid - regenerate |
| ".env file not found" | Ensure `.env` exists with required tokens |
| "Cannot review your own PR" | Use GitHub App token instead of PAT |

### Troubleshooting PR Creation

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

## Required Environment Variables

The `.env` file should contain:

```bash
# Personal Access Token (for code implementation)
GITHUB_USER_TOKEN=ghp_xxxxxxxxxxxxx

# GitHub App credentials (for code review)
GITHUB_APP_ID=123456
GITHUB_APP_INSTALLATION_ID=12345678
GITHUB_APP_PRIVATE_KEY_PATH=/path/to/private-key.pem
```

## Quick Reference

| Task | Command |
|------|---------|
| Check auth status | `gh auth status` |
| Log in | `gh auth login --with-token < token-file` |
| Log out | `gh auth logout` |
| List open PRs | `gh pr list` |
| View PR | `gh pr view <number>` |
| Create PR | `gh pr create` |
| Review PR | `gh pr review <number>` |
| Approve PR | `gh pr review <number> --approve` |
| Request changes | `gh pr review <number> --request-changes` |
| Comment on PR | `gh pr comment <number>` |
| Merge PR | `gh pr merge <number>` |
| View diff | `gh pr diff <number>` |
| Checkout PR | `gh pr checkout <number>` |
| List issues | `gh issue list` |
| Create issue | `gh issue create` |

## Additional Resources

- Official docs: `gh help` or `gh <command> --help`
- GitHub CLI manual: https://cli.github.com/manual/
