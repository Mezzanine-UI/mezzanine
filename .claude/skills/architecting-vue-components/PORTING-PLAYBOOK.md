# Porting Playbook — what the React→Angular port taught us

> Method notes carried over to the Vue 3 port. Read together with
> [SKILL.md](./SKILL.md) (the rules) and [PARITY-TOOLING.md](./PARITY-TOOLING.md)
> (the harness contract). Everything here is evidence-based: it is either
> encoded in `tools/parity/` or visible as a row in `DEVIATIONS.md`.

---

## 1. Principles that made the Angular port converge

### 1.1 The diff is the spec

No "looks right", no screenshots-by-eye, no "close enough". A component is finished when
`tools/parity/.out/<component>/report.txt` says `PARITY OK`. This turns porting from a
judgement task into a search task: run the harness, read the diffs, fix the top one, repeat.
The single most valuable property is that the loop **terminates** — you always know how much
work is left, because it is a number.

### 1.2 Deviations are rare, enumerated, and human-approved

`DEVIATIONS.md` suppresses exactly the `(Component, Story, Kind)` triples listed in its table,
nothing else. There is no per-component off switch, no `--ignore` flag, no "known issues"
section. Consequences worth preserving:

- Writing a deviation costs a conversation with the user, so the default is to fix the code.
- Every suppression carries a written reason, so future readers know whether it is still true.
- Wildcards are only allowed in the `Story` column (`*` = all stories of that component+kind),
  never in `Component` or `Kind`.

### 1.3 Normalization is where the harness earns its keep

Two frameworks never emit identical DOM at the byte level. `normalize.ts` strips exactly the
noise that carries no meaning, and nothing more:

- `_ngcontent-*` / `_nghost-*` / `ng-version` / `ng-reflect-*` / `data-reactroot`
- Angular Forms state classes (`ng-pristine`, `ng-valid`, `ng-touched`, …)
- Generated id strings — React `useId` (`:r0:`) vs CDK (`cdk-overlay-3`) — collapsed to `<id>`
  in `id`, `for`, `aria-controls`, `aria-labelledby`, `aria-describedby`, `aria-owns`,
  `aria-activedescendant`, so _wiring_ is compared but not the arbitrary value
- Attributes outside `aria-*` / `data-*` / a small generic keep-list are dropped entirely
- Class tokens are **sorted**, so ordering differences are not diffs
- Framework wrapper elements (`<storybook-root>`) are skipped so both trees start at the same
  logical root

Getting this list right up front is what stops the first run from producing 4,000 meaningless
diffs and destroying trust in the tool. **Build the Vue noise list before porting component
one** (see PARITY-TOOLING.md §3).

### 1.4 Freeze animation before snapshotting

`compare.ts` injects `* { transition: none !important; animation: none !important; }` and
awaits `document.getAnimations()` plus `document.fonts.ready` before reading computed styles.
Without this, React and Angular mount at slightly different times and `getComputedStyle`
captures different frames of the same fade — an endless source of phantom colour diffs.
Storybook's own `.sb-show-main { transition: color }` was a real offender.

### 1.5 Source-level API parity is separate from DOM parity

`api.ts` compares props/inputs/outputs by **name**, statically, without rendering anything. It
catches the whole class of "the component looks right in every story but is missing six props
nobody wrote a story for". Reported under the pseudo-story `__api__`.

### 1.6 Environment-in-the-loop beats end-of-task checking

`.claude/hooks/quick-tsc.sh` runs a scoped, incremental `tsc --noEmit` after every write to
`packages/ng/**/*.ts` and feeds errors straight back. Type errors get fixed in the same turn
they are introduced, instead of accumulating into a compile-error swamp at the end. Replicate
with `vue-tsc` for `packages/vue`.

### 1.7 Static lints catch what the DOM diff structurally cannot

`check-ng-content-selectors.mjs` exists because a whole phase of bugs came from
`<ng-content select="mzn-navigation-header">` where the sub-component was actually the
attribute directive `[mznNavigationHeader]` — the projection silently rendered nothing, and a
silently-empty slot looks like a legitimately-empty slot in a DOM diff. Whenever a failure mode
is _invisible_ to the differ, it needs its own static check.

---

## 2. Pitfall catalog (and the Vue outlook for each)

