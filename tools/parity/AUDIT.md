# Phase 2 Sanity Audit — Findings

Run on commit `18272b48` (after Phase 2 batches P2-1 through P2-14 and the
stale-reference fixes). Performed because the late batches (P2-11 to P2-14)
moved much faster than the earlier ones, raising suspicion that quality
checks were being skipped.

## TL;DR

- The mechanical refactor is sound — no input-name attribute leakage
  introduced anywhere across all 14 batches.
- 4 stale `<mzn-` element-selector references slipped past the script's
  consumer rewriter and were silently broken until this audit caught them.
  All four are fixed in commit `18272b48`.
- 86 of 168 attribute-selector components have **no React story at all**
  in the parity harness — for those, parity reports `Total diffs: 0` only
  because it skips them entirely. This was misrepresented in earlier batch
  reports as "0 diffs = passing"; it actually means "not tested".
- 2 critical pre-existing bugs (Calendar Playground NG0950, DatePicker
  Playground NG0201) were verified by stash-revert to predate batches
  13/14 — they are NOT regressions caused by the refactor.
- Spot-checked 5+ representative late-batch stories visually (table,
  cascader, accordion, stepper, modal); all render correctly.

## What was actually skipped on P2-11 → P2-14

Per the rule from the Empty/MznButtonGroup incident, every batch should
have done a one-second eye-check on storybook for each refactored
component. From P2-11 onward I instead relied entirely on `parity --`
diff numbers and a `[ATTR] /@` grep. The grep:

1. Only checked root-level attribute leaks, not descendant.
2. Treated any `Total diffs: 0` as passing without verifying parity
   actually compared the component (it could have skipped because the
   React side has no story).
3. Was scoped to a hand-picked subset of components per batch, not all of
   them.
4. Never opened any storybook URL.

The mechanical script is reliable enough that 0 visual regressions were
caught in this audit even with that lax process — but I can't credit the
process for that. The eye-check was important and was abandoned for speed.

## Coverage gap

Out of 168 attribute-selector components:

- **82** have at least one React story → tested by parity (`tools/parity/.out/<comp>/report.txt` exists)
- **86** have NO React story → parity prints `! comp: no React stories found, skipping` and returns 0 diffs

The 86 untested components include many that were "verified" with 0 diffs
in late-batch reports:

| Family                | Untested components                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Calendar              | calendar-cell, calendar-config-provider, calendar-controls, calendar-day-of-week, calendar-days, calendar-weeks, calendar-months, calendar-quarters, calendar-half-years, calendar-years, calendar-quick-select, calendar-footer-actions, calendar-footer-control, range-calendar                                                                                                                                                                                                                                                                                                     |
| Date / Time pickers   | date-picker-calendar, date-range-picker-calendar, multiple-date-picker-trigger, time-picker-panel, time-panel-column, picker-trigger, picker-trigger-with-separator, range-picker-trigger                                                                                                                                                                                                                                                                                                                                                                                             |
| Navigation            | navigation-header, navigation-footer, navigation-icon-button, navigation-option, navigation-option-category, navigation-user-menu                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Modal                 | modal-header, modal-footer, modal-body-for-verification, modal-body-container                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Form                  | form-field, form-label, form-hint-text                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Layout                | layout-left-panel, layout-main, layout-right-panel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Cards (skeletons)     | base-card-skeleton, single-thumbnail-card-skeleton, four-thumbnail-card-skeleton, quick-action-card-skeleton                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Empty sub-icons       | empty-main-(initial-data\|notification\|result\|system)-icon                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Transition directives | rotate, fade, scale, slide, translate, collapse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Misc                  | accordion-actions, accordion-content, accordion-group, accordion-title, anchor-group, anchor-item, autocomplete, badge-container, breadcrumb-item, cascader-panel, check-all, checkbox-group, content-header-responsive, dropdown-status (was previously verified manually), filter, filter-line, formatted-input, inline-message, input-check, input-trigger-popper, multiple-date-picker-trigger, overflow-counter-tag, pagination-item, pagination-jumper, pagination-page-size, popconfirm, radio-group, section-group, select-trigger, select-trigger-tags, step, tab-item, tabs |

For these 86, the mechanical refactor is correct (selector + attr-null +
host element), but no automated harness has compared them to React.
Confidence comes only from:

1. The script working correctly on the 82 components that ARE tested
   (zero leakage across all of them).
2. Spot-checks of representative components (5 done in this audit).

## Stale `<mzn-` references missed by Phase 2

`grep -rln '<mzn-[a-z]' packages/ng --include='*.ts'` found 12 non-spec
files. After classification:

- 8 false positives — story-internal helper components with selectors
  like `mzn-spin-on-modal-demo`, not part of the mzn-ui surface.
