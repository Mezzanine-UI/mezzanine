---
name: architecting-angular-components
description: Angular 元件必須 prop-for-prop 鏡像 React 對應元件的 props 的強制規範。Use when creating or refactoring Angular components in mezzanine packages/ng/, adding input() to picker/text-field/dropdown/calendar family, deciding which React props to expose, porting React xxxProps to Angular signal inputs, designing component inputs, adding sub-component configuration, encountering questions about flat vs bundle props. Covers the "mirror React prop shape" rule, flat + bundle coexistence pattern with flat-overrides-bundle merging, ReactNode content projection exception, xxxRef via ViewChild pattern, OnPush CD hazards with inline object literals, output naming alignment with React, and new-component checklist.
---

# Architecting Angular Components

> **強制規範（2026-04-11 起）** — 任何在 `packages/ng/` 下新建或重構的元件必須遵守此規則。本檔案為權威來源。

## 核心規則

**Angular 元件的 input/output 必須 prop-for-prop 鏡像 React 對應元件的 props。**

> **「React 有 flat 的就 flat、React 有 bundle 的就 bundle、兩者共存時 Angular 也共存。Angular 不自己發明抽象。」**

## React 實際上是 hybrid 模式

打開任何 React 元件的 props interface 你會看到：

```ts
// React DateTimePickerProps
export interface DateTimePickerProps
  extends Omit<DatePickerCalendarProps, 'anchor' | 'onChange' | 'open' | 'referenceDate' | 'value'>,
    Omit<TimePickerPanelProps, ...>,
    Omit<PickerTriggerWithSeparatorProps, ...> {
  // flat props（透過 extends + Pick<> 鏈繼承上來）:
  // disabledMonthSwitch, isDateDisabled, displayMonthLocale,
  // placeholderLeft, errorMessagesLeft, validateLeft, ...

  // bundle props（escape hatch）:
  calendarProps?: Omit<CalendarProps, ...>;
  inputLeftProps?: Omit<...>;
  inputRightProps?: Omit<...>;
  popperProps?: Omit<...>;
  popperPropsTime?: ...;
  fadeProps?: ...;

  // 自己的 direct props:
  defaultValue?, formatDate?, formatTime?, value?, onChange?, ...
}
```

**常用設定用 flat，escape hatch 用 bundle**。兩套設計併存，使用者可選擇任一種寫法。Angular 必須同時提供兩套。

## Angular 對應做法

```ts
@Component({ selector: '[mznDateTimePicker]', ... })
export class MznDateTimePicker {
  // ─── flat inputs — 鏡像 React flat props ─────────────────────────
  readonly disabledMonthSwitch = input<boolean | undefined>(undefined);
  readonly displayMonthLocale = input<string | undefined>(undefined);
  readonly isDateDisabled = input<((d: DateType) => boolean) | undefined>(undefined);
  readonly placeholderLeft = input<string | undefined>(undefined);
  readonly errorMessagesLeft = input<FormattedInputErrorMessages | undefined>(undefined);
  readonly validateLeft = input<((s: string) => boolean) | undefined>(undefined);
  // ... 每一個 React flat prop 都有

  // ─── bundle inputs — 鏡像 React bundle props ─────────────────────
  readonly calendarProps = input<MznDateTimePickerCalendarProps | undefined>(undefined);
  readonly inputLeftProps = input<MznDateTimePickerInputProps | undefined>(undefined);
  readonly inputRightProps = input<MznDateTimePickerInputProps | undefined>(undefined);
  readonly popperProps = input<MznDateTimePickerPopperProps | undefined>(undefined);
  readonly popperPropsTime = input<MznDateTimePickerPopperProps | undefined>(undefined);
  // ...
}
```

**關鍵**：Angular 不要自己決定「這個 prop 應該 flat 還是 bundle」— React 已經決定了，直接鏡像就對。

## flat + bundle 優先順序：**flat 覆寫 bundle**

元件內部用 `computed` 合併：

```ts
protected readonly resolvedCalendar = computed(
  (): MznDateTimePickerCalendarProps => {
    const bundle = this.calendarProps() ?? {};
    return {
      disabledMonthSwitch: this.disabledMonthSwitch() ?? bundle.disabledMonthSwitch,
      displayMonthLocale: this.displayMonthLocale() ?? bundle.displayMonthLocale,
      isDateDisabled: this.isDateDisabled() ?? bundle.isDateDisabled,
      // ...
    };
  },
);
```

flat input 預設一律用 `undefined`（`input<T | undefined>(undefined)`），方便以 `??` 區分「未設定」跟「明確設為 false/空字串」。

## 使用端兩種寫法

### Flat 寫法（推薦，無 CD 陷阱）

```html
<div mznDateTimePicker [(ngModel)]="dateTime" [displayMonthLocale]="'zh-TW'" [isDateDisabled]="isDisabledFn" placeholderLeft="選擇日期"></div>
```

### Bundle 寫法（適合傳大量 CalendarProps）

```ts
@Component({
  template: `<div mznDateTimePicker [calendarProps]="calBundle"></div>`,
})
export class Host {
  // ⚠️ 必須 hoist 到 class field 或 signal，避免 inline literal
  protected readonly calBundle: MznDateTimePickerCalendarProps = {
    displayMonthLocale: 'zh-TW',
    isDateDisabled: (d) => d === '2026-01-01',
  };
}
```

