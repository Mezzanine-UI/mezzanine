#!/bin/bash

# Script to check ESLint and TypeScript errors in a specific directory
#
# Features:
# - Automatically finds the nearest tsconfig.json by traversing up the directory tree
# - Works from any directory and handles relative/absolute paths
# - Filters TypeScript errors to show only those in the target path
# - Supports running only lint or only types checks
#
# Usage: ./scripts/check.sh [options] [path]
# Options:
#   --lint-only     Run only ESLint check
#   --types-only    Run only TypeScript check
# Examples:
#   ./scripts/check.sh packages/react/src/Modal    # Check specific directory
#   ./scripts/check.sh packages/react               # Check entire package
#   ./scripts/check.sh --lint-only packages/react   # Run only ESLint
#   ./scripts/check.sh --types-only .               # Run only TypeScript check

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse options
RUN_LINT=true
RUN_TYPES=true
TARGET_PATH="."

while [[ $# -gt 0 ]]; do
  case $1 in
    --lint-only)
      RUN_LINT=true
      RUN_TYPES=false
      shift
      ;;
    --types-only)
      RUN_LINT=false
      RUN_TYPES=true
      shift
      ;;
    *)
      TARGET_PATH="$1"
      shift
      ;;
  esac
done

ERRORS_FOUND=0

# Find monorepo root (git root or directory with package.json)
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# Normalize repo root to canonical path
if command -v realpath >/dev/null 2>&1; then
  REPO_ROOT=$(realpath "$REPO_ROOT")
elif command -v greadlink >/dev/null 2>&1; then
  # macOS with coreutils installed
  REPO_ROOT=$(greadlink -f "$REPO_ROOT")
else
  # Fallback: basic normalization
  REPO_ROOT=$(cd "$REPO_ROOT" && pwd -P)
fi

