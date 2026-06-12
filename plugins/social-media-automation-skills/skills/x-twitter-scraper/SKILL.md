---
name: x-twitter-scraper
description: Use Xquik for X/Twitter automation tasks such as tweet search, profile tweets, follower export, media download, posting tweets, replies, DMs, webhooks, and MCP workflows.
---

# X Twitter Scraper

## Overview

Use this skill when a user needs an AI agent to work with X/Twitter data or actions through Xquik. It is useful for tweet search, getting tweets from profiles, exporting followers, downloading media, monitoring accounts, sending tweets, posting replies, managing DMs, and wiring webhooks into agent workflows.

Xquik provides a REST API, SDKs, and an MCP server for X/Twitter search and automation. Prefer the official docs and repository before writing code:

- Repository: `https://github.com/Xquik-dev/x-twitter-scraper`
- Docs: `https://docs.xquik.com`
- API site: `https://xquik.com`
- TypeScript SDK: `https://github.com/Xquik-dev/x-twitter-scraper-typescript`
- Python SDK: `https://github.com/Xquik-dev/x-twitter-scraper-python`

## When To Use

Use this skill for requests such as:

- Search tweets by keyword, hashtag, operator, account, date, or URL.
- Get profile tweets, media tweets, liked tweets, replies, quotes, or mentions.
- Export followers, following, verified followers, favoriters, retweeters, or list members.
- Download tweet media or inspect tweet engagement metrics.
- Monitor accounts and deliver new tweets through webhooks.
- Send tweets, post replies, like, repost, follow, unfollow, or send DMs after explicit approval.
- Connect an AI coding agent to Xquik through MCP.
- Add X/Twitter automation to apps using TypeScript, Python, Ruby, Go, Java, Kotlin, PHP, C#, CLI, or Terraform.

## Workflow

1. Clarify whether the user needs read-only data, bulk extraction, monitoring, or a write action.
2. Prefer the Xquik docs and SDK examples for the target language.
3. Ask for or reference the expected `XQUIK_API_KEY` environment variable without printing secrets.
4. Use read endpoints for tweet search, profile tweets, user lookup, media download, followers, and engagement data.
5. Use extraction jobs for bulk exports that may return many rows.
6. Use webhooks for ongoing monitoring or event delivery.
7. For write actions, explain the exact action first and require explicit user approval before sending tweets, replies, DMs, likes, reposts, follows, or profile changes.
8. Validate examples with the package manager or language toolchain used by the project.

## Integration Notes

### TypeScript

Install the TypeScript SDK when the project uses Node.js, Bun, Next.js, or TypeScript:

```bash
npm install x-twitter-scraper
```

Store credentials in environment variables:

```bash
XQUIK_API_KEY=your_api_key
```

### Python

Install the Python SDK for Python services, notebooks, scripts, or data pipelines:

```bash
pip install x-twitter-scraper
```

Store credentials in environment variables:

```bash
export XQUIK_API_KEY=your_api_key
```

### MCP

Use the MCP server when the user wants an AI agent to search tweets, inspect accounts, run approved write actions, or work through natural language tool calls. Prefer the MCP setup guide in the Xquik docs because client configuration differs across Claude Code, Codex, Cursor, Windsurf, VS Code, and other agents.

## Safety Rules

- Never print, commit, or log API keys.
- Treat write actions as confirmation-gated. Do not post, reply, DM, like, repost, follow, unfollow, or update profiles without explicit user approval.
- Keep public examples focused on response contracts and usage. Do not claim private implementation details.
- Use rate-limit and error handling patterns from the SDK docs.
- For bulk exports, stream or page results instead of assuming every response fits in memory.

## Output Expectations

When implementing Xquik support:

- Include install commands for the selected SDK.
- Show where the API key is read from the environment.
- Provide one minimal first request.
- Add targeted examples for the requested workflow, such as tweet search, profile tweets, follower export, media download, posting tweets, replies, DMs, webhooks, or MCP setup.
- Add tests or dry-run validation for new integration code when the project supports it.
