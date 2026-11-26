---
name: fixing-mezzanine
description: >-
  End-to-end workflow for fixing a bug or adding a small cross-framework feature
  in Mezzanine UI (core / React / Vue / Angular): branching from main, finding
  the same defect in every framework, TDD with a revert check, the verification
  gate (scoped yarn check, unit tests, parity, real-browser checks), per-package
  commits and the English PR format. Use when the user asks to fix an issue
  ("修 #123", "fix issue 517", "修正 mezzanine 的 …"), reports a component bug,
  asks to add a prop across React/Vue/Angular, or asks how to verify, commit or
  open a PR for such a change.
---

# Fixing Mezzanine UI

This skill is checked into the repo so every machine fixes Mezzanine the **same way**.
Follow it literally. It distils the method behind PRs #509–#532.

Supporting files (read the relevant one before that phase):

| File              | Purpose                                                               |
| ----------------- | --------------------------------------------------------------------- |
| `verification.md` | Every verification command, baseline comparison, real-browser recipes |
| `pitfalls.md`     | Catalogue of defects seen before (symptom → cause → fix → PR)         |
| `pr-template.md`  | Exact PR title/body skeleton plus a full reference PR                 |

Related mandatory specs (read when the change touches that package):

- `packages/vue/**` → `.claude/skills/architecting-vue-components/` (SKILL, PORTING-PLAYBOOK, PARITY-TOOLING)
- `packages/ng/**` → `.claude/skills/architecting-angular-components/SKILL.md`
- Repo `CLAUDE.md` (props a-z, JSDoc rules, CSS Module Level 4, tokens over px)

---

## 0. Language and scope

- **Reply to the user in Traditional Chinese (繁體中文).** Code, comments, JSDoc, commit
  messages, branch names, PR titles and PR bodies are **English**.
