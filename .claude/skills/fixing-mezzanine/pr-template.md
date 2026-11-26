# PR template

English only. Omit a section only when it would be empty (say "None" for Known
limitations if you looked and found nothing).

## Title

```
fix(<component>[, <component>]): <behaviour, imperative, lower-case>
feat(<component>): <capability>
```

Examples: `fix(drawer): implement the dialog focus model (React / Vue / Angular)`,
`fix(button, table): portal tooltips out of pinned Table cells`,
`feat(table): add resizeStrategy 'grow-table'`.

Append `(#N)` to the title when the PR fixes an issue and the whole title stays within
72 characters; otherwise leave it out (the body's `Closes #N` is enough).

## Body skeleton

```markdown
Closes #<issue>

## Summary

<What the user saw, and the root cause in one or two short paragraphs.>
<Which frameworks had the defect. If one did not, say why.>

## Changes

- **core — <component>**: <what and why>
- **react — <component>**: <what and why>
- **vue — <component>**: <what and why>
- **ng — <component>**: <what and why, or "no change needed: …">

## Reviewer notes

- Behaviour change: <what consumers will notice, who is affected>
- <Anything jsdom cannot cover and how it was checked instead>

## Known limitations

- <Related bug not fixed here, and why it is separate>

## Test plan

- [x] React: `<command>` — <passed>/<total> (<n> new, failing before the fix)
- [x] Vue: `<command>` — <passed>/<total>
- [x] Angular: `<command>` — <passed>/<total>
- [x] Reverting the fix: <exactly which new tests fail>
- [x] `yarn check` on <dirs> — <result; list pre-existing errors as such>
- [x] `yarn parity:vue -- <component>` — 0 diffs
- [x] `yarn parity -- <component>` (Angular) — <n> diffs, identical to `main`
- [x] <Real-browser check and its measured result>
- [ ] <Anything not run — say so>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Use a table for measurements (timing success rates, widths) — see #520.
Use "Per package" instead of "Changes" when each framework needed a different technique.

## Reference PR (condensed from #509)

```markdown
Closes #490

## Summary

`Drawer` handled Escape but never managed focus: opening it left focus on the trigger, so Tab walked through the page behind the drawer. `Modal` already had a dialog focus model (`useFocusTrap` / `use-focus-trap` / `FocusTrapService`); `Drawer` was missed on all three platforms.

This wires the existing focus-trap utilities into `Drawer`, exactly the way each platform's `Modal` does it — no new trap logic.

## Changes

- **react — drawer**: `Slide` clones its child to inject its own ref, so the forwarded ref and the trap's container ref are composed with `useComposeRefs` (same pattern as `useModalContainer`). `role` / `aria-modal` / `tabIndex` are placed before `{...rest}`, so consumers can override them.
- **vue — drawer**: mirrors `modal-container.vue` — `useFocusTrap` + `onEntered` re-assert.
- **ng — drawer**: `FocusTrapService.trap()` inside the existing TopStack/Escape effect, released in its cleanup, as `MznModal` does.

## Reviewer notes

- Behaviour change: the open panel now has `role="dialog"` and `aria-modal="true"`, and takes focus on open.

## Known limitations

None.

## Test plan

- [x] 8 new focus-model specs per platform — all failed before the fix, pass after
- [x] React `Drawer.spec.tsx` 67/67, Vue `drawer.spec.ts` 32/32, Angular `drawer.component.spec.ts` 15/15
- [x] `yarn check` scoped to the three drawer folders: no errors in changed files (pre-existing: Vue ESLint rule matching `Drawer.stories.tsx`; ng `TS6059` rootDir errors)
- [x] `yarn parity:vue -- drawer`: 0 diffs
- [x] `yarn parity -- drawer` (Angular): 23 diffs, identical to `main`
- [ ] Manual Storybook keyboard check — not done

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
