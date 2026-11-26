---
name: release-notes
description: >-
  Write Mezzanine UI release notes (one English note per bumped npm package + a
  minimal Slack umbrella summary, replied in Traditional Chinese). Use when the
  user sends "Release:" followed by a list of @mezzanine-ui/<pkg>@<version>
  entries, or says "release X.Y.Z" / "release ng rc.N" / "幫我產生 release note",
  or asks to compare versions or document changes between tags.
---

# Mezzanine UI Release Notes

This skill is checked into the repo so every machine produces **identical** output.
Follow it literally; do not improvise extra sections, styles or languages.

Supporting files (read them before writing):

| File                | Purpose                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `scripts/gather.sh` | Deterministic data collection per package (tags, commits, BREAKING markers, issues, deps)                |
| `templates.md`      | Exact skeletons: full chat reply, per-package note, umbrella summary                                     |
| `example-output.md` | A complete reference reply (core@1.4.0 / ng rc.27 / react 1.11.0 / vue rc.15) — match its shape and tone |

---

## 1. How the user triggers this skill

The user's message is usually one of these (treat all as the same request):

```
Release:
- @mezzanine-ui/core@1.4.0
- @mezzanine-ui/ng@1.0.0-rc.27
- @mezzanine-ui/react@1.11.0
- @mezzanine-ui/vue@1.0.0-rc.15
```

```
release react@1.0.4, core@1.0.4, ng rc.4
```

Normalise each entry to `@mezzanine-ui/<pkg>@<version>`:

- `ng rc.4` → `@mezzanine-ui/ng@1.0.0-rc.4` (current RC line is `1.0.0-rc.N` for `ng` and `vue`; confirm with the tag list)
- `react@1.0.4` → `@mezzanine-ui/react@1.0.4`

The listed packages are **exactly** the packages to document. Do not ask clarifying
questions — the list is complete. Do not add packages the user did not list
(e.g. `icons` / `system`) unless their tag for this cycle exists and the user listed them.

---

## 2. Workflow (always in this order)

1. **Sync tags** — tags may be missing on a fresh machine:
   ```bash
   git fetch --all --tags
   ```
2. **Gather facts** for all listed packages in one call:
   ```bash
   bash .claude/skills/release-notes/scripts/gather.sh @mezzanine-ui/core@1.4.0 @mezzanine-ui/react@1.11.0 ...
   ```
3. **Read the real changes, not just commit subjects.** For every non-trivial commit:
   ```bash
   git show <hash> --stat --format='%B'
   git show <hash> -- packages/<pkg>/<path>
   ```
   Commit subjects lie by omission: a `fix:` can add props, a `refactor:` can remove an input.
   Look at prop/input/emit interfaces, default values, JSDoc and spec names.
4. **Cross-check parity** between `react`, `ng` and `vue` (React is the reference):
   - A fix in React with no mirror commit in `ng` / `vue` → do **not** claim it in that note;
     report it in the chat as an unverified parity gap (grep the component to confirm).
   - `ng` / `vue` notes start their summary with ``Mirrors React `x.y.z`: …`` when they mirror that release.
5. **Write the reply** using `templates.md` exactly.

---

## 3. Reply structure (chat)

Chat prose is **Traditional Chinese (繁體中文)**. The release notes themselves are **English**.

1. One-paragraph 繁中 overview of the release themes (issue links in plain `#529` form are fine here).
2. A `★ Insight` block (2–3 bullets, 繁中) — non-obvious facts: opt-in vs default behaviour, root cause of a bug, what was verified vs unverified.
3. `---`
4. Per-package notes, each under a heading `### N. \`@mezzanine-ui/<pkg>@<version>\``and each wrapped in its **own four-backtick**` ```markdown ` fence (notes contain inner `` code blocks; three backticks would break copying). Separate notes with `---`.
5. `### Umbrella summary（Slack 用）` followed by the summary in a **plain** ` ``` ` fence.
6. `---` then a 繁中 `補充` section: parity gaps, semver mismatches, undeclared breaking changes, things worth telling users. Omit only if there is truly nothing to add.

### Package order

| Where                    | Order                                                |
| ------------------------ | ---------------------------------------------------- |
| Per-package notes        | `react` → `ng` → `vue` → `core` → `system` → `icons` |
| Umbrella summary bullets | `core` → `react` → `ng` → `vue` → `system` → `icons` |

Skip packages not in this release; keep the relative order.

---

## 4. Per-package note rules

### Header and summary

```markdown
## `@mezzanine-ui/react@1.11.0`

> One or two sentences: the release theme, issue links, and any ⚠️ flag.

---
```

### Sections (only those with content, in this order)

| Section                                                  | Use for                                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `### ✨ New Components`                                  | Brand-new components (bold name, 2–4 sentences, minimal code example)                                                                                                                                                                          |
| `### 🚀 Improvements`                                    | New props/inputs/types, new options, new stories worth mentioning                                                                                                                                                                              |
| `### ⚠️ Breaking Changes`                                | **Pre-release (`-rc.N`) only.** Renames/removals/behaviour that breaks callers; use a Before/After table for clean renames                                                                                                                     |
| `### ⚠️ Behaviour Changes` / `### ⚠️ Requirement change` | **Stable only**, when a release really changes visible behaviour or requirements (e.g. React 19 peer). Also add `⚠️ Visible change:` / `⚠️ Requirement change:` to the summary blockquote. Never hide these just because the version is stable |
| `### 🐛 Bug Fixes`                                       | Regressions and wrong behaviour                                                                                                                                                                                                                |
| `### 🏗 Internal`                                        | Only when it matters to consumers (build output, publish paths); otherwise skip                                                                                                                                                                |

