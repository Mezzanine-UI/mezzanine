/**
 * In-page DOM/style normalization helpers.
 *
 * The snapshot routine is defined as a string and shipped to the browser
 * via Playwright's `evaluate(handle, ...)` so it runs in the page context
 * with `window` / `document` available. Keep this file framework-free.
 */

export type NormalizedNode = {
  tag: string;
  attrs: Record<string, string>;
  style: Record<string, string>;
  text?: string;
  children: NormalizedNode[];
};

export const STYLE_KEYS: readonly string[] = [
  'display',
  'position',
  'box-sizing',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'color',
  'background-color',
  'background-image',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-transform',
  'text-decoration-line',
  'opacity',
  'visibility',
  'overflow-x',
  'overflow-y',
  'flex-direction',
  'flex-wrap',
  'justify-content',
  'align-items',
  'align-content',
  'gap',
  'grid-template-columns',
  'grid-template-rows',
  'transform',
  'transition-property',
  'cursor',
  'pointer-events',
  'z-index',
];

/**
 * Snapshot routine that runs inside the browser via
 * `page.evaluate(SNAPSHOT_SOURCE, styleKeys)`.
 *
 * Authored as a string (not a TypeScript function) so that tsx/esbuild does
 * not inject helpers like `__name` that would be undefined in the browser
 * context once Playwright serializes the function across the bridge.
 */
export const SNAPSHOT_SOURCE = `
(styleKeys) => {
  var DROP_ATTR = /^(_ngcontent|_nghost|ng-version|ng-reflect-|data-reactroot|_)/;
  var KEEP_GENERIC = new Set(['class','role','href','type','name','value','disabled','checked','id','for','placeholder','title','alt','src','tabindex']);

  // Mezzanine uses BEM-style class names (e.g. mzn-button--base-text-link),
  // not CSS-module hashes — compare classes verbatim, only sorting tokens.
  // Drop \`ng-*\` classes (ng-pristine, ng-untouched, ng-valid, ng-dirty,
  // ng-touched, ng-invalid, etc.) injected by Angular FormsModule when an
  // element has an NgModel/NgForm directive — they have no React analogue.
  function normalizeClass(value) {
    return value
      .split(/\\s+/)
      .filter(function (c) { return c && c.indexOf('ng-') !== 0; })
      .sort()
      .join(' ');
  }
  function normalizeAttrs(el) {
    var out = {};
    var attrs = Array.from(el.attributes);
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var name = attr.name;
      if (DROP_ATTR.test(name)) continue;
      if (!(name.indexOf('aria-') === 0 || name.indexOf('data-') === 0 || KEEP_GENERIC.has(name))) continue;
      var value = attr.value;
      if (name === 'class') value = normalizeClass(value);
      out[name] = value;
    }
    var sorted = {};
    var keys = Object.keys(out).sort();
    for (var k = 0; k < keys.length; k++) sorted[keys[k]] = out[keys[k]];
    return sorted;
  }
  function pickStyle(el) {
    var cs = window.getComputedStyle(el);
    var out = {};
    for (var i = 0; i < styleKeys.length; i++) {
      var key = styleKeys[i];
      var v = cs.getPropertyValue(key);
      if (v) out[key] = v.trim();
    }
    // Also capture project-prefixed CSS custom properties (variables)
    // resolved at this element. Both sides must expose the same tokens.
    for (var j = 0; j < cs.length; j++) {
      var name = cs[j];
      if (name && name.indexOf('--mzn-') === 0) {
        var cv = cs.getPropertyValue(name);
        if (cv) out[name] = cv.trim();
      }
    }
    return out;
  }
  function walk(el) {
    var node = { tag: el.tagName.toLowerCase(), attrs: normalizeAttrs(el), style: pickStyle(el), children: [] };
    var children = Array.from(el.childNodes);
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.nodeType === 1) node.children.push(walk(child));
      else if (child.nodeType === 3) {
        var t = (child.textContent || '').trim();
        if (t) node.children.push({ tag: '#text', attrs: {}, style: {}, text: t, children: [] });
      }
    }
    return node;
  }

  var root = document.querySelector('#storybook-root') || document.body;
  if (!root) return null;
  // Skip framework wrappers (e.g. Angular's <storybook-root>) to align both sides.
  var WRAPPER_TAGS = new Set(['storybook-root']);
  var first = root.firstElementChild;
  while (first && WRAPPER_TAGS.has(first.tagName.toLowerCase()) && first.firstElementChild) {
    first = first.firstElementChild;
  }
  if (!first) return null;
  return walk(first);
}
`;

export type StoryArgs = {
  argTypes: Record<
    string,
    { type: string | null; options: string[] | null; control: string | null }
  >;
  initialArgs: Record<string, unknown>;
};

/**
 * In-page argTypes/initialArgs reader. Authored as a string for the same
 * reason as SNAPSHOT_SOURCE — avoid esbuild helpers leaking into the browser.
 */
export const ARGS_SOURCE = `
async (storyId) => {
  var preview = window.__STORYBOOK_PREVIEW__;
  if (!preview) return null;
  var store = preview.storyStoreValue || preview.storyStore;
  if (!store) return null;
  var story = null;
  try { story = await store.loadStory({ storyId: storyId }); }
  catch (e) { return null; }
  if (!story) return null;
  var argTypes = {};
  var defs = story.argTypes || {};
  var names = Object.keys(defs);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    if (name === 'children') continue;
    var def = defs[name];
    var t = def && def.type;
    var typeName = typeof t === 'string' ? t : (t && typeof t === 'object' && 'name' in t ? String(t.name) : null);
    var opts = def && Array.isArray(def.options) ? def.options.slice().sort() : null;
    var ctl = def && def.control;
    var ctlName = typeof ctl === 'string' ? ctl : (ctl && typeof ctl === 'object' && 'type' in ctl ? String(ctl.type) : null);
    argTypes[name] = { type: typeName, options: opts, control: ctlName };
  }
  return { argTypes: argTypes, initialArgs: story.initialArgs || {} };
}
`;
