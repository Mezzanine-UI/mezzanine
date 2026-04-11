# Angular Element → Attribute Selector Refactor

Progress tracker for converting all `@Component({ selector: 'mzn-xxx' })` declarations to `@Component({ selector: '[mznXxx]' })` so Angular-rendered DOM matches React at the tag level.

## 狀態圖例

- `pending` — 尚未處理
- `done` — 已 refactor + parity 驗證 + commit
- `skipped` — 平台差異無法 refactor，已記 DEVIATIONS.md
- `blocked` — 卡住待討論

## Progress

_(updated per batch, see `tools/parity/.out/summary.json` for per-run diffs)_

| Batch    | Commit      | Components                                                                                                                                                                                                                                             | Total Before | Total After   | Notes                                                                                                                                                                                                                                                                                                                                                      |
| -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| baseline | `c15a7030`  | —                                                                                                                                                                                                                                                      | 8416         | 6866          | start of refactor phase                                                                                                                                                                                                                                                                                                                                    |
| 1        | _(pending)_ | separator                                                                                                                                                                                                                                              | 6866         | ~6866         | trial; proves pipeline but separator diffs are story-side not tag                                                                                                                                                                                                                                                                                          |
| 2        | `843cd5f5`  | empty                                                                                                                                                                                                                                                  | 38           | 539           | **EXPECTED** — see "Diff-count masking" below                                                                                                                                                                                                                                                                                                              |
| 3        | `0021e7e5`  | layout, anchor-group, form-group, dropdown-status                                                                                                                                                                                                      | —            | 2/0/64/19     | auto attr-null injection added to script; 0 attribute leakage                                                                                                                                                                                                                                                                                              |
| Phase 1  | `1bddc833`  | compare.ts walker softening                                                                                                                                                                                                                            | 6866         | 23742         | full unmask via class-aware soft-continue (no element refactor)                                                                                                                                                                                                                                                                                            |
| P2-1     | `17bc3995`  | tag, inline-message(+group), alert-banner, progress, spin, skeleton, result-state                                                                                                                                                                      | —            | per-comp      | first Tier A batch; 0 attribute leakage                                                                                                                                                                                                                                                                                                                    |
| P2-2     | `364dfbc0`  | badge(+container), backdrop, popper, portal, scrollbar, section(+group), clear-actions, content-header                                                                                                                                                 | —            | per-comp      | auto host detect: span/span/div/div/div/div/div/div/button/header; dynamic collapse auto-applied on badge                                                                                                                                                                                                                                                  |
| P2-3     | `c2e1978a`  | button-group, tag-group, checkbox(+group)+check-all, radio(+group), toggle, message, drawer, popconfirm                                                                                                                                                | —            | per-comp      | script: backtick selector support + closing-tag whitespace tolerance; checkbox/radio have pre-existing input-check visual bug (not introduced by this batch)                                                                                                                                                                                               |
| P2-4     | `25d9a7d9`  | modal(+header/footer/body-for-verification), media-preview-modal, notification-center, overflow-tooltip, overflow-counter-tag                                                                                                                          | —            | per-comp      | script: refuse dynamic-collapse on wrappers with directive attrs (mznBackdrop on modal); fix modal-footer's leftover `<mzn-button-group>` from P2-3 script miss; modal Storybook environment lacks Portal registry — modal stories' visible-content rendering is BLOCKED on a separate fix                                                                 |
| P2-5     | `40a45068`  | input, text-field, textarea, formatted-input, autocomplete, slider, password-strength-indicator                                                                                                                                                        | —            | per-comp      | script: JSX root tag preferred over forwardRef<HTMLXxxElement> (fixes formatted-input inner-input target); script: find first ELEMENT selector across multiple @Component blocks (fixes autocomplete alongside existing `[mznAutocompletePrefix]`)                                                                                                         |
| P2-6     | `c991825a`  | input-action-button, input-select-button, input-spinner-button, input-check, input-trigger-popper, select, select-trigger, select-trigger-tags                                                                                                         | —            | per-comp      | input internals + select family; 5 fall back to div (Angular-only or missing React file)                                                                                                                                                                                                                                                                   |
| P2-7     | `09da7d22`  | dropdown(+item/item-card/action), pagination(+item/jumper/page-size)                                                                                                                                                                                   | —            | per-comp      | pagination host auto-detected as `<nav>` via JSX root; dropdown-\* sub-components fall back to div (Angular-only)                                                                                                                                                                                                                                          |
| P2-8     | `7b6525bb`  | navigation family (navigation + header/footer/icon-button/option/option-category/user-menu)                                                                                                                                                            | —            | 7/0/0/0/0/0/0 | semantic landmarks correctly detected: nav/header/footer/button/button/li/li                                                                                                                                                                                                                                                                               |
| P2-9     | `a3c47b4e`  | page-header/footer, content-header-responsive, layout-left/main/right-panel, anchor-item, breadcrumb(+item), form-field/label/hint-text                                                                                                                | —            | per-comp      | 12 structural atomics; 9 at zero diffs; semantic landmarks (header/aside/nav/label) auto-picked                                                                                                                                                                                                                                                            |
| P2-10    | `0d8263a6`  | tabs, tab-item, stepper, step, accordion(+title/content/actions/group), description(+title/content/group), filter-area, filter, filter-line                                                                                                            | —            | per-comp      | 16 components; 8 at zero diffs; tab-item → <button>, description-content → <span>                                                                                                                                                                                                                                                                          |
| P2-11    | `0cdd6b7a`  | card family (12: base-card+skeleton, card-group, selection-card, single/four thumbnail cards +skeletons, quick-action-card+skeleton, thumbnail, thumbnail-card-info)                                                                                   | —            | per-comp      | selection-card → <label>, quick-action-card → <button>; 4 dynamic-wrapper collapses auto-applied; 6/12 at zero diffs                                                                                                                                                                                                                                       |
| P2-12    | `e4f54d66`  | upload family, cascader(+panel), table, cropper, transition directives (fade/scale/slide/translate/collapse), empty sub-icons                                                                                                                          | —            | per-comp      | 17 components; uploader → <label>; transitions + empty-icons are Angular-only; 82% total coverage reached                                                                                                                                                                                                                                                  |
| P2-13    | `e6184cb2`  | calendar family (15: calendar, range-calendar, 13 sub-views)                                                                                                                                                                                           | —            | 55/0×14       | script: splitHostEntries() helper to handle commas inside string values; 14/15 zero diffs; 90% total coverage                                                                                                                                                                                                                                              |
| P2-14    | `d20e59d6`  | date/time picker family (16: date-picker(+cal), date-range-picker(+cal), date-time-(range-)picker, multiple-date-picker(+trigger), time-picker(+panel), time-range-picker, time-panel(+column), picker-trigger(+with-separator), range-picker-trigger) | —            | per-comp      | **PHASE 2 COMPLETE — 169/169 = 100%**; 8/16 zero diffs; PROGRESS.md removed                                                                                                                                                                                                                                                                                |
| P4.1     | 4 commits   | clear-actions host collapse, modal content-wrapper, modal-header typography, checkbox React-structure alignment                                                                                                                                        | —            | per-comp      | Port-gap fixes surfaced when investigating the modal "portal blocker" and finding it was a false diagnosis. Clear-actions was producing `<button><button>` nested DOM; modal dialog was uncentered; modal-header used raw `<h2>`/`<p>`; checkbox structure diverged from React. See AUDIT.md "Phase 4.1 correction" for root-cause walk-through.           |
| P4.2     | `ba7e99e5`  | calendar + 6 picker story decorators: provide MZN_CALENDAR_CONFIG via useValue; drop `<div mznCalendarConfigProvider>` wrapper                                                                                                                         | —            | stories only  | Resolves NG0950 (calendar) and NG0201 (all pickers) so their stories actually render. MznCalendarConfigProvider component itself remains broken (input.required read in providers useFactory before bindings are processed) — logged as Phase 3A. Removing the wrapper div also improves DOM parity because React's provider is zero-DOM Context.Provider. |

