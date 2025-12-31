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

# 從 npm registry 獲取最新的 prerelease 版本號
get_next_prerelease_version() {
  local preid=$1
  local package_name="@mezzanine-ui/react"

  # 獲取所有版本
  local versions=$(npm view "$package_name" versions --json 2>/dev/null)

  if [ -z "$versions" ]; then
    echo "1.0.0-${preid}.0"
    return
  fi

  # 找到最高的 canary/alpha/beta/rc 版本號
  local latest_prerelease=$(echo "$versions" | grep -o "\"1\.0\.0-${preid}\.[0-9]*\"" | sed 's/"//g' | sort -t. -k4 -n | tail -1)

  if [ -z "$latest_prerelease" ]; then
    # 沒有找到該 preid 的版本，從 0 開始
    echo "1.0.0-${preid}.0"
  else
    # 提取當前數字並 +1
    local current_num=$(echo "$latest_prerelease" | sed "s/1.0.0-${preid}\.//")
    local next_num=$((current_num + 1))
    echo "1.0.0-${preid}.${next_num}"
  fi
}

# 選擇發布類型
echo "請選擇發布類型："
echo ""
echo -e "${YELLOW}測試版本 (v2 分支)：${NC}"
echo "  1. 🔥 Canary   - 快照版本 (自動版本號，用於快速測試)"
echo ""
echo -e "${GREEN}正式版本流程 (main 分支)：${NC}"
echo "  2. 🧪 Alpha    - 內部測試版本 (首個測試版本)"
echo "  3. 🎯 Beta     - 公開測試版本 (功能測試)"
echo "  4. 🚀 RC       - 發布候選版本 (準備正式發布前的最後測試)"
echo "  5. ✅ Stable   - 正式版本 (生產環境)"
echo ""
echo "  0. ❌ 取消"
echo ""

read -p "請選擇 (0-5): " choice

case $choice in
  1)
    if [ "$CURRENT_BRANCH" != "v2" ]; then
      echo -e "${RED}❌ Canary 版本只能在 v2 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請切換到 v2 分支: git checkout v2${NC}"
      exit 1
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 Canary 版本...${NC}"

    # 獲取下一個 canary 版本號
    NEXT_VERSION=$(get_next_prerelease_version "canary")
    echo -e "${BLUE}ℹ️  下一個版本號: ${NEXT_VERSION}${NC}"
    echo ""

    read -p "確認要發布 ${NEXT_VERSION} 嗎？ (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
      echo -e "${YELLOW}❌ 已取消發布${NC}"
      exit 0
    fi

    # 使用明確的版本號
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn lerna version "$NEXT_VERSION" --no-push --yes
    yarn build
    yarn lerna publish from-package --dist-tag canary --yes

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
    if [ "$CURRENT_BRANCH" != "main" ]; then
      echo -e "${RED}❌ Alpha 版本只能在 main 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請先將 v2 合併到 main 分支: git checkout main && git merge v2${NC}"
      exit 1
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 Alpha 版本...${NC}"

    # 獲取下一個 alpha 版本號
    NEXT_VERSION=$(get_next_prerelease_version "alpha")
    echo -e "${BLUE}ℹ️  下一個版本號: ${NEXT_VERSION}${NC}"
    echo ""

    read -p "確認要發布 ${NEXT_VERSION} 嗎？ (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
      echo -e "${YELLOW}❌ 已取消發布${NC}"
      exit 0
    fi

    # 使用明確的版本號
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn lerna version "$NEXT_VERSION" --no-push --yes
    yarn build
    yarn lerna publish from-package --dist-tag alpha --yes

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ Alpha 版本發布完成！                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📦 安裝方式:${NC}"
    echo -e "   npm install @mezzanine-ui/react@alpha"
    echo -e "   yarn add @mezzanine-ui/react@alpha"
    ;;

  3)
    if [ "$CURRENT_BRANCH" != "main" ]; then
      echo -e "${RED}❌ Beta 版本只能在 main 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請先將 v2 合併到 main 分支${NC}"
      exit 1
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 Beta 版本...${NC}"

    # 獲取下一個 beta 版本號
    NEXT_VERSION=$(get_next_prerelease_version "beta")
    echo -e "${BLUE}ℹ️  下一個版本號: ${NEXT_VERSION}${NC}"
    echo ""

    read -p "確認要發布 ${NEXT_VERSION} 嗎？ (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
      echo -e "${YELLOW}❌ 已取消發布${NC}"
      exit 0
    fi

    # 使用明確的版本號
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn lerna version "$NEXT_VERSION" --no-push --yes
    yarn build
    yarn lerna publish from-package --dist-tag beta --yes

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ Beta 版本發布完成！                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📦 安裝方式:${NC}"
    echo -e "   npm install @mezzanine-ui/react@beta"
    echo -e "   yarn add @mezzanine-ui/react@beta"
    ;;

  4)
    if [ "$CURRENT_BRANCH" != "main" ]; then
      echo -e "${RED}❌ RC 版本只能在 main 分支發布${NC}"
      echo -e "${YELLOW}💡 提示: 請先將 v2 合併到 main 分支${NC}"
      exit 1
    fi

    echo ""
    echo -e "${YELLOW}📦 準備發布 RC 版本...${NC}"

    # 獲取下一個 rc 版本號
    NEXT_VERSION=$(get_next_prerelease_version "rc")
    echo -e "${BLUE}ℹ️  下一個版本號: ${NEXT_VERSION}${NC}"
    echo ""

    read -p "確認要發布 ${NEXT_VERSION} 嗎？ (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
      echo -e "${YELLOW}❌ 已取消發布${NC}"
      exit 0
    fi

    # 使用明確的版本號
    echo -e "${YELLOW}🚀 發布中...${NC}"
    yarn lerna version "$NEXT_VERSION" --no-push --yes
    yarn build
    yarn lerna publish from-package --dist-tag rc --yes

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ RC 版本發布完成！                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📦 安裝方式:${NC}"
    echo -e "   npm install @mezzanine-ui/react@rc"
    echo -e "   yarn add @mezzanine-ui/react@rc"
    ;;

  5)
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
