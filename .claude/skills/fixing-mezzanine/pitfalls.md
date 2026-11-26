# Pitfall catalogue

Defects and traps met while fixing Mezzanine. Each entry: **symptom → cause → fix → PR**.
Check the entries for the component family before settling on a diagnosis. Add a new
entry (next number) when a fix teaches something not listed here.

Vue-port-specific traps (P1–P19) live in
`.claude/skills/architecting-vue-components/PORTING-PLAYBOOK.md`; read it for any
`packages/vue` change.

---

## Cross-framework

### F1 — The bug exists in all three frameworks

- **Symptom:** issue mentions React only.
- **Cause:** the Vue and Angular ports copied React's logic, bugs included.
- **Fix:** search the same file/function in `packages/vue` and `packages/ng`; fix all in
  one PR, one commit per package.
- **PRs:** #509, #517, #520, #528, #531.

### F2 — A sibling component already solves it

- **Symptom:** a component lacks behaviour another one has (focus trap, portal, Escape).
- **Cause:** the feature was wired into one component and missed in its sibling.
- **Fix:** reuse the sibling's hook/service exactly (Drawer ← Modal's `useFocusTrap` /
  `use-focus-trap` / `FocusTrapService`; Table cell ← `TableHeader`'s portaled tooltip).
- **PRs:** #509, #528.

### F3 — The type allows a prop the component never forwards

- **Symptom:** passing a prop has no effect, though TypeScript accepts it.
- **Cause:** props interface `extends Omit<ChildProps, …>` but the wrapper builds its own
  `sharedProps` and drops the rest.
- **Fix:** forward explicitly, declare the prop on the interface with JSDoc stating where it
  goes. List other un-forwarded props as out of scope.
- **PR:** #531 (`DateTimeRangePicker` `inputLeftProps` / `inputRightProps`).

### F4 — A default the caller cannot override

- **Symptom:** consumer sets an attribute and it is ignored.
- **Cause:** default placed after `{...rest}` / `v-bind="$attrs"`.
- **Fix:** put defaults before the spread, with a comment explaining the ordering.
- **PRs:** #509 (`role` / `aria-modal` / `tabIndex` before `{...rest}`), #530.

---

## Input / Picker

### F5 — Regex character class instead of a literal

- **Symptom:** some letters slip through a digit-only mask.
- **Cause:** `!/[\dBackspace]/.test(key)` — the brackets match the single letters
  `B a c k s p e`.
- **Fix:** `!/^\d$/.test(key)`; test each of the 7 letters plus a modifier combo.
- **PR:** #531.

### F6 — IME swallows digits (`key="Process"`)

- **Symptom:** on Windows with a Chinese IME in Chinese mode, date fields accept no digits.
- **Cause:** keydown receives `key="Process"` / `keyCode=229`.
- **Fix:** default the mask input to `inputMode="numeric"` (overridable).
- **PR:** #530.

### F7 — Caret restored too late (same-frame keys)

- **Symptom:** fast typing drops digits or writes into the wrong cell.
- **Cause:** caret restored in `requestAnimationFrame`; the next `keydown` reads the DOM
  caret first.
- **Fix:** React `useLayoutEffect`; Vue `nextTick`; Angular write synchronously then
  re-apply after render (no zone.js). Test with keys pressed **without** a frame between.
- **Why tests missed it:** the `typeKeys` helpers waited a frame per key.
- **PR:** #520.

### F8 — Angular (zoneless) effect treats its own emit as an outside change

- **Symptom:** typed characters wiped after the component's commit comes back.
- **Cause:** the value effect cannot tell its own emission from a parent update.
- **Fix:** track the emitted value (`emittedValue`) and skip it once, clear after render.
- **PR:** #520.

### F9 — `readOnly` not honoured everywhere

- **Symptom:** a read-only AutoComplete still opens / edits / clears.
- **Cause:** `readOnly` was only passed to the `<input>`; open, clear and key handlers
  ignored it.
- **Fix:** guard every interaction path; test each one.
- **PR:** #517.

---

## Overlay / Tooltip / Portal

### F10 — In-place overlay hidden by sticky (pinned) cells

- **Symptom:** tooltip in a pinned Table column is painted under the next row.
- **Cause:** `position: sticky` + `z-index` makes each cell a stacking context.
- **Fix:** render through the portal (`disablePortal={false}`), not a bigger z-index.
- **PR:** #528.

### F11 — Portaled element closes when hovered

- **Symptom:** tooltip disappears as the pointer moves onto it.
- **Cause:** the portal layer is `pointer-events: none`; the element did not opt back in.
- **Fix:** `pointer-events: auto` in core. Only visible in a real browser.
- **PR:** #528.

### F12 — Fixed z-index inside the portal layer breaks mount order

- **Symptom:** tooltip covers the menu its own button opened.
- **Cause:** the tooltip kept `z-index: popover` while siblings in the portal layer stack
  by mount order.
- **Fix:** direct children of `.mzn-portal-default` use `z-index: auto`; nested in-place
  tooltips keep `popover`.
- **PR:** #528.

### F13 — Tooltip over an open popup trigger

- **Symptom:** hovering back on a "More actions" button covers its menu's first option.
- **Fix:** hide the tooltip title while the trigger has `aria-haspopup` + `aria-expanded="true"`
  (keep it for plain disclosure toggles). Keep the node so focus and anchor survive.
- **PR:** #528.

### F14 — Dialog-like overlay without a focus model

- **Symptom:** Tab escapes to the page behind a Drawer.
- **Fix:** focus on open (first focusable, else panel `tabindex="-1"`), Tab/Shift+Tab cycle,
  pull escaped focus back, restore on close, only the top overlay traps, `role="dialog"`
  and `aria-modal`. React: compose refs when a transition clones the child (`useComposeRefs`).
- **PR:** #509.

---

## Vue-specific

### F15 — `computed` over `slots` never updates

- **Symptom:** removing a slot does not close/hide what depends on it.
- **Cause:** `slots` is not reactive; `computed(() => !!slots.title)` caches the first value.
- **Fix:** read `slots.x` in render (or a function), mirroring React's per-render read.
- **PR:** #528.

### F16 — A declared prop disappears from `$attrs`

- **Symptom:** an attribute React puts on the host is missing in Vue (parity diff).
- **Cause:** React left the prop in `...rest`; declaring it in Vue removes it from `$attrs`.
- **Fix:** bind it back explicitly on the host.

### F17 — TS syntax in a story `template` string

- **Symptom:** a Vue story fails to mount; parity reports a `waitForFunction` timeout.
- **Cause:** story templates are compiled by the runtime compiler (plain JS).
- **Fix:** no `as` casts in story template strings.

---

## Table

### F18 — Fixed table layout redistributes leftover width

- **Symptom:** other columns shift while one column is resized.
- **Cause:** `table-layout: fixed` spreads leftover space across every column.
- **Fix:** give leftover space to one designated column (the last) when no column flexes.
- **PR:** #532.

### F19 — Angular renders right-control columns outside `columns()`

- **Symptom:** Angular's last resizable column differs from React's when `actions` exists.
- **Note:** pre-existing difference; document it, do not fix it inside an unrelated PR.
- **PR:** #532.
