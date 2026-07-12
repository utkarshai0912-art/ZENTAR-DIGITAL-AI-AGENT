# ZENTAR DIGITAL AI AGENT — Project Summary

*Generated: 2026-07-12 | Total files: ~6,173 | Version: 0.18.2*

---

## Overview

**ZENTAR DIGITAL AI AGENT** (formerly Hermes) is a self-improving AI agent by ZENTAR DIGITAL (originally by Nous Research). It runs the same agent core across a CLI, messaging gateway (Telegram, Discord, Slack, ~20 platforms), TUI, Electron desktop app, and web dashboard. The agent learns across sessions (memory + skills), delegates to subagents, runs scheduled jobs, and drives real terminals and browsers. Extended primarily through **plugins and skills**.

**Package:** `zentar-digital-agent`  
**Python:** >=3.11, <3.14  
**License:** MIT  

---

## Directory Structure

### Root Files

| File | Description |
|------|-------------|
| `run_agent.py` | **Core agent loop** — `AIAgent` class, `run_conversation()`, ~12K LOC. Orchestrates LLM calls, tool dispatch, iteration budget, interrupt handling |
| `cli.py` | **Interactive CLI orchestrator** — `ZentarCLI` class ~11K LOC. Uses Rich + prompt_toolkit, process_command() dispatches slash commands |
| `model_tools.py` | **Tool orchestration** — `handle_function_call()`, `discover_builtin_tools()`, tool schema assembly, service-gated tools |
| `toolsets.py` | **Toolset definitions** — `TOOLSETS` dict mapping platform keys to tool bundles; `_ZENTAR_CORE_TOOLS` default bundle |
| `zentar_state.py` | **Session store** — SQLite session storage with FTS5 full-text search |
| `zentar_constants.py` | **Config paths** — `get_zentar_home()`, `display_zentar_home()`, profile-aware path resolution |
| `zentar_logging.py` | **Logging setup** — `setup_logging()` for agent.log, errors.log, gateway.log |
| `zentar_bootstrap.py` | **Bootstrapping** — dependency installation, first-run setup |
| `zentar_time.py` | **Time utilities** — duration parsing, cron expression handling |
| `batch_runner.py` | **Parallel batch processing** — runs batch tasks concurrently |
| `trajectory_compressor.py` | **Context compression** — summarizes middle turns when near context limit |
| `mcp_serve.py` | **MCP server mode** — serves the agent as a Model Context Protocol server |
| `toolset_distributions.py` | **Toolset distribution profiles** — platform-aware tool enabling/disabling |
| `utils.py` | **Utility functions** — shared helpers |
| `setup.py` | **Setuptools shim** — for legacy pip install compatibility |
| `mini_swe_runner.py` | **SWE-bench runner** — automated software engineering benchmark |
| `pyproject.toml` | **Project metadata** — exact-pinned dependencies, build config |
| `MANIFEST.in` | **Package manifest** — includes skills, plugins, locales in sdist |
| `AGENTS.md` | **Development guide** — contribution rubric, architecture docs, coding standards |
| `CONTRIBUTING.md` | **Contributor guide** — PR workflow, testing, code review |
| `README.md` | **Project README** — user-facing introduction |
| `cli-config.yaml.example` | **CLI config template** — documented example config with all options |
| `Dockerfile` | **Docker build** — container image definition |
| `Makefile` | **Build automation** — common dev tasks |

---

### `agent/` — Agent Internals

Core agent implementation modules (50+ files):

