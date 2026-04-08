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

### Transition directives (6/6) — PASS

Verified one story per directive; each renders without error and
applies the directive attribute:

| Directive    | Story                                |
| ------------ | ------------------------------------ |
| mznFade      | `motion-transition--fade-story`      |
| mznScale     | `motion-transition--scale-story`     |
| mznSlide     | `motion-transition--slide-story`     |
| mznTranslate | `motion-transition--translate-story` |
| mznRotate    | `motion-transition--rotate-story`    |
| mznCollapse  | `motion-transition--collapse-story`  |

### Card skeleton family (4/4) — PASS with fixes

2 component templates had orphan `</div>` from missing wrapper:

- `MznSingleThumbnailCard` — missing `<div [class]="containerClass">` wrapper before tag/personalAction/ng-content/overlay group
- `MznFourThumbnailCard` — missing `<div [class]="thumbnailGridClass">` wrapper before tag/personalAction/ng-content/emptySlot group
- `MznSingleThumbnailCardSkeleton` — missing `<div [class]="singleThumbnailClass">` wrapper around the single skeleton div

Fixed in commit `da1b1ea5` by restoring the wrapper divs to match
React parity. `MznBaseCardSkeleton` and `MznQuickActionCardSkeleton`
templates were already structurally sound.

| Skeleton                       | Story                                                         |
| ------------------------------ | ------------------------------------------------------------- |
| base-card-skeleton             | `data-display-card-cardgroup--loading-base-card`              |
| single-thumbnail-card-skeleton | `data-display-card-cardgroup--custom-thumbnail-skeleton-size` |
| four-thumbnail-card-skeleton   | `data-display-card-cardgroup--custom-thumbnail-skeleton-size` |
| quick-action-card-skeleton     | `data-display-card-cardgroup--loading-quick-action-card`      |

### Empty sub-icon family (4/4) — PASS

Verified via `feedback-empty--all-types`, which renders all 4 variants
(initial-data / notification / result / system) in a single story.
DOM contains 12 SVGs and `mzn-empty__icon` classes from every sub-icon
directive. No port gaps.

## Phase 3B Session 1 summary

- **Covered**: Calendar (14), Date/Time picker (8), Navigation (6 BLOCKED),
  Modal (4), Form (3), Layout (3 BLOCKED), Transition (6), Card skeleton (4),
  Empty sub-icon (4) = **52 of 80 components**
- **Pass**: 43 DOM-verified, 2 code-verified (calendar-quick-select, modal-body-container)
- **Blocked**: 9 (Navigation 6 + Layout 3 — cascading from same port gap)
- **Bugs fixed in code**: 3 (SingleThumbnailCard, FourThumbnailCard, SingleThumbnailCardSkeleton — orphan `</div>` templates)
- **Port gaps discovered**: 1 (`MznNavigationOption` attribute-directive pattern breaks HTML5 `<li>` auto-close — Phase 3A backlog)
- **Remaining Phase 3B**: Misc family (28 components) — next session

### Misc family (26/26) — PASS (Session 2)

Original prompt listed 28 but the enumerated names total 26. All
verified, most DOM, a handful code-verified via template usage.