# Convert target path to absolute path (safe method that doesn't require path to exist)
if [[ "$TARGET_PATH" = /* ]]; then
  # Already absolute
  ABS_TARGET_PATH="$TARGET_PATH"
else
  # Make it absolute relative to current directory without requiring existence
  ABS_TARGET_PATH="$PWD/$TARGET_PATH"
fi

# Check if path exists before normalization
if [ ! -e "$ABS_TARGET_PATH" ]; then
  echo -e "${RED}❌ Path does not exist: $TARGET_PATH${NC}"
  exit 1
fi

# Normalize the target path to canonical form (resolve symlinks and ..)
if command -v realpath >/dev/null 2>&1; then
  ABS_TARGET_PATH=$(realpath "$ABS_TARGET_PATH")
elif command -v greadlink >/dev/null 2>&1; then
  # macOS with coreutils installed
  ABS_TARGET_PATH=$(greadlink -f "$ABS_TARGET_PATH")
else
  # Fallback: use cd to resolve path
  if [ -d "$ABS_TARGET_PATH" ]; then
    ABS_TARGET_PATH=$(cd "$ABS_TARGET_PATH" && pwd -P)
  else
    # For files, resolve the directory then append filename
    ABS_TARGET_PATH=$(cd "$(dirname "$ABS_TARGET_PATH")" && pwd -P)/$(basename "$ABS_TARGET_PATH")
  fi
fi

# Security check: Ensure the resolved path is within the repository
if [[ "$ABS_TARGET_PATH" != "$REPO_ROOT"* ]]; then
  echo -e "${RED}❌ Security error: Path is outside repository${NC}"
  echo -e "${RED}   Target: $ABS_TARGET_PATH${NC}"
  echo -e "${RED}   Repo:   $REPO_ROOT${NC}"
  exit 1
fi

# Convert to path relative to repo root
if [[ "$ABS_TARGET_PATH" == "$REPO_ROOT"/* ]]; then
  TARGET_PATH="${ABS_TARGET_PATH#$REPO_ROOT/}"
elif [[ "$ABS_TARGET_PATH" == "$REPO_ROOT" ]]; then
  TARGET_PATH="."
fi

echo "========================================"
echo "🔍 Checking: $TARGET_PATH"
echo "========================================"

# ESLint Check
if [ "$RUN_LINT" = true ]; then
  echo ""
  echo "📋 Running ESLint check..."
  # Run ESLint from repo root (temporarily disable set -e to handle failures)
  set +e
  (cd "$REPO_ROOT" && npx eslint "$TARGET_PATH" --ext .js,.ts,.tsx --max-warnings=0 2>&1)
  ESLINT_EXIT_CODE=$?
  set -e

  if [ $ESLINT_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ ESLint: No errors found${NC}"
  else
    echo -e "${RED}❌ ESLint: Errors found${NC}"
    ERRORS_FOUND=1
  fi
fi

# Find the nearest tsconfig.json by traversing up from target path
find_tsconfig_dir() {
  local search_path="$1"
  local current_dir="$search_path"

  # If search_path is a file, start from its directory
  if [ -f "$current_dir" ]; then
    current_dir=$(dirname "$current_dir")
  fi

  # Traverse up until we find tsconfig.json or reach repo root
  while [ "$current_dir" != "/" ]; do
    if [ -f "$current_dir/tsconfig.json" ]; then
      echo "$current_dir"
      return 0
    fi

    # Stop at repo root
    if [ "$current_dir" = "$REPO_ROOT" ]; then
      break
    fi

    current_dir=$(dirname "$current_dir")
  done

  # Fall back to repo root
  echo "$REPO_ROOT"
  return 0
}

# TypeScript Check
if [ "$RUN_TYPES" = true ]; then
  echo ""
  echo "📋 Running TypeScript check..."

  ABS_PACKAGE_DIR=$(find_tsconfig_dir "$ABS_TARGET_PATH")

  # Convert to relative path for display
  if [ "$ABS_PACKAGE_DIR" = "$REPO_ROOT" ]; then
    PACKAGE_DIR="."
  else
    PACKAGE_DIR="${ABS_PACKAGE_DIR#$REPO_ROOT/}"
  fi

  if [ -f "$ABS_PACKAGE_DIR/tsconfig.json" ]; then
    echo "Checking TypeScript in package: $PACKAGE_DIR"

    # Run tsc and filter output (temporarily disable set -e to capture output)
    set +e
    TSC_OUTPUT=$(cd "$ABS_PACKAGE_DIR" && npx tsc --noEmit 2>&1)
    TSC_EXIT_CODE=$?
    set -e

    if [ $TSC_EXIT_CODE -eq 0 ]; then
      echo -e "${GREEN}✅ TypeScript: No errors found${NC}"
    else
      # First, filter out node_modules
      ALL_ERRORS=$(echo "$TSC_OUTPUT" | grep -v "node_modules")

      # Count total errors (non-empty lines that look like errors)
      TOTAL_ERROR_COUNT=$(echo "$ALL_ERRORS" | grep -c "error TS" || echo "0")

      # Determine if we need to filter by specific path
      SHOULD_FILTER=false
      if [ -n "$TARGET_PATH" ] && [ "$TARGET_PATH" != "." ] && [ "$TARGET_PATH" != "$PACKAGE_DIR" ]; then
        # Extract relative path from package root
        REL_PATH=$(echo "$TARGET_PATH" | sed "s|^$PACKAGE_DIR/||")

        # Only filter if sed actually removed the prefix (meaning TARGET_PATH is under PACKAGE_DIR)
        if [ "$REL_PATH" != "$TARGET_PATH" ] && [ -n "$REL_PATH" ]; then
          SHOULD_FILTER=true
        fi
      fi

      # Apply path filtering if needed
      if [ "$SHOULD_FILTER" = true ]; then
        # Filter errors to only those in target path
        set +e
        FILTERED_OUTPUT=$(echo "$ALL_ERRORS" | grep "$REL_PATH")
        GREP_EXIT_CODE=$?
        set -e

        FILTERED_ERROR_COUNT=$(echo "$FILTERED_OUTPUT" | grep -c "error TS" || echo "0")

        if [ $GREP_EXIT_CODE -eq 0 ] && [ -n "$FILTERED_OUTPUT" ]; then
          # Found errors in target path
          echo -e "${RED}❌ TypeScript: Errors found (${FILTERED_ERROR_COUNT} in target path, ${TOTAL_ERROR_COUNT} total)${NC}"
          echo "$FILTERED_OUTPUT"
          ERRORS_FOUND=1
        elif [ $GREP_EXIT_CODE -eq 1 ]; then
          # grep found no matches - no errors in target path
          echo -e "${YELLOW}⚠️  TypeScript: No errors in target path (${TOTAL_ERROR_COUNT} errors exist elsewhere)${NC}"
        else
          # grep failed for some other reason - show all errors to be safe
          echo -e "${RED}❌ TypeScript: Errors found (filtering failed, showing all ${TOTAL_ERROR_COUNT} errors)${NC}"
          echo "$ALL_ERRORS"
          ERRORS_FOUND=1
        fi
      else
        # No filtering needed - show all errors
        echo -e "${RED}❌ TypeScript: Errors found (${TOTAL_ERROR_COUNT} errors)${NC}"
        echo "$ALL_ERRORS"
        ERRORS_FOUND=1
      fi
    fi
  else
    echo -e "${YELLOW}⚠️  No tsconfig.json found in $PACKAGE_DIR${NC}"
  fi
fi

# Summary
echo ""
echo "========================================"
if [ $ERRORS_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Checks failed. Please fix the errors above.${NC}"
  exit 1
fi
