#!/bin/bash
# Hook 5: PostToolUse — Immediate TypeScript compilation check (Environment-in-the-Loop)
# Runs scoped tsc --noEmit after writing ng package TypeScript files.
# Uses incremental build cache to stay under the 30s timeout.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check ng package TypeScript files (skip spec, stories, mdx)
if [[ -z "$FILE_PATH" ]] || [[ ! "$FILE_PATH" =~ packages/ng/.+\.ts$ ]]; then
  exit 0
fi

if [[ "$FILE_PATH" =~ \.(spec|stories)\.ts$ ]]; then
  exit 0
fi

PROJECT_ROOT=$(echo "$INPUT" | jq -r '.cwd // empty')
[[ -z "$PROJECT_ROOT" ]] && PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Extract component name for scoped error filtering
COMPONENT_DIR=$(dirname "$FILE_PATH")
COMPONENT_NAME=$(basename "$COMPONENT_DIR")

# Run scoped tsc check with incremental build to stay fast
# Swallow failures — the hook should never crash even if tsc times out or errors non-zero
cd "$PROJECT_ROOT" || exit 0
# Cache lives under node_modules/.cache so it survives `.migration-work/` resets
# (which are common when re-running the migration pipeline from scratch).
TSC_CACHE_DIR="node_modules/.cache/migration-tsc"
mkdir -p "$TSC_CACHE_DIR" 2>/dev/null || true
TSC_OUTPUT=$(npx tsc --noEmit --incremental --tsBuildInfoFile "${TSC_CACHE_DIR}/.tsbuildinfo" --project .storybook-ng/tsconfig.json 2>&1 | grep "packages/ng/${COMPONENT_NAME}/" | head -15 || true)

if [[ -n "$TSC_OUTPUT" ]]; then
  # Use jq --arg to safely encode multi-line output as JSON string
  MSG="⚠️ TypeScript 編譯錯誤（Environment-in-the-Loop 即時回饋）：

${TSC_OUTPUT}

請立即修正這些型別錯誤，不要等到 COMPILE_CHECK 階段。"

  jq -n --arg msg "$MSG" '{
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      decision: "allow",
      additionalContext: $msg
    }
  }'
  exit 0
fi

exit 0