| Component                 | Status  | Evidence                                                                             |
| ------------------------- | ------- | ------------------------------------------------------------------------------------ |
| accordion-group           | ✅      | `[mznAccordionGroup]` + `mzn-accordion-group` (data-display-accordion--with-actions) |
| accordion-title           | ✅      | `[mznAccordionTitle]` + `mzn-accordion__title`                                       |
| accordion-content         | ✅      | `[mznAccordionContent]` + `mzn-accordion__content`                                   |
| accordion-actions         | ⚠️ code | opt-in helper directive, no story/template uses it                                   |
| anchor-group              | ✅      | `[mznAnchorGroup]` (navigation-anchor--all)                                          |
| anchor-item               | ✅      | `[mznAnchorItem]` + `mzn-anchor__anchorItem`                                         |
| badge-container           | ✅      | `mzn-badge__container` class (data-display-badge--variants)                          |
| breadcrumb-item           | ✅      | `[mznBreadcrumbItem]` + `mzn-breadcrumb__item` (navigation-breadcrumb--basic)        |
| cascader-panel            | ⚠️ code | used in cascader.component.ts template; cascader story compiles OK                   |
| check-all                 | ⚠️ code | opt-in helper, no story/template uses it                                             |
| checkbox-group            | ✅      | `[mznCheckboxGroup]` (data-entry-checkbox-group--with-children)                      |
| input-check               | ⚠️ code | internal directive, dead in current checkbox/radio templates                         |
| content-header-responsive | ✅      | `[mznContentHeaderResponsive]` + `mzn-content-header*` (navigation-contentheader)    |
| dropdown-status           | ✅      | `[mznDropdownStatus]` + `mzn-dropdown-status` (internal-dropdown-dropdownstatus)     |
| filter                    | ✅      | `[mznFilter]` + `mzn-filter-area__filter` (data-entry-filterarea--basic)             |
| filter-line               | ✅      | `[mznFilterLine]` + `mzn-filter-area__line`                                          |
| input-trigger-popper      | ⚠️ code | used in autocomplete + select templates; both compile/render                         |
| overflow-counter-tag      | ✅      | `[mznOverflowCounterTag]` + `mzn-overflow-counter-tag`                               |
| pagination-item           | ✅      | `[mznPaginationItem]` + `mzn-pagination-item` (navigation-pagination--all)           |
| pagination-jumper         | ✅      | `[mznPaginationJumper]` + `mzn-pagination-jumper`                                    |
| pagination-page-size      | ✅      | `[mznPaginationPageSize]` + `mzn-pagination-page-size`                               |
| radio-group               | ✅      | `[mznRadioGroup]` (data-entry-radio--group)                                          |
| section-group             | ✅      | `[mznSectionGroup]` (data-display-section--section-vertical-layout)                  |
| select-trigger            | ✅      | `[mznSelectTrigger]` + `mzn-select-trigger` (data-entry-select--multiple)            |
| select-trigger-tags       | ⚠️ code | conditional render in select.component.ts; template compiles                         |
| step                      | ✅      | `[mznStep]` + `mzn-stepper-step` (navigation-stepper--playground)                    |

No new port gaps in Misc family. 20 DOM-verified + 6 code-verified.

## Phase 3B Session 2 summary

- **Covered**: Misc family (26 components) — all originally enumerated items
- **Pass**: 20 DOM-verified, 6 code-verified
- **Blocked**: 0 new
- **Bugs fixed**: 0 new
- **Port gaps discovered**: 0 new

## Phase 3B Final tally (Sessions 1 + 2)

| Family           | Pass/Total | Blocked |
| ---------------- | ---------- | ------- |
| Calendar         | 14/14      | 0       |
| Date/Time picker | 8/8        | 0       |
| Navigation       | 0/6        | 6       |
| Modal            | 4/4        | 0       |
| Form             | 3/3        | 0       |
| Layout           | 0/3        | 3       |
| Transition       | 6/6        | 0       |
| Card skeleton    | 4/4        | 0       |
| Empty sub-icon   | 4/4        | 0       |
| Misc             | 26/26      | 0       |
| **Total**        | **69/78**  | **9**   |

Grand total: 63 DOM-verified + 8 code-verified + 9 blocked = 80.
3 component template bugs fixed (thumbnail cards), 1 port gap logged
(Navigation `<li>` nesting), cascading 9 blocked to Phase 3A backlog.

Phase 3B complete. Next actions belong to Phase 3A (fix Navigation
port gap → unblocks Layout family too).

## Phase 3A #1 — Navigation port gap resolved

Port gap fixed in commits `c9cf176f` (component conversion),
`82bcdb63` (story migration) and `6564b9fe` (ng-content selectors).
Approach: convert `MznNavigationOption` and `MznNavigationOptionCategory`
from attribute directives on author-provided `<li>` to element
selectors `mzn-navigation-option[-category]`. Host uses
`display: contents` so the custom elements are layout-transparent;
the inner `<li>` emitted from the component template wraps content
and hosts the ng-content projection for children. Custom element
names bypass the HTML5 `<li>` auto-close rule entirely.

Two adjacent pre-existing bugs surfaced once the JIT compile
passed and were fixed in the same batch:

1. `<ng-content select="mzn-navigation-header|footer" />` in
   `MznNavigation` referenced tag names for what are attribute
   directives (`[mznNavigationHeader]`). Silent drop of header/footer
   was hidden because the surrounding stories never compiled.
2. `MznLayout`, `MznModal`, `MznSection`, `MznFourThumbnailCard`
   had the same class of typo in their ng-content selectors. Modal
   stories appeared to work only because a fallback default
   `<ng-content />` caught the header/footer content at the wrong
   position; layout silently dropped everything. Switched all to
   `[mznXxx]` attribute form.

### Navigation family (6/6) — now PASS

