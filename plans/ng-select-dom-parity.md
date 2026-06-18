# Angular Select DOM Parity Plan

> Source: parity report `tools/parity/.out/select/report.txt` — 426 diffs across 8 stories.
> Baseline story: **Basic** (single mode, outside position, no value).

---

## 1. React 完整渲染 DOM 樹 (Basic story, single mode)

Class 來源一覽：

| Symbol                                  | Resolved string                          | Source file                      |
| --------------------------------------- | ---------------------------------------- | -------------------------------- |
| `selectClasses.host`                    | `mzn-select`                             | core/src/select/select.ts        |
| `selectClasses.hostFullWidth`           | `mzn-select--full-width`                 | core/src/select/select.ts        |
| `selectClasses.hostMode`                | `mzn-select--single`                     | core/src/select/select.ts        |
| `dropdownClasses.root`                  | `mzn-dropdown`                           | core/src/dropdown/dropdown.ts    |
| `dropdownClasses.inputPosition`         | `mzn-dropdown--outside`                  | core/src/dropdown/dropdown.ts    |
| `dropdownClasses.popperWithPortal`      | `mzn-dropdown-popper--with-portal`       | core/src/dropdown/dropdown.ts    |
| `textFieldClasses.host`                 | `mzn-text-field`                         | core/src/text-field/textField.ts |
| `textFieldClasses.main`                 | `mzn-text-field--main`                   | core/src/text-field/textField.ts |
| `textFieldClasses.fullWidth`            | `mzn-text-field--full-width`             | core/src/text-field/textField.ts |
| `selectClasses.trigger`                 | `mzn-select-trigger`                     | core/src/select/select.ts        |
| `selectClasses.triggerMode`             | `mzn-select-trigger--single`             | core/src/select/select.ts        |
| `selectClasses.triggerInput`            | `mzn-select-trigger__input`              | core/src/select/select.ts        |
| `textFieldClasses.suffix`               | `mzn-text-field__suffix`                 | core/src/text-field/textField.ts |
| `selectClasses.triggerSuffixActionIcon` | `mzn-select-trigger__suffix-action-icon` | core/src/select/select.ts        |

```
SelectControlContext.Provider
+-- div.mzn-select.mzn-select--full-width.mzn-select--single       [Select.tsx render]
    +-- div.mzn-dropdown.mzn-dropdown--outside                     [Dropdown.tsx root wrapper]
        +-- Popper.mzn-dropdown-popper--with-portal                [portal; display:none when closed]
        |   +-- (TransitionGroup -> dropdown list; not parity target)
        |
        +-- div.mzn-text-field.mzn-text-field--main                [TextField.tsx host div]
            .mzn-text-field--full-width                            [from SelectTrigger className]
            .mzn-select-trigger.mzn-select-trigger--single         [from SelectTrigger className]
            +-- input.mzn-select-trigger__input                    [SelectTrigger.tsx]
            |     type=text readonly  aria-haspopup=listbox
            |     aria-autocomplete=list  role=combobox
            |     aria-expanded=false  aria-controls=...-listbox
            +-- div.mzn-text-field__suffix                         [TextField.tsx suffix slot]
                +-- i.mzn-select-trigger__suffix-action-icon       [ChevronDown icon]
```

Notes (React):

- The `mzn-dropdown mzn-dropdown--outside` div is the FIRST child of `mzn-select`.
- The `mzn-text-field` div is a CHILD of `mzn-dropdown--outside`, rendered as `{!isInline && triggerElement}` (Dropdown.tsx line ~1047).
- There is NO `mzn-input-trigger-popper` element in React. The Popper renders into a portal.
- The TextField div carries BOTH textFieldClasses AND selectTriggerClasses on the same element.

---

## 2. Angular 完整渲染 DOM 樹 (Basic story, single mode)

```
[mznSelect] host div                                               [select.component.ts]
  .mzn-select.mzn-select--full-width.mzn-select--single
  +-- [mznSelectTrigger] host div                                  [select-trigger.component.ts]
  |   .mzn-text-field.mzn-text-field--full-width.mzn-text-field--main
  |   .mzn-select-trigger.mzn-select-trigger--single
  |   +-- input.mzn-select-trigger__input                          [select-trigger template]
  |         type=text  readonly
  |         aria-haspopup=listbox  aria-autocomplete=list
  |         (NO role=combobox, NO aria-expanded, NO aria-controls)
  |   +-- div.mzn-text-field__suffix                               [select-trigger template]
  |         +-- i.mzn-select-trigger__suffix-action-icon           [ChevronDown icon]
  |
  +-- div.mzn-input-trigger-popper                                 [select.component.ts template]
        [popper container; always in DOM, height:0]
        +-- [mznTranslate] -> ul (listbox) when open
```

