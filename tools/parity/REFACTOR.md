# Angular Element → Attribute Selector Refactor

Progress tracker for converting all `@Component({ selector: 'mzn-xxx' })` declarations to `@Component({ selector: '[mznXxx]' })` so Angular-rendered DOM matches React at the tag level.

## 狀態圖例

- `pending` — 尚未處理
- `done` — 已 refactor + parity 驗證 + commit
- `skipped` — 平台差異無法 refactor，已記 DEVIATIONS.md
- `blocked` — 卡住待討論

## Progress

_(updated per batch, see `tools/parity/.out/summary.json` for per-run diffs)_

| Batch    | Commit      | Components | Total Before | Total After | Notes                                                             |
| -------- | ----------- | ---------- | ------------ | ----------- | ----------------------------------------------------------------- |
| baseline | `c15a7030`  | —          | 8416         | 6866        | start of refactor phase                                           |
| 1        | _(pending)_ | separator  | 6866         | ~6866       | trial; proves pipeline but separator diffs are story-side not tag |

## Session Handoff — 2026-04-08 (continuation)

### Fixed this session

- **Script boundary bug**: `rewriteConsumerText` used `<${tag}\\b` which, because `-` is non-word, matched `mzn-empty` inside `mzn-empty-main-initial-data-icon` (word→non-word boundary between `y` and `-`). Replaced `\b` with negative lookahead `(?![-\\w])` so the tag name must not be followed by another tag-name character. Verified on `empty` — sub-component tags are no longer corrupted.

### Blocker discovered on `empty` — DO NOT skip next time

Attempted `empty` (selector-only, baseline 38 diffs). Post-refactor: **577 diffs** — huge regression. Reverted. Two concerns to investigate before proceeding with any more components that have plain string input bindings:

1. **Attribute leakage**: with an attribute selector, the host becomes a real DOM element (`<div>`), so static attributes like `title="..."`, `type="..."`, `size="..."` in consumer templates end up as HTML attributes on the div. Parity sees them as `[ATTR] //div[0]@title` etc. Fix options:
   - Use `@HostBinding('attr.title')` set to `null` on each conflicting input, OR
   - Force bracket syntax in every consumer (`[title]="..."`)
   - Pick a convention before batching more components.
2. **Mystery style regression**: all descendants shifted from `rgb(1, 1, 1)` to `rgb(3, 3, 3)` and heights changed (e.g. 856→780px). The core `.mzn-empty` class selectors in `_empty-styles.scss` should match either element/attribute form. Not yet diagnosed — may be CSS variable inheritance or a second instance of core styles loading. **Diagnose first** by comparing computed-style trees on one story before batching.

Until both are understood, further refactor batches are likely to regress parity.

### Original handoff (still valid)

**Context is high.** Current session completed Phase 0 (build script) and Phase 1 trial on `separator`. Next session should resume batching.

### What exists

- `tools/parity/refactor-selector.mjs` — mechanical rewriter. Usage:

  ```
  node tools/parity/refactor-selector.mjs <comp.ts> [host-tag]
  ```

  - Rewrites `selector: 'mzn-x'` → `selector: '[mznX]'`
  - Injects `host: { '[class]': 'mzn-x' }` IF template outer wrapper has static `class="mzn-x"` (conservative — skips with WARN if anything non-trivial)
  - Updates all consumers across `packages/ng/` (opening, closing, self-closing, multi-line via `/s` flag)
  - Handles void-element hosts (`<hr>`, `<br>`, etc.) by emitting `<host />` not `<host></host>`

- `tools/parity/REFACTOR.md` — this file, progress tracker

### What the script CAN'T do (needs human)

1. **Dynamic `[class]` outer wrappers**: e.g. badge has `template: '<div [class]="containerClasses()">...</div>'`. Script doesn't lift this into host binding; must be manual.
2. **Multi-root templates**: layout has two `<div>` siblings; no single outer wrapper to collapse. Selector-only refactor is fine, but the wrappers stay as extra DOM.
3. **Template outer wrapper mismatch**: if React root ≠ Angular root tag, pick host per `Host Element Overrides` table below.
4. **Sub-component coordination**: Dropdown has DropdownItem/Status/Action/ItemCard. Refactor parent BEFORE children to avoid template references breaking, OR refactor all siblings in one batch.
5. **Host with existing bindings**: if `host: { ... }` already has `'[class]'`, script warns and skips injection — manual merge needed.

### Gotchas learned

