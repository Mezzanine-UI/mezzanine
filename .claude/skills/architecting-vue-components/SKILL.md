---
name: architecting-vue-components
description: Mandatory rules for the Vue 3 port of Mezzanine UI. Use when creating or refactoring anything under packages/vue/, porting a React component to Vue 3, deciding how a React prop maps to a Vue prop/emit/slot, wiring v-model, writing Vue stories that must mirror React stories, running the React↔Vue parity harness, or deciding whether something needs a DEVIATIONS-VUE.md row. Covers prop-for-prop mirroring, the flat+bundle hybrid, emit naming, named v-model, slots as the ReactNode escape hatch, defineExpose as the ref escape hatch, the no-local-styles rule, story parity, and the verification gate.
---

# Architecting Vue 3 Components

> **MANDATORY** — this file is the authority for everything under `packages/vue/`.
> Companion files: [PORTING-PLAYBOOK.md](./PORTING-PLAYBOOK.md) (method learned from the
> React→Angular port) and [PARITY-TOOLING.md](./PARITY-TOOLING.md) (the harness contract).

## 0. The one-line rule

**Vue mirrors React prop-for-prop. Vue invents nothing. The parity diff is the spec — exit 0
or the component is not done.**

The React package is the reference implementation. Angular is a sibling port, **not** a
reference: where Angular deviated from React (see `DEVIATIONS.md`), Vue follows **React**, not
Angular. Angular's deviations exist because Angular could not express something; Vue's ability
to express it is judged independently.

---

## 1. Non-negotiable rules

| #      | Rule                                                                                                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1** | Strict prop-for-prop mirroring of the React component's props. No renames, no merges, no splits, no "nicer" Vue API.                                                             |
| **R2** | Styles come from `@mezzanine-ui/core` only. **No `<style>` block of any kind in any `.vue` file** (scoped or not). If a Vue-only style need appears — **STOP and ask the user**. |
| **R3** | Implementation first, tests second. Test files may be deferred until most components exist, but the **test environment must be stood up before the first component is written**. |
| **R4** | Behaviour must be identical. Vue-native performance optimizations are allowed **only** when the parity diff stays at 0 and observable behaviour is byte-identical.               |
| **R5** | Anything not achievable → **STOP, explain, ask the user**. Only after approval, add a row to `DEVIATIONS-VUE.md`.                                                                |
| **R6** | Story scenarios must be identical: same `title`, same export names, same order, same visible content, so the user can compare the two Storybooks side by side.                   |
| **R7** | Every rule above must be enforced by tooling, not by memory. If a rule has no check, write the check.                                                                            |
| **R8** | Everything else follows existing repo practice (`CLAUDE.md`, `AGENTS.md`, `DEVELOP_GUIDELINE.md`).                                                                               |

Inherited from `CLAUDE.md` and therefore also non-negotiable:

- Props sorted **alphabetically** in every declaration site (interface, `withDefaults`, story `args`, template attribute order).
- CSS Module Level 4 syntax; no hardcoded pixel values in style files — but note **R2**: the Vue package writes no styles at all, so this only matters if a core-side change is ever needed (which requires user approval first).
- The JSDoc convention applies verbatim: component-level JSDoc with summary + behaviour + `@example` (using the `@mezzanine-ui/vue` import path) + `@see`; every prop documented with `/** */` and `@default` where applicable.

---

## 2. Prop mirroring

### 2.1 React is a hybrid — mirror both halves

React exposes **flat props** for common settings and **bundle props** as escape hatches, and
both coexist on the same component:

```ts
// React DateTimePickerProps (abridged)
export interface DateTimePickerProps
  extends Omit<DatePickerCalendarProps, 'anchor' | 'onChange' | 'open'>,
    Omit<TimePickerPanelProps, /* … */> {
  // flat (inherited through extends + Omit/Pick chains)
  disabledMonthSwitch?: boolean;
  isDateDisabled?: (d: DateType) => boolean;
  placeholderLeft?: string;

  // bundle (escape hatches)
  calendarProps?: Omit<CalendarProps, /* … */>;
  inputLeftProps?: /* … */;
  popperProps?: /* … */;
}
```

Vue must expose **both**. Do not decide which shape a prop "should" have — React already
decided.

### 2.2 Where the type lives

```
packages/vue/<component-kebab>/
  <component-kebab>.types.ts    ← export interface XxxProps  (the parity contract)
  <component-kebab>.vue         ← defineProps<XxxProps>()
```

