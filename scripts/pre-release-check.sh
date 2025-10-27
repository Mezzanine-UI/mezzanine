#!/bin/bash

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      🔍 發布前檢查清單 🔍                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# 1. 檢查 Git 狀態
echo -e "${YELLOW}1. 檢查 Git 狀態...${NC}"
if git diff-index --quiet HEAD --; then
  echo -e "${GREEN}   ✓ 沒有未提交的變更${NC}"
else
  echo -e "${RED}   ✗ 有未提交的變更${NC}"
  git status --short
  ERRORS=$((ERRORS + 1))
fi

# 2. 檢查當前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo ""
echo -e "${YELLOW}2. 檢查當前分支...${NC}"
echo -e "${BLUE}   📍 當前分支: ${CURRENT_BRANCH}${NC}"
if [ "$CURRENT_BRANCH" = "v2" ] || [ "$CURRENT_BRANCH" = "main" ]; then
  echo -e "${GREEN}   ✓ 在允許的發布分支上${NC}"
else
  echo -e "${RED}   ✗ 不在允許的發布分支上（應該是 v2 或 main）${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 3. 檢查是否與遠程同步
echo ""
echo -e "${YELLOW}3. 檢查遠程同步狀態...${NC}"
git fetch origin "${CURRENT_BRANCH}" --quiet 2>/dev/null || true
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
if [ -z "$REMOTE" ]; then
  echo -e "${YELLOW}   ⚠  無法檢測遠程分支（可能是新分支）${NC}"
  WARNINGS=$((WARNINGS + 1))
elif [ "$LOCAL" = "$REMOTE" ]; then
  echo -e "${GREEN}   ✓ 與遠程同步${NC}"
else
  echo -e "${RED}   ✗ 與遠程不同步${NC}"
  echo -e "${YELLOW}   💡 請執行: git pull origin ${CURRENT_BRANCH}${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 4. 檢查 node_modules
echo ""
echo -e "${YELLOW}4. 檢查依賴安裝...${NC}"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}   ✓ node_modules 存在${NC}"
else
  echo -e "${RED}   ✗ node_modules 不存在${NC}"
  echo -e "${YELLOW}   💡 請執行: yarn install${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 5. 運行 lint
echo ""
echo -e "${YELLOW}5. 執行 lint 檢查...${NC}"
if yarn lint --quiet 2>/dev/null; then
  echo -e "${GREEN}   ✓ Lint 檢查通過${NC}"
else
  echo -e "${RED}   ✗ Lint 檢查失敗${NC}"
  echo -e "${YELLOW}   💡 請執行: yarn lint 查看詳細錯誤${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 6. 運行構建測試
echo ""
echo -e "${YELLOW}6. 測試構建...${NC}"
if yarn build --quiet 2>/dev/null; then
  echo -e "${GREEN}   ✓ 構建成功${NC}"
else
  echo -e "${RED}   ✗ 構建失敗${NC}"
  echo -e "${YELLOW}   💡 請執行: yarn build 查看詳細錯誤${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 7. 檢查 npm 登錄狀態
echo ""
echo -e "${YELLOW}7. 檢查 npm 登錄狀態...${NC}"
if npm whoami &>/dev/null; then
  NPM_USER=$(npm whoami)
  echo -e "${GREEN}   ✓ 已登錄 npm (用戶: ${NPM_USER})${NC}"
else
  echo -e "${RED}   ✗ 未登錄 npm${NC}"
  echo -e "${YELLOW}   💡 請執行: npm login${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 總結
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}║   ✅ 所有檢查通過！可以發布             ║${NC}"
else
  echo -e "${RED}║   ❌ 發現 ${ERRORS} 個錯誤                     ║${NC}"
fi
if [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}║   ⚠️  發現 ${WARNINGS} 個警告                     ║${NC}"
fi
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}請先解決上述錯誤後再發布${NC}"
  exit 1
fi

echo -e "${GREEN}✨ 準備就緒，可以執行發布！${NC}"
echo -e "${BLUE}💡 執行發布: ./scripts/release.sh${NC}"
echo ""

exit 0
