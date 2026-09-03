# Parity Tooling Contract — React ↔ Vue

> What must exist in `tools/parity/` before the first Vue component is written, and what each
> piece is responsible for. Companion to [SKILL.md](./SKILL.md) and
> [PORTING-PLAYBOOK.md](./PORTING-PLAYBOOK.md).

The existing harness is React↔Angular-specific in its wiring but framework-agnostic in its
logic. **Generalize it to a target parameter; do not fork it.** A forked copy drifts, and then
the two ports stop being comparable.

---

## 1. Current harness (React ↔ Angular)

```
tools/parity/
  compare.ts                    orchestrator: fetch both index.json, snapshot each story
                                in Playwright, diff trees, write report + exit code
  normalize.ts                  in-page snapshot routine (string-authored), STYLE_KEYS,
                                attribute/class/id normalization, argTypes reader
  api.ts                        static source-level prop/emit extraction + inheritance
                                resolution (extends / Omit / Pick / & / |)
  deviations.ts                 DEVIATIONS.md table parser → (component, story, kind) suppressions
  report.ts                     report.txt renderer
  check-ng-content-selectors.mjs   Angular-specific static lint
  check-hardcoded-tokens.mjs       core SCSS token scan (framework-agnostic, unchanged)
```

Entry points: `yarn parity -- <component>`, `yarn parity:all`, exit 0 iff every unsuppressed
diff is gone. Output under `tools/parity/.out/<component>/` (`report.txt`, `diffs.json`, plus
per-story `*.react.json` / `*.ng.json` / `*.diff.json`).

---

## 2. Required generalization

### 2.1 `compare.ts`

- Add `--target <ng|vue>` (default `ng`, so every existing invocation is unchanged).
- Target table:

  | target | URL env          | default                 | package        | out dir                 | deviations file     |
  | ------ | ---------------- | ----------------------- | -------------- | ----------------------- | ------------------- |
  | `ng`   | `PARITY_NG_URL`  | `http://localhost:6007` | `packages/ng`  | `tools/parity/.out`     | `DEVIATIONS.md`     |
  | `vue`  | `PARITY_VUE_URL` | `http://localhost:6008` | `packages/vue` | `tools/parity/.out-vue` | `DEVIATIONS-VUE.md` |

- Rename `Diff.ng` → `Diff.target` and carry the target label through to `report.ts`
  (`EXTRA (only in Angular)` → `EXTRA (only in <Target>)`). Per-story snapshot files become
  `<story>.<target>.json`.
- Keep everything else identical — the tree walk, the transition freeze, the id normalization
  and the exit-code contract are already framework-neutral.

### 2.2 `api.ts`

The React side needs **no changes**: the interface index, the `extends` / `Omit<>` / `Pick<>` /
intersection / union resolution and the sibling-safe visited-set cloning all stay. Only the
_target_ extractor is new.

- `locateVueFile(pascalName)` → `packages/vue/<kebab>/<kebab>.types.ts`, with the same
  `kebab` / de-hyphenated / plural / singular candidate list as `locateAngularFile`.
- `extractVueApi(typesFile, sfcFile)`:
  - **Props** — resolve `export interface <Pascal>Props` in the `.types.ts` through the same
    `resolveInterfaceProps` machinery (build a second index rooted at `packages/vue` +
    `packages/core/src`). This is why the props interface must live in a plain `.ts` file:
    it makes the Vue side use the _identical_ resolver as React, so an inherited-prop bug
    cannot show up on one side only.
  - **Emits** — parse `defineEmits<{ ... }>()` from the SFC and take the top-level keys of the
    type literal (named-tuple form is mandated in SKILL.md §3.3 precisely so this stays a
    depth-tracking key scan rather than a TS type checker).
  - **Skip** `update:*` emits (framework plumbing for named `v-model`).
  - Apply the existing `SKIP_PROP_NAMES` set and the `*Ref` suffix rule unchanged.
- Fail loudly, not silently: if `defineEmits` is present but not in named-tuple form, emit an
  `error` diff rather than reporting zero emits. A silently-empty extraction is the worst
  possible outcome — it reads as "parity achieved".

### 2.3 `deviations.ts`

- `loadDeviations(file)` parameterized by path. Create `DEVIATIONS-VUE.md` with the identical
  header text and table columns (`Component | Story | Kind | React | Vue | Reason | Approved`)
  so the same parser works; the parser only reads the first three cells.
- Do **not** merge the two files. React↔Angular deviations are not React↔Vue deviations, and
  inheriting Angular's compromises is exactly the failure mode to avoid.

### 2.4 `normalize.ts`

Add to `DROP_ATTR`:

- `^data-v-` — SFC scoped-style hashes. We forbid `<style>` blocks entirely (R2) so these
  should never appear; dropping them means a stray scoped style shows up as a _style_ diff
  (which is what we want to see) rather than as attribute noise on every node.

Add to the class filter (currently drops `ng-*`):

- Vue `<Transition>` classes: `v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`,
  `v-leave-active`, `v-leave-to`, and the custom-named variants
  `/-(enter|leave)-(from|active|to)$/`.
- **Do not** add masking speculatively. Vue injects no form-state classes (Angular's
  `ng-pristine` / `ng-valid` / …), so the Vue diff is naturally more honest. Every masking
  rule is a place where a real bug can hide; add one only with evidence.

`STYLE_KEYS` and the `--mzn-*` custom-property capture stay as they are.

### 2.4a Two settling hazards in `snapshotStory` — do not "simplify" these away

Both were found the hard way and both present as a hang or as phantom diffs
rather than as an error.