- Scope: bug fixes **and** small features that land in several frameworks at once
  (e.g. #532 `resizeStrategy`, #524 `fullWidth`). Differences for a feature are marked
  **[feat]** below.
- Never merge a PR, never enable auto-merge. The user reviews.
- For Mezzanine this skill supersedes any machine-local `git-monorepo` or
  `language-preference` skill; when they disagree, follow this file.

---

## 1. Start

```bash
git fetch --all
git checkout main && git pull
git checkout -b fix/<area>-<short-description>[-<issue>]
```

- **Always branch from `main`** — Vue and Angular fixes too. `packages/vue` and
  `packages/ng` live on `main`. Never branch from `vue3` or a feature branch.
- Branch names: `fix/drawer-focus-trap-490`, `fix/picker-stale-caret`,
  `fix/button-icon-only-tooltip-portal`. **[feat]** `feat/table-grow-table-resize-strategy`.
- Read the issue: `gh issue view <n> --comments`.
- **Reproduce before touching code** — in a unit test, or in Storybook when the bug is
  visual or about timing (see `verification.md` §5).

---

## 2. Diagnose

Work through these in order. Each one has caught real defects before.

1. **Find the same code in every framework.** An issue that names React almost always
   applies to Vue and Angular too (#509, #517, #520, #528, #531). Locate the matching
   files:
   - React `packages/react/src/<Component>/`
   - Vue `packages/vue/<component>/` (kebab-case)
   - Angular `packages/ng/<component>/` (kebab-case; some names differ, e.g. `autocomplete`)
   - Shared styles and types `packages/core/src/<component>/`

   Find exact folder names with `ls packages/vue packages/ng packages/core/src | grep -i <name>`.
   Also check which component owns the behaviour: an overlay in `Select` is rendered by
   `Dropdown` / `Popper`, so the fix may belong there. Tests live next to the source:
   React `<Component>.spec.tsx`, Vue `<component>.spec.ts`, Angular
   `<name>.component.spec.ts`.

   Fix every framework that has the defect in **one branch and one PR**. If a framework
   is not affected, say so in the PR and why (e.g. "Angular already appends the tooltip
   to `document.body`").

2. **Reuse what a sibling already does.** Before writing new logic, find the component
   that already solves it and copy the pattern: Drawer reused Modal's
   `useFocusTrap` / `use-focus-trap` / `FocusTrapService`; Table's ellipsis tooltip
   reused `TableHeader`'s portal. State in the PR that no new mechanism was added.
3. **Put shared styling in core.** CSS fixes go in `packages/core/src/**`
   (React/Vue/Angular all consume it); framework packages change behaviour only.
4. **Know what jsdom cannot see.** Hit-testing, `pointer-events`, stacking/z-index,
   layout widths, and `requestAnimationFrame` timing races need a real browser
   (`verification.md` §5). Unit tests then pin the behaviour through DOM attributes.
5. **Ask why the existing tests missed it**, and write the answer in the PR (e.g. the
   `typeKeys` helpers wait a frame between keys, skipping the race window — #520).
6. Check `pitfalls.md` for the component's family before settling on a cause.

---

## 3. Implement (TDD)

1. **Write the failing test first** in every affected framework, run it, and see it fail
   for the expected reason.
2. Implement the minimal fix. Run the tests until green.
3. **Revert check:** temporarily undo the fix (`git stash push -- <source files>`, keeping
   the new tests), re-run, and confirm **exactly the new tests** fail. Restore. Record it in
   the Test plan ("Reverting the fix: exactly the 7 `B a c k s p e` cases fail").
4. Follow the repo rules:
   - Props sorted a-z, no `any`, every prop has English JSDoc (`@default` where relevant).
   - React / Vue / Angular stay **prop-for-prop mirrors** of React. Vue never adds
     `<style>`. Angular exposes both flat and bundle inputs when React does.
   - SCSS: semantic tokens from `@mezzanine-ui/system`, no hard-coded px, CSS Module
     Level 4 syntax (native nesting, logical properties).
   - A default the caller may override goes **before** the spread / `v-bind`, with a
     comment saying why (#530/#531).
5. **[feat]** order: core union type with per-value JSDoc (one `- 'value' —` line per
   member, see `CLAUDE.md`) → React prop + story → Vue mirror + story → Angular input +
   story. Stories must be scenario-identical across the three Storybooks. Update
   `packages/react/COMPONENTS.md` when a component's public API changes.
6. **Scope discipline.** A related but different bug found on the way goes into the PR's
   "Known limitations / Out of scope" section, not into this branch — unless the fix
   cannot work without it (then explain, as #520 did for the Angular `emittedValue` bug).

---

## 4. Verify

Run the gate in `verification.md`. Minimum, for every change:

| Check          | Command                                                         | Pass condition                        |
| -------------- | --------------------------------------------------------------- | ------------------------------------- |
| React unit     | `yarn nx test react --testPathPatterns=<Component>`             | all green                             |
| Vue unit       | `cd packages/vue && npx vitest run <component>/`                | all green                             |
| Angular unit   | `cd packages/ng && npx jest <component>/`                       | all green                             |
| Lint + types   | `yarn check <dir>` — **one per modified directory, never bare** | no new errors vs. `main`              |
| Vue parity     | `yarn parity:vue -- <component>`                                | 0 diffs                               |
| Vue static     | `yarn parity:vue:lint-api && yarn parity:vue:lint-styles`       | 0 problems                            |
| Angular parity | `yarn parity -- <component>`                                    | diff count **identical to `main`**    |
| Real browser   | Storybook + Playwright (`verification.md` §5)                   | when the bug is visual / timing / hit |

Rules:

- **Never run bare `yarn check`** — it checks the whole repo and floods with
  pre-existing errors.
- Errors that exist on `main` are not yours: measure the baseline on `main` first
  (`verification.md` §3) and report them as pre-existing in the PR.
- Run the full suite of a package when the change touches shared code (core styles,
  hooks, `_internal`).
- Kill every Storybook you started: `lsof -ti :6006,:6007,:6008 | xargs kill -9`.
- Anything not run is reported as an unchecked `[ ]` item. Never claim a check that
  did not happen.

---

## 5. Commit

One commit **per package**, in this order: `core` → `react` → `vue` → `ng`. Within a
package, split further when two components change for unrelated reasons.

```
<type>(<package>/<component>): <imperative, lower-case description>
```

| Directory          | Scope    |
| ------------------ | -------- |
| `packages/core/`   | `core`   |
| `packages/react/`  | `react`  |
| `packages/vue/`    | `vue`    |
| `packages/ng/`     | `ng`     |
| `packages/icons/`  | `icons`  |
| `packages/system/` | `system` |

- Types: `fix`, `feat`, `docs`, `refactor`, `test`, `chore`.
- Component part is the folder name in kebab-case: `fix(react/date-time-range-picker)`,
  `fix(core/tooltip)`, `fix(ng/picker)`.
- Describe the behaviour, not the code:
  - `fix(react/picker): restore the caret before the next key arrives`
  - `fix(vue/button): portal the icon-only tooltip`
  - `feat(core/table): add TableResizeStrategy type`
- Append the issue when there is one: `fix(vue/auto-complete): honour readOnly prop (#517)`.
- Comment-only or doc follow-ups get their own `docs(<pkg>/<component>): …` commit.
- Stage files explicitly (`git add <paths>`), never `git add -A`.
- End each message with the `Co-Authored-By` line the current harness asks for.

---

## 6. Pull request

Use `pr-template.md` exactly. Essentials:

- Title: `fix(<component>[, <component>]): <behaviour>` — e.g.
  `fix(button, table): portal tooltips out of pinned Table cells`.
- Body in English, sections in this order: `Closes #N` → **Summary** (root cause, which
  frameworks were affected) → **Changes** / **Per package** → **Reviewer notes**
  (behaviour changes consumers will notice) → **Known limitations** / **Out of scope** →
  **Test plan** (checklist with real numbers).
- Quantify when you can (#520's Playwright success-rate table, #532's measured widths).
- Push with `git push -u origin <branch>`, create with `gh pr create --base main`.
- Do not merge. Hand the link to the user.

---

## 7. Definition of done

- [ ] Branched from fresh `main`
- [ ] Every affected framework fixed, or the PR says why it is not affected
- [ ] New tests fail without the fix, pass with it (revert check done)
- [ ] `yarn check` clean for each modified directory (only pre-existing errors remain)
- [ ] Unit tests green in each touched package
- [ ] `parity:vue` 0 diffs; Angular parity equal to `main` baseline
- [ ] Real-browser check done when jsdom cannot see the bug
- [ ] Storybooks killed
- [ ] One commit per package, conventional scope, English
- [ ] PR follows `pr-template.md`; unrun checks marked `[ ]`
