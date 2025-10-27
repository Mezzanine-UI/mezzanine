#!/bin/bash

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Mezzanine UI Release Script 🚀      ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# 檢查當前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${YELLOW}📍 當前分支: ${CURRENT_BRANCH}${NC}"

# 檢查是否有未提交的變更
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}❌ 錯誤: 有未提交的變更，請先提交或暫存${NC}"
  git status --short
  exit 1
fi

echo -e "${GREEN}✓ Git 狀態檢查通過${NC}"
echo ""

# 選擇發布類型
echo "請選擇發布類型："
echo ""
echo -e "${YELLOW}測試版本 (v2 分支)：${NC}"
echo "  1. 🔥 Canary   - 快照版本 (自動版本號，用於快速測試)"
echo "  2. 🧪 Beta     - 測試版本 (手動版本號，用於功能測試)"
echo "  3. 🎯 RC       - 發布候選版本 (準備正式發布前的最後測試)"
echo ""
echo -e "${GREEN}正式版本 (main 分支)：${NC}"
echo "  4. ✅ Stable   - 正式版本 (僅在 main 分支發布)"
echo ""
echo "  0. ❌ 取消"
echo ""

read -p "請選擇 (0-4): " choice

case $choice in
  1)
    if [ "$CURRENT_BRANCH" != "v2" ]; then
      echo -e "${RED}❌ Canary 版本只能在 v2 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請切換到 v2 分支: git checkout v2${NC}"
      exit 1
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 Canary 版本...${NC}"
    echo -e "${BLUE}ℹ️  Canary 版本會自動生成時間戳版本號${NC}"
    echo ""

    # 運行測試
    echo -e "${YELLOW}🧪 運行測試...${NC}"
    yarn test || {
      echo -e "${RED}❌ 測試失敗，發布已取消${NC}"
      exit 1
    }
    echo -e "${GREEN}✓ 測試通過${NC}"
    echo ""

    # 發布
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn release:canary

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ Canary 版本發布完成！                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📦 安裝方式:${NC}"
    echo -e "   npm install @mezzanine-ui/react@canary"
    echo -e "   yarn add @mezzanine-ui/react@canary"
    ;;

  2)
    if [ "$CURRENT_BRANCH" != "v2" ]; then
      echo -e "${RED}❌ Beta 版本只能在 v2 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請切換到 v2 分支: git checkout v2${NC}"
      exit 1
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 Beta 版本...${NC}"
    echo -e "${BLUE}ℹ️  Beta 版本格式: x.y.z-beta.n${NC}"
    echo ""

    # 運行測試
    echo -e "${YELLOW}🧪 運行測試...${NC}"
    yarn test || {
      echo -e "${RED}❌ 測試失敗，發布已取消${NC}"
      exit 1
    }
    echo -e "${GREEN}✓ 測試通過${NC}"
    echo ""

    # 發布
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn release:beta

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ Beta 版本發布完成！                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📦 安裝方式:${NC}"
    echo -e "   npm install @mezzanine-ui/react@beta"
    echo -e "   yarn add @mezzanine-ui/react@beta"
    ;;

  3)
    if [ "$CURRENT_BRANCH" != "v2" ]; then
      echo -e "${RED}❌ RC 版本只能在 v2 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請切換到 v2 分支: git checkout v2${NC}"
      exit 1
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 RC 版本...${NC}"
    echo -e "${BLUE}ℹ️  RC 版本格式: x.y.z-rc.n${NC}"
    echo ""

    # 運行測試
    echo -e "${YELLOW}🧪 運行測試...${NC}"
    yarn test || {
      echo -e "${RED}❌ 測試失敗，發布已取消${NC}"
      exit 1
    }
    echo -e "${GREEN}✓ 測試通過${NC}"
    echo ""

    # 發布
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn release:rc

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ RC 版本發布完成！                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📦 安裝方式:${NC}"
    echo -e "   npm install @mezzanine-ui/react@rc"
    echo -e "   yarn add @mezzanine-ui/react@rc"
    ;;

  4)
    if [ "$CURRENT_BRANCH" != "main" ]; then
      echo -e "${RED}❌ Stable 版本只能在 main 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請先將 v2 合併到 main 分支${NC}"
      exit 1
    fi

    echo ""
    echo -e "${RED}⚠️  警告: 你即將發布正式版本！${NC}"
    echo -e "${YELLOW}這將會更新 latest 標籤，所有用戶都會獲取此版本${NC}"
    echo ""
    read -p "確認要繼續嗎？ (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
      echo -e "${YELLOW}❌ 已取消發布${NC}"
      exit 0
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 Stable 版本...${NC}"
    echo ""

    # 運行測試
    echo -e "${YELLOW}🧪 運行完整測試...${NC}"
    yarn test || {
      echo -e "${RED}❌ 測試失敗，發布已取消${NC}"
      exit 1
    }
    echo -e "${GREEN}✓ 測試通過${NC}"
    echo ""

    # 發布
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn release:stable

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ Stable 版本發布完成！                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📦 安裝方式:${NC}"
    echo -e "   npm install @mezzanine-ui/react"
    echo -e "   yarn add @mezzanine-ui/react"
    ;;

  0)
    echo -e "${YELLOW}❌ 已取消${NC}"
    exit 0
    ;;

  *)
    echo -e "${RED}❌ 無效選擇${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${BLUE}📊 當前發布狀態:${NC}"
echo ""
npm dist-tag ls @mezzanine-ui/react 2>/dev/null || echo "  (尚未發布任何版本)"
echo ""
echo -e "${GREEN}✨ 完成！${NC}"