| Module | Description |
|--------|-------------|
| `agent_init.py` | Agent initialization, credential resolution, configuration loading |
| `chat_completion_helpers.py` | LLM API call helpers — streaming, retry, error handling |
| `agent_runtime_helpers.py` | Runtime utilities — message formatting, tool call processing |
| `context_compressor.py` | Conversation context compression via summarization |
| `context_breakdown.py` | Token budgeting and context window management |
| `coding_context.py` | Coding workspace context — repo map, file structure |
| `codex_responses_adapter.py` | OpenAI Codex Responses API adapter |
| `codex_runtime.py` | Codex runtime bridge — GitHub Copilot integration |
| `anthropic_adapter.py` | Anthropic native API adapter (messages API) |
| `bedrock_adapter.py` | AWS Bedrock integration |
| `azure_identity_adapter.py` | Azure Foundry / Azure OpenAI (Entra ID auth) |
| `auxiliary_client.py` | Side-LLM client for vision, compression, search tasks |
| `memory_provider.py` | Memory provider ABC — pluggable memory backends |
| `memory_manager.py` | Memory orchestration — read/write/sync across providers |
| `browser_provider.py` | Browser automation ABC — browserbase, CDP, camofox |
| `browser_registry.py` | Browser session registry and lifecycle management |
| `curator.py` | Skill lifecycle management — auto-archive stale skills |
| `curator_backup.py` | Skill backup and rollback (tar.gz snapshots) |
| `display.py` | CLI display — KawaiiSpinner, activity feed, tool progress |
| `account_usage.py` | API usage tracking and cost monitoring |
| `billing_view.py` | Billing dashboard data generation |
| `bounded_response.py` | Response length capping utilities |
| `background_review.py` | Background E2B review of agent tool calls |
| `skill_commands.py` | Skill slash command loading and discovery |
| `async_utils.py` | Async utilities, task management, event loops |
| `lsp/` | Language Server Protocol integration submodule |

---

### `zentar_cli/` — CLI Subcommands

CLI framework with subcommands and utilities:

| File | Description |
|------|-------------|
| `main.py` | CLI entry point — argparse, command dispatch, profile override |
| `config.py` | Configuration loading — `DEFAULT_CONFIG`, YAML/ENV merge, migration |
| `commands.py` | Slash command registry — `COMMAND_REGISTRY` with CommandDef objects |
| `skin_engine.py` | Data-driven CLI theme system — skins, built-in themes, YAML loader |
| `plugins.py` | Plugin manager — discovers and loads plugins from multiple sources |
| `tools_config.py` | Interactive tool configuration via curses UI |
| `curator.py` | `zentar curator <verb>` CLI — skill lifecycle management |
| `kanban.py` | `zentar kanban <verb>` CLI — multi-agent kanban board |
| `curses_ui.py` | Curses-based interactive menu system |
| `pty_bridge.py` | PTY bridge for dashboard web terminal |
| `web_server.py` | Dashboard web server — REST API + WebSocket |
| `deployment.py` | Deployment management commands |
| `proxy/` | Reverse proxy submodule for gateway integrations |
| `subcommands/` | Additional subcommand handlers |
| `dashboard_auth/` | Dashboard OAuth authentication modules |

---

### `tools/` — Tool Implementations

~110 tool modules, auto-discovered via `tools/registry.py`:

**Core Tools:**
- `terminal_tool.py` / `read_terminal_tool.py` / `close_terminal_tool.py` — Terminal execution
- `file_tools.py` / `file_operations.py` — File read/write/patch/search
- `web_tools.py` — Web search and content extraction
- `browser_tool.py` / `browser_cdp_tool.py` / `browser_camofox.py` — Web browser automation
- `vision_tools.py` — Image analysis (vision_analyze)
- `image_generation_tool.py` — AI image generation (FLUX, etc.)

**Agent Tools:**
- `delegate_tool.py` — Subagent delegation (single + batch)
- `memory_tool.py` — Persistent memory read/write
- `todo_tool.py` — In-memory task tracking
- `skill_manager_tool.py` / `skills_tool.py` / `skills_hub.py` — Skill management
- `session_search_tool.py` — Past conversation search (FTS5 + AI summarization)

**Communication:**
- `send_message_tool.py` — Platform message sending
- `discord_tool.py` — Discord-specific tools
- `feishu_doc_tool.py` / `feishu_drive_tool.py` — Feishu/Lark integration
- `yuanbao_tools.py` — Tencent Yuanbao/WeCom integration

**Security & Approvals:**
- `approval.py` — Approval/rejection of dangerous commands
- `write_approval.py` — File write approval workflow
- `slash_confirm.py` — Slash command confirmation
- `tirith_security.py` — Pre-exec command scanning (homograph URLs, injection)
- `path_security.py` — Path traversal and safety checks
- `url_safety.py` — URL safety validation
- `threat_patterns.py` — Known threat pattern detection
- `osv_check.py` — OSV vulnerability scanning