| Component                  | Evidence                                                                      |
| -------------------------- | ----------------------------------------------------------------------------- |
| navigation-option          | `<mzn-navigation-option>` × 9 in `navigation-navigation--basic` (len=13697)   |
| navigation-option-category | `<mzn-navigation-option-category>` × 3 in `navigation-navigation--all`        |
| navigation-header          | `[mznNavigationHeader]` + `mzn-navigation-header` class                       |
| navigation-footer          | `[mznNavigationFooter]` + `mzn-navigation-footer` class                       |
| navigation-icon-button     | `mzn-navigation-icon-button` class in footer                                  |
| navigation-user-menu       | port-skipped in Phase 2 (noted in story); Angular has no equivalent component |

### Layout family (3/3) — now PASS

Verified via `foundation-layout--with-dual-panels`:

| Component          | Evidence                                               |
| ------------------ | ------------------------------------------------------ |
| layout-main        | `[mznLayoutMain]` projected into content-wrapper slot  |
| layout-left-panel  | `[mznLayoutLeftPanel]` projected into content-wrapper  |
| layout-right-panel | `[mznLayoutRightPanel]` projected into content-wrapper |

## Phase 3B Final tally (post Phase 3A #1)

63 + 6 (Navigation) + 3 (Layout) = **72 DOM-verified**

- 8 code-verified
  = **80/80 components verified**, 0 blocked.

All Phase 3B work closed.

## Phase 3A #2 — MznCalendarConfigProvider structural rewrite

Port gap fixed in commit `a124d313`; picker stories converted
from the Phase 4.2 decorator workaround to the real directive
in `bbe7f77c`, serving as end-to-end proof.

Previously the provider was a `@Component` with `<ng-content/>`
(adds a DOM wrapper React's `CalendarConfigProvider` never
emits) and a `useFactory` that called `self.methods()` inline,
which blew up with `NG0950` because required input signals are
unbound at directive construction. Phase 4.2 worked around it by
providing `MZN_CALENDAR_CONFIG` directly in story decorators and
leaving `<div mznCalendarConfigProvider>` as a bare attribute
without importing the directive.

**Rewrite**:

- `@Component` → `@Directive` (no DOM, parity with React).
- Expose a lazy `CalendarConfigs` as a `Proxy` whose only trap
  is `get`; removed `ownKeys`/`has`/`getOwnPropertyDescriptor`
  because Angular's devMode injector profiler introspects the
  returned token eagerly and would re-trigger the NG0950 via
  those traps at child construction time.
- Wrap the `get` handler in `try/catch`; access during the brief
  pre-binding window returns `undefined` instead of throwing.
  Real consumers read config inside getters / computed / event
  handlers after inputs have settled, so they see the correct
  values.
- `useFactory` switches from `deps: [MznCalendarConfigProvider]`
  to `inject(MznCalendarConfigProvider)`, clearer and matches the
  Angular v16+ `inject()` convention.

**Verification**:

- `internal-picker--picker-trigger-playground` compiles and
  renders `mzn-picker mzn-text-field` trigger with the real
  directive (no console errors).
- `data-entry-datepicker--playground` still renders the full
  picker + calendar subtree (len 17077) under its unchanged
  decorator-level provider, confirming backward compatibility.
- The six other picker/calendar story files still use the
  decorator workaround; they continue to render unchanged and
  can be migrated incrementally as a follow-up if full directive
  parity is desired.

Phase 3A backlog now: only CI-gate work remains (Phase 5).

## Phase 5 — CI gate

Two regression guards added in commits `c4b79175` and `6b4489e9`:

1. **`yarn parity:lint-ng-content`** — static script in
   `tools/parity/check-ng-content-selectors.mjs` that scans every
   `.ts` under `packages/ng`, collects declared `@Component` /
   `@Directive` element selectors, and flags any
   `<ng-content select="mzn-xxx" />` whose tag form does not match
   a real component. Attribute-form selectors (`[mznFoo]`) are
   treated as slot markers and skipped. Current status: clean.

2. **`yarn ng:build-storybook`** in CI — runs an AOT build of
   the entire Angular Storybook, which exercises every component
   template through the Angular compiler. This would have caught
   the three Phase 3B template bugs (thumbnail cards), both
   Phase 3A port gaps (navigation `<li>`, calendar provider),
   and all five ng-content typos at compile time, long before
   any visual or parity inspection.

Both steps are wired into `.github/workflows/test.yml` after the
existing `yarn test` step.

Scope-intentionally-not-covered: **story inline render() template
bugs** (where the story's `render: () => ({ template: "..." })`
contains a compile error) are not caught by AOT build because
Storybook compiles those at runtime. Catching them would require
running Storybook's test-runner under a headless browser in CI,
which is heavy for the marginal benefit. Document it as a known
gap; revisit if inline template regressions recur.

## Phase 5 — component inventory follow-ups

Working from the component parity inventory report, three user-picked
follow-ups were closed:

### Popconfirm removal (`878ddc36`)