## ⚠️ 使用端陷阱 — inline object literal

```html
<!-- ❌ 禁止：每次 CD cycle 建立新 object，signal reference equality 失敗，
     下游 computed/effect 會不必要地重新執行 -->
<div mznDateTimePicker [calendarProps]="{ displayMonthLocale: 'zh-TW' }"></div>
```

**務必 hoist 到 class field 或 signal**。這是使用端的責任，元件開發者在 JSDoc `@example` 示範正確寫法即可，不需要元件做任何防禦。

## Output 命名規範

Angular output 名稱必須跟 React 對齊（去掉 `on` 前綴、lowerCamelCase）：

| React                 | Angular             |
| --------------------- | ------------------- |
| `onChange`            | `change`            |
| `onFocusLeft`         | `focusLeft`         |
| `onBlurRight`         | `blurRight`         |
| `onLeftComplete`      | `leftComplete`      |
| `onPasteIsoValueLeft` | `pasteIsoValueLeft` |
| `onPanelToggle`       | `panelToggle`       |

## 例外：不對應為 Angular input 的 React props

### 1. `prefix` / `suffix`（React `ReactNode`）→ content projection

```html
<div mznDateTimePicker>
  <i prefix mznIcon [icon]="BankIcon"></i>
  <i suffix mznIcon [icon]="CalendarIcon"></i>
</div>
```

元件內：`<ng-content select="[prefix]">` / `<ng-content select="[suffix]">`

### 2. `xxxRef`（React ref forwarding）→ ViewChild + template reference

```html
<div mznDateTimePicker #picker="mznDateTimePicker"></div> <button (click)="picker.focusCalendar()">Focus</button>
```

元件內以 `@ViewChild` + public API method 暴露，不當 input。

### 3. 無對應物的 React 專屬 lib（如 `fadeProps`）

寫入 `DEVIATIONS.md`：

```markdown
| date-time-picker | **api** | input | fadeProps | — | React 用 react-transition-group... Angular 用 CSS transition，無同等抽象 | 2026-04-11 |
```

## 新元件 / 重構 checklist

1. **打開 React `Xxx.tsx`**，讀 `export interface XxxProps`
2. **列出所有 props**（含 `extends`/`Omit<>`/`Pick<>` 繼承來的）— 可用 parity extractor 跑一次確認
3. **逐一鏡像到 Angular**：
   - 同名 input
   - 正確型別（flat 用 `T | undefined` default undefined，bundle 用對應 bundle type）
   - 必要的 `[attr.xxx]: null` host 綁定（避免 input 名稱洩漏為 HTML 屬性）
4. **內部 `computed`** 以 flat 覆寫 bundle 的語意合併
5. **Output 去 `on` 前綴**對齊 React
6. **例外處理**：`prefix`/`suffix` content projection、`xxxRef` ViewChild、無對應 lib 寫 deviation
7. **Stories 更新**：可用 flat 或 hoist 的 bundle 寫法，禁止 inline object literal
8. **JSDoc `@example`** 示範使用方式
9. **跑 `npm run parity -- <comp>`** 確認 diff 歸零（除了已寫 deviation 的）

## Parity 工具對此規範的支援

`tools/parity/api.ts` 的 extractor 以「prop 名稱」為單位直接比對兩邊，不做 flatten transform。鏡像正確時 diff 應歸零。

**inherited props 解析**透過：

1. Interface `extends` 遞迴
2. Type alias `type X = A & B & C;` 的 intersection 展開（2026-04-11 新增）
3. `Omit<>` / `Pick<>` 展開
4. Sibling-safe visited set — 每個 parent resolution 用獨立的 visited clone（2026-04-11 修正）

**自動跳過的欄位**：

- `SKIP_PROP_NAMES`：`children`, `className`, `classes`, `ref`, `key`, `style`, `prefix`, `suffix`
- 結尾 `Ref`（如 `calendarRef`, `inputLeftRef`）
- HTML passthrough interface（`HTMLAttributes`, `NativeElementProps*` 等）

## 已採用此規範的參考實作

- **`MznDateTimePicker`** — 首個 hybrid 鏡像實作，**parity 0 diff**（除 `fadeProps` deviation）
- `packages/ng/date-time-picker/date-time-picker.component.ts`

## 遷移進度（picker family）

- [x] `date-time-picker` — 首個 hybrid 鏡像的 picker
- [ ] `date-picker`
- [ ] `date-range-picker`
- [ ] `time-picker`
- [ ] `date-time-range-picker`
- [ ] `multiple-date-picker`

## 其他已部分採用 bundle 的元件

以下元件已有 bundle input 的先例（不是全部鏡像，但跟 React bundle 對齊的部分）：

- `MznProgress.percentProps`
- `MznSpin.backdropProps`
- `MznTable.emptyProps`
- `MznDropdown.actionConfig`
- `MznPopper.arrowOptions` / `offsetOptions`
- `MznDrawer.bottomGhostAction` / `bottomPrimaryAction` / ...
- `MznRadio.withInputConfig`

## 參考

- **首個實作範例**：`packages/ng/date-time-picker/date-time-picker.component.ts`
- **Parity 工具實作**：`tools/parity/api.ts` 的 `resolveInterfaceProps` + `resolveTypeExpression`
