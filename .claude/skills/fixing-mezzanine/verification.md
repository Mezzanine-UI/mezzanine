# Verification gate

Every command below has been run on this repo. Record each result (with numbers) in the
PR's Test plan. Anything skipped is an unchecked `[ ]` item.

---

## 1. Unit tests

| Package | Targeted run (from repo root unless noted)          | Full suite        |
| ------- | --------------------------------------------------- | ----------------- |
| React   | `yarn nx test react --testPathPatterns=<Component>` | `yarn react:test` |
| Vue     | `cd packages/vue && npx vitest run <component>/`    | `yarn vue:test`   |
| Angular | `cd packages/ng && npx jest <component>/`           | `yarn ng:test`    |

- `--testPathPatterns` is a regex over the path: `Picker` also runs `DateTimePicker`,
  `DateRangePicker`… which is usually what you want for a shared hook.
- Run the **full suite** of a package when you touched shared code (`core` styles,
  `hooks/`, `utils/`, `_internal/`, a base component like `Tooltip` or `Popper`).
- Report counts: "React Picker/DateTimePicker 261/261, DateTimeRangePicker 20/20".

### Revert check (mandatory for new tests)

```bash
git stash push -- <fixed source file(s)>   # keep the new tests, drop the fix
<run the targeted tests>                    # exactly the new cases must fail
git stash pop
```

Write the outcome in the PR: which cases failed, and that nothing else did.

---

## 2. Lint and types — `yarn check`

```bash
yarn check packages/react/src/<Component>
yarn check packages/vue/<component>
yarn check packages/ng/<component>
yarn check packages/core/src/<component>
yarn check --lint-only  <dir>     # ESLint only
yarn check --types-only <dir>     # tsc only, filtered to <dir>
```

- **One run per modified directory. Never bare `yarn check`** — it defaults to `.` and
  reports hundreds of unrelated errors.
- The script finds the nearest `tsconfig.json` and filters TS errors to the target path.

---

## 3. Baseline on `main` (for anything that is not green)

Some checks are already red on `main`. Before blaming your change, measure the same
check on `main` and compare counts:

```bash
git stash            # or commit your work first
git checkout main
yarn check packages/ng/<component>      # or: yarn parity -- <component>
git checkout -       # back to your branch
git stash pop
```

Known pre-existing failures at the time of writing (re-measure — do not trust blindly):

- `yarn check packages/ng/<any>` → 6 × `TS6059` (rootDir) errors on `@mezzanine-ui/core`
  imports, in files you did not touch.
- `yarn check packages/react/src/Table` → `Table.stories.tsx` typing errors (`"body2"`).
- `yarn check packages/vue/drawer` → a Vue ESLint rule matching `Drawer.stories.tsx`.
- `yarn parity -- <component>` (Angular) → non-zero diffs on most components (story wrapper
  tags, output naming, `data-*` attributes). Pass condition is **equal to `main`**.

Report them as: "ESLint passes; TypeScript still has the 6 pre-existing `TS6059` errors,
same as `main`, unrelated to this change".

---

## 4. Parity (React is always the reference)

Start the Storybooks the harness needs (leave them running while you iterate):

```bash
yarn react:storybook   # :6006 — needed for both comparisons
yarn vue:storybook     # :6008 — for parity:vue
yarn ng:storybook      # :6007 — for parity (Angular)
```

`yarn parity` and `npm run parity` are the same script (`CLAUDE.md` uses the npm form).
The Angular comparison needs :6006 + :6007, the Vue one :6006 + :6008. Then:

```bash
yarn parity:vue -- <component>          # pass: 0 diffs
yarn parity:vue:lint-api                # pass: 0 problems
yarn parity:vue:lint-styles             # pass: 0 problems (no <style> in .vue)
yarn parity:stories                     # story scenarios aligned across frameworks
yarn parity -- <component>              # Angular: pass = same count as main (§3)
```

- Component names are the story folder names in kebab-case (`date-picker`,
  `date-range-picker`, `button`, `table`, `tooltip`).
- Reports: `tools/parity/.out-vue/<component>/report.txt` (Vue),
  `tools/parity/.out/<component>/report.txt` (Angular).
- A diff that cannot be removed for a platform reason is **not** suppressed on your own:
  stop, explain it to the user, and only after approval add a row to `DEVIATIONS-VUE.md`
  or `DEVIATIONS.md`.
- Also run parity on components that **consume** what you changed (e.g. a Tooltip change →
  also `button`, `table`, `dropdown`).

Kill them when done:

```bash
lsof -ti :6006,:6007,:6008 | xargs kill -9
```

---

## 5. Real-browser checks

Needed whenever jsdom cannot observe the bug: hit-testing, `pointer-events`, stacking
order / z-index, sticky/pinned cells, layout widths, scroll, focus across portals,
`requestAnimationFrame` / same-frame timing.

Options, in order of preference:

1. **The built-in browser pane** (or Claude in Chrome) on the running Storybook:
   open `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story` and inspect
   with JavaScript — e.g. `document.elementFromPoint(x, y)` over the tooltip,
   `getComputedStyle(el).zIndex`, `table.scrollWidth`.
2. **A throwaway Playwright script** in the session scratchpad (Playwright is already a
   root dev dependency). Never commit it. Template:

```ts
// scratchpad/check.ts — run with: npx tsx <path>/check.ts
import { chromium } from 'playwright';

const URL = 'http://localhost:6006/iframe.html?id=<story-id>&viewMode=story';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(URL);
await page.waitForSelector('<root selector>');

// Example: is the tooltip actually on top of what it overlaps?
await page.hover('<trigger selector>');
const box = await page.locator('.mzn-tooltip').boundingBox();
const topmost = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('.mzn-tooltip') !== null, [box!.x + box!.width / 2, box!.y + box!.height / 2]);
console.log({ topmost });

await browser.close();
```

3. **Timing races**: type with a fixed key interval and count successes over N runs per
   interval (0 / 5 / 10 / 16 / 30 ms). Put the before/after table in the PR (#520).

4. **Sweeps** for cross-cutting changes: iterate `http://localhost:6006/index.json`,
   open each story and assert the invariant (#528 hovered every tooltip trigger in 477
   stories).

Temporary stories needed only for a manual check are not committed; say so in the PR.

---

## 6. Test-plan wording

Write what was run and what came out, with numbers:

```markdown
## Test plan

- [x] React: `yarn nx test react --testPathPatterns=Drawer` — 67/67 (8 new, failing before the fix)
- [x] Vue: `vitest run drawer/` — 32/32
- [x] Angular: `jest drawer/` — 15/15
- [x] Reverting the fix: exactly the 8 new focus-model specs fail in each framework
- [x] `yarn check` on `packages/react/src/Drawer`, `packages/vue/drawer`, `packages/ng/drawer` — no errors in changed files (pre-existing: …)
- [x] `yarn parity:vue -- drawer` — 0 diffs
- [x] `yarn parity -- drawer` (Angular) — 23 diffs, identical to `main`
- [ ] Manual keyboard check in Storybook — not done
```