### Bullet style

- `- **\`ComponentName\`\*\* — what changed, the prop name in backticks, and why it matters.`
- Em dash `—` after the bold name. Active voice ("adds", "fixes", "now …").
- One bullet per logical change; group changes to the same component.
- Explain bug root causes in one clause when it helps (e.g. a regex character class matching single letters).
- State verification scope honestly: "verified on Windows 11 + Edge; other IMEs and browsers are unverified".
- Default unchanged? Say so: "The default `'preserve-table-width'` is unchanged."
- Nested option lists (`- \`'value'\` — …`) are fine for union values.
- Include one usage example per new option, in the framework's syntax:
  - react: ` ```tsx ` `<Table … resizeStrategy="grow-table" />`
  - ng: ` ```html ` attribute-selector components, e.g. `<div mznTable … resizeStrategy="grow-table"></div>`
  - vue: ` ```vue ` kebab-case props, e.g. `<MznTable … resize-strategy="grow-table" />`
- Angular outputs are de-prefixed vs React (`onChange` → `(change)`); Vue uses named `v-model:<prop>` — describe them in each framework's own terms.

### Links

- GitHub issues: `([#529](https://github.com/Mezzanine-UI/mezzanine/issues/529))` — in the summary and/or the relevant bullet.
- Core-driven changes inside a framework note: append `*(via core@1.4.0)*` and describe the effect from the consumer's view.
- The `core` note stays at class / mixin / token / type level (e.g. `.mzn-table__…`, `TableResizeStrategy` exported from `@mezzanine-ui/core/table`).

### Footer

Framework notes (`react`, `ng`, `vue`) end with a Compatibility line built from `gather.sh` output (exact versions of `@mezzanine-ui/*` deps, plus the framework peer):

| Package               | Compatibility line                                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| react                 | ``**Compatibility**: requires `react` ≥ 19, `react-dom` ≥ 19, `@mezzanine-ui/core` ≥ X, `@mezzanine-ui/system` ≥ X, `@mezzanine-ui/icons` ≥ X`` |
| ng                    | ``**Compatibility**: requires `@mezzanine-ui/core` ≥ X, `@mezzanine-ui/system` ≥ X, `@mezzanine-ui/icons` ≥ X, `@angular/cdk` ≥ 21.0.0``        |
| vue                   | ``**Compatibility**: requires `vue` ≥ 3.5, `@mezzanine-ui/core` ≥ X, `@mezzanine-ui/system` ≥ X, `@mezzanine-ui/icons` ≥ X``                    |
| core / system / icons | no Compatibility line                                                                                                                           |

Re-read peer ranges from `gather.sh` every time; update the table above if they change.

Every note ends with:

```markdown
**Full Changelog**: https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/<pkg>@<prev>...@mezzanine-ui/<pkg>@<new>
```

`<prev>` is the previous tag printed by `gather.sh` (semver-aware: `rc.9 < rc.10 < 1.0.0`).

---

## 5. Special cases

| Situation                                                                    | What to do                                                                                                                                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package has no commits (pure bump)                                           | Short note: summary "Compatibility release: aligns with `core@x` …"; describe any downstream core effect that actually applies (verify it applies to this framework's implementation) |
| `core` changed + framework bumped                                            | Describe the effect in each framework note with `*(via core@x)*`; keep the `core` note type/class level                                                                               |
| Only `core` bumped                                                           | One `core` note; say framework users get it with their next framework release                                                                                                         |
| BREAKING footer on a commit but version is stable/minor                      | Don't add a Breaking section; add ⚠️ Requirement/Behaviour change section and tell the user in 補充 that semver was arguably not followed (once, without relitigating)                |
| Breaking change found in the diff with no BREAKING marker                    | Put it under ⚠️ Breaking Changes (RC) / ⚠️ Behaviour Changes (stable) and point it out in 補充                                                                                        |
| `feat`-level additions shipped under `fix:` in a patch                       | Document them as Improvements; mention the semver mismatch in 補充                                                                                                                    |
| First release of a package (no previous tag, or previous was a test publish) | Write it as the first public release; for `vue`, `1.0.0-rc.0` was a test publish so `rc.1` was the first public RC                                                                    |
| Tag missing                                                                  | Run `git fetch --all --tags`; if still missing, tell the user instead of guessing                                                                                                     |

---

## 6. Umbrella summary (Slack)

Plain text only — no mrkdwn, no markdown, no emoji, no descriptions:

```
Mezzanine UI Release
• @mezzanine-ui/core@1.4.0
• @mezzanine-ui/react@1.11.0
• @mezzanine-ui/ng@1.0.0-rc.27
• @mezzanine-ui/vue@1.0.0-rc.15

版本紀錄：https://github.com/Mezzanine-UI/mezzanine/releases
Demo：https://storybook.mezzanine-ui.org/
```

- Title is literally `Mezzanine UI Release`.
- Bullet character is `•` (U+2022); one line per package, name and version only.
- One blank line, then the two link lines exactly as above (full-width colon `：`, bare URLs).
- Nothing after the links. No dates, RC labels, ⚠️, "no breaking changes", upgrade notes, `---`.
- Produce it whenever ≥ 2 packages ship; for a single package, still include it (same format).

---

## 7. Tone

- Audience: app developers consuming the package, not maintainers.
- Be specific (prop names, values, scenarios); never "improved behaviour".
- 1–3 sentences per bullet.
- Never claim something you did not verify in the diff; say "unverified" instead.
- Do not repeat this skill's rules back to the user; just deliver the reply.