**Animations that never finish.** `document.getAnimations()` returns
scroll-driven animations too — OverlayScrollbars creates two on every scrollbar
handle, with computed timing expressed in percentages (`duration: "100%"`)
because progress comes from a ScrollTimeline rather than the clock. Their
`finished` promise never resolves, so awaiting it hangs the run indefinitely.
The injected `animation: none !important` does not save you: it cancels CSS
animations only, never ones created through the Web Animations API. Anything
whose computed `endTime` is not a finite number must be **cancelled**, not
awaited, and a hard cap should back that up.

**Work deferred to idle time.** Components using OverlayScrollbars' `defer`
option initialise inside `requestIdleCallback`. Whether that has run by
snapshot time depends on how busy the page is, which differs between the two
dev servers — so the _first_ story of a run reports a screenful of style and
attribute diffs that only mean "the other side had not initialised yet", while
the rest of the same component is clean. Wait for idle, then for two animation
frames.

### 2.5 Wire up the unused `argTypes` comparison

`ARGS_SOURCE` exists in `normalize.ts` but `compare.ts` never calls it, even though `CLAUDE.md`
advertises argTypes comparison. Wire it for the Vue target: read `argTypes` (name, `type`,
sorted `options`, `control.type`) and `initialArgs` for each story on both sides and emit
`args` diffs. This is what enforces R6 ("stories must be scenario-identical") at the control
level rather than just the rendered-DOM level.

---

## 3. New Vue-specific static checks

Each exists because the failure mode it catches is **invisible** to a DOM diff.

| Script                          | Fails when                                                                                                                 | Why the differ can't catch it                                                                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `check-vue-no-local-styles.mjs` | any `<style>` block in `packages/vue/**/*.vue`; any `:style` / `style=` binding containing a literal `px`/`rem`/hex colour | A local style that happens to match core's output today produces zero diff — and silently forks the design system tomorrow. Enforces **R2**.                             |
| `check-vue-emit-syntax.mjs`     | `defineEmits` not in the mandated named-tuple type form                                                                    | A malformed `defineEmits` extracts as zero emits, which reads as "no missing outputs".                                                                                   |
| `check-vue-slots.mjs`           | a `<slot name="x">` with no matching key in `defineSlots`; a declared slot never rendered                                  | The Angular analogue (`check-ng-content-selectors.mjs`) exists because an unmatched projection selector renders _nothing_, and an empty slot looks legitimate in a diff. |
| `check-vue-single-root.mjs`     | a component template with multiple root elements and no explicit `$attrs` binding                                          | Fallthrough `class`/`style` is silently dropped — the resulting missing class looks like a styling mistake, not a structural one.                                        |
| `check-story-parity.mjs`        | React and Vue story files disagree on `title` or on the set/order of exported story names                                  | Static and instant; catches the whole "missing story" class before spinning up two browsers and Playwright. Runs in seconds and should gate the slow harness.            |

`check-hardcoded-tokens.mjs` is unchanged and still applies — it scans `packages/core/src`
only, which is shared by all three frameworks.

---

## 4. Scripts to add to the root `package.json`

```jsonc
{
  "vue:storybook": "storybook dev -p 6008 -c .storybook-vue",
  "vue:build-storybook": "storybook build -c .storybook-vue -o storybook-vue-static",
  "vue:test": "nx run @mezzanine-ui/vue:test",
  "parity:vue": "tsx tools/parity/compare.ts --target vue",
  "parity:vue:all": "tsx tools/parity/compare.ts --target vue --all",
  "parity:vue:lint-styles": "node tools/parity/check-vue-no-local-styles.mjs",
  "parity:vue:lint-api": "node tools/parity/check-vue-emit-syntax.mjs && node tools/parity/check-vue-slots.mjs && node tools/parity/check-vue-single-root.mjs",
  "parity:stories": "node tools/parity/check-story-parity.mjs",
}
```

`.storybook-vue/` mirrors `.storybook-ng/`: same `global.scss` (system variables + `core.styles()`),
same `storySort` order, same aliasing of `@mezzanine-ui/{system,core,icons}` to their `src`
directories so Storybook consumes source rather than built output.

`scripts/compose-storybooks.mjs` gains a third source (`storybook-vue-static` → `/vue/`) and a
third tile on the landing page.

---

## 5. Environment-in-the-loop hook

Add a sibling to `.claude/hooks/quick-tsc.sh` for the Vue package: a `PostToolUse` hook that
runs a scoped, incremental `vue-tsc --noEmit` after any write to `packages/vue/**/*.{ts,vue}`
(skipping `*.spec.ts` / `*.stories.ts`), greps the output for the touched component directory,
and feeds errors straight back. Cache the build info under `node_modules/.cache/` to stay
inside the hook timeout, and swallow all failures — the hook must never break the session.

---

## 6. Bring-up order (before component #1)

1. `packages/vue` skeleton — `package.json`, `project.json` (Nx target), `tsconfig*.json`,
   Vite lib config, `src/public-api.ts`.
2. Test environment stood up and green on a trivial smoke spec (**R3** — the environment is not
   deferrable even though the specs are).
3. `.storybook-vue/` running on :6008 with the core stylesheet loaded and one smoke story.
4. `tools/parity` generalized to `--target` (§2) and verified: `yarn parity -- <comp>` still
   passes for Angular, `yarn parity:vue -- <comp>` runs end-to-end (even if every diff fails).
5. `DEVIATIONS-VUE.md` created, empty table.
6. Static checks (§3) written and passing on the empty package.
7. `vue-tsc` hook installed (§5).

Only then port `icon`. A harness that arrives after the components is a harness nobody trusts,
because by then there are hundreds of diffs and no way to tell which are real.
