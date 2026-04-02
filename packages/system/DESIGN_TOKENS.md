# Mezzanine UI Design Tokens

視覺變數的基礎定義，採用 **Primitives + Semantic** 雙層架構。

> 基於 **v1.0.0**（`@mezzanine-ui/system`）

## 目錄

- [架構說明](#架構說明)
- [Primitives 色票](#primitives-色票)
- [Semantic 顏色](#semantic-顏色)
- [間距系統](#間距系統)
- [字體排版系統](#字體排版系統)
- [圓角](#圓角)
- [陰影](#陰影)
- [尺寸](#尺寸)
- [Z-Index](#z-index)
- [使用方式](#使用方式)

---

## 架構說明

v2 design tokens 採用雙層架構：

1. **Primitives**：原始值定義（顏色值、間距像素等）
2. **Semantic**：依使用情境命名，參照 Primitives

> **最佳實踐**：在應用程式中應一律使用 Semantic tokens，以支援自動切換主題。

---

## Primitives 色票

依分類與級距定義的原始顏色值。

### 色彩分類

| 分類         | 說明         | 級距                                                     |
| ------------ | ------------ | -------------------------------------------------------- |
| `brand`      | 品牌色       | 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `red`        | 錯誤/危險    | 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `yellow`     | 警告         | 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `green`      | 成功         | 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `blue`       | 資訊         | 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `gray`       | 中性灰階     | 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `white-base` | 白色系       | white, white-alpha-0/5/10/20/30/40/50/60/70/80/90        |
| `black-base` | 黑色系       | black, black-alpha-0/3/5/8/10/20/30/40/50/60/70/80/90    |
| `brand-base` | 品牌色透明度 | brand-alpha-10/20/30/40/50/60/70/80/90                   |

### 品牌色 (Brand)

| 級距 | 色值      |
| ---- | --------- |
| 25   | `#FAFAFF` |
| 50   | `#F2F4FE` |
| 100  | `#E2E6FD` |
| 200  | `#C2CCFA` |
| 300  | `#9DAAF5` |
| 400  | `#7689EF` |
| 500  | `#5D74E9` |
| 600  | `#5265E1` |
| 700  | `#4353D6` |
| 800  | `#3340C2` |
| 900  | `#24318F` |
| 950  | `#1A2558` |

### 錯誤色 (Red)

| 級距 | 色值      |
| ---- | --------- |
| 25   | `#FFFAFA` |
| 50   | `#FFF1F1` |
| 100  | `#FDDDDD` |
| 200  | `#FAB6B9` |
| 300  | `#F88B91` |
| 400  | `#F45D65` |
| 500  | `#F03740` |
| 600  | `#D03335` |
| 700  | `#B22B2D` |
| 800  | `#911F22` |
| 900  | `#6D1518` |
| 950  | `#4B0B0B` |

### 成功色 (Green)

| 級距 | 色值      |
| ---- | --------- |
| 25   | `#F3FCF7` |
| 50   | `#E5F9EE` |
| 100  | `#C5F0D8` |
| 200  | `#94DFB8` |
| 300  | `#57C78F` |
| 400  | `#2BB26D` |
| 500  | `#139F62` |
| 600  | `#11985A` |
| 700  | `#0E754D` |
| 800  | `#0A5C41` |
| 900  | `#064130` |
| 950  | `#042B1B` |

### 警告色 (Yellow)

| 級距 | 色值      |
| ---- | --------- |
| 25   | `#FFFCF5` |
| 50   | `#FFFAEB` |
| 100  | `#FEF0C7` |
| 200  | `#FEDF89` |
| 300  | `#FEC84B` |
| 400  | `#FEB022` |
| 500  | `#F7900A` |
| 600  | `#DC6803` |
| 700  | `#B54708` |
| 800  | `#93370D` |
| 900  | `#7A2E0E` |
| 950  | `#4E1D09` |

### 資訊色 (Blue)

| 級距 | 色值      |
| ---- | --------- |
| 25   | `#F5FAFF` |
| 50   | `#EFF8FF` |
| 100  | `#D1E9FF` |
| 200  | `#B2DDFF` |
| 300  | `#84CAFF` |
| 400  | `#53B1FD` |
| 500  | `#2E90FA` |
| 600  | `#1570EF` |
| 700  | `#175CD3` |
| 800  | `#1849A9` |
| 900  | `#194185` |
| 950  | `#102A56` |

### 中性灰階 (Gray)

| 級距 | 色值      |
| ---- | --------- |
| 25   | `#FBFBFC` |
| 50   | `#F9FAFB` |
| 100  | `#F3F4F6` |
| 200  | `#E5E7EB` |
| 300  | `#C9CBD4` |
| 400  | `#9DA4AE` |
| 500  | `#6C737F` |
| 600  | `#525A61` |
| 700  | `#404750` |
| 800  | `#29313B` |
| 900  | `#191E26` |
| 950  | `#101319` |

### CSS 變數格式

```
--mzn-color-primitive-{category}-{scale}
```

範例：

- `--mzn-color-primitive-brand-500`
- `--mzn-color-primitive-gray-100`
- `--mzn-color-primitive-red-600`

---

## Semantic 顏色

依使用情境命名，自動對應 light/dark 主題。

### 情境類型

| 情境         | 說明                                                               |
| ------------ | ------------------------------------------------------------------ |
| `layer`      | 層級背景（01, 02, 03）                                             |
| `background` | 背景色（33 種 tone）                                               |
| `text`       | 文字色（17 種 tone）                                               |
| `icon`       | 圖示色（19 種 tone）                                               |
| `border`     | 邊框色（11 種 tone）                                               |
| `separator`  | 分隔線色（4 種 tone）                                              |
| `scrollbar`  | 捲軸色（僅 SCSS，3 種 tone：`neutral-light`, `neutral`, `strong`） |
| `overlay`    | 覆蓋層色（3 種 tone）                                              |
| `surface`    | 表面色（4 種 tone）                                                |
| `shadow`     | 陰影色（6 種 tone）                                                |

### 背景色 Tones

| Tone             | 說明         |
| ---------------- | ------------ |
| `base`           | 基底背景     |
| `menu`           | 選單背景     |
| `inverse`        | 反色背景     |
| `fixed-dark`     | 固定深色背景 |
| `neutral-ghost`  | 中性幽靈     |
| `neutral-faint`  | 中性極淡     |
| `neutral-subtle` | 中性淡       |
| `neutral`        | 中性標準     |
| `neutral-strong` | 中性強       |
| `neutral-solid`  | 中性實心     |
| `brand-ghost`    | 品牌幽靈     |
| `brand-faint`    | 品牌極淡     |
| `brand-subtle`   | 品牌淡       |
| `brand-light`    | 品牌亮       |
| `brand`          | 品牌背景     |
| `brand-strong`   | 品牌強       |
| `brand-solid`    | 品牌實心     |
| `error-ghost`    | 錯誤幽靈     |
| `error-faint`    | 錯誤極淡     |
| `error-subtle`   | 錯誤淡       |
| `error-light`    | 錯誤亮       |
| `error`          | 錯誤背景     |
| `error-strong`   | 錯誤強       |
| `error-solid`    | 錯誤實心     |
| `warning-ghost`  | 警告幽靈     |
| `warning-faint`  | 警告極淡     |
| `warning`        | 警告背景     |
| `success-ghost`  | 成功幽靈     |
| `success-faint`  | 成功極淡     |
| `success`        | 成功背景     |
| `info-ghost`     | 資訊幽靈     |
| `info-faint`     | 資訊極淡     |
| `info`           | 資訊背景     |

### 文字色 Tones

| Tone             | 說明                 |
| ---------------- | -------------------- |
| `fixed-light`    | 固定淡色文字         |
| `neutral-faint`  | 中性極淡文字         |
| `neutral-light`  | 中性淡色文字         |
| `neutral`        | 中性標準文字         |
| `neutral-strong` | 中性強文字           |
| `neutral-solid`  | 中性實心文字（最深） |
| `brand`          | 品牌文字             |
| `brand-strong`   | 品牌強文字           |
| `brand-solid`    | 品牌實心文字         |
| `error`          | 錯誤文字             |
| `error-strong`   | 錯誤強文字           |
| `error-solid`    | 錯誤實心文字         |
| `warning`        | 警告文字             |
| `warning-strong` | 警告強文字           |
| `success`        | 成功文字             |
| `info`           | 資訊文字             |
| `info-strong`    | 資訊強文字           |

### 圖示色 Tones

| Tone             | 說明         |
| ---------------- | ------------ |
| `fixed-light`    | 固定淡色圖示 |
| `neutral-faint`  | 中性極淡圖示 |
| `neutral-light`  | 中性淡色圖示 |
| `neutral`        | 中性標準圖示 |
| `neutral-strong` | 中性強圖示   |
| `neutral-bold`   | 中性粗體圖示 |
| `neutral-solid`  | 中性實心圖示 |
| `brand`          | 品牌圖示     |
| `brand-strong`   | 品牌強圖示   |
| `brand-solid`    | 品牌實心圖示 |
| `error`          | 錯誤圖示     |
| `error-strong`   | 錯誤強圖示   |
| `error-solid`    | 錯誤實心圖示 |
| `warning`        | 警告圖示     |
| `warning-strong` | 警告強圖示   |
| `success`        | 成功圖示     |
| `success-strong` | 成功強圖示   |
| `info`           | 資訊圖示     |
| `info-strong`    | 資訊強圖示   |

### 邊框色 Tones

| Tone                | 說明             |
| ------------------- | ---------------- |
| `fixed-light`       | 固定淡色邊框     |
| `fixed-light-alpha` | 固定淡色透明邊框 |
| `neutral-faint`     | 中性極淡邊框     |
| `neutral-light`     | 中性淡色邊框     |
| `neutral`           | 中性標準邊框     |
| `neutral-strong`    | 中性強邊框       |
| `brand`             | 品牌邊框         |
| `error-subtle`      | 錯誤淡邊框       |
| `error`             | 錯誤邊框         |
| `warning-subtle`    | 警告淡邊框       |
| `warning`           | 警告邊框         |

### CSS 變數格式

```
--mzn-color-{context}-{tone}
```

範例：

- `--mzn-color-background-base`
- `--mzn-color-text-neutral-solid`
- `--mzn-color-border-brand`

---

## 間距系統

v2 使用語意化間距系統，支援 default / compact 兩種密度。

### Size（元素尺寸）

#### Element Tones

SCSS 中定義的 tones 比 TypeScript 型別定義多，下表同時標示兩者的差異。

| Tone                  | Default | Compact | 備註                   |
| --------------------- | ------- | ------- | ---------------------- |
| `hairline`            | 1px     | 1px     |                        |
| `micro`               | 3px     | 3px     | 僅 SCSS，TypeScript 無 |
| `tiny`                | 4px     | 4px     |                        |
| `tight`               | 6px     | 6px     |                        |
| `compact`             | 8px     | 6px     |                        |
| `slim`                | 12px    | 8px     |                        |
| `narrow`              | 14px    | 12px    |                        |
| `base`                | 16px    | 12px    |                        |
| `base-fixed`          | 16px    | 16px    |                        |
| `gentle`              | 20px    | 18px    |                        |
| `relaxed`             | 24px    | 20px    |                        |
| `airy`                | 28px    | 24px    |                        |
| `roomy`               | 32px    | 28px    |                        |
| `loose`               | 36px    | 32px    |                        |
| `extra-wide`          | 40px    | 36px    |                        |
| `extra-wide-condense` | 40px    | 24px    |                        |
| `expansive`           | 60px    | 56px    |                        |
| `extra`               | 64px    | 48px    |                        |
| `max`                 | 80px    | 64px    |                        |

> 注意：TypeScript `ElementTone` 型別不含 `micro`，但 SCSS 實作有此 tone。

#### Container Tones

下表列出 SCSS 中所有定義的 container tones（TypeScript `ContainerTone` 型別僅包含部分）。

| Tone                | Default | Compact | TypeScript 型別 |
| ------------------- | ------- | ------- | --------------- |
| `atomic`            | 30px    | 26px    |                 |
| `minimal`           | 36px    | 28px    |                 |
| `micro`             | 38px    | 30px    |                 |
| `minimized`         | 40px    | 32px    |                 |
| `collapsed`         | 52px    | 52px    | 有              |
| `reduced`           | 56px    | 48px    |                 |
| `condensed`         | 60px    | 52px    |                 |
| `compressed`        | 70px    | 70px    |                 |
| `concentrate-fixed` | 72px    | 72px    |                 |
| `tightened`         | 76px    | 68px    |                 |
| `tiny`              | 80px    | 80px    | 有              |
| `medium`            | 96px    | 88px    |                 |
| `small`             | 100px   | 92px    |                 |
| `snug`              | 140px   | 120px   |                 |
| `tight`             | 160px   | 160px   | 有              |
| `slim`              | 240px   | 240px   | 有              |
| `slender`           | 280px   | 280px   | 有              |
| `narrow`            | 320px   | 320px   | 有              |
| `compact`           | 360px   | 360px   | 有              |
| `standard`          | 400px   | 400px   | 有              |
| `balanced`          | 480px   | 480px   | 有              |
| `broad`             | 560px   | 560px   | 有              |
| `wide`              | 640px   | 640px   | 有              |
| `expanded`          | 720px   | 720px   | 有              |
| `max`               | 960px   | 960px   | 有              |
| `xwide`             | 1280px  | 1280px  |                 |

### Gap

> 注意：TypeScript `GapTone` 型別（15 種）與 SCSS 實作（12 種）使用**不同的 tone 名稱**。以下依 SCSS 實作為準（SCSS 產生實際 CSS 變數）。

#### SCSS 實作 Tones（12 種，產生 CSS 變數）

| Tone          | Default | Compact |
| ------------- | ------- | ------- |
| `none`        | 0       | 0       |
| `tiny`        | 2px     | 2px     |
| `tight`       | 4px     | 2px     |
| `tight-fixed` | 4px     | 4px     |
| `slim`        | 6px     | 4px     |
| `base`        | 8px     | 6px     |
| `calm`        | 12px    | 10px    |
| `comfort`     | 16px    | 14px    |
| `roomy`       | 20px    | 16px    |
| `spacious`    | 24px    | 20px    |
| `relaxed`     | 32px    | 28px    |
| `loose`       | 40px    | 36px    |

#### TypeScript `GapTone` 型別（15 種）

`'none' | 'micro' | 'tiny' | 'tight' | 'compact' | 'base' | 'base-fixed' | 'comfortable' | 'roomy' | 'spacious' | 'relaxed' | 'airy' | 'generous' | 'breath' | 'wide'`

> TypeScript 型別用於 component prop 型別檢查；SCSS 產生的 CSS 變數才是實際渲染值。兩者名稱不一致為已知問題。

### Padding

#### 水平 Tones

| Tone            | Default | Compact |
| --------------- | ------- | ------- |
| `none`          | 0       | 0       |
| `micro`         | 2px     | 2px     |
| `tiny`          | 4px     | 2px     |
| `tiny-fixed`    | 4px     | 4px     |
| `tight`         | 6px     | 4px     |
| `tight-fixed`   | 6px     | 6px     |
| `base`          | 8px     | 4px     |
| `base-fixed`    | 8px     | 8px     |
| `cozy`          | 10px    | 8px     |
| `comfort`       | 12px    | 10px    |
| `comfort-fixed` | 12px    | 12px    |
| `roomy`         | 14px    | 12px    |
| `spacious`      | 16px    | 14px    |
| `open`          | 20px    | 16px    |
| `relaxed`       | 24px    | 20px    |
| `airy`          | 28px    | 24px    |
| `breath`        | 32px    | 28px    |
| `loose`         | 36px    | 32px    |
| `wide`          | 40px    | 36px    |
| `max`           | 48px    | 40px    |
| `ultra`         | 64px    | 56px    |
| `xultra`        | 80px    | 76px    |

> 注意：TypeScript `HorizontalPaddingTone` 型別不含 `cozy`、`open`、`ultra`、`xultra`，但 SCSS 實作有這些 tone。

#### 垂直 Tones

| Tone          | Default | Compact |
| ------------- | ------- | ------- |
| `none`        | 0       | 0       |
| `micro`       | 2px     | 2px     |
| `tiny`        | 4px     | 2px     |
| `tight`       | 6px     | 4px     |
| `tight-fixed` | 6px     | 6px     |
| `base`        | 8px     | 4px     |
| `base-fixed`  | 8px     | 8px     |
| `calm`        | 10px    | 6px     |
| `comfort`     | 12px    | 8px     |
| `roomy`       | 14px    | 10px    |
| `spacious`    | 16px    | 12px    |
| `generous`    | 20px    | 16px    |
| `relaxed`     | 24px    | 20px    |
| `airy`        | 28px    | 24px    |
| `breath`      | 32px    | 28px    |
| `loose`       | 36px    | 32px    |
| `wide`        | 40px    | 36px    |
| `max`         | 48px    | 44px    |
| `ultra`       | 68px    | 64px    |

> 注意：TypeScript `VerticalPaddingTone` 型別不含 `tight-fixed`、`base-fixed`、`airy`、`breath`、`loose`、`wide`、`max`、`ultra`，但 SCSS 實作有這些 tone。

### CSS 變數格式

```
--mzn-spacing-size-element-{tone}
--mzn-spacing-size-container-{tone}
--mzn-spacing-gap-{tone}
--mzn-spacing-padding-horizontal-{tone}
--mzn-spacing-padding-vertical-{tone}
```

---

## 字體排版系統

### 語意化排版類型

共 21 種語意化排版類型：

| 類型                      | 字級 | 字重     | 說明           |
| ------------------------- | ---- | -------- | -------------- |
| `h1`                      | 24px | semibold | 標題 1         |
| `h2`                      | 18px | semibold | 標題 2         |
| `h3`                      | 16px | semibold | 標題 3         |
| `body`                    | 14px | regular  | 內文           |
| `body-highlight`          | 14px | medium   | 強調內文       |
| `body-mono`               | 14px | regular  | 等寬內文       |
| `body-mono-highlight`     | 14px | medium   | 等寬強調內文   |
| `text-link-body`          | 14px | regular  | 內文連結       |
| `text-link-caption`       | 12px | regular  | 說明文字連結   |
| `caption`                 | 12px | regular  | 說明文字       |
| `caption-highlight`       | 12px | semibold | 強調說明文字   |
| `annotation`              | 10px | regular  | 註解           |
| `annotation-highlight`    | 10px | semibold | 強調註解       |
| `button`                  | 14px | regular  | 按鈕文字       |
| `button-highlight`        | 14px | medium   | 強調按鈕文字   |
| `input`                   | 14px | regular  | 輸入框文字     |
| `input-highlight`         | 14px | medium   | 強調輸入框文字 |
| `input-mono`              | 14px | regular  | 等寬輸入框文字 |
| `label-primary`           | 14px | regular  | 主要標籤       |
| `label-primary-highlight` | 14px | medium   | 強調主要標籤   |
| `label-secondary`         | 12px | regular  | 次要標籤       |

### 字重

| 字重       | 值  |
| ---------- | --- |
| `regular`  | 400 |
| `medium`   | 500 |
| `semibold` | 600 |

### CSS 變數格式

```
--mzn-typography-{type}-font-size
--mzn-typography-{type}-font-weight
--mzn-typography-{type}-line-height
--mzn-typography-{type}-letter-spacing
```

---

## 圓角

| Tone    | 值                 |
| ------- | ------------------ |
| `none`  | 0                  |
| `tiny`  | 0.125rem (2px)     |
| `base`  | 0.25rem (4px)      |
| `roomy` | 0.5rem (8px)       |
| `full`  | 62.4375rem (999px) |

TypeScript 型別：`RadiusSize = 'none' | 'tiny' | 'base' | 'roomy' | 'full'`

CSS 變數：`--mzn-radius-{tone}`

---

## 陰影

使用 Semantic 陰影色：

| Tone          | 說明         |
| ------------- | ------------ |
| `dark`        | 深色陰影     |
| `dark-light`  | 淡深色陰影   |
| `dark-faint`  | 極淡深色陰影 |
| `dark-ghost`  | 幽靈深色陰影 |
| `light-faint` | 極淡亮色陰影 |
| `brand`       | 品牌陰影     |

---

## 尺寸

通用 Size：

| 尺寸    | 說明     |
| ------- | -------- |
| `main`  | 主要尺寸 |
| `sub`   | 次要尺寸 |
| `minor` | 較小尺寸 |

---

## Z-Index

從基底值（預設 1000）開始，依序遞增。

| 名稱       | 預設值 | 說明                      |
| ---------- | ------ | ------------------------- |
| `base`     | 1001   | 基底層                    |
| `alert`    | 1002   | AlertBanner 層            |
| `drawer`   | 1003   | Drawer 層                 |
| `modal`    | 1004   | Modal 層                  |
| `popover`  | 1005   | Popover / Tooltip 層      |
| `feedback` | 1006   | Message / Notification 層 |

CSS 變數：`--mzn-z-index-{name}`

SCSS 用法：

```scss
@use '~@mezzanine-ui/system/z-index' as z-index;

.my-overlay {
  z-index: z-index.get(modal);
}
```

---

## 使用方式

### 在 SCSS 中使用

`_system.scss` 提供兩個主要 mixin：

- `mzn-system.colors($mode, $semantic, $primitives)` — 設定色彩相關的 CSS 變數（palette）
- `mzn-system.common-variables($mode, $options)` — 設定間距、字體、圓角、z-index 等 CSS 變數

```scss
@use '~@mezzanine-ui/system' as mzn-system;
@use '~@mezzanine-ui/system/palette' as palette;
@use '~@mezzanine-ui/system/spacing' as spacing;
@use '~@mezzanine-ui/system/typography' as typography;
@use '~@mezzanine-ui/system/radius' as radius;

// 設定變數
:root {
  @include mzn-system.colors('light');
  @include mzn-system.common-variables(default);
}

[data-theme='dark'] {
  @include mzn-system.colors('dark');
}

[data-density='compact'] {
  @include mzn-system.common-variables(compact);
}

// 使用變數
.my-component {
  // 顏色
  color: palette.semantic-variable(text, brand);
  background-color: palette.semantic-variable(background, base);
  border-color: palette.semantic-variable(border, neutral);

  // 間距
  padding: spacing.semantic-variable(padding, horizontal, base);
  gap: spacing.semantic-variable(gap, base);

  // 圓角
  border-radius: radius.variable(base);

  // 字體排版（mixin）
  @include typography.semantic-variable(body);
}
```

### 自訂 Palette

```scss
@use '~@mezzanine-ui/system' as mzn-system;

$custom-semantic: (
  background: (
    base: (
      light: #f5f5f5,
      dark: #1a1a1a,
    ),
  ),
);

:root {
  @include mzn-system.colors('light', $custom-semantic);
}
```

### 自訂 Spacing

```scss
@use '~@mezzanine-ui/system' as mzn-system;

$custom-options: (
  spacing: (
    size: (
      element: (
        base: (
          default: 20px,
          compact: 16px,
        ),
      ),
    ),
  ),
);

:root {
  @include mzn-system.common-variables(default, $custom-options);
}
```
