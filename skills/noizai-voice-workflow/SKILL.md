---
name: noizai-voice-workflow
description: Build human-like TTS voice workflows with style controls, local/cloud backends, and delivery-ready output. Use when the user needs expressive text-to-speech generation, voice broadcast assets, or app-ready voice messages.
---

# NoizAI Voice Workflow

Use this skill when the user asks for realistic, expressive speech workflows that should be ready for delivery in real scenarios.

## Repository

- https://github.com/NoizAI/skills

## Capabilities

- Generate natural-sounding TTS with speaking style presets
- Tune fillers, pacing, and emotional tone for companion-like output
- Run local-first or cloud-backed workflows depending on privacy/speed needs
- Produce delivery-ready audio for voice broadcast and chat app workflows

## Recommended flow

1. Clarify use case and audience (news, podcast, assistant voice, alert).
2. Pick backend mode:
   - Local-first for privacy-sensitive drafts
   - Cloud backend for speed and expressive controls
3. Generate short validation samples before long renders.
4. Apply style tuning (emotion/fillers/pacing) only where it improves clarity.
5. Render final audio and verify duration, clipping, and output format.
6. Package output for downstream app delivery.

## Quick commands

```bash
# List available NoizAI skills
npx skills add NoizAI/skills --list --full-depth

# Install TTS skill
npx skills add NoizAI/skills --full-depth --skill tts -y

# Example verification command
bash skills/characteristic-voice/scripts/speak.sh \
  --preset comfort -t "Hmm... I'm right here." -o comfort.wav
```

## Guardrails

- Keep descriptions factual and avoid overclaiming quality.
- If a model/backend is unavailable, provide fallback options.
- Do not expose API keys in logs, commits, or chat outputs.
