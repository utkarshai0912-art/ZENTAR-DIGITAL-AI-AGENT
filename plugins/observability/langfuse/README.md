# Langfuse Observability Plugin

This plugin ships bundled with Zentar but is **opt-in** — it only loads when
you explicitly enable it.

## Enable

Pick one:

```bash
# Interactive: walks you through credentials + SDK install + enable
zentar tools  # → Langfuse Observability

# Manual
pip install langfuse
zentar plugins enable observability/langfuse
```

## Required credentials

Set these in `~/.zentar/.env` (or via `zentar tools`):

```bash
ZENTAR_LANGFUSE_PUBLIC_KEY=pk-lf-...
ZENTAR_LANGFUSE_SECRET_KEY=sk-lf-...
ZENTAR_LANGFUSE_BASE_URL=https://cloud.langfuse.com   # or your self-hosted URL
```

Without the SDK or credentials the hooks no-op silently — the plugin fails
open.

## Verify

```bash
zentar plugins list                 # observability/langfuse should show "enabled"
zentar chat -q "hello"              # then check Langfuse for a "Zentar turn" trace
```

## Optional tuning

```bash
ZENTAR_LANGFUSE_ENV=production       # environment tag
ZENTAR_LANGFUSE_RELEASE=v1.0.0       # release tag
ZENTAR_LANGFUSE_SAMPLE_RATE=0.5      # sample 50% of traces
ZENTAR_LANGFUSE_MAX_CHARS=12000      # max chars per field (default: 12000)
ZENTAR_LANGFUSE_DEBUG=true           # verbose plugin logging
```

## Disable

```bash
zentar plugins disable observability/langfuse
```
