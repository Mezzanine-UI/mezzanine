# Mezzanine UI 發布指南

## 發布流程總覽

```
v2 分支 (開發)
  ├─ Canary 版本 (快速測試)
  ├─ Beta 版本 (功能測試)
  └─ RC 版本 (發布候選)
       ↓
    合併到 main
       ↓
  Stable 版本 (正式發布)
```

## 版本類型說明

### 1. Canary 版本 🔥

**用途**: 快速測試，自動版本號

**適用場景**:

- 需要快速驗證某個功能
- 每日構建測試
- 內部測試版本

**版本格式**: `1.0.0-canary.20250127123456`

**發布命令**:

```bash
# 在 v2 分支
yarn release:canary
```

**安裝方式**:

```bash
npm install @mezzanine-ui/react@canary
yarn add @mezzanine-ui/react@canary
```

### 2. Beta 版本 🧪

**用途**: 功能測試，手動版本號

**適用場景**:

- 新功能開發完成
- 需要用戶測試反饋
- API 可能變更

**版本格式**: `1.1.0-beta.1`, `1.1.0-beta.2`, ...

**發布命令**:

```bash
# 在 v2 分支
yarn release:beta
```

**安裝方式**:

```bash
npm install @mezzanine-ui/react@beta
yarn add @mezzanine-ui/react@beta
```

### 3. RC 版本 🎯

**用途**: 發布候選，準備正式發布

**適用場景**:

- 功能已凍結
- 只修復 bug
- 準備合併到 main

**版本格式**: `1.1.0-rc.1`, `1.1.0-rc.2`, ...

**發布命令**:

```bash
# 在 v2 分支
yarn release:rc
```

**安裝方式**:

```bash
npm install @mezzanine-ui/react@rc
yarn add @mezzanine-ui/react@rc
```

### 4. Stable 版本 ✅

**用途**: 正式版本

**適用場景**:

- 所有測試通過
- 文檔完整
- 準備發布給所有用戶

**版本格式**: `1.1.0`

**發布命令**:

```bash
# 在 main 分支
yarn release:stable
```

**安裝方式**:

```bash
npm install @mezzanine-ui/react
yarn add @mezzanine-ui/react
```

## 完整發布流程

### 準備工作

1. **確保 npm 已登錄**

```bash
npm login
npm whoami
```

2. **確保在正確分支**

```bash
# 測試版本: v2 分支
git checkout v2
git pull origin v2

# 正式版本: main 分支
git checkout main
git pull origin main
```

3. **執行發布前檢查**

```bash
./scripts/pre-release-check.sh
```

### 發布測試版本 (v2 分支)

#### 快速發布 Canary

```bash
# 1. 確保在 v2 分支
git checkout v2

# 2. 執行發布
./scripts/release.sh
# 選擇選項 1 (Canary)

# 3. 驗證發布
npm info @mezzanine-ui/react@canary
```

#### 發布 Beta 版本

```bash
# 1. 確保在 v2 分支
git checkout v2

# 2. 執行檢查
./scripts/pre-release-check.sh

# 3. 執行發布
./scripts/release.sh
# 選擇選項 2 (Beta)

# 4. 驗證發布
npm dist-tag ls @mezzanine-ui/react
npm info @mezzanine-ui/react@beta

# 5. 推送 git 變更
git push origin v2
git push origin --tags
```

#### 發布 RC 版本

```bash
# 1. 確保在 v2 分支
git checkout v2

# 2. 執行完整測試
yarn test
yarn lint

# 3. 執行發布
./scripts/release.sh
# 選擇選項 3 (RC)

# 4. 驗證發布
npm info @mezzanine-ui/react@rc

# 5. 推送 git 變更
git push origin v2
git push origin --tags
```

### 發布正式版本 (main 分支)