Notes (Angular):

- `mzn-dropdown` wrapper is ABSENT. The `[mznSelectTrigger]` host sits directly as the first child of `[mznSelect]`.
- `mzn-input-trigger-popper` is always in DOM (height:0 when closed). React's Popper is portaled out.
- Missing ARIA attributes on the trigger: `role`, `aria-expanded`, `aria-controls`.

---

## 3. 逐節點對齊表

Parity xpath: `//div[0]/div[0]` (second-level child of story root).

| Depth    | React node                                       | Angular node                                     | Diff type              |
| -------- | ------------------------------------------------ | ------------------------------------------------ | ---------------------- |
| /        | `div` (story wrapper)                            | `div` (story wrapper)                            | Match                  |
| /0       | `div.mzn-select.mzn-select--full-width.--single` | `div.mzn-select.mzn-select--full-width.--single` | Match                  |
| /0/0     | `div.mzn-dropdown.mzn-dropdown--outside`         | `div[mznSelectTrigger] .mzn-text-field...`       | **CLASS MISMATCH**     |
| /0/0/0   | `div.mzn-text-field...` (TextField host)         | `input.mzn-select-trigger__input`                | **TAG+CLASS MISMATCH** |
| /0/0/0/0 | `input.mzn-select-trigger__input`                | (no match — Angular's input is at /0/0/0)        | PATH SHIFT             |
| /0/0/0/1 | `div.mzn-text-field__suffix`                     | (no match)                                       | PATH SHIFT             |
| /0/1     | (absent — Popper is portaled)                    | `div.mzn-input-trigger-popper`                   | **EXTRA Angular**      |

Root cause: Angular is missing the `mzn-dropdown mzn-dropdown--outside` wrapper div between
`mzn-select` and `mzn-select-trigger`. This shifts ALL children by one xpath level and causes
every downstream diff.

Secondary issues (independent of wrapper):

- `mzn-input-trigger-popper` appears as an extra sibling in Angular (React portals this away).
- ARIA attrs missing on Angular trigger (`role=combobox`, `aria-expanded`, `aria-controls`).
- `with-read-only` story: Angular renders `button.mzn-text-field__clear-icon` when clearable=true
  even in readOnly mode; React suppresses clear button when readOnly.

---

## 4. 逐項結構改動清單 (按消除 diff 數排序)

### [Change A] MznSelect template: 在 [mznSelectTrigger] 外包一層 `div.mzn-dropdown.mzn-dropdown--outside`

**元件**: `packages/ng/select/select.component.ts`

**改動**:

```html
<!-- 現在 -->
<div [mznSelectTrigger] ...></div>
<div class="mzn-input-trigger-popper" #triggerPopper>...</div>

<!-- 改後 -->
<div [class]="dropdownWrapperClasses()">
  <!-- = "mzn-dropdown mzn-dropdown--outside" -->
  <div [mznSelectTrigger] ...></div>
</div>
<div class="mzn-input-trigger-popper" #triggerPopper>...</div>
```

需在 component 新增：

```typescript
import { dropdownClasses } from '@mezzanine-ui/core/dropdown';

readonly dropdownWrapperClasses = computed(() =>
  clsx(dropdownClasses.root, dropdownClasses.inputPosition('outside'))
);
```

預計消除 diff：~360 / 426（所有 ATTR class + STYLE 群組 diffs，因為 xpath 對齊後會自動對上）。

---

### [Change B] MznSelectTrigger: 補齊 ARIA attributes (role / aria-expanded / aria-controls)

**元件**: `packages/ng/select/select-trigger.component.ts`

React 的 `SelectTrigger` (透過 `TextField` 的 host div) 有：

- `role="combobox"` — on the text-field div
- `aria-expanded="false"` — on the text-field div
- `aria-controls="...-listbox"` — on the text-field div

Angular 的 `[mznSelectTrigger]` host 缺這三個屬性。

改動：在 host binding 加入：

```typescript
host: {
  '[attr.role]': '"combobox"',
  '[attr.aria-expanded]': 'isOpen()',
  '[attr.aria-controls]': 'listboxId()',
  // ...existing host bindings
}
```

預計消除 diff：`with-scroll` story 中的 3 個 ATTR diffs (aria-controls, aria-expanded, aria-haspopup)。

---

### [Change C] MznInputTriggerPopper: 移入 `mzn-dropdown--outside` wrapper 內，或改為 portal

**依賴**: Change A 完成後。

`div.mzn-input-trigger-popper` 在 React 中不存在（Popper 使用 portal）。
在 Angular 中它始終渲染在 DOM 內（height: 0）。

兩個方案：

- **方案 C1（推薦）**：把 `mzn-input-trigger-popper` 移到 `mzn-dropdown--outside` wrapper _之外_（保持同一父層 `mzn-select` 下作第二子元素），讓 parity xpath 只對 `/0/0` 做比對、不跨到 `/0/1`。
- **方案 C2**：改用 Angular CDK `Overlay` portal，讓 popper 渲染到 body。對齊更完整但改動大。

方案 C1 改動：

```html
<!-- select.component.ts template -->
<div [class]="dropdownWrapperClasses()">
  <div [mznSelectTrigger] ...></div>
  <!-- popper 移到 wrapper 之外, 成為 mzn-select 的第 2 個 child -->
</div>
<div class="mzn-input-trigger-popper" #triggerPopper>...</div>
```

注意：parity 工具目前把 Angular-only 的 `/0/1` (`mzn-input-trigger-popper`) 標為 EXTRA。
只要 wrapper 層修正後 xpath 對齊，此 EXTRA 仍會存在但數量從每 story ~18 style diffs 縮減至 1 EXTRA。
若要完全消除須採方案 C2。

---

### [Change D] With Read Only story: 修正 clear button 顯示邏輯

**元件**: `packages/ng/select/select-trigger.component.ts`

React 行為：readOnly 模式下 `clearable` prop 傳 `false`，TextField 不渲染 clear button。
Angular 行為：即使 readOnly，`clearable()` 仍為 true（因為有 value），導致 `button.mzn-text-field__clear-icon` 出現在 DOM。

改動：

```typescript
// select-trigger.component.ts
readonly shouldShowClearButton = computed(() =>
  this.clearable() && this.hasValue() && !this.readOnly()
);
```

並在 template 中用 `shouldShowClearButton` 取代 `clearable() && hasValue()`。

預計消除 diff：`with-read-only` story 的 2 個 EXTRA (`button.mzn-text-field__clear-icon`) diffs。

---

### [Change E] With Scroll / With Tree stories: story wrapper 元素修正

**元件**: Angular Storybook stories (`packages/ng/select/select.stories.ts`)

`With Scroll` story root 是 `<story-select-with-scroll>` (Angular component tag)，
React 是 `<div>` with inline style `width:300px; max-width:300px`.

`With Tree` story root 是 `<story-select-with-tree>` (Angular component tag)，
React 是 `<div>` with `display:flex; flex-direction:column; gap:24px`.

改動：把 story 的 host selector 改為 `div`，或在 story component 的 host binding 加上對應 style（`display:block/flex`, `width`, `max-width`, `gap`）。

With Tree 額外 diff：React 有第二個 `div.mzn-select.mzn-select--full-width.mzn-select--multiple` child，Angular 缺少。需確認 `WithTree` story 是否應同時渲染兩個 select 實例。

預計消除 diff：`with-scroll` (7 STYLE/ATTR) + `with-tree` (15 diffs)。

---

### [Change F] **api** diffs: 補齊缺失 Input/Output

**元件**: `packages/ng/select/select.component.ts` + `select-trigger.component.ts`

React inputs 缺於 Angular（13 個）：

| Input                       | 優先度 | 說明                                            |
| --------------------------- | ------ | ----------------------------------------------- |
| `value`                     | P1     | CVA writeValue 已有，但未作為 input signal 暴露 |
| `warning`                   | P1     | textField warning state                         |
| `defaultValue`              | P1     | uncontrolled mode                               |
| `searchText`                | P1     | searchable mode controlled input                |
| `showTextInputAfterTags`    | P1     | multiple mode search after tags                 |
| `inputProps`                | P2     | escape hatch for native input attrs             |
| `forceShowClearable`        | P2     | override clearable display                      |
| `forceHideSuffixActionIcon` | P2     | hide chevron                                    |
| `hideSuffixWhenClearable`   | P2     | suffix overlay mode                             |
| `isForceClearable`          | P2     | force clearable regardless of value             |
| `suffixAction`              | P2     | custom suffix icon/action                       |
| `computed`                  | P2     | virtual scroll computed options                 |
| `target`                    | P3     | scroll container ref                            |

React outputs 缺於 Angular（7 個）：

| Output        | Angular 現有名稱 | 改動                     |
| ------------- | ---------------- | ------------------------ |
| `blur`        | missing          | 新增                     |
| `clear`       | missing          | 新增                     |
| `focus`       | missing          | 新增                     |
| `leaveBottom` | `onLeaveBottom`  | 新增 `leaveBottom` alias |
| `reachBottom` | `onReachBottom`  | 新增 `reachBottom` alias |
| `scroll`      | `onScroll`       | 新增 `scroll` alias      |
| `tagClose`    | missing          | 新增                     |

Angular-only outputs (`onLeaveBottom`, `onReachBottom`, `onScroll`, `selectionChange`) 可保留，不刪除。

---

## 5. 可行性評估

### 可 100% 對齊

| 改動 | 可行性 | 說明                                   |
| ---- | ------ | -------------------------------------- |
| A    | 100%   | 純 template 加 wrapper div，無框架限制 |
| B    | 100%   | Angular host binding 標準做法          |
| D    | 100%   | computed signal 條件修正               |
| E    | 100%   | Story host style 對齊                  |

### 部分對齊 / 有框架差異

| 改動 | 對齊程度 | 框架差異說明                                                                                                                                                  |
| ---- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C    | ~90%     | `mzn-input-trigger-popper` 在 React 中完全不在 DOM（portal）；Angular 除非改用 CDK Overlay 否則始終在 DOM，作為 EXTRA 無法消除。建議寫入 DEVIATIONS.md。      |
| F    | ~70%     | `inputProps` (ReactNode escape hatch) 在 Angular 無直接等價，改為個別 input signal；`computed` 是 React-specific virtual scroll API，Angular 端實作方式不同。 |

### 需寫入 DEVIATIONS.md 的項目

1. **`div.mzn-input-trigger-popper`（Angular-only extra）**：
   `(select, *, TAG/EXTRA)` — Angular 使用 inline popper container；React 使用 portal，DOM 中無此元素。

2. **`inputProps` input**：
   `(select, *, INPUT)` — React 傳遞 native input attribute bag；Angular 改為獨立個別 input signals。

3. **`computed` input**：
   `(select, *, INPUT)` — React virtual scroll API，Angular 端以不同介面實作。

---

## 6. 各 story 額外結構差異

| Story          | 與 Basic 相比的額外差異                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Basic          | baseline                                                                                                                     |
| Disabled       | Angular trigger 多 `pointer-events:none`（來自 text-field CSS，React dropdown wrapper 無此樣式）— 同 Change A 修正後自動解決 |
| Error          | Angular trigger 邊框 error 色（`rgb(248,139,145)` vs React 無邊框）— 同 Change A 修正後解決                                  |
| Multiple       | 無額外結構差異，Change A 可一次解決                                                                                          |
| Size           | sub size 時 padding 6px（Angular）vs 0px（React）— Change A 修正後 sub-story 自動對齊                                        |
| With Flip      | 無額外結構差異                                                                                                               |
| With Read Only | 額外 `button.mzn-text-field__clear-icon` in Angular when readOnly — Change D 解決                                            |
| With Scroll    | story root tag mismatch + missing ARIA + `mzn-input-trigger-popper` EXTRA — Change A+B+E 部分解決；popper EXTRA 需 DEVIATION |
| With Tree      | story root tag mismatch + missing second `mzn-select--multiple` div — Change A+E 解決；需確認 story 結構應含兩 select 實例   |
| **api**        | 13 missing inputs + 7 missing outputs — Change F (P1 優先)                                                                   |

---

## 改動規模估計

| 優先 | 改動 | 受影響元件                                            | 工作量估計                     | 預計消除 diff 數   |
| ---- | ---- | ----------------------------------------------------- | ------------------------------ | ------------------ |
| P0   | A    | `select.component.ts` (template)                      | XS (1hr)                       | ~360               |
| P0   | B    | `select-trigger.component.ts` (host)                  | XS (30min)                     | ~3                 |
| P1   | D    | `select-trigger.component.ts`                         | XS (30min)                     | ~2                 |
| P1   | E    | `select.stories.ts`                                   | S (2hr)                        | ~22                |
| P2   | C    | `select.component.ts` (template)                      | M (4hr, 若改 CDK portal 則 XL) | ~1 EXTRA per story |
| P2   | F    | `select.component.ts` + `select-trigger.component.ts` | L (1-2d)                       | ~26 **api** diffs  |

**Change A 單一改動即可消除 84%+ 的 parity diffs。**
建議執行順序：A → D → B → E → (C: 僅記 DEVIATION) → F (P1 inputs 優先)。
