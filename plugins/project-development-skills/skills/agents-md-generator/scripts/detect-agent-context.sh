#!/usr/bin/env bash
set -euo pipefail

root="."
declare -a extra_mcp_paths

usage() {
  cat <<'EOF'
Usage:
  bash skills/agents-md-generator/scripts/detect-agent-context.sh [options]

Options:
  --root <path>       Project root (default: .)
  --mcp-path <path>   Additional MCP config path (repeatable)
  -h, --help          Show help

Notes:
  - This script reports presence of AI tool instruction files and MCP configs.
  - It does not print file contents, only paths and MCP server names.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --root) root="${2:?}"; shift 2 ;;
    --mcp-path) extra_mcp_paths+=("${2:?}"); shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage >&2; exit 2 ;;
  esac
done

root="$(cd -- "$root" && pwd)"
home_dir="${HOME:-}"

print_header() {
  echo "Agent Context Report"
  echo "Project root: $root"
  echo
}

print_section() {
  echo "$1"
  echo "$(printf '%*s' ${#1} '' | tr ' ' '-')"
}

report_file() {
  local label="$1"
  local path="$2"
  if [[ -f "$path" ]]; then
    echo "- $label: $path"
    return 0
  fi
  return 1
}

report_dir() {
  local label="$1"
  local path="$2"
  if [[ -d "$path" ]]; then
    echo "- $label: $path"
    return 0
  fi
  return 1
}

list_glob_files() {
  local label="$1"
  local glob="$2"
  local found="false"
  local matches=()

  while IFS= read -r match; do
    matches+=("$match")
  done < <(compgen -G "$glob")

  if [[ ${#matches[@]} -gt 0 ]]; then
    for item in "${matches[@]}"; do
      if [[ -e "$item" ]]; then
        echo "- $label: $item"
        found="true"
      fi
    done
  fi

  [[ "$found" == "true" ]]
}

list_mcp_servers() {
  local file="$1"
  if command -v python3 >/dev/null 2>&1; then
    python3 - "$file" <<'PY'
import json
import sys

path = sys.argv[1]
try:
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)
except Exception as exc:
    print(f"  - ERROR: {exc.__class__.__name__}")
    sys.exit(0)

servers = data.get("mcpServers")
if isinstance(servers, dict) and servers:
    for name in sorted(servers.keys()):
        print(f"  - {name}")
else:
    print("  - (no mcpServers found)")
PY
    return 0
  fi

  if command -v node >/dev/null 2>&1; then
    node -e "const fs=require('fs');const p=process.argv[1];try{const data=JSON.parse(fs.readFileSync(p,'utf8'));const servers=data.mcpServers||{};const names=Object.keys(servers);if(names.length){names.sort().forEach(n=>console.log('  - '+n));}else{console.log('  - (no mcpServers found)');}}catch(e){console.log('  - ERROR: '+e.name);}" "$file"
    return 0
  fi

  echo "  - (unable to parse; install python3 or node)"
}

print_header

print_section "Project Instruction Files"

report_file "CLAUDE.md" "$root/CLAUDE.md" || true
report_file "AGENTS.md" "$root/AGENTS.md" || true
report_file "GitHub Copilot" "$root/.github/copilot-instructions.md" || true
report_file "Cursor" "$root/.cursorrules" || true
report_file "Cline (.clinerules file)" "$root/.clinerules" || true
report_dir "Cline (.clinerules dir)" "$root/.clinerules" || true
report_file "Kilo Code (.kilocoderules)" "$root/.kilocoderules" || true
report_dir "Kilo Code (.kilo dir)" "$root/.kilo" || true
report_file "Kilo Code (.kilocodemodes)" "$root/.kilocodemodes" || true
report_file "Kilo Code (.kilocode/config.json)" "$root/.kilocode/config.json" || true
report_dir "Roo Code (.roo/rules)" "$root/.roo/rules" || true
list_glob_files "Roo Code (.roo/rules-*)" "$root/.roo/rules-*" || true
list_glob_files "Roo Code (.roorules*)" "$root/.roorules*" || true
report_file "OpenCode (opencode.jsonc)" "$root/opencode.jsonc" || true

if [[ -n "${OPENCODE_CONFIG:-}" ]]; then
  report_file "OpenCode (OPENCODE_CONFIG)" "$OPENCODE_CONFIG" || true
fi

report_file "Claude Code (repo prompt)" "$root/.claude/CLAUDE.md" || true
report_file "Claude Code (.mcp.json)" "$root/.mcp.json" || true

echo
print_section "Global Instruction Files"

if [[ -n "$home_dir" ]]; then
  report_file "Claude Code Global Prompt" "$home_dir/.claude/CLAUDE.md" || true
  report_file "Codex Config" "$home_dir/.codex/config.toml" || true
  report_dir "Roo Code Global Rules" "$home_dir/.roo/rules" || true
  list_glob_files "Roo Code Global Rules (modes)" "$home_dir/.roo/rules-*" || true
  report_dir "Kilo Code Global Rules" "$home_dir/.kilocode/rules" || true
fi

echo
print_section "MCP Configs"

declare -a mcp_candidates
mcp_candidates+=("$root/.mcp.json")
mcp_candidates+=("$root/.roo/mcp.json")
mcp_candidates+=("$root/cline_mcp_settings.json")
if [[ -n "$home_dir" ]]; then
  mcp_candidates+=("$home_dir/.roo/mcp_settings.json")
  mcp_candidates+=("$home_dir/.cline/cline_mcp_settings.json")
  mcp_candidates+=("$home_dir/.config/cline/cline_mcp_settings.json")
fi

if [[ ${#extra_mcp_paths[@]} -gt 0 ]]; then
  mcp_candidates+=("${extra_mcp_paths[@]}")
fi

found_any_mcp="false"
for mcp_path in "${mcp_candidates[@]}"; do
  if [[ -f "$mcp_path" ]]; then
    found_any_mcp="true"
    echo "- $mcp_path"
    list_mcp_servers "$mcp_path"
  fi
done

if [[ "$found_any_mcp" == "false" ]]; then
  echo "- (no MCP configs found)"
fi

echo
print_section "Notes"
echo "- Global system prompts can override project rules. Review them for conflicts."
echo "- Use --mcp-path <path> to scan additional MCP config locations."