## ⚠️ Diff-count masking — critical reading (mostly fixed in Phase 1)

Originally `tools/parity/compare.ts:123-126` returned immediately on tag mismatch, hiding the entire subtree. Phase 1 softened this: when the two mismatched tags share the same `class` attribute, the walker records the tag diff and **continues walking**. This unmasked the bulk of pre-existing descendant issues at once — new full baseline is **23 742 diffs**, the honest number.

The original early-return is preserved when the tags differ AND the class attribute differs, so genuinely divergent subtrees (e.g. completely wrong template) still bail out and don't explode the report.

Empty went 38 → 539 not because we broke it but because we unmasked existing component-level gaps. The unmasking is now done globally — future refactor batches will produce stable, comparable diff counts.

**Per-batch success is still judged categorically, not by total count alone.** Criteria:

1. No new `[ATTR] @title` / `@type` / `@size` / `@description` (or other HTML-reflected input names) on the refactored host — proves attribute-null pattern works.
2. Root tag matches React root (no more `mzn-x` vs `div` at `/`).
3. Any new diffs introduced below the host are either (a) pre-existing issues newly exposed, or (b) verifiably caused by the refactor — the latter must be fixed before committing.

## Refactor batch responsibility scope

A refactor batch should NOT be treated as "selector switch only and nothing else." The batch is the right moment to fix any port-time omission that's visible to a human user. Concretely:

**In scope — fix during the batch:**

- Selector element → attribute switch
- Input-name attribute leakage (`[attr.X]: null`)
- Host tag alignment with React root
- **Missing wrappers / sub-components that the Angular port skipped.** Example: empty's React source wraps actions in `<ButtonGroup>` for gap spacing; the Angular port used a plain `<div>`, so two buttons had no spacing between them. This is NOT a pre-existing theme noise issue — it is visible at a glance — and must be fixed in the same commit that touches the component. Discovered 2026-04-08 on empty; see commit referencing this note.
- Obvious template structural gaps that produce hand-visible UX breakage
- **Typography wrapping on text elements that React wraps in `<Typography>`.**
  Many React components wrap title/label/description text in
  `<Typography variant="..." color="...">`, which emits both the
  semantic font-size class AND a `mzn-typography--color` class that
  activates the CSS-variable color system. Angular ports that render
  raw `<h2>`/`<p>`/`<span>` miss both the sizing and the color class,
  producing visibly wrong fonts. Fix by adding `mznTypography`
  directive with matching `variant` and `color` inputs. Discovered
  2026-04-08 during Phase 4.1 on modal-header (h2/body) and checkbox
  (label-primary/caption).
- **Structure audit when consumer-level scss uses `:has()` selectors
  on descendants.** Checkbox scss had many rules gated on
  `:has(.mzn-checkbox__text-container)`, none of which applied because
  the Angular port replaced text-container with input-check\_\_label.
  When the port diverges from React DOM, `:has()` rules silently
  no-op. Always verify the host + descendant class set matches React
  before declaring a port complete.

**Out of scope — leave for Phase 5 cleanup:**

- Angular Storybook theme CSS variable drift (e.g. `rgb(5, 6, 6)` vs `rgb(0, 0, 0)` everywhere)
- `hostClasses()` emitting modifier classes in a slightly different order than React's `cx()`
- `<p>` vs `<span>` where React's `Typography` defaults differ from the Angular template tag
- Invisible computed-style differences (1px nudges, sub-pixel color rounding)

**Decision rule**: open the story, look at it for one second. If you can point at something wrong without consulting the diff report, fix it in this commit. If you can only see it by reading the report, defer to Phase 5.

Separator (already refactored) shows the same pervasive `rgb(5, 6, 6)` descendant diff — confirms it's Angular-storybook-wide theme/CSS-variable noise independent of this refactor.

### Resolved this session