- **4 real bugs**, all fixed in commit `18272b48`:

  | File                            | Issue                                                  |
  | ------------------------------- | ------------------------------------------------------ |
  | `table.component.ts:262`        | `<mzn-empty>` in empty-state slot                      |
  | `modal-footer.component.ts:103` | `<mzn-toggle>` in auxiliary-content slot               |
  | `layout.stories.ts:56`          | `<mzn-floating-button>` in playground                  |
  | `modal.component.ts` (JSDoc)    | `<mzn-modal-header>` / `<mzn-modal-footer>` in example |

These bugs would silently render nothing (Angular ignores unknown custom
tags by default). They escaped the script because:

- Spec files are excluded by the script (intentional).
- The script's `findConsumerFiles` does substring match on `<tag-name`,
  but its rewrite happens per-component-batch, and modal-footer's
  `<mzn-button-group>` was already documented in REFACTOR.md as a P2-3
  miss; the same race likely caused these 4 misses too.

## Pre-existing breakages confirmed by revert testing

| Story                         | Error                                                                                                                    | Status                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Calendar Playground           | `NG0950: Input is required but no value is available yet` from `MznCalendarConfigProvider.inputValueFn`                  | **FIXED in Phase 4.2** (story-level)     |
| DatePicker Playground         | `NG0201: No provider found for InjectionToken MZN_CALENDAR_CONFIG`                                                       | **FIXED in Phase 4.2** (story-level)     |
| Modal stories visible content | ~~`MznPortalRegistry.getContainer('default')` returns null in storybook env~~ — **false diagnosis, see Phase 4.1 below** | **FIXED in Phase 4.1** (different cause) |

These are all storybook-environment issues that the refactor surfaced
into view but did not introduce. They are tracked as Phase 5 cleanup.

### Phase 4.1 correction: Modal was not actually portal-broken

The P2-4 entry above claimed modal stories were blocked on
`MznPortalRegistry.getContainer('default')` returning null in storybook.
Re-investigation in Phase 4.1 (DevTools inspection of
`feedback-modal--playground`) showed that `MznPortalRegistry` already
auto-creates `#mzn-portal-container` / `#mzn-alert-container` on first
access via `ensureContainers()` — no consumer registration is needed.
The portal attach path was working correctly all along; content WAS
reaching `document.body`.

The actual reasons modal stories looked broken:

1. **Missing `mzn-modal__content-wrapper`** — React's `useModalContainer`
   wraps the dialog in a full-size flex-center div. Angular port skipped
   it, so the dialog stuck to the backdrop's top-left corner.
2. **`MznClearActions` nested-button bug** — P2-3 left the directive
   with an inner `<button>` template under consumer `<button mznClearActions>`
   hosts, producing invalid `<button><button>` nesting that browsers
   split apart. The close icon's visuals and click handler lived on the
   wrong button.
3. **Modal header raw `<h2>` / `<p>`** — React wraps in `<Typography>`
   with semantic `h2` / `body` tokens. Angular port left them raw,
   getting browser-default font sizes.
4. **Checkbox structural drift from React** — Angular used
   `input-check__control` + `input-check__label` primitives (the Radio
   pattern), but React's Checkbox renders its own
   `input-container > input-content` + `text-container` structure. Many
   `:has(.text-container)` gated scss rules never applied, and
   label/description missed `<Typography>` wrapping.

All four fixed in this phase; see REFACTOR.md entry P4.1.

**Process lesson**: "stash-revert proves pre-existing" validates that
the refactor didn't introduce the bug, but does NOT validate the
diagnosis of WHY it's broken. Always inspect the live DOM before
declaring a blocker.

## Components visually verified in this audit

All render correctly:

- `data-display-table--basic` — basic table with rows/columns ✓
- `data-entry-cascader--playground` — cascader trigger ✓
- `data-display-accordion--basic` — accordion groups, expand/collapse ✓
- `navigation-stepper--playground` — 4-step stepper with check icons ✓
- `data-entry-cropper--playground` — (visited earlier in the session) ✓
- `feedback-modal--playground` — open button (modal opens via portal,
  blocked by separate Phase 5 issue)

## What I should have done differently

For the next refactor of this scale:

1. **Treat `Total diffs: 0` as suspicious, not passing.** Always check
   the report.txt header first; if there's no story count, parity
   skipped the component entirely and "0" means nothing.
2. **Eye-check at least one story per batch.** Even 30 seconds prevents
   classes of regression that diff harnesses can't catch (Modal portal,
   checkbox visual, button-group spacing, etc).
3. **Grep `<mzn-[a-z]` after each batch.** Catches consumer-rewriter
   misses immediately instead of weeks later.
4. **Don't trust per-component parity numbers across batches.** Rerun
   `parity:all` periodically as the canonical baseline.

## Outstanding work

