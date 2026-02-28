
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
| **CONTRIBUTING.md** | You need to implement a task, create a branch, commit changes, or understand the development workflow |
| **architecture.md** | You need to understand the technical stack, parser design, validation strategy, or implementation approach |
| **plan.md** | You need to select the next task to work on, check task status, or update task tracking |
| **requirements.md** | You need to understand user-facing features and interaction flow |
| **star-realms-knowledge.md** | You need information about Star Realms game rules, card mechanics, or log format patterns |

### Quick Start Guide

**For implementing tasks:**
1. Read **CONTRIBUTING.md** for the complete workflow
2. Read **architecture.md** for technical guidance
3. Check **plan.md** to select an available task
4. Reference **star-realms-knowledge.md** as needed for game mechanics

**For understanding the codebase:**
1. Read **requirements.md** to understand what the app does
2. Read **architecture.md** to understand how it works
3. Explore the code with context from those documents

## Key Principles

When working on this project:

1. **Always read CONTRIBUTING.md first** - It contains the complete workflow for implementing tasks
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
├── CLAUDE.md            # This file - high-level AI guidance
├── CONTRIBUTING.md      # Development workflow (READ THIS for implementation tasks)
├── architecture.md      # Technical design and parser architecture
├── requirements.md      # Feature requirements
├── plan.md              # Implementation roadmap with task list
└── star-realms-knowledge.md  # Game rules and mechanics reference
```

## Common Questions

**Q: How do I implement a task?**
→ Read `CONTRIBUTING.md` for the complete workflow.

**Q: What technology is this project using?**
→ Read `architecture.md` for the tech stack and design decisions.

**Q: What should I work on next?**
→ Check `plan.md` for available tasks, then follow the workflow in `CONTRIBUTING.md`.

**Q: How does the parser work?**
→ Read `architecture.md` for the parser architecture and implementation phases.

**Q: What are the Star Realms game rules?**
→ Read `star-realms-knowledge.md` for game mechanics and log format patterns.
