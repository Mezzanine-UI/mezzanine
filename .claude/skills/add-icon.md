# Skill: Adding a New Icon

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