Mirrors React's `packages/react/src/Xxx/typings.ts` + `Xxx.tsx` split, and keeps the props
interface parseable by the API extractor without having to understand SFC compilation.

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import clsx from 'clsx';
import type { ButtonProps } from './button.types';

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  disabledTooltip: false,
  loading: false,
  size: 'main',
  tooltipPosition: 'bottom',
  variant: 'base-primary',
});
</script>
```

### 2.3 Defaults

- Give a default **only** where React gives one, and give **exactly React's value**.
- Everything else stays `undefined`, so `??` can distinguish "not set" from "explicitly `false` / empty string".
- A default that differs from React is a **deviation** and needs approval (see `media-preview-modal` in `DEVIATIONS.md` for the shape of an approved one).

### 2.4 flat + bundle precedence: **flat overrides bundle**

```ts
const resolvedCalendar = computed<DateTimePickerCalendarProps>(() => {
  const bundle = props.calendarProps ?? {};
  return {
    disabledMonthSwitch: props.disabledMonthSwitch ?? bundle.disabledMonthSwitch,
    displayMonthLocale: props.displayMonthLocale ?? bundle.displayMonthLocale,
    isDateDisabled: props.isDateDisabled ?? bundle.isDateDisabled,
  };
});
```

Identical semantics to the Angular rule. Consumers may use either style; hoisting bundle
objects out of the template is still recommended (a fresh object literal per parent render
invalidates every `computed`/`watch` that depends on it), and the JSDoc `@example` should
demonstrate the hoisted form.

---

## 3. Emits

### 3.1 Naming

Strip the `on` prefix, lowerCamelCase the remainder — same table as Angular:

| React                 | Vue emit            |
| --------------------- | ------------------- |
| `onChange`            | `change`            |
| `onFocusLeft`         | `focusLeft`         |
| `onBlurRight`         | `blurRight`         |
| `onLeftComplete`      | `leftComplete`      |
| `onPasteIsoValueLeft` | `pasteIsoValueLeft` |
| `onPanelToggle`       | `panelToggle`       |

**Never rename an emit to fit a Vue idiom.** Angular had to (`onChange` → `expandedChange`,
`onOpen` → `opened`) because Angular cannot give an input and an output the same name and
`[(x)]` demands `xChange`. Vue has no such constraint — see 3.2 — so a rename here is a bug,
not a deviation.

### 3.2 Two-way binding — use **named** `v-model`

Vue 3's named `v-model:<prop>` binds prop `<prop>` to emit `update:<prop>`. This keeps React's
prop name intact while still giving consumers two-way binding:

```vue
<!-- consumer -->
<MznSelect v-model:value="selected" />
<!-- equivalent to :value="selected" @update:value="selected = $event" -->
```

Rules:

- The prop keeps **React's name** (`value`, `open`, `expanded`), never `modelValue`.
- Emit **both** the React-named event and the `update:` event where React has a callback:
  `onChange` → emit `change` **and** `update:value`.
- `update:*` emits are framework-intrinsic plumbing and are on the extractor skip list; they
  never count as an "extra" output. They are the Vue analogue of Angular's `xxxChange`
  convention — but additive, not a replacement.
- Do **not** add `update:*` for a prop React never notifies about.

### 3.3 Declaration syntax is fixed

Declare emits with the **named-tuple type form only**:

```ts
const emit = defineEmits<{
  change: [value: string];
  'update:value': [value: string];
}>();
```

Not the call-signature form, not the runtime array form. The API extractor reads the top-level
keys of this type literal; any other form makes the emit invisible to the harness and will be
reported as a missing output.

---

## 4. Sanctioned exceptions (the only ones)

These React props are **not** mirrored as Vue props. They are on the extractor skip list and
never count as diffs. Anything not on this list that cannot be mirrored requires **R5**.

### 4.1 `ReactNode` props → named slots

`children`, `prefix`, `suffix`, and any prop typed `ReactNode`:

```vue
<!-- component -->
<slot name="prefix" />
<slot />
<slot name="suffix" />
```

```vue
<!-- consumer -->
<MznTextField>
  <template #prefix><MznIcon :icon="BankIcon" /></template>
  <template #suffix><MznIcon :icon="CalendarIcon" /></template>