- **Script boundary bug**: `rewriteConsumerText` used `<${tag}\\b` which, because `-` is non-word, matched `mzn-empty` inside `mzn-empty-main-initial-data-icon`. Replaced `\b` with negative lookahead `(?![-\\w])`.
- **Attribute leakage convention**: add `'[attr.X]': 'null'` to `host` metadata for every `input()` whose name overlaps a reflected HTML attribute (`title`, `type`, `size`, `description`, `value`, `name`, `disabled`, `href`, `id`, `hidden`, `lang`, ...). No consumer template changes required. Verified on `empty` — 0 remaining `[ATTR] @title` etc.
- **"Mystery" rgb(1,1,1)→rgb(3,3,3) style regression**: was not a regression — it was subtree un-masking (see above). Storybook HMR plus `compare.ts` early-return on tag diff hid it.

### Original handoff (still valid)

**Context is high.** Current session completed Phase 0 (build script) and Phase 1 trial on `separator`. Next session should resume batching.

### What exists

- `tools/parity/refactor-selector.mjs` — mechanical rewriter. Usage:

  ```
  node tools/parity/refactor-selector.mjs <comp.ts> [host-tag]
  ```

  - Rewrites `selector: 'mzn-x'` → `selector: '[mznX]'`
  - Injects `host: { '[class]': 'mzn-x' }` IF template outer wrapper has static `class="mzn-x"` (conservative — skips with WARN if anything non-trivial)
  - Updates all consumers across `packages/ng/` (opening, closing, self-closing, multi-line via `/s` flag)
  - Handles void-element hosts (`<hr>`, `<br>`, etc.) by emitting `<host />` not `<host></host>`

- `tools/parity/REFACTOR.md` — this file, progress tracker

### What the script CAN'T do (needs human)

1. **Dynamic `[class]` outer wrappers**: e.g. badge has `template: '<div [class]="containerClasses()">...</div>'`. Script doesn't lift this into host binding; must be manual.
2. **Multi-root templates**: layout has two `<div>` siblings; no single outer wrapper to collapse. Selector-only refactor is fine, but the wrappers stay as extra DOM.
3. **Template outer wrapper mismatch**: if React root ≠ Angular root tag, pick host per `Host Element Overrides` table below.
4. **Sub-component coordination**: Dropdown has DropdownItem/Status/Action/ItemCard. Refactor parent BEFORE children to avoid template references breaking, OR refactor all siblings in one batch.
5. **Host with existing bindings**: if `host: { ... }` already has `'[class]'`, script warns and skips injection — manual merge needed.

### Gotchas learned

- **Stale `.d.ts` / `.js` files reappear** across sessions (maybe IDE/ng-packagr watcher?). ALWAYS run `find packages/ng -type f \( -name '*.js' -o -name '*.d.ts' \) -not -path '*/node_modules/*' -not -path '*/dist/*' -delete` before testing.
- **Storybook HMR is unreliable for selector changes**. Restart `ng:storybook` after any batch (`kill $(ps aux | grep ng-storybook | grep -v grep | awk '{print $2}')` then `npm run ng:storybook &`).
- **Void elements (`<hr>`) reject closing tags**. Script handles this; don't "fix" the self-close output.
- **Storybook title segments affect story slug**, e.g. separator lives under `Internal/Separator` not `Data Display/Separator`. Check `curl http://localhost:6007/index.json | jq '.entries | keys[]' | grep X` before debugging "empty story".

### Next session: batching plan

**Priority 1 — high tag-diff impact, simple template**:

- `badge` (34 tag diffs, dynamic `[class]` — needs manual host class lift)
- `empty` (19)
- `text-field` (16)
- `description-content` (15, host=span per override table)

**Priority 2 — easy pure-selector (no template collapse)**:

- `separator` ✓ (done this session)
- `layout` (already has host class binding, two sub-siblings — selector-only)
- `anchor-group` (already has host class binding, template uses sub-component)
- `notifier`, `form-group`, `dropdown-status`

**Priority 3 — coordinated family refactors**:

- Dropdown family (6 components)
- Pagination family (4 components)
- Navigation family (multiple)
- Description family (title + content + group)
- Card family (base-card + group + sub-cards + thumbnail)
- Transition family (fade, slide, scale, rotate, translate, collapse — these are Directives)

### Per-batch workflow

```bash
# 1. Ensure Angular Storybook is fresh
find packages/ng -type f \( -name '*.js' -o -name '*.d.ts' \) -not -path '*/node_modules/*' -not -path '*/dist/*' -delete
kill $(ps aux | grep ng-storybook | grep -v grep | awk '{print $2}')
npm run ng:storybook &    # wait for :6007 to return 200

# 2. Refactor
node tools/parity/refactor-selector.mjs packages/ng/<comp>/<comp>.component.ts [host]

# 3. Manual fixes if script warned

# 4. Parity verify
npm run parity -- <comp>

# 5. Restart storybook if HMR suspicious, re-run parity

# 6. Commit per batch (5-10 components)
git add packages/ng tools/parity/REFACTOR.md
git commit -m "refactor(ng): convert <components> to attribute selectors"
```

## Angular Component Input Architecture — **強制規範 (2026-04-11)**

**全專案 Angular 元件的 input/output 必須 prop-for-prop 鏡像 React 對應元件的 props。**
此規範對整個 `packages/ng/` 有效，任何新建或重構的元件必須遵守。

### 核心規則：**Angular 忠實鏡像 React 的 prop shape**

> **「React 有 flat 的就 flat、React 有 bundle 的就 bundle、兩者共存時 Angular 也共存。Angular 不自己發明抽象。」**

React 實際上是 **hybrid 模式** — 同一個元件的 props 會混合：

- **常用設定用 flat top-level props**：`disabledMonthSwitch`、`isDateDisabled`、`placeholderLeft`、`validateLeft` … 這些透過 TS `extends Pick<...>` 鏈從 sub-component props 繼承上來
- **Escape hatch 用 bundle props**：`calendarProps`、`inputLeftProps`、`popperProps`、`fadeProps` 等用 `xxxProps?: Omit<...>` 宣告，讓使用者傳遞任意額外的子元件設定

**兩套設計併存，使用者可任選一種寫法。** Angular 要跟 React 對齊的最忠實作法就是 prop-for-prop 鏡像：

```ts
// React DateTimePickerProps 有這些（flat via inheritance）
disabledMonthSwitch?: boolean;  // from DatePickerCalendarProps → Pick<CalendarProps>
displayMonthLocale?: string;
isDateDisabled?: (d: DateType) => boolean;
placeholderLeft?: string;       // from PickerTriggerWithSeparatorProps
errorMessagesLeft?: ...;
validateLeft?: ...;
// 同時也有這些（bundle escape hatches）
calendarProps?: Omit<CalendarProps, ...>;
inputLeftProps?: Omit<...>;
popperProps?: Omit<InputTriggerPopperProps, ...>;
popperPropsTime?: ...;
```

```ts
// Angular MznDateTimePicker 也必須兩個都有
readonly disabledMonthSwitch = input<boolean | undefined>(undefined);
readonly displayMonthLocale = input<string | undefined>(undefined);
readonly isDateDisabled = input<((d: DateType) => boolean) | undefined>(undefined);
readonly placeholderLeft = input<string | undefined>(undefined);
readonly errorMessagesLeft = input<FormattedInputErrorMessages | undefined>(undefined);
readonly validateLeft = input<((s: string) => boolean) | undefined>(undefined);
// 同時也有 bundle
readonly calendarProps = input<MznDateTimePickerCalendarProps | undefined>(undefined);
readonly inputLeftProps = input<MznDateTimePickerInputProps | undefined>(undefined);
readonly popperProps = input<MznDateTimePickerPopperProps | undefined>(undefined);
readonly popperPropsTime = input<MznDateTimePickerPopperProps | undefined>(undefined);
```

### flat + bundle 同時存在時的優先順序：**flat 覆寫 bundle**