| #   | Angular pitfall                                                                                                                                              | Evidence                                                                   | Vue outlook                                                                                                                                                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1  | Cannot give an input and an output the same name; `[(x)]` forces an `xChange` suffix → renamed emits                                                         | `accordion` `expandedChange`, `dropdown` `opened`                          | **Solved.** Named `v-model:<prop>` keeps React's prop name and adds `update:<prop>`. Any emit rename in Vue is a bug.                                                                                                                                                                                                                      |
| P2  | Overlay/portal host `<div>` stays next to the trigger while React portals to `<body>` → `extra` diffs                                                        | `accordion / With Actions`, `four-thumbnail-card`, `single-thumbnail-card` | **Should not recur.** `<Teleport to="body">` mirrors `createPortal`. If it recurs, the Teleport target/placement is wrong — fix it, do not deviate.                                                                                                                                                                                        |
| P3  | `ReactNode` props have no equivalent → bridged with `xxxText` / `xxxIcon` props                                                                              | `upload` icons, `checkbox` `prefix`/`suffix`                               | **Likely solved.** Vue slots (incl. inside render functions) cover more ground. Try the faithful mapping first; a bridge prop is a deviation.                                                                                                                                                                                              |
| P4  | `ReactNode` fields _inside a bundle object_ were unreachable                                                                                                 | `checkbox.editableInput.prefix`                                            | Re-evaluate per case; Vue can pass VNodes/render functions in a plain object, but prefer a slot.                                                                                                                                                                                                                                           |
| P5  | Ref-forwarding props have no prop form                                                                                                                       | `upload` `controllerRef` / `inputRef`                                      | Same shape: `defineExpose` + template ref. Auto-skipped by the extractor (`*Ref`).                                                                                                                                                                                                                                                         |
| P6  | React's async-returning callbacks (`onUpload` returns a promise that drives state) don't fit an event emitter                                                | `upload` split into `uploadHandler` input + `upload` output                | **Same problem in Vue** — emits are fire-and-forget. Expect the same split; keep React's handler-prop shape (a function prop) rather than forcing an emit.                                                                                                                                                                                 |
| P7  | Component-level default changed for product reasons                                                                                                          | `media-preview-modal.disableCloseOnBackdropClick`                          | Do **not** inherit Angular's changed defaults. Mirror React; if the product wants otherwise, that is a new conversation.                                                                                                                                                                                                                   |
| P8  | Extractor limits produce phantom diffs (union members not expanded; non-`onX` callback names)                                                                | `select.onChange`, `four-thumbnail-card.personalActionOnClick`             | Same extractor, same limits. Prefer improving the extractor over adding a deviation row when the code is actually correct.                                                                                                                                                                                                                 |
| P9  | React-side defects surface as diffs (props leaking to DOM attributes)                                                                                        | `select` `value="[object Object]"`                                         | Do **not** reproduce React bugs. Record the deviation and state that React is wrong.                                                                                                                                                                                                                                                       |
| P10 | Framework-only ecosystems (`react-transition-group`)                                                                                                         | `date-time-picker.fadeProps`                                               | Vue has `<Transition>`; a `fadeProps`-shaped object may be mappable. Evaluate rather than assuming a deviation.                                                                                                                                                                                                                            |
| P11 | Story args diverge where `children` isn't a prop                                                                                                             | ng Button uses `args.text` where React uses `args.children`                | Vue has the same issue (slot ≠ arg). Keep the same visible output; document the arg-name difference in the story, not as a component API.                                                                                                                                                                                                  |
| P12 | Third-party integrations block prop parity (OverlayScrollbars)                                                                                               | `dropdown` `scrollbar*` inputs                                             | Decide early per family whether Vue ports the same library; `overlayscrollbars` ships a Vue binding, so this one is avoidable.                                                                                                                                                                                                             |
| P13 | Story markup, not the component, produced most of the diffs: template engines merge adjacent text + interpolation into one text node where JSX emits several | `icon` `All` — 283 diffs, all in the story                                 | **Same trap in Vue.** Author such stories with `h()`; see SKILL.md §7. Confirmed: Vue `icon` reached 0 diffs on the first run with this approach.                                                                                                                                                                                          |
| P14 | JSX auto-converts numeric style values to px and camelCase SVG attrs to hyphenated form                                                                      | —                                                                          | Vue does neither. Write `'12px'` and `'fill-rule'` explicitly. Silent: the browser ignores `fillRule`, so the icon renders subtly wrong rather than erroring.                                                                                                                                                                              |
| P15 | — (Vue-only)                                                                                                                                                 | `badge` failed to compile for ~15 minutes                                  | An unbalanced HTML tag in a `<script setup>` comment breaks SFC parsing, reported at end-of-file with no reference to the comment. Position-dependent and invisible to `compiler-sfc.parse()`. Caught by `check-vue-comment-tags.mjs`.                                                                                                     |
| P16 | — (Vue-only)                                                                                                                                                 | every popper spec assertion that looked in `document.body`                 | The portal registry caches its two containers on first use. A spec that clears `document.body` between cases leaves the registry pointing at detached nodes, and every later teleport lands outside the document — the component looks broken while the DOM diff would have been fine. Call `resetPortals()` wherever the body is cleared. |

