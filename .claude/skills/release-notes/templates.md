# Release Note Templates

Copy these skeletons exactly. `{…}` are placeholders; delete any section that has no content.

---

## A. Full chat reply

`````text
{繁中一段：這版的主題，例如「這版有兩個主題：…」，可用條列列出 1–3 個主題，issue 可寫 #529}

`★ Insight ─────────────────────────────────────`
- {繁中：預設行為是否改變 / opt-in 與否}
- {繁中：某個 bug 的根本原因}
- {繁中：哪些有驗證、哪些沒驗證}
`─────────────────────────────────────────────────`

---

### 1. `@mezzanine-ui/react@{version}`

````markdown
{per-package note — template B}
````

---

### 2. `@mezzanine-ui/ng@{version}`

````markdown
{per-package note — template B}
````

---

### 3. `@mezzanine-ui/vue@{version}`

````markdown
{per-package note — template B}
````

---

### 4. `@mezzanine-ui/core@{version}`

````markdown
{per-package note — template C}
````

---

### Umbrella summary（Slack 用）

```
{template D}
```

---

補充：

- **{主題}**：{繁中說明：parity 缺口、semver 不一致、未宣告的 breaking change、值得對外說的事}
`````

---

## B. Framework package note (react / ng / vue)

````markdown
## `@mezzanine-ui/{pkg}@{version}`

> {One or two sentences. ng/vue: "Mirrors React `{reactVersion}`: …". Issue links like ([#529](https://github.com/Mezzanine-UI/mezzanine/issues/529)). Stable releases with real visible/requirement changes add "⚠️ Visible change: …" / "⚠️ Requirement change: …".}

---

### ✨ New Components

**`{ComponentName}`**
{2–4 sentences: purpose, key behaviour, accessibility.}

```tsx
import { {ComponentName} } from '@mezzanine-ui/react';

<{ComponentName} {prop}="{value}" />
```

### 🚀 Improvements

- **`{Component}`** — {What changed, prop in backticks, why it matters. Say when the default is unchanged.}

  ```tsx
  {one-line usage example in this framework's syntax}
  ```

### ⚠️ Breaking Changes

| What changed        | Before  | After   |
| ------------------- | ------- | ------- |
| {`Component` input} | {`old`} | {`new`} |

### 🐛 Bug Fixes

- **`{Component}`** — {Symptom, short root cause, what happens now. State verification scope if limited.}

### 🏗 Internal

- {Only consumer-relevant internal changes.}

---

**Compatibility**: requires {framework peer}, `@mezzanine-ui/core` ≥ {x}, `@mezzanine-ui/system` ≥ {x}, `@mezzanine-ui/icons` ≥ {x}

**Full Changelog**: https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/{pkg}@{prev}...@mezzanine-ui/{pkg}@{version}
````

Notes:

- `⚠️ Breaking Changes` only for `-rc.N` versions. Stable uses `⚠️ Behaviour Changes` / `⚠️ Requirement change`.
- Framework peer: react → `` `react` ≥ 19, `react-dom` ≥ 19, `` (placed first); ng → `` , `@angular/cdk` ≥ 21.0.0`` (placed last); vue → `` `vue` ≥ 3.5, `` (placed first).

### Pure version bump variant

```markdown
## `@mezzanine-ui/{pkg}@{version}`

> Compatibility release: aligns with `@mezzanine-ui/core@{coreVersion}`. No API changes.

---

### 🚀 Improvements

- **`{Component}`** — {effect of the core change on this framework} _(via core@{coreVersion})_

---

**Compatibility**: …

**Full Changelog**: …
```

Drop the Improvements section if the core change does not affect this framework (verify first).

---

## C. Core / system / icons note

```markdown
## `@mezzanine-ui/core@{version}`

> {One sentence: what was added/changed at the style/type level, with issue link.}

---

### 🚀 Improvements

- **`{area}`** — {New type/class/mixin/token, where it's exported from, union values listed as nested bullets.}

### 🐛 Bug Fixes

- **`{area}`** — {`.mzn-…` class / token change.}

---

**Full Changelog**: https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/core@{prev}...@mezzanine-ui/core@{version}
```

No Compatibility line for core / system / icons.

---

## D. Umbrella summary

```
Mezzanine UI Release
• @mezzanine-ui/core@{version}
• @mezzanine-ui/react@{version}
• @mezzanine-ui/ng@{version}
• @mezzanine-ui/vue@{version}

版本紀錄：https://github.com/Mezzanine-UI/mezzanine/releases
Demo：https://storybook.mezzanine-ui.org/
```