元件內部用 `computed` 把 flat + bundle 合併為單一 view-model：

```ts
protected readonly resolvedCalendar = computed(
  (): MznDateTimePickerCalendarProps => {
    const bundle = this.calendarProps() ?? {};
    return {
      // flat 優先，bundle fallback
      disabledMonthSwitch: this.disabledMonthSwitch() ?? bundle.disabledMonthSwitch,
      displayMonthLocale: this.displayMonthLocale() ?? bundle.displayMonthLocale,
      isDateDisabled: this.isDateDisabled() ?? bundle.isDateDisabled,
      // ...
    };
  },
);
```

flat input 的 default 一律是 `undefined`（`input<T | undefined>(undefined)`），方便以 `??` 區分「未設定」跟「明確設為 false/空字串」。

### 使用端陷阱 — inline object literal

```html
<!-- ❌ 禁止：每次 CD cycle 都建立新 object，signal reference equality 失敗，
     下游 computed/effect 會不必要地重新執行 -->
<div mznDateTimePicker [calendarProps]="{ displayMonthLocale: 'zh-TW' }"></div>
```

```ts
// ✅ 必須：把 bundle hoist 到 class field 或 signal
@Component({
  template: `<div mznDateTimePicker [calendarProps]="calBundle"></div>`,
})
export class Host {
  // 不會變的設定 → readonly field
  protected readonly calBundle = {
    displayMonthLocale: 'zh-TW',
    isMonthDisabled: (d: DateType) => false,
  };

  // 會變的設定 → signal
  protected readonly popperBundle = signal<PopperBundleProps>({
    placement: 'bottom-start',
  });
}
```

或者直接用 flat 寫法（沒有 OnPush CD 陷阱）：

```html
<!-- ✅ flat 寫法：無 inline object，安全 -->
<div mznDateTimePicker [displayMonthLocale]="'zh-TW'" [isMonthDisabled]="isDisabledFn"></div>
```

**這是使用端的責任，元件開發者不需要防禦**。元件的 JSDoc `@example` 應示範正確的 hoist 寫法或直接用 flat。

### 例外：不對應為 Angular input 的 React props

- **`prefix` / `suffix`（React `ReactNode`）** → Angular 用 content projection（`<ng-content select="[prefix]">`），不當 input
- **`xxxRef`（React ref forwarding）** → Angular 用 `@ViewChild` + template ref `#var="mznXxx"` 模式，使用端從 outside 取得
- **`fadeProps` 等 React 框架專屬的配置物件** → Angular 無同等抽象時，寫入 `DEVIATIONS.md`

### Parity 工具如何支援這個規範

`tools/parity/api.ts` 的 extractor **不做 flatten transform**。React 端與 Angular 端都以「prop 名稱」為單位直接比對。鏡像正確的情況下，parity diff 應歸零（除了少數 deviation）。

**inherited props 解析**透過以下機制：

1. **Interface `extends` 遞迴**（原有功能）
2. **Type alias `type X = A & B & C;` 的 intersection 展開**（2026-04-11 新增）
3. **`Omit<>` / `Pick<>` 展開**（原有功能）
4. **Sibling-safe visited set**（2026-04-11 修正）：每個 parent resolution 用獨立的 visited clone，避免兄弟分支互相污染（`CalendarProps` 的 `Pick<CalendarMonthsProps>` 不會被 `Pick<CalendarDaysProps>` 內部引用 `CalendarMonthsProps` 而提前截斷）

#### Parity extractor 會跳過的欄位

- 名字在 `SKIP_PROP_NAMES`：`children`, `className`, `classes`, `ref`, `key`, `style`, `prefix`, `suffix`
- 名字結尾 `Ref`（如 `calendarRef`, `inputLeftRef`）
- HTML passthrough interface（`HTMLAttributes`, `NativeElementProps*` 等）

### 新元件 / 重構 checklist

當新建 Angular 元件或重構舊元件時：