- **Stale `.d.ts` / `.js` files reappear** across sessions (maybe IDE/ng-packagr watcher?). ALWAYS run `find packages/ng -type f \( -name '*.js' -o -name '*.d.ts' \) -not -path '*/node_modules/*' -not -path '*/dist/*' -delete` before testing.
- **Storybook HMR is unreliable for selector changes**. Restart `ng:storybook` after any batch (`kill $(ps aux | grep ng-storybook | grep -v grep | awk '{print $2}')` then `npm run ng:storybook &`).
- **Void elements (`<hr>`) reject closing tags**. Script handles this; don't "fix" the self-close output.
- **Storybook title segments affect story slug**, e.g. separator lives under `Internal/Separator` not `Data Display/Separator`. Check `curl http://localhost:6007/index.json | jq '.entries | keys[]' | grep X` before debugging "empty story".

### Next session: batching plan

**Priority 1 — high tag-diff impact, simple template**:

- `badge` (34 tag diffs, dynamic `[class]` — needs manual host class lift)
- `empty` (19)
- `text-field` (16)
- `description-content` (15, host=span per override table)

**Priority 2 — easy pure-selector (no template collapse)**:

- `separator` ✓ (done this session)
- `layout` (already has host class binding, two sub-siblings — selector-only)
- `anchor-group` (already has host class binding, template uses sub-component)
- `notifier`, `form-group`, `dropdown-status`

**Priority 3 — coordinated family refactors**:

- Dropdown family (6 components)
- Pagination family (4 components)
- Navigation family (multiple)
- Description family (title + content + group)
- Card family (base-card + group + sub-cards + thumbnail)
- Transition family (fade, slide, scale, rotate, translate, collapse — these are Directives)

### Per-batch workflow

```bash
# 1. Ensure Angular Storybook is fresh
find packages/ng -type f \( -name '*.js' -o -name '*.d.ts' \) -not -path '*/node_modules/*' -not -path '*/dist/*' -delete
kill $(ps aux | grep ng-storybook | grep -v grep | awk '{print $2}')
npm run ng:storybook &    # wait for :6007 to return 200

# 2. Refactor
node tools/parity/refactor-selector.mjs packages/ng/<comp>/<comp>.component.ts [host]

# 3. Manual fixes if script warned

# 4. Parity verify
npm run parity -- <comp>

# 5. Restart storybook if HMR suspicious, re-run parity

# 6. Commit per batch (5-10 components)
git add packages/ng tools/parity/REFACTOR.md
git commit -m "refactor(ng): convert <components> to attribute selectors"
```

## Host Element Overrides

For components where the React root element is NOT a `<div>`. Script defaults to `<div>`; these must be set explicitly.

| Component           | Host    | React Root         | Reason                    |
| ------------------- | ------- | ------------------ | ------------------------- |
| tag                 | span    | `<span>`           | inline content            |
| badge               | span    | `<span>`           | inline wrapper            |
| description-content | span    | `<span>`           | inline value              |
| description-title   | span    | `<span>`           | inline label              |
| description         | dl      | `<dl>`             | description list semantic |
| description-group   | div     | `<div>`            |                           |
| inline-message      | div     | `<div>`            | block banner              |
| navigation          | nav     | `<nav>`            | semantic landmark         |
| page-header         | header  | `<header>`         | semantic landmark         |
| page-footer         | footer  | `<footer>`         | semantic landmark         |
| section             | section | `<section>`        | semantic landmark         |
| breadcrumb          | nav     | `<nav>`            | wrapping nav              |
| anchor              | a       | `<a>`              | link                      |
| typography          | —       | varies per variant | handled per-case          |

_(list updated as components are refactored and React roots verified)_

## Known Problem Patterns

### 1. Template outer wrapper collapse

Many components render `template: '<div class="mzn-foo">...</div>'`. After attribute-selector change the host becomes `<div mznFoo>` and the inner wrapper becomes redundant. Must collapse by:

- Moving `class` to `host: { '[class]': 'hostClasses()' }`
- Removing the wrapper `<div>` from template
- Template left with just content

### 2. Class binding collision with child directives

If the component's internal `<button mznButton>` has both `[class]` host binding from the directive AND a static `class` attribute from template, they collide. Use `[class.foo]="true"` per-class bindings instead.

### 3. Self-closing tags in templates

Angular rejects `<div mznFoo />` — must be `<div mznFoo></div>`. Our perl pass must handle multi-line self-closing with `-0777` slurp mode.

### 4. Stale .js/.d.ts files

Periodic `find packages/ng -name '*.js' -o -name '*.d.ts' -delete` needed to prevent webpack from loading stale builds.
