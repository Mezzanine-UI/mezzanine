# Mezzanine UI v2 - Development Guideline

> 本指南旨在協助前端工程師快速了解 Mezzanine UI v2 的架構與開發規範，確保團隊開發的一致性與品質。

## 目錄

- [環境需求](#環境需求)
- [專案架構](#專案架構)
- [Design System 概念](#design-system-概念)
- [開發流程](#開發流程)
- [System Package 使用指南](#system-package-使用指南)
- [Icons Package 使用指南](#icons-package-使用指南)
- [Core Package 開發規範](#core-package-開發規範)
- [React Package 開發規範](#react-package-開發規範)
- [設計稿閱讀與協作](#設計稿閱讀與協作)
- [Light/Dark Mode](#lightdark-mode)
- [Default/Compact Mode](#defaultcompact-mode)

---

## 環境需求

### Node.js 版本

- **必須使用 Node.js v22**
- 建議使用 nvm 管理版本：
  ```bash
  nvm use
  # 或
  nvm install 22
  nvm use 22
  ```

### 套件管理工具

- 使用 **Yarn v4**
- 不使用 npm 或 pnpm

### 安裝依賴

```bash
yarn install
```

### 開發工具

- Storybook：用於開發與預覽元件
  ```bash
  yarn react:storybook
  ```
- 測試：
  ```bash
  yarn react:test
  ```

---

## 專案架構

Mezzanine UI v2 採用 **Monorepo** 架構，使用 **Nx** 進行專案管理，主要分為四個 packages：

```
packages/
├── system/      # Design System 的基礎變數與 tokens
├── core/        # 純 SCSS 樣式與邏輯（不含 React）
├── icons/       # SVG icon 元件
└── react/       # React 元件（依賴 core）
```

### 1. System Package (`@mezzanine-ui/system`)

**職責**：定義所有設計系統的基礎變數與 tokens，包含：

- **Primitives（原始值）**：最基礎的設計 tokens，如顏色的十六進位值、間距的像素值
- **Semantic（語意化）**：根據使用情境定義的變數，如 `text-brand`、`background-base`

**主要模組**：

| 模組          | 狀態        | 說明                                  |
| ------------- | ----------- | ------------------------------------- |
| `palette`     | ✅ 已更新   | 顏色系統（primitives + semantic）     |
| `radius`      | ✅ 已更新   | 圓角系統                              |
| `effect`      | ✅ 已更新   | 視覺效果（focus、shadow 等）          |
| `size`        | ✅ 已更新   | 尺寸系統                              |
| `typography`  | ✅ 已更新   | 文字排版系統（primitives + semantic） |
| `spacing`     | ✅ 已更新   | 間距系統（primitives + semantic）     |
| `breakpoint`  | ⏳ 等待設計 | 響應式斷點                            |
| `motion`      | ⏳ 等待設計 | 動畫參數                              |
| `transition`  | ⏳ 等待設計 | 轉場效果                              |
| `css`         | 🔒 舊版維持 | CSS 工具函式                          |
| `orientation` | 🔒 舊版維持 | 方向設定                              |
| `z-index`     | 🔒 舊版維持 | Z 軸層級                              |
| `severity`    | 🔒 舊版維持 | 嚴重程度（success/error 等）          |

> ⚠️ **重要**：標記為「等待設計」的模組中，部分舊版方法僅為了編譯成功而保留，入口已標記為 `@deprecated`，請勿使用。

### 2. Core Package (`@mezzanine-ui/core`)

**職責**：提供純 SCSS 樣式與元件邏輯，**不包含任何 React 程式碼**。

- 定義元件的 class names
- 撰寫元件的 SCSS 樣式
- 提供元件的 TypeScript 類型定義（僅型別，不含 React 元件）

**範例結構**（以 Button 為例）：

```
button/
├── _button.scss           # 變數定義（$prefix, $variants 等）
├── _button-styles.scss    # 完整樣式邏輯
├── _index.scss            # SCSS 入口
├── button.ts              # TypeScript 類型與 class names
└── index.ts               # TypeScript 入口
```

### 3. Icons Package (`@mezzanine-ui/icons`)

**職責**：提供 SVG icon React 元件。

**重要規則**：

- ✅ **只使用放在資料夾內的新版 icon**
  - 例如：`arrow/`, `alert/`, `content/`, `controls/`, `stepper/`, `system/`
- ❌ **不要使用根目錄下的 deprecated icon**
  - 例如：根目錄的 `arrow-down.ts`, `check.ts` 等已棄用

**檢查方式**：

```typescript
// ✅ 正確 - 使用新版 icon
import { ChevronDownIcon } from '@mezzanine-ui/icons';

// ❌ 錯誤 - 使用 icon 時出現 deprecated 標記，則要更換掉
import { ArrowDownIcon } from '@mezzanine-ui/icons';
```

### 4. React Package (`@mezzanine-ui/react`)

**職責**：提供 React 元件實作。

- 依賴 `@mezzanine-ui/core` 的樣式與邏輯
- 處理元件的互動性與狀態
- 提供 TypeScript 類型完整的 props

**範例結構**（以 Button 為例）：

```
Button/
├── Button.tsx          # 主要元件實作
├── Button.spec.tsx     # 單元測試
├── Button.stories.tsx  # Storybook stories
├── Button.mdx          # Storybook 文件
├── typings.ts          # TypeScript 類型定義
└── index.ts            # 入口檔案
```

---

## Design System 概念

### Primitives vs Semantic

新版 Design System 採用 **兩層架構**：

#### 1. Primitives（原始層）

- **定義**：最基礎、不含語意的設計 tokens
- **特性**：
  - 直接對應到具體的數值（如顏色的十六進位碼、間距的像素值）
  - 不受使用情境影響
  - 通常以數字或顏色名稱命名

**範例**：

```scss
// Palette Primitives
--mzn-color-primary-500: #3b82f6;
--mzn-color-gray-900: #111827;

// Typography Primitives
--mzn-typography-primitive-font-size-14: 0.875rem;
--mzn-typography-primitive-font-weight-medium: 500;

// Spacing Primitives
--mzn-spacing-primitive-8: 0.5rem;
```

#### 2. Semantic（語意層）

- **定義**：根據使用情境定義的變數
- **特性**：
  - 指向 primitives 的值
  - 描述「用途」而非「外觀」
  - 可根據模式（Light/Dark、Default/Compact）自動切換

**範例**：

```scss
// Palette Semantic
--mzn-color-text-brand: var(--mzn-color-primary-500);
--mzn-color-background-base: var(--mzn-color-white-base-white);

// Typography Semantic
--mzn-typography-button-font-size: var(--mzn-typography-primitive-font-size-14);
--mzn-typography-button-font-weight: var(--mzn-typography-primitive-font-weight-regular);

// Spacing Semantic
--mzn-spacing-gap-base: var(--mzn-spacing-primitive-8);
```

### 元件開發中的使用原則

> ⚠️ **黃金規則**：元件實作中 **一律使用 Semantic 變數**，不直接使用 Primitives。

**錯誤示範**：

```scss
// ❌ 不要直接使用 primitive
.button {
  color: palette.primitive-variable(primary, 500);
  padding: spacing.primitive-variable(8);
}
```

**正確示範**：

```scss
// ✅ 使用 semantic variable
.button {
  color: palette.semantic-variable(text, brand-strong);
  padding: spacing.semantic-variable(padding, horizontal, base);
}
```

---

## 開發流程

### 1. 閱讀設計稿

在開始實作前，**必須**完成以下步驟：

1. **閱讀元件文件**（Mezzanine UI_Ver2_Document）
   - 了解元件的使用情境
   - 確認各個狀態的定義
   - 閱讀設計規範與注意事項

2. **閱讀元件本體**（Mezzanine UI_Ver2）
   - 確認所有變體（variants）
   - 檢查各個狀態（hover、active、disabled 等）
   - 對照文件與實際設計是否一致

3. **參考設計系統頁面**
   - **Colors**：了解 semantic 顏色的分類與用途
   - **Spacing**：了解間距的語意化命名
   - **Radius**：了解圓角的應用場景
   - **Typography**：了解文字排版的語意類型

4. **發現問題時**
   - 如果設計稿與文件有出入，或有標注錯誤，**請在團隊頻道提出詢問**

### 2. 建立分支

```bash
# 確保在 v2 分支上
git checkout v2
git pull origin v2

# 建立新分支（命名規範：feature/元件名稱 or fix/問題描述）
git checkout -b feature/button-component
```

### 3. 開發元件

#### Step 1: 在 Core Package 中開發樣式

```scss
// packages/core/src/button/_button-styles.scss
@use '~@mezzanine-ui/system/palette' as palette;
@use '~@mezzanine-ui/system/spacing' as spacing;
@use '~@mezzanine-ui/system/radius' as radius;
@use '~@mezzanine-ui/system/typography';

.mzn-button {
  // ✅ 使用 semantic variables
  color: palette.semantic-variable(text, brand);
  background-color: palette.semantic-variable(background, brand);
  padding: spacing.semantic-variable(padding, horizontal, tiny-fixed);
  gap: spacing.semantic-variable(gap, base);
  border-radius: radius.variable(base);

  @include typography.semantic-variable(button);
}
```

#### Step 2: 定義 TypeScript 類型與 class names

```typescript
// packages/core/src/button/button.ts
export const buttonClasses = {
  root: 'mzn-button',
  main: 'mzn-button--main',
  disabled: 'mzn-button--disabled',
} as const;

export type ButtonSize = 'main' | 'sub' | 'minor';
export type ButtonVariant = 'base-primary' | 'base-secondary';
```

#### Step 3: 在 React Package 中實作元件（要注意 RSC 問題）

```typescript
// packages/react/src/Button/Button.tsx
'use client'; // ⚠️ 互動性元件必須加上

import { forwardRef } from 'react';
import { buttonClasses } from '@mezzanine-ui/core/button';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  // 實作細節...
});
```

#### Step 4: 撰寫 Storybook Stories

```typescript
// packages/react/src/Button/Button.stories.tsx
import type { StoryObj, Meta } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'General/Button',
  component: Button,
};

export default meta;

export const Playground: StoryObj<typeof Button> = {
  args: {
    children: 'Button',
    variant: 'base-primary',
    size: 'main',
  },
};
```

#### Step 5: 確認 [Component].spec.tsx 的 test cases 是否正確

- 無使用任何 Deprecated typings/function
- 測試結果無誤

### 4. 測試與驗證

```bash
# 啟動 Storybook 預覽
yarn react:storybook

# 執行測試
yarn react:test

# 執行 build 確認編譯沒問題
yarn build
```

### 5. 提交與發 PR

```bash
# 提交變更
git add .
git commit -m "feat(react/button): implement new button component"

# 推送到遠端
git push origin feature/button-component

# 在 GitHub 上開啟 Pull Request，base 分支選擇 v2
```

---

## System Package 使用指南

### Palette（顏色系統）

#### 在 SCSS 中使用

```scss
@use '~@mezzanine-ui/system/palette' as palette;

.example {
  // ✅ 使用 semantic variable
  color: palette.semantic-variable(text, brand);
  background-color: palette.semantic-variable(background, base);
  border-color: palette.semantic-variable(border, neutral);

  // 如需透明度
  color: palette.semantic-variable(text, brand, 60); // 60% opacity
}
```

### Typography（文字排版）

#### 在 SCSS 中使用

```scss
@use '~@mezzanine-ui/system/typography';

.example {
  // 套用完整的 semantic typography
  @include typography.semantic-variable(button);

  // 排除特定屬性（例如不要套用 line-height）
  @include typography.semantic-variable(button-highlight, (line-height));

  // 只取得特定屬性的 CSS variable
  font-size: typography.semantic-prop(body, font-size);
}
```

> 📝 **注意**：所有包含 `mono` 的類型會自動使用 SF Mono 字體。

### Spacing（間距系統）

#### 在 SCSS 中使用

```scss
@use '~@mezzanine-ui/system/spacing' as spacing;

.example {
  // ✅ 使用 semantic spacing
  padding-x: spacing.semantic-variable(padding, horizontal, none);
  padding-y: spacing.semantic-variable(padding, vertical, comfort);
  gap: spacing.semantic-variable(gap, tight);
}
```

### Radius（圓角系統）

```scss
@use '~@mezzanine-ui/system/radius' as radius;

.example {
  border-radius: radius.variable(tiny);
  border-radius: radius.variable(base);
  border-radius: radius.variable(roomy);
  border-radius: radius.variable(full);
}
```

### Effect（視覺效果）

```scss
@use '~@mezzanine-ui/system/effect' as effect;

.example {
  // Focus ring
  &:focus-visible {
    box-shadow: effect.variable(focus, primary);
  }

  // Shadow
  box-shadow: effect.variable(shadow, raised);
}
```

---

## Core Package 開發規範

### 檔案結構規範

每個元件應包含以下檔案：

```
component-name/
├── _component-name.scss        # 變數定義（$prefix, 配置 maps 等）
├── _component-name-styles.scss # 完整樣式與 mixins
├── _index.scss                 # SCSS 入口，匯出樣式
├── component-name.ts           # TypeScript 類型與 class names
└── index.ts                    # TypeScript 入口
```

### 樣式開發規範

#### 1. 使用 System Variables

```scss
// ✅ 正確
@use '~@mezzanine-ui/system/palette' as palette;
@use '~@mezzanine-ui/system/spacing' as spacing;

.mzn-button {
  color: palette.semantic-variable(text, brand);
  padding: spacing.semantic-variable(padding, base);
}

// ❌ 錯誤 - 不要寫死數值
.mzn-button {
  color: #3b82f6;
  padding: 16px;
}
```

#### 2. 避免硬編碼數值

**例外情況**：

- 只有在確實沒有對應的 system variable 時才使用 px 值
- 使用前應在團隊頻道討論確認

### TypeScript 開發規範

#### 1. Class Names 定義

```typescript
// component-name.ts
export const componentClasses = {
  root: 'mzn-component',
  main: 'mzn-component--main',
  disabled: 'mzn-component--disabled',
} as const;
```

#### 2. 類型定義

```typescript
export type ComponentSize = 'main' | 'sub' | 'minor';
export type ComponentVariant = 'base-primary' | 'base-secondary';

export interface ComponentConfig {
  size?: ComponentSize;
  variant?: ComponentVariant;
  disabled?: boolean;
}
```

---

## React Package 開發規範

### 1. 'use client' 指令

所有包含**互動性**的元件必須在檔案頂部加上 `'use client'`：

```typescript
'use client';

import { forwardRef } from 'react';
// ...
```

**何時需要 'use client'**：

- 使用 React hooks（`useState`, `useEffect`, `useRef` 等）
- 處理事件（`onClick`, `onChange` 等）
- 包含任何客戶端互動邏輯

**何時不需要**：

- 純展示性元件（如 `Typography`, `Icon`）
- 僅處理樣式與結構，無互動邏輯

### 2. Props 定義規範

#### 使用 ComponentOverridableForwardRefComponentPropsFactory

```typescript
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';

export type ButtonComponent = 'button' | 'a';

export interface ButtonPropsBase {
  /** 按鈕尺寸 */
  size?: ButtonSize;
  /** 按鈕變體 */
  variant?: ButtonVariant;
  /** 是否禁用 */
  disabled?: boolean;
  /** 載入中狀態 */
  loading?: boolean;
  // ... 其他 props
}

export type ButtonProps<C extends ButtonComponent = 'button'> = ComponentOverridableForwardRefComponentPropsFactory<ButtonComponent, C, ButtonPropsBase>;
```

#### Props 排序規範

**所有 Props 必須按字母順序排列（a-z）**：

```typescript
// 按字母順序
export interface ButtonPropsBase {
  disabled?: boolean;
  icon?: IconConfig;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}
```

### 3. Storybook Stories 規範

使用 **StoryObj** 格式：

```typescript
import type { StoryObj, Meta } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'General/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['base-primary', 'base-secondary'],
    },
  },
};

export default meta;

export const Playground: StoryObj<typeof Button> = {
  args: {
    children: 'Button',
    size: 'main',
    variant: 'base-primary',
  },
};

export const Disabled: StoryObj<typeof Button> = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};
```

## Light/Dark Mode

Mezzanine UI v2 的 **Light/Dark Mode 已在 System 層級定義完成**，使用者在引入樣式時即可選擇：

```scss
// 使用者在專案中的設定
@use '~@mezzanine-ui/system' as system;

:root {
  // Light mode
  @include system.palette-variables(light);
}

[data-theme='dark'] {
  // Dark mode
  @include system.palette-variables(dark);
}
```

### 元件開發中的注意事項

開發元件時，**只需使用 Semantic 顏色**，系統會自動根據 mode 切換：

```scss
.mzn-button {
  // ✅ 使用 semantic variable，自動支援 Light/Dark mode
  color: palette.semantic-variable(text, brand);
  background-color: palette.semantic-variable(background, base);
}

// ❌ 不要自己處理 Light/Dark mode
.mzn-button {
  color: palette.primitive-variable(primary, 500);

  [data-theme='dark'] & {
    color: palette.primitive-variable(primary, 400);
  }
}
```

---

## Default/Compact Mode

### 自動支援原理

**Default/Compact Mode 在 System 層級的 common-variables 中定義**，影響間距（spacing）的大小：

```scss
// 使用者在專案中的設定
:root {
  // Default mode - 較大的間距
  @include system.common-variables(default);
}

[data-density='compact'] {
  // Compact mode - 較小的間距
  @include system.common-variables(compact);
}
```

### 元件開發中的注意事項

開發元件時，**只需使用 Semantic Spacing**，系統會自動根據 mode 調整：

```scss
.mzn-button {
  // ✅ 使用 semantic spacing，自動支援 Default/Compact mode
  padding: spacing.semantic-variable(padding, horizontal, tiny);
  gap: spacing.semantic-variable(gap, base);
}

// ❌ 不要寫死數值
.mzn-button {
  padding: 16px; // 無法根據 mode 切換
}
```

## 參考資源

### 已完成的元件範例

- **Button**：`packages/react/src/Button`
- **Typography**：`packages/react/src/Typography`