1. **打開對應的 React 元件 `Xxx.tsx`**，找到 `export interface XxxProps` 或 `export type XxxProps = ...`
2. **列出 React 所有的 props**（包含 `extends`/`Omit<>`/`Pick<>` 繼承來的）— 可以先用 `tsx tools/parity/api.ts` 腳本 trace 一下看看 extractor 實際算出哪些
3. **為每個 React prop 在 Angular 開對應的 input**：
   - 名稱一致：`disabledMonthSwitch` ↔ `disabledMonthSwitch`、`calendarProps` ↔ `calendarProps`
   - 預設值：flat primitive input 預設用 `undefined`，bundle input 預設用 `undefined`
4. **元件內部的 computed 讀 `xxx() ?? this.bundle()?.xxx`** 實現 flat 覆寫 bundle
5. **Output 命名對齊 React**：`onChange` → `change`、`onFocusLeft` → `focusLeft` 等
6. **skip**：
   - React 的 `prefix` / `suffix` ReactNode — Angular 用 content projection
   - React 的 `xxxRef` — Angular 用 ViewChild + public method
   - 無對應物的 React 慣用法（如 `fadeProps`）— 寫入 `DEVIATIONS.md`，kind 為 `input` 或 `output`
7. **更新 stories**：flat 寫法或 hoist 的 bundle 寫法皆可，但禁止 inline object literal
8. **更新 JSDoc `@example`** 示範使用方式
9. **跑 `npm run parity -- <comp>`** 確認 API diff 歸零

### 遷移進度

- [x] `date-time-picker` — 首個採用 hybrid 鏡像模式的 picker，**parity 0 diff**（除 `fadeProps` deviation），作為規範確立的參考實作
- [ ] `date-picker`
- [ ] `date-range-picker`
- [ ] `time-picker`
- [ ] `date-time-range-picker`
- [ ] `multiple-date-picker`

_舊元件會在 parity refactor 的下一階段批次遷移。在那之前新元件必須直接採用此規範。_

## Host Element Overrides

For components where the React root element is NOT a `<div>`. Script defaults to `<div>`; these must be set explicitly.

| Component           | Host    | React Root         | Reason                    |
| ------------------- | ------- | ------------------ | ------------------------- |
| tag                 | span    | `<span>`           | inline content            |
| badge               | span    | `<span>`           | inline wrapper            |
| description-content | span    | `<span>`           | inline value              |
| description-title   | span    | `<span>`           | inline label              |
| description         | dl      | `<dl>`             | description list semantic |
| description-group   | div     | `<div>`            |                           |
| inline-message      | div     | `<div>`            | block banner              |
| navigation          | nav     | `<nav>`            | semantic landmark         |
| page-header         | header  | `<header>`         | semantic landmark         |
| page-footer         | footer  | `<footer>`         | semantic landmark         |
| section             | section | `<section>`        | semantic landmark         |
| breadcrumb          | nav     | `<nav>`            | wrapping nav              |
| anchor              | a       | `<a>`              | link                      |
| typography          | —       | varies per variant | handled per-case          |

_(list updated as components are refactored and React roots verified)_

## Known Problem Patterns

### 1. Template outer wrapper collapse

Many components render `template: '<div class="mzn-foo">...</div>'`. After attribute-selector change the host becomes `<div mznFoo>` and the inner wrapper becomes redundant. Must collapse by:

- Moving `class` to `host: { '[class]': 'hostClasses()' }`
- Removing the wrapper `<div>` from template
- Template left with just content

### 2. Class binding collision with child directives

If the component's internal `<button mznButton>` has both `[class]` host binding from the directive AND a static `class` attribute from template, they collide. Use `[class.foo]="true"` per-class bindings instead.

### 3. Self-closing tags in templates

Angular rejects `<div mznFoo />` — must be `<div mznFoo></div>`. Our perl pass must handle multi-line self-closing with `-0777` slurp mode.

### 4. Stale .js/.d.ts files

Periodic `find packages/ng -name '*.js' -o -name '*.d.ts' -delete` needed to prevent webpack from loading stale builds.
