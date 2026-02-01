# CLI KNOWLEDGE BASE

## OVERVIEW

CLI entry: `bunx oh-my-opencode`. Interactive installer, doctor diagnostics. Commander.js + @clack/prompts.

## STRUCTURE

```
cli/
├── index.ts                    # Commander.js entry (157 lines, 4 commands)
├── types.ts                    # InstallArgs, InstallConfig types (41 lines)
├── install.ts                  # Interactive TUI installer (521 lines)
├── config-manager.ts           # JSONC parsing, config management (665 lines)
├── model-fallback.ts           # Model fallback configuration (195 lines)
├── run/                        # Run command module
│   ├── index.ts               # Module exports (3 lines)
│   ├── types.ts               # RunOptions, RunContext types (77 lines)
│   ├── runner.ts              # Task runner with todo enforcement (170 lines)
│   ├── completion.ts          # Completion condition checks (80 lines)
│   └── events.ts              # Event stream processing (326 lines)
├── get-local-version/          # Version query module
│   ├── index.ts               # Version detection logic (107 lines)
│   ├── types.ts               # VersionInfo types (15 lines)
│   └── formatter.ts           # Version output formatting (67 lines)
├── doctor/                     # Diagnostics module
│   ├── index.ts               # Doctor entry point (12 lines)
│   ├── types.ts               # CheckResult, CheckDefinition types (114 lines)
│   ├── runner.ts              # Check orchestration (133 lines)
│   ├── formatter.ts           # Colored output formatting (141 lines)
│   ├── constants.ts           # Check IDs, symbols, categories (77 lines)
│   └── checks/                # 16 individual checks
│       ├── index.ts           # Check registration (41 lines)
│       ├── opencode.ts        # OpenCode installation check (179 lines)
│       ├── plugin.ts          # Plugin registration check (128 lines)
│       ├── config.ts          # Config validation with Zod (123 lines)
│       ├── model-resolution.ts # Model resolution check (265 lines)
│       ├── auth.ts            # Auth providers check (115 lines)
│       ├── dependencies.ts    # Dependencies check (187 lines)
│       ├── gh.ts              # GitHub CLI check (172 lines)
│       ├── lsp.ts             # LSP servers check (78 lines)
│       ├── mcp.ts             # MCP servers check (129 lines)
│       ├── mcp-oauth.ts       # MCP OAuth tokens check (81 lines)
│       └── version.ts         # Version status check (136 lines)
└── mcp-oauth/                  # MCP OAuth management
    ├── index.ts               # OAuth command registration (44 lines)
    ├── login.ts               # OAuth login (39 lines)
    ├── logout.ts              # OAuth logout (31 lines)
    └── status.ts              # OAuth status query (51 lines)
```

## COMMANDS

| Command | Purpose | Key Options |
|---------|---------|-------------|
| `install` | Interactive setup with provider selection | `--no-tui`, `--claude`, `--gemini`, `--copilot`, etc. |
| `doctor` | 16 health checks for diagnostics | `--verbose`, `--json`, `--category` |
| `run` | Launch session with todo enforcement | `--agent`, `--directory`, `--timeout` |
| `get-local-version` | Version detection and update check | `--json`, `--directory` |
| `mcp oauth login` | Authenticate with MCP server | `--server-url`, `--client-id`, `--scopes` |
| `mcp oauth logout` | Remove OAuth tokens | `--server-url` |
| `mcp oauth status` | Query OAuth token status | `[server-name]` |

## DOCTOR CATEGORIES (16 Checks)

| Category | Checks | Description |
|----------|--------|-------------|
| installation | opencode, plugin | OpenCode binary and plugin registration |
| configuration | config, model-resolution | JSONC validity and Zod validation |
| authentication | anthropic, openai, google | Auth provider plugins |
| dependencies | ast-grep-cli, ast-grep-napi, comment-checker | Optional dependencies |
| tools | gh-cli, lsp-servers, mcp-builtin, mcp-user, mcp-oauth | External tools and servers |
| updates | version-status | Version comparison with npm |

## KEY FILES DETAIL

### install.ts (521 lines)
- **TUI Mode**: Interactive prompts using @clack/prompts
- **Non-TUI Mode**: Command-line argument validation
- **Providers**: Claude (no/yes/max20), OpenAI, Gemini, Copilot, OpenCode Zen, Z.ai
- **Features**: Config detection, update mode, auth hints

### config-manager.ts (665 lines)
- **Config Formats**: JSON and JSONC support
- **Key Functions**:
  - `addPluginToOpenCodeConfig()` - Plugin registration
  - `writeOmoConfig()` - Write oh-my-opencode config
  - `addAuthPlugins()` - Add antigravity-auth for Gemini
  - `addProviderConfig()` - Add Google provider config
  - `detectCurrentConfig()` - Detect existing setup
- **Features**: Deep merge, error handling with suggestions

### model-fallback.ts (195 lines)
- **Purpose**: Generate model config based on provider availability
- **Special Agents**:
  - `librarian`: Prioritize ZAI if available
  - `explore`: Fast model chain (haiku → gpt-5-nano)
  - `sisyphus`: Opus for max20, sonnet otherwise
- **Fallback Priority**: Native > Copilot > OpenCode Zen > Z.ai

### run/runner.ts (170 lines)
- **Session Management**: Create with retry (exponential backoff)
- **Event Processing**: Real-time event stream handling
- **Completion Checks**: Todos + child sessions (recursive)
- **Constants**: POLL_INTERVAL_MS=500, DEFAULT_TIMEOUT_MS=0

### doctor/runner.ts (133 lines)
- **Check Execution**: Sequential execution with timing
- **Categories**: 6 categories in fixed order
- **Output**: Text or JSON format
- **Exit Codes**: 0 (success), 1 (failure)

## HOW TO ADD CHECK

1. Create `src/cli/doctor/checks/my-check.ts`
2. Export `getXXXCheckDefinition()` factory returning `CheckDefinition`
3. Add to `getAllCheckDefinitions()` in `checks/index.ts`

Example:
```typescript
export function getMyCheckDefinition(): CheckDefinition {
  return {
    id: CHECK_IDS.MY_CHECK,
    name: CHECK_NAMES[CHECK_IDS.MY_CHECK],
    category: "tools",
    check: async () => {
      // Check logic
      return { name: "...", status: "pass", message: "..." }
    },
    critical: false,
  }
}
```

## TUI FRAMEWORK

- **@clack/prompts**: `select()`, `spinner()`, `intro()`, `outro()`, `note()`, `log.success()`
- **picocolors**: Terminal colors (green, red, yellow, cyan, dim)
- **Symbols**: ✓ (pass), ✗ (fail), ⚠ (warn), ℹ (info), → (arrow), • (bullet)

## ENVIRONMENT VARIABLES

- `OPENCODE_SERVER_PORT`: Custom server port for run command
- `OPENCODE_SERVER_HOSTNAME`: Custom server hostname

## EXIT CODES

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Execution error |
| 130 | Interrupted (SIGINT) or timeout |

## ANTI-PATTERNS

- **Blocking in non-TTY**: Always check `process.stdout.isTTY`
- **Direct JSON.parse**: Use `parseJsonc()` from shared utils
- **Silent failures**: Return `warn` or `fail` in doctor instead of throwing
- **Hardcoded paths**: Use `getOpenCodeConfigPaths()` from `config-manager.ts`
- **Missing cleanup**: Always register SIGINT handlers in run command