---

## 3. Sequencing that worked

Port in dependency order, leaves first. Every later component's parity depends on its
children already being at zero, so porting a container before its children means debugging
someone else's diffs.

1. **Foundation / leaves** — `icon`, `typography`, `separator`, `spin`, `badge`, `tag`, `skeleton`, `empty`
2. **Simple containers** — `button`, `button-group`, `card`, `description`, `breadcrumb`, `pagination`, `progress`
3. **Form controls** — `text-field`, `input`, `textarea`, `checkbox`, `radio`, `toggle`, `slider`, `upload`
4. **Overlay infrastructure** — `portal`, `backdrop`, `popper`, `transition`, `tooltip`, `modal`, `drawer`
5. **Composite overlays** — `dropdown`, `select`, `autocomplete`, `cascader`, `menu`-likes
6. **Calendar family** — `calendar`, `time-panel`, then the pickers
7. **Picker family last** — `date-picker`, `date-range-picker`, `time-picker`, `date-time-picker`, `date-time-range-picker`, `multiple-date-picker` (largest prop surfaces, and the reason the flat+bundle rule exists)
8. **Data display** — `table`, `navigation`, `tab`, `stepper`, `accordion`, thumbnail cards
9. **Service-style** — `message`, `notification-center`, `alert-banner`, `notifier`

Rationale for the tail: the picker family is where the flat+bundle hybrid rule was discovered
in the first place (`MznDateTimePicker` was the first hybrid mirror and the first 0-diff
picker). Doing it last means the rule is already muscle memory, and `calendar` / `text-field` /
`popper` are already at zero underneath.

---

## 4. Where Vue should do better than Angular

Track these explicitly — if any of them ends up as a deviation row, the port took a shortcut:

1. **No emit renames** (P1) — named `v-model` removes Angular's excuse.
2. **No portal-sibling `extra` nodes** (P2) — `Teleport` matches `createPortal`.
3. **Fewer `ReactNode` bridge props** (P3, P4) — slots are more expressive than
   `<ng-content>` because they can be passed programmatically and can be scoped.
4. **No `ng-*` class noise** — Vue injects no form-state classes, so the normalizer needs less
   masking, which means the diff is _more_ honest. Do not add masking that isn't needed.
5. **Reactivity is value-based, not zone-based** — no change-detection strategy to get wrong,
   no `OnPush` inline-literal hazard class. Inline object literals are still discouraged
   (identity churn invalidates `computed`), but they cannot cause a correctness bug.

## 5. Where Vue will be harder than Angular

1. **`<Transition>` injects its own class names** (`v-enter-from`, …) which have no React
   analogue. Either rename them to core's classes or drive classes manually. Angular had no
   equivalent trap because it used plain CSS transitions.
2. **Multi-root components** silently drop fallthrough `class`/`style` unless `$attrs` is
   bound manually — a whole class of missing-class diffs that Angular's single host element
   made impossible.
3. **SFC compilation hides the API from naive parsers.** Hence the fixed authoring rules
   (props interface in a sibling `.types.ts`, emits in named-tuple form) — they exist to keep
   the extractor simple and reliable, not for style reasons.
4. **`defineProps` type resolution is compile-time**: types must be statically analysable —
   no complex conditional/mapped types in the props interface, or the SFC compiler itself will
   reject them.
5. **Scoped-slot props are part of the public API** but invisible to a prop-name differ. Any
   scoped slot needs a documented signature in `defineSlots` and a story that exercises it.

---

## 6. Operating rhythm

```
git fetch --all → checkout vue3 → git pull
read the React component + typings + stories + mdx
write types → SFC → stories
yarn react:storybook (:6006)  +  yarn vue:storybook (:6008)
yarn parity:vue -- <component>   →  read report.txt  →  fix top diff  →  repeat
yarn check packages/vue/<component>
stuck / impossible → STOP, ask the user, only then a DEVIATIONS-VUE.md row
```

Two rules that keep this honest:

- **Never edit `packages/core`** to make a Vue diff go away. Core is shared with React and
  Angular; a core change silently changes both. It requires user approval (R2).
- **Never edit `packages/react`** to make a diff go away, except when the user has agreed that
  React has a genuine bug — and then it is a separate change with its own review.
