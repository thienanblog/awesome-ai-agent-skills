# Contributing to Awesome AI Agent Skills

Thank you for your interest in contributing! This guide will help you create and submit high-quality skills.

## Before You Start

### Prerequisites

- Node.js 18+ installed
- Git installed
- A GitHub account

### Setup

1. Fork this repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/awesome-ai-agent-skills.git
   cd awesome-ai-agent-skills
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Creating a New Skill

### Step 1: Create Skill Folder

Create a new folder in `skills/` with your skill name (use kebab-case):

```bash
mkdir -p skills/your-skill-name
```

### Step 2: Create SKILL.md

Create a `SKILL.md` file with the required YAML frontmatter:

```markdown
---
name: your-skill-name
description: Brief description of what the skill does and when to use it.
---

# Your Skill Name

## Overview
Explain what this skill does and when to use it.

## Workflow
1. Step one
2. Step two
3. Step three

## Guidelines
- Guideline one
- Guideline two
```

### Step 3: Add Reference Documentation (Optional)

If your skill needs detailed reference documentation:

```bash
mkdir -p skills/your-skill-name/references
```

Add markdown files in the `references/` folder for detailed guides.

### Skill Structure

```
skills/
  your-skill-name/
    SKILL.md              # Required: Skill definition with metadata
    references/           # Optional: Reference documentation
      your-reference.md
    assets/               # Optional: Images, templates, etc.
    scripts/              # Optional: Helper scripts
```

## Validating Your Skill Locally

**Important:** Always validate your skill before pushing to avoid failed PRs.

### Run Validation

```bash
npm run validate
```

This checks:
- Each skill folder has a `SKILL.md` file
- `SKILL.md` has valid YAML frontmatter with `name` and `description`
- All skills are listed in `marketplace.json`
- `marketplace.json` is valid JSON

### Expected Output

```
🔍 Validating AI Agent Skills Repository
=========================================

Found X skill(s) in skills/

📁 Validating skills...

📦 Validating marketplace.json...

=========================================
✅ All validations passed! (X valid skills)
```

### If Validation Fails

Fix the reported errors before pushing. Common issues:

| Error | Solution |
|-------|----------|
| Missing SKILL.md | Create `skills/your-skill/SKILL.md` |
| No valid YAML frontmatter | Add `---\nname: ...\ndescription: ...\n---` at top of SKILL.md |
| Missing "name" in frontmatter | Add `name: your-skill-name` to frontmatter |
| Missing "description" in frontmatter | Add `description: ...` to frontmatter |
| Skill not in marketplace.json | Run `npm run sync` to auto-add it |

### Sync Marketplace (Optional)

If you want to update `marketplace.json` locally:

```bash
npm run sync
```

This will:
- Scan all skills in `skills/` folder
- Update `marketplace.json` with discovered skills
- Update the skills table in `README.md`

**Note:** The sync happens automatically on merge via GitHub Actions, so this step is optional.

## Submitting Your Skill

### Step 1: Validate

```bash
npm run validate
```

Make sure all validations pass.

### Step 2: Commit

```bash
git add .
git commit -m "feat: add your-skill-name skill"
```

### Step 3: Push

```bash
git push origin main
```

### Step 4: Create Pull Request

1. Go to the original repository
2. Click "Pull Requests" > "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template
5. Submit

### What Happens Next

1. GitHub Actions runs validation on your PR
2. If validation passes, maintainers review your skill
3. On merge, the marketplace is auto-updated

## Skill Metadata Requirements

### Required Fields

| Field | Description |
|-------|-------------|
| `name` | Skill identifier (should match folder name, kebab-case) |
| `description` | Clear description of what the skill does and when to use it |

### Example

```yaml
---
name: api-documentation
description: Generate comprehensive API documentation from code. Use when documenting REST APIs, GraphQL endpoints, or RPC services.
---
```

## Quality Guidelines

### Do

- **Clear Purpose**: Solve a specific, well-defined problem
- **Actionable Instructions**: Include step-by-step workflows
- **Reference Documentation**: Provide detailed references for complex topics
- **Universal Compatibility**: Write instructions that work across different AI tools
- **Examples**: Include examples where helpful

### Don't

- Don't create skills that are too narrow or too broad
- Don't duplicate existing skills
- Don't include sensitive or proprietary information
- Don't use tool-specific syntax that won't work in other AI tools

## Getting Help

- Open an issue for questions or suggestions
- Check existing skills for examples
- Read [CLAUDE.md](./CLAUDE.md) for AI agent instructions

## Code of Conduct

Be respectful and constructive. We welcome contributions from everyone.
