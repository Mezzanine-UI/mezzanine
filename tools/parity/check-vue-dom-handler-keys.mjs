#!/usr/bin/env node
/**
 * Static check: no React-spelled DOM handler keys in an object of props.
 *
 * Vue turns a handler key into an event name by **hyphenating** it, so a prop
 * object carrying React's `onKeyDown` registers a listener for a `key-down`
 * event that no element ever fires. Vue's own `InputHTMLAttributes` spells it
 * `onKeydown`. Single-word handlers (`onFocus`, `onClick`) are identical in
 * both frameworks, which is what makes this so easy to miss: the object works
 * for everything except the multi-word events.
 *
 * Nothing catches it otherwise — TypeScript accepts the extra property, the
 * DOM diff sees an element with the same attributes either way, and the
 * behaviour is simply absent. TimePicker shipped `onKeyDown` in its
 * `inputProps` and Enter silently stopped confirming.
 *
 * Only property *definitions* are flagged (`onKeyDown:`), not reads
 * (`attrs.onMouseOver`), which are how a component deliberately accepts both
 * spellings from its consumers.
 *
 * Usage:  node tools/parity/check-vue-dom-handler-keys.mjs
 */
import { readFileSync } from 'node:fs';
import { report, vueRoot, walk } from './vue-fs.mjs';

/**
 * DOM events whose React handler name differs from Vue's. Component emits are
 * not affected — Vue camelizes those — so only real DOM event names are here.
 */
const REACT_DOM_HANDLERS = [
  'AnimationEnd',
  'AnimationIteration',
  'AnimationStart',
  'CompositionEnd',
  'CompositionStart',
  'CompositionUpdate',
  'ContextMenu',
  'DblClick',
  'DoubleClick',
  'DragEnd',
  'DragEnter',
  'DragLeave',
  'DragOver',
  'DragStart',
  'FocusIn',
  'FocusOut',
  'KeyDown',
  'KeyPress',
  'KeyUp',
  'MouseDown',
  'MouseEnter',
  'MouseLeave',
  'MouseMove',
  'MouseOut',
  'MouseOver',
  'MouseUp',
  'PointerCancel',
  'PointerDown',
  'PointerEnter',
  'PointerLeave',
  'PointerMove',
  'PointerUp',
  'TouchCancel',
  'TouchEnd',
  'TouchMove',
  'TouchStart',
  'TransitionEnd',
  'WheelEvent',
];

const HANDLER_KEY = new RegExp(
  `(?<![.\\w])(on(?:${REACT_DOM_HANDLERS.join('|')}))\\s*:`,
  'g',
);

const files = await walk(
  vueRoot,
  (n) => n.endsWith('.vue') || n.endsWith('.ts'),
);
const problems = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');

  for (const match of src.matchAll(HANDLER_KEY)) {
    const key = match[1];
    const vueKey = `on${key.slice(2, 3)}${key.slice(3).toLowerCase()}`;

    problems.push({
      file,
      line: src.slice(0, match.index).split('\n').length,
      reason:
        `\`${key}\` is React's spelling. Vue hyphenates the key, so this ` +
        `registers for an event that never fires — write \`${vueKey}\`.`,
    });
  }
}

report('vue DOM handler key check', files.length, problems);
