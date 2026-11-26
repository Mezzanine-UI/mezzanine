# Reference Output

User message:

```
Release:
- @mezzanine-ui/core@1.4.0
- @mezzanine-ui/ng@1.0.0-rc.27
- @mezzanine-ui/react@1.11.0
- @mezzanine-ui/vue@1.0.0-rc.15
```

Expected reply (everything below the line). Match this shape, language split, ordering and level of detail.

---

這版有兩個主題：

- **#529**：Table 新增 `resizeStrategy="grow-table"`，拖曳欄寬時只改變被拖的那一欄，整張表會跟著變寬並出現橫向捲動，行為類似試算表。core 新增了對應的型別，三個框架都有實作。
- **Picker 的遮罩輸入修正**：預設改用數字鍵盤（解決微軟注音中文模式無法輸入的問題），並修掉一個正規表達式 bug。另外 React 和 Vue 修了 `DateTimeRangePicker` 沒有轉傳 `inputLeftProps` / `inputRightProps` 的問題。

`★ Insight ─────────────────────────────────────`

- `grow-table` 是選用功能，預設仍是 `'preserve-table-width'`。「沒有彈性欄位時，剩餘空間交給最後一欄」這個調整只在 `grow-table` 下生效；預設策略的 spec 寫明「剩餘空間交給瀏覽器分配」。所以既有的表格完全不受影響。
- Backspace 那個 bug 很典型：`/[\dBackspace]/` 是 character class，比對的是單一字元，所以 B、a、c、k、s、p、e 這幾個字母都會被放行。原本想放行的是 `Backspace` 這個鍵名，結果寫成了字元集合。
- `inputMode="numeric"` 的修正有寫清楚驗證範圍：只在 Win11 + Edge + 微軟注音中文模式下確認過，其他輸入法和瀏覽器沒有驗證。我在 note 裡照實寫出，不寫成「修好了所有輸入法」。
  `─────────────────────────────────────────────────`

---

### 1. `@mezzanine-ui/react@1.11.0`

````markdown
## `@mezzanine-ui/react@1.11.0`