**Infrastructure:**
- `cronjob_tools.py` — Scheduled job management
- `kanban_tools.py` — Kanban board toolset for workers
- `mcp_tool.py` / `mcp_oauth.py` / `mcp_oauth_manager.py` — MCP server integration
- `tts_tool.py` — Text-to-speech (Edge TTS, ElevenLabs, etc.)
- `transcription_tools.py` — Speech-to-text (Whisper, Groq, etc.)
- `video_generation_tool.py` — AI video generation
- `code_execution_tool.py` — Programmatic Python tool calling via RPC
- `homeassistant_tool.py` — Home Assistant smart home control
- `x_search_tool.py` / `xai_http.py` / `xai_video_tools.py` — X/Twitter integration
- `computer_use_tool.py` / `computer_use/` — Desktop computer use (click, type, drag)
- `environments/` — Terminal backend adapters (local, docker, ssh, modal, daytona, singularity)
- `registry.py` — Central tool discovery and registration system

---

### `gateway/` — Messaging Gateway

Multi-platform messaging gateway that runs the agent core as a bot:

| File | Description |
|------|-------------|
| `run.py` | Gateway runner — session management, message routing, agent lifecycle |
| `session.py` | Gateway session state, message queuing, interrupt handling |
| `config.py` | Gateway configuration loading |
| `hooks.py` | Event hook system for gateway lifecycle |
| `status.py` | Gateway status tracking, profile-aware lock management |
| `assets/` | Gateway assets (status phrases, images) |
| `builtin_hooks/` | Always-registered gateway hooks |
| `relay/` | Message relay system |

**Platform Adapters** (`gateway/platforms/`):
| Platform | Description |
|----------|-------------|
| `telegram` (via base.py) | Telegram bot integration |
| `discord` (via base.py) | Discord bot integration |
| `slack` (via base.py) | Slack bot integration |
| `whatsapp_cloud.py` | WhatsApp Cloud API |
| `signal.py` | Signal messaging |
| `matrix` (via base.py) | Matrix protocol |
| `mattermost` (via base.py) | Mattermost |
| `email` (via base.py) | Email gateway |
| `sms` (via base.py) | SMS gateway |
| `webhook.py` | Generic webhook receiver |
| `api_server.py` | OpenAI-compatible API server |
| `weixin.py` | WeChat/Weixin |
| `feishu` / `lark` | Feishu/Lark |
| `dingtalk` (via base.py) | DingTalk |
| `qqbot/` | QQ bot |
| `teams` (via base.py) | Microsoft Teams |
| `google_chat` (via base.py) | Google Chat |
| `homeassistant` (via base.py) | Home Assistant |
| `bluebubbles.py` | BlueBubbles (iMessage bridge) |
| `yuanbao.py` | Tencent Yuanbao |
| `irc` (via base.py) | IRC protocol |
| `signal_rate_limit.py` | Signal-specific rate limiting |
| `_http_client_limits.py` | HTTP client connection limits |

---

### `plugins/` — Plugin System

Extensible plugin architecture with 19 plugin directories:

| Plugin | Description |
|--------|-------------|
| `memory/` | Memory provider plugins (honcho, mem0, supermemory, byterover, etc.) |
| `model-providers/` | Inference backend plugins (openrouter, anthropic, gemini, deepseek, etc.) |
| `context_engine/` | Context engine plugins |
| `kanban/` | Multi-agent kanban board + dispatcher + dashboard |
| `zentar-achievements/` | Gamified achievement tracking |
| `observability/` | Metrics, traces, logs |
| `image_gen/` | Image generation providers |
| `video_gen/` | Video generation providers |
| `browser/` | Browser automation providers |
| `web/` | Web tool providers |
| `platforms/` | Community platform adapters |
| `dashboard_auth/` | Dashboard authentication providers |
| `google_meet/` | Google Meet integration |
| `spotify/` | Spotify music control |
| `disk-cleanup/` | Disk space management |
| `cron_providers/` | Cron job provider backends |
| `teams_pipeline/` | MS Teams CI/CD pipeline integration |
| `security-guidance/` | Security advisory plugin |
| `transcription/` | Speech-to-text provider plugins |

---

### `skills/` — Built-in Skills

15 skill categories shipped by default:

| Category | Skills |
|----------|--------|
| `computer-use/` | Desktop automation, clicking, typing, dragging |
| `software-development/` | Code review, refactoring, debugging, PR management |
| `github/` | GitHub issue/PR/repo management |
| `research/` | Web research, paper analysis, fact checking |
| `data-science/` | Data analysis, visualization, ML workflow |
| `mlops/` | Model training, deployment, experiment tracking |
| `productivity/` | Task management, note taking, scheduling |
| `email/` | Email composition, inbox management |
| `creative/` | Content creation, image editing, writing |
| `media/` | Media processing, video editing |
| `smart-home/` | Home automation, IoT control |
| `note-taking/` | Knowledge base, documentation |
| `social-media/` | Social media posting and management |
| `apple/` | Apple ecosystem integrations |
| `dogfood/` | Exploratory QA of web apps |
| `autonomous-ai-agents/` | Third-party AI agent integrations |
| `index-cache/` | Search index caching skills |

### `optional-skills/` — Optional/Niche Skills

Heavier skills not active by default, installed via `zentar skills install official/<category>/<skill>`:

| Category | Notable Skills |
|----------|----------------|
| `autonomous-ai-agents/` | Antigravity CLI, Blackbox, Grok, Honcho, OpenHands |
| `blockchain/` | EVM, Hyperliquid, Solana |
| `communication/` | One-Three-One rule |
| `creative/` | Concept diagrams, meme generation, pixel art, Blender MCP, Hyperframes |
| `devops/` | Docker management, Pinggy tunnel, watchers, s6 container supervision |
| `email/` | AgentMail |
| `finance/` | 3-statement model, comps, DCF, LBO, merger model |
| `mcp/` | MCP server management |
| `migration/` | Database/code migration helpers |
| `security/` | Security audit, vulnerability scanning |
| `web-development/` | Frontend/backend development workflows |
| `dogfood/` | Adversarial UX testing |

---

### `apps/` — Desktop & Web Applications

#### `apps/desktop/` — Electron Desktop App
- **Electron + React + nanostores** chat application
- Talks to `tui_gateway` backend via JSON-RPC over WebSocket
- `electron/` — Electron main process (backend command, bootstrap, window management)
- `src/` — React renderer (chat UI, slash commands, theme system)
- `scripts/` — Build, package, sign, and test scripts
- `public/` — Static assets
- `assets/` — Icons and branding

#### `apps/bootstrap-installer/` — Tauri Desktop Installer
- **Tauri + React** thin installer
- First-launch Python runtime download and setup
- `src-tauri/` — Rust-based Tauri backend

#### `apps/shared/` — Shared TypeScript Package
- `@zentar/shared` npm package
- `JsonRpcGatewayClient`, WebSocket URL helpers, shared types
- Used by both desktop app and web dashboard

#### `web/` — Web Dashboard (React + Vite)
- Web-based chat dashboard (`/chat`, `/settings`, `/sessions`)
- xterm.js terminal with WebGL renderer
- Embedded TUI via PTY bridge
- `src/pages/`, `src/components/`, `src/hooks/`, `src/store/`
- i18n support (multiple languages in `src/i18n/`)

---

### `ui-tui/` — Terminal UI (Ink/React)

Full TUI replacement for the classic CLI, activated via `zentar --tui`:

- **Ink (React for terminals)** renderer
- JSON-RPC stdio bridge to Python `tui_gateway` backend
- `src/` — React components (transcript, composer, session picker, themes)
- `packages/zentar-ink/` — Shared Ink component library
- `scripts/` — Build and dev scripts

### `tui_gateway/` — TUI Python Backend

Python JSON-RPC server that backs the TUI:
- `server.py` — RPC method catalog (prompt.submit, message.delta, tool.start, etc.)
- Session management, slash command execution, model calls

---

### `website/` — Documentation Site (Docusaurus)

Full documentation website at `hermes-agent.nousresearch.com`:
- `docs/getting-started/` — Installation and quickstart
- `docs/user-guide/` — Features, configuration, skills, plugins, MCP
- `docs/developer-guide/` — Plugin authoring, model providers, contributing
- `docs/guides/` — Tutorials and walkthroughs
- `docs/reference/` — API reference, config reference
- `docs/integrations/` — Platform and tool integrations
- `i18n/zh-Hans/` — Chinese (Simplified) translation
- `src/` — Custom React components and pages

---

### `tests/` — Test Suite (~17K tests across ~900 files)