</MznTextField>
```

Declare them with `defineSlots<{ prefix?: () => unknown; default?: () => unknown }>()` so the
slot checker can verify every `<slot name>` is declared and documented.

**Vue advantage over Angular:** a slot can be passed inside a render function, so bundles that
contained `ReactNode` fields (Angular had to bridge these with `prefixText` / `prefixIcon` —
see the `checkbox` rows in `DEVIATIONS.md`) may be expressible in Vue. Try the faithful
mapping before reaching for a bridge prop; a bridge prop is a deviation.

### 4.2 `xxxRef` → `defineExpose` + template ref

React ref-forwarding props (`inputRef`, `calendarRef`, `controllerRef`, …) become an imperative
surface:

```ts
defineExpose({
  focus,
  reset,
  get inputRef() {
    return inputEl.value;
  },
});
```

```vue
<MznUpload ref="uploader" />
<button @click="uploader?.reset()">Reset</button>
```

Any prop name ending in `Ref` is auto-skipped by the extractor.

### 4.3 `className` / `classes` / `style` / `key` → fallthrough attrs

Leave `inheritAttrs` at its default (`true`) and give the component a **single root element**,
so consumer-supplied `class` / `style` land on the root exactly like React's `className` spread.
Multi-root components must handle `$attrs` explicitly and are a red flag for DOM parity.

### 4.4 React-ecosystem-only bundles

`fadeProps` (react-transition-group) and friends: if there is genuinely no Vue equivalent,
that is **R5** → ask → `DEVIATIONS-VUE.md`.

---

## 5. Rendering contract

The DOM diff is unforgiving. These are the rules that keep it at zero:

1. **Same root tag, same class composition.** Classes come from `@mezzanine-ui/core/<comp>`'s
   `xxxClasses` object composed with `clsx` — never hand-written strings.
2. **No extra wrappers.** Use `<template v-if>` / `<template v-for>` for fragments. A `<div>`
   that React does not render is an `extra` diff.
3. **Portals → `<Teleport to="body">`.** This is much closer to React's `createPortal` than
   Angular's CDK overlay host div, so several Angular deviations
   (`accordion / With Actions / extra`, the thumbnail-card ones) **must not** reappear in Vue.
   If they do, the Teleport placement is wrong.
4. **Transitions.** React uses `react-transition-group`; Vue's `<Transition>` injects
   `v-enter-from` / `v-enter-active` / … classes. Either drive the core transition classes
   manually, or configure `<Transition>`'s `enter-from-class` etc. to emit exactly React's
   class names. Do not let Vue's default class names reach the DOM.
5. **No `<style>` blocks.** (R2). Enforced by `check-vue-no-local-styles.mjs`.
   5a. **No unbalanced HTML tags in `<script>` comments.** Writing
   ``merges `className` onto the inner `<span>`, not the container `<div>` ``
   in a JSDoc block can make the entire SFC fail to parse, reported as
   `Element is missing end tag` pointing at **end-of-file** — not at the
   comment. Whether it triggers depends on what else the file contains, so the
   same comment can be harmless in one component and fatal in the next, and
   `@vue/compiler-sfc`'s own `parse()` does not flag it. Balanced markup is
   fine (that is what `@example` blocks are); write incidental element
   mentions without angle brackets. Enforced by
   `check-vue-comment-tags.mjs`.
6. **No inline `:style` with literal px/hex.** Same reason; use core classes and tokens.
7. **Attribute leakage.** Vue does not leak object props to attributes the way React does
   (see the `select` rows in `DEVIATIONS.md` where React leaks
   `value="[object Object]"`). Where React has that bug, Vue is _correct_ and the diff is a
   React-side defect — record it as a deviation with that reason, do not reproduce the bug.

---

## 6. File layout

```
packages/vue/<component-kebab>/
  <component-kebab>.vue          # SFC, <script setup lang="ts">
  <component-kebab>.types.ts     # export interface XxxProps  (+ bundle types)
  <component-kebab>.stories.ts   # mirrors React story-for-story
  <component-kebab>.mdx          # mirrors React's MDX
  <component-kebab>.spec.ts      # may be deferred (R3), environment may not
  index.ts                       # public re-exports for the sub-path entry
