---
name: gh-cli
description: Use this skill when the user asks to create pull requests, review PRs, manage GitHub issues, check PR status, view diffs, merge PRs, or perform any GitHub-related operations. Activated by phrases like "create a PR", "review pull request", "check issues", "view PR", or mentions of GitHub workflows.
---

# GitHub CLI (gh) Skill

This skill provides comprehensive guidance for using the GitHub CLI (`gh`) to interact with GitHub repositories, manage pull requests, issues, and perform repository operations.

## Overview

The GitHub CLI (`gh`) is a command-line tool for GitHub interactions. It enables PR management, code review, issue tracking, and repository operations directly from the terminal.

## Authentication for AI Agents

**CRITICAL FIRST STEP**: Before using ANY `gh` command, ALWAYS check authentication status and log in if needed.

### Automatic Authentication Workflow

**ALWAYS start with this check:**

```bash
# Check if gh is logged in
if ! gh auth status 2>/dev/null; then
    # Not logged in - determine which token to use based on task

    # For CODE REVIEW tasks (posting reviews, approving PRs):
    # Use GitHub App token (allows bot identity for reviewing own PRs)
    source .env
    NEW_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)
    echo "$NEW_TOKEN" > /tmp/gh-token.txt
    gh auth login --with-token < /tmp/gh-token.txt
    rm /tmp/gh-token.txt

    # Save token to .env for future reference
    if grep -q "^GITHUB_APP_TOKEN=" .env; then
        sed -i "s|^GITHUB_APP_TOKEN=.*|GITHUB_APP_TOKEN=$NEW_TOKEN|" .env
    else
        echo "GITHUB_APP_TOKEN=$NEW_TOKEN" >> .env
    fi

    # OR for CODE IMPLEMENTATION tasks (creating PRs, pushing commits):
    # Use user token (attributes work to repository owner)
    source .env
    echo "$GITHUB_USER_TOKEN" > /tmp/gh-token.txt
    gh auth login --with-token < /tmp/gh-token.txt
    rm /tmp/gh-token.txt
fi

# Verify authentication
gh auth status
```

### Which Token Should I Use?

| Task Type | Token to Use | Authentication |
|-----------|--------------|----------------|
| **Code Review**<br>- Posting code reviews<br>- Approving/requesting changes<br>- Commenting on PRs as reviewer | **GitHub App Token**<br>`GITHUB_APP_TOKEN` | Regenerate fresh token using `generate-github-app-token.sh`<br>Tokens expire after 1 hour<br>Bot identity allows reviewing own PRs |
| **Code Implementation**<br>- Creating PRs<br>- Pushing commits<br>- Merging branches<br>- Managing issues | **User Token**<br>`GITHUB_USER_TOKEN` | Use token from `.env` file<br>No expiration<br>Attributes work to repository owner |

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

When reviewing a PR:

1. **Authenticate properly**: Ensure gh is logged in with GitHub App token (see authentication section above)
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
# Ensure logged in with user token
if ! gh auth status 2>/dev/null; then
    source .env
    echo "$GITHUB_USER_TOKEN" > /tmp/gh-token.txt
    gh auth login --with-token < /tmp/gh-token.txt
    rm /tmp/gh-token.txt
fi

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
# Ensure logged in with GitHub App token
if ! gh auth status 2>/dev/null; then
    source .env
    NEW_TOKEN=$(.claude/skills/gh-cli/scripts/generate-github-app-token.sh)
    echo "$NEW_TOKEN" > /tmp/gh-token.txt
    gh auth login --with-token < /tmp/gh-token.txt
    rm /tmp/gh-token.txt

    # Save to .env
    if grep -q "^GITHUB_APP_TOKEN=" .env; then
        sed -i "s|^GITHUB_APP_TOKEN=.*|GITHUB_APP_TOKEN=$NEW_TOKEN|" .env
    else
        echo "GITHUB_APP_TOKEN=$NEW_TOKEN" >> .env
    fi
fi

# List and review PRs
gh pr list
gh pr view 123
gh pr checkout 123
npm test  # or your test command
gh pr diff 123

# Post review
gh pr review 123 --approve --body "Changes look good. Tests pass."
# Or: gh pr review 123 --request-changes --body "Please address X"
```

### Workflow 3: Merge an Approved PR

```bash
# Ensure logged in with user token
if ! gh auth status 2>/dev/null; then
    source .env
    echo "$GITHUB_USER_TOKEN" > /tmp/gh-token.txt
    gh auth login --with-token < /tmp/gh-token.txt
    rm /tmp/gh-token.txt
fi

# Verify PR is approved and checks pass
gh pr checks 123

# Merge PR
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

# If not logged in or need to switch tokens, log out first
gh auth logout

# Then follow the authentication workflow for your task type (see above)
```

**Common authentication errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Not logged in" | Need to authenticate | Use authentication workflow from above |
| "Cannot review your own PR" | Using user token for review | Log out and use GitHub App token instead |
| "Resource not accessible by integration" | GitHub App lacks permissions | Check app permissions in GitHub settings |
| "Bad credentials" | Token expired or invalid | Log out and regenerate token (GitHub App tokens expire after 1 hour) |
| ".env file not found" | Missing .env configuration | Copy `.env.example` to `.env` and fill in |
| "Private key file not found" | Wrong path in .env | Verify `GITHUB_APP_PRIVATE_KEY_PATH` is correct |

**Note**: GitHub App tokens expire after 1 hour. Always regenerate when starting a code review session.

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
