<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- Always sort component props alphabetically (a-z).
- Do not generate extra documentation or explanations after completing a task.
  The code itself must be clean, self-explanatory, and readable.
- Always use CSS Module Level 4 syntax and features whenever applicable. Prefer modern selectors, logical properties, and native nesting instead of older approaches.
- Do not hardcode pixel values inside style files unless absolutely necessary. Use predefined design tokens and variables from the @mezzanine-ui/system directory instead.

<!-- nx configuration end-->

---

## Skill: Adding a New Icon

**When:** The user asks to add an icon to any category.

**Icon category directories:** `packages/icons/src/{alert,arrow,content,controls,stepper,system}/`

**4 files to update:**

1. **Create the icon file** at `packages/icons/src/{category}/{icon-name}.ts`:

   ```typescript
   import { IconDefinition } from '../typings';

   export const {PascalCase}Icon: IconDefinition = {
     name: '{kebab-case}',           // must match the file name
     definition: {
       svg: { viewBox: '0 0 16 16', fill: 'none' },
       path: { fill: 'currentColor', d: '...' },
     },
   };
   ```

   - File name: `kebab-case.ts` — Export name: `{PascalCase}Icon`
   - Always: `svg.fill: 'none'`, `path.fill: 'currentColor'`, `viewBox: '0 0 16 16'`
   - **If the source SVG has multiple `<path>` elements, concatenate all `d` values into a single string (space-separated). The `IconDefinition` interface only supports one `path` object.**

2. **Update the category barrel** `packages/icons/src/{category}/index.ts`:
   Add `export { {PascalCase}Icon } from './{icon-name}';`

3. **Update the root barrel** `packages/icons/src/index.ts`:
   Add `export { {PascalCase}Icon } from './{category}/{icon-name}';` under the matching category section.

4. **Update Storybook** `packages/react/src/Icon/Icon.stories.tsx`:
   Add `AllIcons.{PascalCase}Icon` to the matching category's `icons` array in the `All` story.

---

## Skill: Adding a Spacing Token

**When:** The user asks to add a new primitive value or semantic tone.

**3 files to update:**

- `packages/system/src/spacing/_primitives.scss`
- `packages/system/src/spacing/_semantic.scss`
- `packages/system/src/spacing/typings.ts`

### Adding a primitive (e.g. `280`)

1. **`_primitives.scss`** — Add the value to `$primitive-scales` list (ascending order); add `{scale}: {scale}px` to `$default-primitives` map (ascending order).
2. **`typings.ts`** — Add `| {scale}` to the `SpacingScale` union (ascending order).

### Adding a semantic tone (e.g. `size-container-slender`)

1. **`_semantic.scss`** — Add the tone name to the relevant tones list; add an entry to the matching context/category block inside `$semantic-spacings`:
   ```scss
   {tone-name}: (
     default: primitive.variable({scale}),
     compact: primitive.variable({scale}),
   ),
   ```
2. **`typings.ts`** — Add `| '{tone-name}'` to the matching tone union type:

| Context   | Category     | TypeScript union type   |
| --------- | ------------ | ----------------------- |
| `size`    | `element`    | `ElementTone`           |
| `size`    | `container`  | `ContainerTone`         |
| `gap`     | —            | `GapTone`               |
| `padding` | `horizontal` | `HorizontalPaddingTone` |
| `padding` | `vertical`   | `VerticalPaddingTone`   |
