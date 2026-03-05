
# CLAUDE.md

This file provides high-level guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Star Realms game log analyzer** web application. Users upload game logs (copied from the Star Realms mobile/desktop app) and receive a parsed view showing player names, winner, and eventually detailed game statistics.

**Current Status**: Early implementation phase. Basic project structure exists with testing framework set up.

## Documentation Structure

This project has comprehensive documentation. **Read the appropriate file(s) based on your task:**

### When to Read Each File

| File | Read When... |
|------|--------------|
| **architecture.md** | You need to understand the technical stack, parser design, validation strategy, or implementation approach |
| **plan.md** | You need to select the next task to work on, check task status, or update task tracking |
| **requirements.md** | You need to understand user-facing features and interaction flow |
| **star-realms-knowledge.md** | You need information about Star Realms game rules, card mechanics, or log format patterns |

**Note:** Development workflow and code review guidelines are now in specialized agent files (`.claude/agents/coder.md` and `.claude/agents/reviewer.md`).

### Quick Start Guide

**For implementing tasks:**
1. Use the **coder agent** (`.claude/agents/coder.md`) which has the complete development workflow
2. Read **architecture.md** for technical guidance
3. Check **plan.md** to select an available task
4. Reference **star-realms-knowledge.md** as needed for game mechanics

**For reviewing pull requests:**
1. Use the **reviewer agent** (`.claude/agents/reviewer.md`) which has complete review guidelines
2. Read **plan.md** to find the task the PR implements
3. Read **architecture.md** to verify architectural alignment

**For understanding the codebase:**
1. Read **requirements.md** to understand what the app does
2. Read **architecture.md** to understand how it works
3. Explore the code with context from those documents

## Key Principles

When working on this project:

1. **Use the specialized agents** - The coder and reviewer agents contain complete workflows
2. **Never commit directly to `main`** - All work happens on feature branches
3. **Follow the architecture** - Read architecture.md for technical design decisions
4. **Update plan.md** - Track your implementation branch in the plan file
5. **Start simple** - Avoid over-engineering; meet current requirements, not hypothetical future ones

## Directory Structure

Quick reference for navigating the codebase:

```
/
├── app/                 # Next.js app directory (pages and API routes)
├── lib/                 # Shared library code (parser implementation)
├── tests/               # Test files
├── logdata/             # Sample game logs (organized by expansion)
│   ├── core_set/
│   ├── colony_wars/
│   ├── frontier/
│   └── errors/          # Edge cases and malformed logs
├── golden/              # Expected parser outputs for testing
│
├── .claude/             # Agent configurations
│   └── agents/
│       ├── coder.md     # Development workflow and implementation guide
│       └── reviewer.md  # Code review guidelines and criteria
├── CLAUDE.md            # This file - high-level AI guidance
├── architecture.md      # Technical design and parser architecture
├── requirements.md      # Feature requirements
├── plan.md              # Implementation roadmap with task list
└── star-realms-knowledge.md  # Game rules and mechanics reference
```

## Common Questions

**Q: How do I implement a task?**
→ Use the **coder agent** which has the complete development workflow.

**Q: How do I review a pull request?**
→ Use the **reviewer agent** which has complete review guidelines.

**Q: What technology is this project using?**
→ Read `architecture.md` for the tech stack and design decisions.

**Q: What should I work on next?**
→ Check `plan.md` for available tasks, then use the coder agent to implement.

**Q: How does the parser work?**
→ Read `architecture.md` for the parser architecture and implementation phases.

**Q: What are the Star Realms game rules?**
→ Read `star-realms-knowledge.md` for game mechanics and log format patterns.