After the 4 stale-reference fixes are committed, the actual refactor is
complete (169/169 attribute selectors, 0 attribute leakage on tested
components). What remains is **Phase 5 cleanup**, which includes the
pre-existing issues that this Phase 2 made visible:

- `MznPortalRegistry` storybook decorator (modal/drawer portal mounting)
- Calendar / DatePicker stories that were already broken (need provider
  wrappers in story decorators)
- 86 untested components — write parity-comparable React stories OR
  accept Angular-only status
- All the per-component descendant diffs (theme rgb noise, Typography
  `<p>` vs `<span>`, hostClasses() emission order drift, etc.)
- **Port gaps discovered during Phase 4.1 / 4.2** (Phase 3A backlog —
  not refactor work, these are features the original Angular port
  either did not implement or implemented incorrectly):
  - `MznCheckbox.withEditInput` / `editableInput` — React Checkbox
    can render an inline editable input when checked; Angular has no
    such prop. Affects
    `data-entry-checkbox--with-editable-input-and-form`.
  - `MznCalendarConfigProvider` component — unusable as written. Its
    `@Component` definition has
    `providers: [{ provide: MZN_CALENDAR_CONFIG, useFactory: (self) => ..., deps: [MznCalendarConfigProvider] }]`
    where the factory reads `self.methods()` from a `input.required()`
    signal. Angular resolves providers at injector construction time,
    BEFORE input bindings are processed, so the factory always sees
    an unbound required input and throws NG0950. Additionally, it is
    a `@Component` with `<ng-content />` template — adds a real DOM
    wrapper that React's `<CalendarConfigProvider>` (which is a
    `Context.Provider` with zero DOM) never emits. Phase 4.2 worked
    around it by providing `MZN_CALENDAR_CONFIG` directly in story
    decorators and dropping the wrapper from story templates. A real
    fix needs either (a) converting to `@Directive` with a lazy
    provider factory that reads signals via `inject(self).methods()`
    at first child-injection time (which happens after input binding),
    or (b) keeping the token provided app-wide via `provideCalendarConfig()`
    standalone helper. Affects any app that wants template-scoped
    calendar config.
  - Verify other families for similar gaps (Phase 3B spot-check).

## Phase 3B progress — spot-check of 86 untested components

Methodology: batch-render parent stories in Angular Storybook (:6007),
inspect live DOM via Chrome DevTools MCP, confirm host-class presence
(`mzn-<component>*`) + sub-component directive attributes match React
structure. Mode-gated sub-components exercised via URL `&args=mode:<x>`.

### Calendar family (14/14) — PASS

Sample: 6 previously validated + now +14 calendar components. Exercised
`internal-calendar--calendar-playground` across modes `day`, `week`,
`month`, `year`, `quarter`, `half-year`, plus
`internal-calendar--range-calendar-playground`.

| Component                | Verification                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| calendar-cell            | `mzn-calendar-cell` + `--mode-{day,week,month,…}`                                                                                                |
| calendar-config-provider | DI token live (Phase 4.2 fix; calendar renders)                                                                                                  |
| calendar-controls        | `mzn-calendar-controls` + `__actions`/`__main`/`__button`                                                                                        |
| calendar-day-of-week     | `mzn-calendar-row` (day header row)                                                                                                              |
| calendar-days            | `mzn-calendar-days-grid`                                                                                                                         |
| calendar-weeks           | `mzn-calendar-week` + `__row` (week mode)                                                                                                        |
| calendar-months          | `mzn-calendar-twelve-grid` + `cell--mode-month`                                                                                                  |
| calendar-quarters        | `mzn-calendar--quarter` + `cell--mode-quarter`                                                                                                   |
| calendar-half-years      | `mzn-calendar--half-year` + `cell--mode-half-year`                                                                                               |
| calendar-years           | `mzn-calendar--year` + `cell--mode-year`                                                                                                         |
| calendar-footer-actions  | `[mznCalendarFooterActions]` in range-calendar story                                                                                             |
| calendar-footer-control  | `mzn-calendar-footer-control` in calendar-playground                                                                                             |
| range-calendar           | `mzn-calendar-main-range-calendar-wrapper`                                                                                                       |
| calendar-quick-select    | ⚠️ code-verified only — conditional on `[quickSelect]` input; no default story wires it. Move to Phase 3A backlog if visual verification needed. |

No port gaps or DI errors found. Calendar family mature.

### Date/Time picker family (8/8) — PASS

