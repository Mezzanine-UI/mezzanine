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