> `Table` gains a spreadsheet-like `resizeStrategy="grow-table"` ([#529](https://github.com/Mezzanine-UI/mezzanine/issues/529)). Also fixes typing into picker inputs with some Chinese IMEs, and `DateTimeRangePicker` input props being ignored.

---

### 🚀 Improvements

- **`Table`** — New `resizeStrategy` prop for resizable tables:
  - `'preserve-table-width'` (default) — unchanged: the table keeps its total width, and the dragged column borrows from the last column first, then from its right neighbour.
  - `'grow-table'` — only the dragged column changes (clamped to its own `minWidth` / `maxWidth`), so the table widens or narrows by the drag distance and scrolls horizontally. The last column gets a resize handle too, and `onColumnWidthsChange` reports only the dragged column plus earlier committed widths. When no column flexes and the columns are narrower than the container, the last column takes up the remaining space, so other columns do not shift during a drag until the table overflows.

  ```tsx
  <Table columns={columns} dataSource={data} fullWidth resizable resizeStrategy="grow-table" />
  ```

  A new "Resizable / Grow Table" story shows it with horizontal scrolling, a pinned column and persisted widths.

### 🐛 Bug Fixes

- **Pickers** — The mask input now defaults to `inputMode="numeric"`. Users of Microsoft Bopomofo in Chinese mode could not type into date or time fields until they switched input method, because `keydown` reported `key="Process"` while the IME composed the digits. With the numeric input mode, digits reach `keydown` as plain keys (verified on Windows 11 + Edge; other IMEs and browsers are unverified). `inputProps.inputMode` still overrides the default.
- **Pickers** — The mask input now blocks the letters B, a, c, k, s, p and e. The non-digit guard used `/[\dBackspace]/`, a character class that matched those single letters, so they were not prevented.
- **`DateTimeRangePicker`** — `inputLeftProps` and `inputRightProps` now take effect. They were accepted by the props type but never passed on; they now reach the date and time inputs of both the from and the to picker.

---

**Compatibility**: requires `react` ≥ 19, `react-dom` ≥ 19, `@mezzanine-ui/core` ≥ 1.4.0, `@mezzanine-ui/system` ≥ 1.0.2, `@mezzanine-ui/icons` ≥ 1.0.2

**Full Changelog**: https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@1.10.2...@mezzanine-ui/react@1.11.0
````

---

### 2. `@mezzanine-ui/ng@1.0.0-rc.27`

````markdown
## `@mezzanine-ui/ng@1.0.0-rc.27`

> Mirrors React `1.11.0`: `MznTable` gains `resizeStrategy="grow-table"` ([#529](https://github.com/Mezzanine-UI/mezzanine/issues/529)), and picker mask inputs work better with Chinese IMEs.

---

### 🚀 Improvements

- **`MznTable`** — New `resizeStrategy` input. The default `'preserve-table-width'` is unchanged. With `'grow-table'`, a drag changes only the dragged column, so the table widens and scrolls horizontally like a spreadsheet; the last data column gets a resize handle, and when no column flexes the last column takes up the remaining space. A new "Resizable / Grow Table" story demonstrates it.

  ```html
  <div mznTable [columns]="columns" [dataSource]="data" resizable resizeStrategy="grow-table"></div>
  ```

### 🐛 Bug Fixes

- **Pickers** — The mask input now defaults to `inputmode="numeric"`, so users of Microsoft Bopomofo in Chinese mode can type digits without switching input method (verified on Windows 11 + Edge; other IMEs and browsers are unverified).
- **Pickers** — The mask input now blocks the letters B, a, c, k, s, p and e, which the non-digit guard let through.

---

**Compatibility**: requires `@mezzanine-ui/core` ≥ 1.4.0, `@mezzanine-ui/system` ≥ 1.0.2, `@mezzanine-ui/icons` ≥ 1.0.2, `@angular/cdk` ≥ 21.0.0

**Full Changelog**: https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.26...@mezzanine-ui/ng@1.0.0-rc.27
````

---

### 3. `@mezzanine-ui/vue@1.0.0-rc.15`

````markdown
## `@mezzanine-ui/vue@1.0.0-rc.15`

> Mirrors React `1.11.0`: `MznTable` gains `resizeStrategy="grow-table"` ([#529](https://github.com/Mezzanine-UI/mezzanine/issues/529)), picker mask inputs work better with Chinese IMEs, and `MznDateTimeRangePicker` input props now take effect.

---

### 🚀 Improvements

- **`MznTable`** — New `resizeStrategy` prop. The default `'preserve-table-width'` is unchanged. With `'grow-table'`, a drag changes only the dragged column, so the table widens and scrolls horizontally like a spreadsheet; the last column gets a resize handle, and when no column flexes the last column takes up the remaining space. A new "Resizable / Grow Table" story demonstrates it.

  ```vue
  <MznTable :columns="columns" :data-source="data" resizable resize-strategy="grow-table" />
  ```

### 🐛 Bug Fixes

- **Pickers** — The mask input now defaults to `inputmode="numeric"`, so users of Microsoft Bopomofo in Chinese mode can type digits without switching input method (verified on Windows 11 + Edge; other IMEs and browsers are unverified). `inputProps.inputmode` still overrides it.
- **Pickers** — The mask input now blocks the letters B, a, c, k, s, p and e, which the non-digit guard let through.
- **`MznDateTimeRangePicker`** — `inputLeftProps` and `inputRightProps` now take effect on the date and time inputs of both the from and the to picker.

---

**Compatibility**: requires `vue` ≥ 3.5, `@mezzanine-ui/core` ≥ 1.4.0, `@mezzanine-ui/system` ≥ 1.0.2, `@mezzanine-ui/icons` ≥ 1.0.2

**Full Changelog**: https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.14...@mezzanine-ui/vue@1.0.0-rc.15
````

---

### 4. `@mezzanine-ui/core@1.4.0`

```markdown
## `@mezzanine-ui/core@1.4.0`

> Adds the `TableResizeStrategy` type used by the new table resize strategy ([#529](https://github.com/Mezzanine-UI/mezzanine/issues/529)).

---

### 🚀 Improvements

- **`table`** — New `TableResizeStrategy` type, exported from `@mezzanine-ui/core/table`:
  - `'preserve-table-width'` — the table keeps its total width; the dragged column borrows from the last column first, then from its right neighbour, stopping at their `minWidth`.
  - `'grow-table'` — only the dragged column changes; the table widens or narrows by the drag distance and scrolls horizontally.

---

**Full Changelog**: https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/core@1.3.3...@mezzanine-ui/core@1.4.0
```

---

### Umbrella summary（Slack 用）

```
Mezzanine UI Release
• @mezzanine-ui/core@1.4.0
• @mezzanine-ui/react@1.11.0
• @mezzanine-ui/ng@1.0.0-rc.27
• @mezzanine-ui/vue@1.0.0-rc.15

版本紀錄：https://github.com/Mezzanine-UI/mezzanine/releases
Demo：https://storybook.mezzanine-ui.org/
```

---

補充兩點：

- **Angular 缺 `inputLeftProps` / `inputRightProps`**：我查了 `packages/ng/date-time-range-picker/date-time-range-picker.component.ts`，裡面完全沒有這兩個 input。也就是說，Angular 不是「有傳但沒生效」，而是根本沒提供這兩個 input，這是一個 parity 缺口。所以 ng note 沒有寫這條修正，建議之後補上。
- **注音問題值得對外說一句**：會用 Picker 的台灣使用者，很多人用的是微軟注音。之前在中文模式下打不了日期，必須先切換輸入法，升級後就可以直接輸入。如果有團隊回報過這個問題，可以直接告訴他們升級。