| Directory | Description |
|-----------|-------------|
| `tests/agent/` | Agent core tests (AIAgent, memory, context, providers) |
| `tests/cli/` | CLI command and interaction tests |
| `tests/gateway/` | Gateway and platform adapter tests |
| `tests/tools/` | Individual tool implementation tests |
| `tests/zentar_cli/` | CLI subcommand tests (config, commands, plugins) |
| `tests/skills/` | Skill loading and execution tests |
| `tests/plugins/` | Plugin system tests (browser, memory, model_providers, etc.) |
| `tests/providers/` | Provider integration tests |
| `tests/run_agent/` | Agent loop end-to-end tests |
| `tests/cron/` | Cron scheduler tests |
| `tests/docker/` | Docker deployment tests |
| `tests/e2e/` | End-to-end workflow tests |
| `tests/computer_use/` | Computer use tool tests |
| `tests/integration/` | Cross-module integration tests |
| `tests/stress/` | Stress and performance tests |
| `tests/fakes/` | Fake/mock implementations for testing |
| `tests/fixtures/` | Test fixtures (plugins, configs, etc.) |
| `tests/website/` | Website documentation tests |
| `tests/tui_gateway/` | TUI gateway tests |
| `tests/dashboard/` | Dashboard tests |

---

### Supporting Directories

| Directory | Description |
|-----------|-------------|
| `cron/` | **Scheduler** — `jobs.py` (job store), `scheduler.py` (tick loop), `scripts/` |
| `docker/` | **Docker deployment** — s6-overlay supervision, container init scripts |
| `docs/` | **Internal docs** — design docs, plans, security docs, kanban, middleware |
| `locales/` | **Localization** — i18n translation files |
| `nix/` | **Nix flake** — Nix package build definition |
| `optional-mcps/` | **Optional MCP servers** — Linear, n8n, Unreal Engine |
| `infographic/` | **Performance analysis** — approval mode validation, dead delivery targets, tool labels, profile perf |
| `acp_adapter/` | **ACP server** — VS Code / Zed / JetBrains integration adapter |
| `acp_registry/` | **ACP registry** — agent identity and capability registration |
| `assets/` | **Brand assets** — images, logos, branding |
| `scripts/` | **Build/CI scripts** — `run_tests.sh`, `release.py`, contributor audit |
| `datagen-config-examples/` | **Data generation** — configuration examples for benchmark data |
| `docker/` | **Docker images** — multi-stage Dockerfiles, s6 supervision |

---

## Key Architecture Principles

1. **Per-conversation prompt caching is sacred** — never mutate past context, swap toolsets, or rebuild system prompts mid-conversation
2. **Core is a narrow waist** — most capability lives at the edges (plugins, skills, CLI commands), not in core model tools
3. **Profile isolation** — each profile has its own `ZENTAR_HOME` directory with independent config, sessions, memory
4. **Plugin discovery** — plugins loaded from `~/.zentar/plugins/`, `./.zentar/plugins/`, and pip entry points
5. **Skill system** — reusable procedures loaded from `skills/` and `~/.zentar/skills/`, auto-created after complex tasks
6. **Cron scheduler** — scheduled jobs with multi-format schedule support (duration, cron expression, ISO timestamp)
7. **Delegation** — subagents with isolated context, parallel batch mode, background execution
8. **Kanban** — multi-agent work queue with durable SQLite board, dispatcher, worker toolset

---

## CLI Quick Reference

```bash
zentar                  # Interactive CLI session
zentar --tui            # Terminal UI (Ink/React)
zentar serve            # Headless gateway server
zentar dashboard        # Web dashboard
zentar desktop          # Launch desktop app
zentar tools            # Interactive tool config (curses)
zentar setup            # First-run setup wizard
zentar update           # Self-update
zentar auth add <name>  # Add provider credentials
zentar skills install   # Install skills
zentar cron list        # List scheduled jobs
zentar kanban ls        # List kanban tasks
zentar curator status   # Skill maintenance status
zentar logs             # View logs
zentar -p <profile>     # Run with specific profile
```

## Environment Variables (Key)

| Variable | Purpose |
|----------|---------|
| `ZENTAR_HOME` | Override config/data directory |
| `ZENTAR_API_TIMEOUT` | Global API timeout (seconds) |
| `ZENTAR_INTERACTIVE` | Force interactive mode |
| `ZENTAR_SERVE_HEADLESS` | Run serve without web UI |
| `ZENTAR_VERIFY_ON_STOP` | Auto-verify after editing |
| `ZENTAR_ACCEPT_HOOKS` | Auto-accept shell hooks |
| `ZENTAR_DASHBOARD_*` | Dashboard OAuth config |
