#!/bin/bash
# Hook 2: PreToolUse — Prevent tool-switching bypass (Issue #29795)
# When Edit/Write hooks block a file change, Claude may switch to Bash with sed/echo/tee.
# This hook catches those bypass attempts for protected paths.

set -euo pipefail

# shellcheck source=lib/migration-helpers.sh
source "$(dirname "$0")/lib/migration-helpers.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only intercept Bash tool calls
if [[ "$TOOL_NAME" != "Bash" ]]; then
  exit 0
fi

COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
if [[ -z "$COMMAND" ]]; then
  exit 0
fi

PROJECT_ROOT=$(echo "$INPUT" | jq -r '.cwd // empty')

# Extract actual write targets (redirections, tee, sed -i, cp/mv destinations).
# This avoids false positives where a command merely *mentions* a protected
# path (e.g. inside a quoted string, grep argument, or echo for debugging).
WRITE_TARGETS=$(extract_write_targets "$COMMAND" || true)

if [[ -z "$WRITE_TARGETS" ]]; then
  exit 0
fi

# Check 1: Protected pipeline-managed files
# NOT protected: migration-log.json, manifests/, deviations-registry.json
# (those are agent-authored)
PROTECTED_PATHS=(
  ".migration-work/dependency-graph.json"
  ".migration-work/react-audit.json"
  ".migration-work/angular-audit.json"
  ".migration-work/diff-report.json"
  ".claude/ng-components-audit.json"
)

while IFS= read -r target; do
  [[ -z "$target" ]] && continue
  for protected in "${PROTECTED_PATHS[@]}"; do
    if [[ "$target" == *"$protected" ]]; then
      jq -n --arg p "$protected" '{
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: ("❌ 嘗試透過 Bash 修改受保護檔案：" + $p + "\n此檔案由驗證腳本管理，不可直接修改。")
        }
      }'
      exit 0
    fi
  done
done <<< "$WRITE_TARGETS"

# Check 2: Writing to ng component/directive files without manifest
while IFS= read -r target; do
  [[ -z "$target" ]] && continue
  if [[ "$target" =~ packages/ng/.+\.(component|directive)\.ts$ ]] \
     && [[ ! "$target" =~ \.(spec|stories)\.ts$ ]]; then
    COMPONENT_NAME=$(resolve_component_root "$target")
    [[ -z "$COMPONENT_NAME" ]] && continue
    MANIFEST="${PROJECT_ROOT}/.migration-work/manifests/${COMPONENT_NAME}.json"
    if [[ ! -f "$MANIFEST" ]]; then
      jq -n --arg c "$COMPONENT_NAME" --arg m "$MANIFEST" '{
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: ("❌ 嘗試透過 Bash 繞過 manifest 檢查寫入 packages/ng/" + $c + "/\n請先產出 Component Manifest：" + $m)
        }
      }'
      exit 0
    fi
  fi
done <<< "$WRITE_TARGETS"

exit 0