```

Cross-component internals live in `packages/vue/_internal/`, mirroring `packages/ng/_internal/`.
Public entry: `packages/vue/src/public-api.ts`; sub-path imports (`@mezzanine-ui/vue/button`)
must work like the ng package's secondary entry points.

---

## 7. Story parity

The harness matches stories by **Storybook `storyId`**, which is derived from `title` +
export name. Therefore:

- `title` must be byte-identical to React's (`'Foundation/Button'`).
- Export names must be identical **and** cover the full set — a missing story is a `missing`
  diff, a Vue-only story is an `extra` diff. Both fail the gate.
- `argTypes` `options` / `control.type` must match; `args` must produce the same rendered
  content (where React passes `children`, the Vue story passes the same text through the
  default slot).
- Story order should match so the two Storybook sidebars read the same.
- Hoist bundle objects out of story templates; never inline object literals in a template
  binding.

### Text nodes: when a template is not good enough

JSX emits one text node per child. `<h3>{name} ({count})</h3>` produces **four**:
`name`, `" ("`, `count`, `")"`. Vue's template compiler merges adjacent text and
interpolations into a **single** text node, and the DOM differ correctly reports the
mismatch — this is most of what made the Angular port's `icon` story carry 283 diffs.

So: **whenever a React story interleaves text and interpolation inside one element,
author that story with `h()` instead of a template string.** `h('h3', {…}, [name, ' (',
String(count), ')'])` reproduces the child list exactly. A template is fine when each
element holds a single interpolation or plain static text.

Two related React↔Vue serialization differences to write out by hand in stories:

- React converts numeric style values to px (`fontSize: 12` → `12px`); Vue does not.
  Write `'12px'` in Vue. The computed style then matches, so this is not a deviation.
- React renders the export identifier only if you ask for it. Mirror the _expression_,
  not the variable name — the Angular port printed `MenuIcon` where React printed
  `icon.name` (`menu`), which also shifted every element's measured width.

---

## 8. Verification gate

A component is done when **all** of these pass:

```bash
yarn react:storybook          # :6006
yarn vue:storybook            # :6008
yarn parity:vue -- <component>       # → tools/parity/.out-vue/<component>/report.txt, exit 0
yarn parity:vue:lint-styles          # no <style> blocks / literal px in packages/vue
yarn parity:check-tokens             # unchanged core-scss token scan
yarn check packages/vue/<component>  # eslint + type check
```

Never report a component complete on visual inspection. `report.txt` saying `PARITY OK` is the
only acceptable evidence, and any suppressed row must already exist in `DEVIATIONS-VUE.md`
with a user-approved date.

---

## 9. Open decisions — **do not guess** (R5)

These shape the whole package and must be answered by the user before implementation starts.
Recommended answers are given, but none may be adopted silently.

| #   | Decision                          | Recommendation                                                                                                                                                          |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Package name / directory / layout | `packages/vue`, npm `@mezzanine-ui/vue`, flat kebab-case component directories (mirrors `packages/ng`, keeps sub-path imports)                                          |
| D2  | Authoring format                  | `.vue` SFC with `<script setup lang="ts">` + props interface in a sibling `.types.ts`                                                                                   |
| D3  | Build tool                        | Vite library mode (multi-entry) + `vite-plugin-dts`; `vue-tsc` for type checking                                                                                        |
| D4  | Storybook builder & port          | `@storybook/vue3-vite` on **:6008** (React :6006, Angular :6007)                                                                                                        |
| D5  | Test runner                       | Vitest + `@vue/test-utils` + jsdom — the Jest SFC transformer is effectively unmaintained. **This deviates from the repo's Jest standard and needs explicit approval.** |
| D6  | Named `v-model` policy (§3.2)     | Emit both the React-named event and `update:<prop>`; skip-list `update:*` in the extractor                                                                              |
| D7  | Deviations file                   | New `DEVIATIONS-VUE.md`, same table format, separate from the React↔Angular file                                                                                       |
| D8  | Composed Storybook hub            | Add a third `/vue/` tile to `scripts/compose-storybooks.mjs`                                                                                                            |

---

## 9a. Reference implementation

`packages/vue/icon` — first ported component, **parity 0 diffs on the first harness run**,
including the `All` story that the Angular port never brought below 283. Worth reading for:

- the `useAttrs()` reading of `onClick` / `onMouseover` that mirrors React's derived
  cursor without inventing Angular's extra `clickable` input
- the explicit camelCase → hyphenated SVG attribute mapping (`fillRule` → `fill-rule`),
  which JSX does automatically and `v-bind` does not
- `h()`-authored stories (§7)

## 10. New-component checklist

1. Open the React source: `packages/react/src/<Xxx>/<Xxx>.tsx` **and** `typings.ts`.
2. List every prop, including everything inherited through `extends` / `Omit<>` / `Pick<>` /
   intersections. Verify the list with the parity API extractor rather than by eye.
3. Read the React stories and the MDX — the story set is part of the spec.
4. Write `<comp>.types.ts`: every prop mirrored, alphabetical, JSDoc'd, `@default` where React
   has a default.
5. Write `<comp>.vue`: `defineProps<XxxProps>()`, `withDefaults` only for React's defaults,
   `defineEmits` in named-tuple form, `defineSlots` for every slot, `defineExpose` for every
   `xxxRef`.
6. Compose classes from `@mezzanine-ui/core/<comp>` with `clsx`. No `<style>`. No literal px.
7. Merge flat over bundle in `computed`.
8. Port the stories one-for-one (same title, same export names, same args, same order).
9. Run the verification gate (§8) until `report.txt` reads `PARITY OK`.
10. Anything that will not converge → **stop and ask** before writing a deviation row.
11. Update `packages/vue/COMPONENTS.md` (the AI-facing component index, mirroring
    `packages/react/COMPONENTS.md`).
