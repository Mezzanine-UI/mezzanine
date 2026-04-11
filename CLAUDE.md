<!-- nx configuration start-->

# General Guidelines

- Always sort component props alphabetically (a-z).
- Always use CSS Module Level 4 syntax and features whenever applicable. Prefer modern selectors, logical properties, and native nesting instead of older approaches.
- Do not hardcode pixel values inside style files unless absolutely necessary. Use predefined design tokens and variables from the @mezzanine-ui/system directory instead.

<!-- nx configuration end-->

---

## JSDoc 規範（AI 友善）

為了讓 AI 工具在消費端專案中能精準理解元件用法，本專案遵循以下 JSDoc 規範：

1. **元件 JSDoc**：每個 default export 元件必須包含：一行摘要、關鍵行為描述（2-3 行）、至少一個 `@example`（含 `@mezzanine-ui/react` import 路徑）、`@see` 相關元件。
2. **Prop JSDoc**：每個 props interface 的屬性必須有 `/** */` 描述，適用時加上 `@default`。discriminated union 中的 `never` 屬性使用 `/** 此模式下不適用。 */`。
3. **Core Union Type JSDoc**：`packages/core/src/` 中的每個 union type 必須有 JSDoc，以 `- \`'value'\` —` 格式逐值說明。
4. **Hook JSDoc**：每個公開 hook 必須有 JSDoc，包含搭配元件說明與 `@example`。
5. **元件目錄**：`packages/react/COMPONENTS.md` 為元件索引，新增元件時須同步更新。

---

## Project Skills

Detailed how-to guides are stored in `.claude/skills/` — read the relevant file before starting the task:

- **Adding a new icon** → `.claude/skills/add-icon.md`
- **Adding a spacing token** → `.claude/skills/add-spacing-token.md`
- **Angular 元件架構（強制規範）** → `.claude/skills/architecting-angular-components/SKILL.md`

## React → Angular Parity

Angular 元件移植以「同時跑兩邊 Storybook、用 `tools/parity/` 比對 DOM / computed style / argTypes」為唯一驗證機制。Diff 是規格，無 diff 即完成。流程：

1. `npm run react:storybook`（:6006）+ `npm run ng:storybook`（:6007）
2. `npm run parity -- <component>` → 讀 `tools/parity/.out/<component>/report.txt`
3. 修 `packages/ng/<component>/*` → 重跑直到 exit 0
4. 平台差異無法 parity 時：**停下來向使用者說明、取得核可後**寫入 repo 根 `DEVIATIONS.md`，harness 只抑制明列的 `(component, story, kind)` 三元組

## Angular Component Input Architecture — **強制規範**

**所有 Angular 元件的 input/output 必須 prop-for-prop 鏡像 React 對應元件的 props。**

> **「React 有 flat 的就 flat、React 有 bundle 的就 bundle、兩者共存時 Angular 也共存。Angular 不自己發明抽象。」**

React 是 hybrid 模式 — 常用設定用 flat top-level props（如 `disabledMonthSwitch`、`isDateDisabled`、`placeholderLeft`），escape hatch 用 bundle props（如 `calendarProps`、`inputLeftProps`、`popperProps`）。Angular 必須同時提供兩種。flat + bundle 同時存在時元件內部以 flat 優先覆寫 bundle。

例外：`prefix`/`suffix`（ReactNode）用 content projection、`xxxRef` 用 ViewChild、無對應物的 React 專屬 lib（如 `fadeProps`）寫入 `DEVIATIONS.md`。

**完整規範、使用端 OnPush 陷阱警告、遷移 checklist、範例** 見 `tools/parity/REFACTOR.md` 的 `Angular Component Input Architecture` 區段。2026-04-11 確立，所有新元件與重構必須遵守。