```bash
# 1. 將 v2 合併到 main
git checkout main
git pull origin main
git merge v2

# 2. 解決衝突（如果有）
git status

# 3. 執行完整測試
yarn test
yarn lint
yarn build

# 4. 執行發布
./scripts/release.sh
# 選擇選項 4 (Stable)

# 5. 推送變更
git push origin main
git push origin --tags

# 6. (可選) 更新 v2 分支
git checkout v2
git merge main
git push origin v2
```

## 手動發布命令

如果不想使用腳本，可以直接使用以下命令：

```bash
# Canary 版本
yarn release:canary

# Beta 版本
yarn release:beta

# RC 版本
yarn release:rc

# Stable 版本
yarn release:stable
```

## 查看發布狀態

```bash
# 查看所有 dist-tags
npm dist-tag ls @mezzanine-ui/react

# 查看特定版本信息
npm info @mezzanine-ui/react@beta
npm info @mezzanine-ui/react@rc
npm info @mezzanine-ui/react@canary

# 查看所有版本
npm info @mezzanine-ui/react versions
```

## 回滾發布

### 回滾 dist-tag

```bash
# 將 beta tag 指向舊版本
npm dist-tag add @mezzanine-ui/react@1.0.0-beta.1 beta

# 移除錯誤的 tag
npm dist-tag rm @mezzanine-ui/react beta
```

### 撤銷 npm 發布 (24小時內)

```bash
# 撤銷特定版本
npm unpublish @mezzanine-ui/react@1.0.0-beta.2

# 警告: 24小時後無法撤銷！
```

### 棄用版本

```bash
# 標記版本為棄用
npm deprecate @mezzanine-ui/react@1.0.0-beta.2 "This version has bugs, use @beta instead"
```

## 故障排除

### 問題 1: "You must be logged in to publish packages"

```bash
# 登錄 npm
npm login

# 驗證登錄
npm whoami
```

### 問題 2: "You do not have permission to publish"

檢查你的 npm 帳號是否有發布權限：

1. 訪問 https://www.npmjs.com/settings/mezzanine-ui/packages
2. 確認你在組織的成員列表中
3. 確認套件設為 public

### 問題 3: "git tag already exists"

```bash
# 查看現有 tags
git tag -l

# 刪除本地 tag
git tag -d v1.0.0-beta.1

# 刪除遠程 tag
git push origin --delete v1.0.0-beta.1

# 重新發布
./scripts/release.sh
```

### 問題 4: Lerna 無法檢測變更

```bash
# 查看變更的套件
lerna changed

# 強制發布所有套件
lerna publish --force-publish
```

## 最佳實踐

### 1. 發布前檢查清單

- [ ] 所有測試通過
- [ ] Lint 檢查通過
- [ ] 構建成功
- [ ] 變更已提交
- [ ] 與遠程同步
- [ ] npm 已登錄

### 2. 版本號策略

- **Canary**: 自動版本號，用於頻繁測試
- **Beta**: 從 `beta.1` 開始遞增
- **RC**: 從 `rc.1` 開始遞增
- **Stable**: 遵循語義化版本

### 3. Git Workflow

```
feature branch → v2 branch → main branch
                  ↓             ↓
              canary/beta/rc  stable
```

### 4. 通知用戶

發布後記得：

- 更新 CHANGELOG.md
- 在 GitHub 創建 Release
- 發布公告（如果是重大更新）

## 快速參考

| 版本類型 | 分支 | 命令                  | 安裝方式  |
| -------- | ---- | --------------------- | --------- |
| Canary   | v2   | `yarn release:canary` | `@canary` |
| Beta     | v2   | `yarn release:beta`   | `@beta`   |
| RC       | v2   | `yarn release:rc`     | `@rc`     |
| Stable   | main | `yarn release:stable` | `@latest` |

## 腳本位置

- 發布腳本: `./scripts/release.sh`
- 檢查腳本: `./scripts/pre-release-check.sh`
- 配置文件: `lerna.json`, `package.json`
