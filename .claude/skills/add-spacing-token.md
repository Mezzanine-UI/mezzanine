# Skill: Adding a Spacing Token

**When:** The user asks to add a new primitive value or semantic tone.

**3 files to update:**

- `packages/system/src/spacing/_primitives.scss`
- `packages/system/src/spacing/_semantic.scss`
- `packages/system/src/spacing/typings.ts`

## Adding a primitive (e.g. `280`)

1. **`_primitives.scss`** — Add the value to `$primitive-scales` list (ascending order); add `{scale}: {scale}px` to `$default-primitives` map (ascending order).
2. **`typings.ts`** — Add `| {scale}` to the `SpacingScale` union (ascending order).

## Adding a semantic tone (e.g. `size-container-slender`)

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