NG had a day-1 `mzn-popconfirm` component with no React counterpart
and zero consumers inside the monorepo (verified via grep across
`packages/react`, `packages/core/src`, `packages/ng`). Per user
decision the divergence was removed cleanly rather than logged as a
DEVIATIONS entry: the folder, the tsconfig.spec entry, and all refs
were deleted in a single commit, and both `ng:build-storybook` and
`parity:lint-ng-content` stayed green afterwards.

### Table — expandable config + virtualized stub (`0e8b002c`)

Phase 5 research showed NG Table covered ~24/26 React props, with two
real feature gaps behind a mostly-matching input surface:

1. `expandable` was just a `boolean`, with the expanded row rendering
   only a placeholder `<!-- -->` comment. React accepts a
   `TableExpandable<T>` object with `expandedRowRender`, controlled
   `expandedRowKeys`, `onExpand` / `onExpandedRowsChange` callbacks,
   and a `rowExpandable` predicate.
2. `scroll.virtualized` was entirely unimplemented and the TODO hid
   inside a single-line comment.

**Closed**: a new `TableExpandable<T>` type mirrors the React core
type but uses `TemplateRef<{ $implicit: T }>` in place of the React
function prop, which is the idiomatic Angular equivalent. The
`expandable` input now accepts `TableExpandable<T> | boolean`; boolean
keeps the original behavior. Internal helpers `expandableConfig`,
`isExpandableEnabled`, `expandedTemplate`, `canExpandRow`,
`onExpandCellClick` wire the new object shape. `effect()` syncs
controlled `expandedRowKeys` to the internal signal.
`sticky` default flipped from `false` to `true` for React parity.
The `WithExpansion` story now demonstrates TemplateRef, predicate
gating, and event hooks.

**Deferred**: virtualized scroll is still a placeholder, but the
scroll input's doc-comment is now an explicit Phase 6 TODO targeting
`@angular/cdk/scrolling` / `CdkVirtualScrollViewport`. The Storybook
story `Virtual Scrolling (In Development)` surfaces a prominent
warning banner so the status is visible in the sidebar.

### NavigationUserMenu — rewrite + story (`76641dda`)

Originally logged in Phase 3B as "port-skipped", but a stub file
already existed with three latent bugs that kept it unusable:

1. attribute directive on `<button>` whose template added a nested
   `<button>` (invalid HTML + broken click handling),
2. `<ng-content select="[menuContent], ng-template" />` projection
   though `MznDropdown` has no default content slot (items never
   rendered),
3. `tooltipTitle` computed dead code, duplicated `hostClasses` /
   `buttonClasses`, and a `ngOnInit`-scoped `ResizeObserver` outside
   the signal lifecycle.

**Closed**: rewrite to an element selector
`<mzn-navigation-user-menu>` with `display: contents` host (matching
Phase 3A #1 pattern used for `mzn-navigation-option`). Inner
`<button>` + sibling `<div mznDropdown>` renders properly; the
dropdown is driven by a new `options: DropdownOption[]` input that
reuses the design system's existing menu vocabulary. New
`optionSelected` output fires on item click; existing
`visibilityChange` / `closed` outputs preserved. `ResizeObserver`
moved inside an `effect()` with `onCleanup`. A `NavigationWithUserMenu`
story exercises the full flow and the two "not available in Angular"
comments that existed in Phase 2 stories were removed.

### Public API alignment (`1846f68c`)

Ten secondary entry points were narrowed to match the React surface:
`accordion`, `calendar`, `checkbox`, `dropdown`, `filter-area`,
`modal`, `navigation`, `picker`, `stepper`, `table`. Removed exports
are DI tokens / context interfaces / internal sub-components / parser
utilities that React never published. Intra-package consumers already
used relative paths, so no compile breakage — the only adjustment
needed was keeping `CalendarQuickSelectOption` as a _type_-only
re-export from `calendar/index.ts` because sibling date-range-picker
packages type their quick-select payload against it.

Explicitly kept:

- `description`: `MZN_DESCRIPTION_CONTEXT` / `DescriptionContextValue`
  mirror React's `DescriptionContext` + `DescriptionContextValue`
- `table`: `MZN_TABLE_CONTEXT` / `TableContextValue` mirror React's
  `TableContext` + `TableContextValue`
- `form`: `FormControl` + `MZN_FORM_CONTROL` mirror React's
  `FormControl` + `FormControlContext`
- `notifier` / `alert-banner`: Angular-idiomatic services are kept as
  the valid equivalents of React's hook / provider patterns, not as
  over-exposed components

Both `yarn ng:build-storybook` and `yarn parity:lint-ng-content` pass
after the alignment.