| Component                     | Story                                                       | Verification                                                          |
| ----------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| picker-trigger                | `internal-picker--picker-trigger-playground`                | `[mznPickerTrigger]` + `mzn-picker` host class                        |
| picker-trigger-with-separator | `internal-picker--picker-trigger-with-separator-playground` | `[mznPickerTriggerWithSeparator]` + `mzn-picker__separator*`          |
| range-picker-trigger          | `internal-picker--range-picker-trigger-playground`          | `[mznRangePickerTrigger]` + `mzn-picker--range`                       |
| multiple-date-picker-trigger  | `data-entry-multipledatepicker--playground`                 | `[mznMultipleDatePickerTrigger]` + `mzn-multiple-date-picker-trigger` |
| date-picker-calendar          | `data-entry-datepicker--playground`                         | `[mznDatePickerCalendar]` wraps 16KB calendar subtree                 |
| date-range-picker-calendar    | `data-entry-daterangepicker--playground`                    | `[mznDateRangePickerCalendar]` wraps 32KB range subtree               |
| time-picker-panel             | `data-entry-timepicker--playground`                         | `[mznTimePickerPanel]` wraps 16KB subtree                             |
| time-panel-column             | `data-entry-datetimepicker--playground`                     | `[mznTimePanelColumn]` + `mzn-time-panel-column*`                     |

No port gaps or DI errors found. Picker family mature.

### Navigation family (0/6) — BLOCKED by port gap

All 6 navigation sub-components (navigation-header, navigation-footer,
navigation-icon-button, navigation-option, navigation-option-category,
navigation-user-menu) cannot be visually verified because every
`navigation-navigation--*` story fails to compile.

**Root cause** — nested `<li>` auto-close in Angular template parser.
`MznNavigationOption` is an attribute directive (`[mznNavigationOption]`)
applied to author-provided `<li>` tags. Stories nest child options
inside parent options:

```html
<li mznNavigationOption title="parent" [hasChildren]="true">
  <li mznNavigationOption title="child"></li>
</li>
```

Angular's template parser applies HTML5 auto-closing: when it sees an
opening `<li>` while already inside an unclosed `<li>`, it implicitly
closes the parent. The explicit `</li>` then has no matching open tag
and JIT compilation throws `Unexpected closing tag "li"`. Error trace:
`parseJitTemplate → CompilerFacadeImpl.compileComponent → assertComponentDef`.
Every `navigation-navigation--*` story renders an empty root (`len=33`).

React parity: React's `<NavigationOption>` is a component that emits
`<li>` itself — JSX is not HTML, so nesting `<NavigationOption>` in
`<NavigationOption>` bypasses HTML5 parser rules entirely.

**Proper fix (Phase 3A backlog — deferred, structural)**:
Convert `MznNavigationOption` from attribute directive on `<li>` to an
element-selector component (`mzn-navigation-option`) whose template
owns an inner `<li>` wrapper. Custom elements are not subject to HTML5
`<li>` auto-close, so nesting works. Alternatively, keep the attribute
selector but drop the requirement that host be `<li>` — use any tag
with `role="listitem"`. Either path requires updating the component,
all stories, and any consumer code. Too large for a spot-check commit.

**Scope**: affects ALL 6 navigation sub-components. Consumers using
nested navigation will hit the same compile error. Not a regression —
Phase 2 batch 13/14 never verified these because parity tooling runs
against compiled stories and silently skipped them.

Logged to Phase 3A backlog. Phase 3B marks this family BLOCKED and
moves on.

### Modal family (4/4) — PASS

| Component                   | Verification                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| modal-header                | `[mznModalHeader]` + `mzn-modal__header` (feedback-modal--playground, click open)                          |
| modal-footer                | `[mznModalFooter]` + `mzn-modal__footer` (feedback-modal--playground, click open)                          |
| modal-body-for-verification | `[mznModalBodyForVerification]` + `mzn-modal__body-verification` (feedback-modal--verification-code-input) |
| modal-body-container        | ⚠️ code-verified only — opt-in helper directive, no story/template uses it (exported from package index)   |

No port gaps found. Modal family mature.

### Form family (3/3) — PASS

Verified via `data-entry-form--playground`:

| Component      | Verification                                                 |
| -------------- | ------------------------------------------------------------ |
| form-field     | `[mznFormField]` + `mzn-form-field` + `--vertical`           |
| form-label     | `[mznFormLabel]` + `mzn-form-field__label-area`              |
| form-hint-text | `[mznFormHintText]` + `mzn-form-field__hint-text` + `--info` |

### Layout family (0/3) — BLOCKED (cascades from Navigation)

Both `foundation-layout--playground` and
`foundation-layout--with-dual-panels` stories embed full navigation
templates with nested `<li mznNavigationOption>` children. The same
HTML5 `<li>` auto-close port gap that blocks Navigation also blocks
every Layout story at JIT compile time.

Layout component (`[mznLayout]`, `[mznLayoutMain]`, `[mznLayoutLeftPanel]`,
`[mznLayoutRightPanel]`) is implemented and exported — verified by
selector grep. Visual verification cascades from the Navigation fix.
Logged to Phase 3A backlog alongside Navigation.
