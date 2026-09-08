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
  var DROP_ATTR = /^(_ngcontent|_nghost|ng-version|ng-reflect-|data-reactroot|data-v-|_)/;
  var KEEP_GENERIC = new Set(['class','role','href','type','name','value','disabled','checked','id','for','placeholder','title','alt','src','tabindex']);

  // Mezzanine uses BEM-style class names (e.g. mzn-button--base-text-link),
  // not CSS-module hashes — compare classes verbatim, only sorting tokens.
  //
  // Dropped, because they are framework plumbing with no React analogue:
  //   - \`ng-*\` (ng-pristine, ng-untouched, ng-valid, ng-dirty, ng-touched,
  //     ng-invalid, …) injected by Angular FormsModule on NgModel/NgForm hosts
  //   - Vue \`<Transition>\` state classes, both the default \`v-enter-from\`
  //     family and custom-named \`xxx-enter-active\` variants
  //
  // Nothing else is masked. Vue injects no form-state classes, so its diff is
  // naturally more honest than Angular's; every masking rule added here is a
  // place where a real bug can hide.
  var VUE_TRANSITION_CLASS = /-(enter|leave)-(from|active|to)$/;
  function normalizeClass(value) {
    return value
      .split(/\\s+/)
      .filter(function (c) {
        if (!c) return false;
        if (c.indexOf('ng-') === 0) return false;
        if (VUE_TRANSITION_CLASS.test(c)) return false;
        return true;
      })
      .sort()
      .join(' ');
  }
  // Id-reference attributes carry framework-generated, non-deterministic values
  // (React useId \`_r_0_\`/\`:r0:\`, Angular/CDK \`cdk-*\`, etc.). Their exact value
  // is meaningless across implementations — only their presence/wiring matters.
  // Collapse the value to a placeholder so a correctly-wired pair is not flagged
  // as a diff purely because the generated id strings differ.
  var ID_REF_ATTRS = new Set(['id','for','aria-controls','aria-labelledby','aria-describedby','aria-owns','aria-activedescendant']);
  // React mirrors a controlled input's value into the \`value\` *attribute*;
  // Vue's v-model and Angular's ngModel set only the DOM property. The field
  // displays identically either way — \`el.value\` agrees on every side — so the
  // attribute is an artifact of React's controlled-input model rather than a
  // difference anyone can see. Ignored on form controls only: elsewhere a
  // \`value\` attribute is still compared, which is what surfaces React leaking
  // an object onto a \`<div>\` (see the select rows in DEVIATIONS.md).
  var VALUE_ATTR_HOSTS = new Set(['input', 'textarea']);
  // The same generated ids also reach attributes that are not id references: a
  // Checkbox with no \`name\` falls back to its own generated id, on both
  // sides, so a tree option's checkbox differed only by which generator wrote
  // it. Matched on the value's shape — React's \`_r_0_\` / \`:r0:\`, Vue's
  // \`v-0\`, Angular's \`cdk-*\` — so a real name is still compared.
  var GENERATED_ID = /^(?:_r_[0-9a-z]+_|:r[0-9a-z]+:|v-[0-9]+|cdk-[0-9a-z-]*[0-9]+)$/;
  // An object URL is minted per call: it carries the page's own origin — which
  // differs by port between the two Storybooks — and a fresh uuid that is not
  // even stable between two runs of the same app. Only its presence is
  // comparable, so it collapses the way generated ids do.
  var OBJECT_URL = /^blob:/;
  function normalizeAttrs(el) {
    var out = {};
    var attrs = Array.from(el.attributes);
    var tag = el.tagName.toLowerCase();
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var name = attr.name;
      if (DROP_ATTR.test(name)) continue;
      if (name === 'value' && VALUE_ATTR_HOSTS.has(tag)) continue;
      if (!(name.indexOf('aria-') === 0 || name.indexOf('data-') === 0 || KEEP_GENERIC.has(name))) continue;
      var value = attr.value;
      if (name === 'class') value = normalizeClass(value);
      else if (ID_REF_ATTRS.has(name) && value) value = '<id>';
      else if (value && GENERATED_ID.test(value)) value = '<id>';
      else if (value && OBJECT_URL.test(value)) value = '<blob>';
      out[name] = value;
    }
    var sorted = {};
    var keys = Object.keys(out).sort();
    for (var k = 0; k < keys.length; k++) sorted[keys[k]] = out[keys[k]];
    return sorted;
  }
  // Project-prefixed CSS custom properties resolved at an element.
  function collectMznVars(cs) {
    var vars = {};
    for (var j = 0; j < cs.length; j++) {
      var name = cs[j];
      if (name && name.indexOf('--mzn-') === 0) {
        var cv = cs.getPropertyValue(name);
        if (cv) vars[name] = cv.trim();
      }
    }
    return vars;
  }
  function pickStyle(cs, ownVars) {
    var out = {};
    for (var i = 0; i < styleKeys.length; i++) {
      var key = styleKeys[i];
      var v = cs.getPropertyValue(key);
      if (v) out[key] = v.trim();
    }
    for (var name in ownVars) out[name] = ownVars[name];
    return out;
  }
  // \`inheritedVars\` is the parent's resolved \`--mzn-*\` map. Only variables an
  // element actually declares are recorded, because custom properties inherit:
  // capturing every resolved variable on every node repeated the same ~500
  // values per element and made up ~89% of a snapshot, for no added signal.
  // What matters is *where* a variable is set, and that is exactly what a
  // difference from the parent identifies.
  function walk(el, inheritedVars) {
    var cs = window.getComputedStyle(el);
    var vars = collectMznVars(cs);
    var own = {};
    for (var name in vars) {
      if (inheritedVars[name] !== vars[name]) own[name] = vars[name];
    }
    var node = { tag: el.tagName.toLowerCase(), attrs: normalizeAttrs(el), style: pickStyle(cs, own), children: [] };
    var children = Array.from(el.childNodes);
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.nodeType === 1) node.children.push(walk(child, vars));
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
  var container = root;
  var first = container.firstElementChild;
  while (first && WRAPPER_TAGS.has(first.tagName.toLowerCase()) && first.firstElementChild) {
    container = first;
    first = first.firstElementChild;
  }
  if (!first) return null;
  // Seed with the variables the snapshot root already inherits, so the root
  // node does not dump the whole \`:root\` token set either.
  var seed = collectMznVars(window.getComputedStyle(container));
  // A story with several root nodes — \`<><Toggle /><Fade>…</Fade></>\` — used
  // to be snapshotted from its first element only, so everything after it was
  // never compared: the transition stories' whole subject sat outside the
  // diff. Anything past the first root is collected under a synthetic node.
  // Single-root stories keep their exact previous shape, so their snapshots
  // and report paths do not churn.
  var roots = [];
  var rootNodes = Array.from(container.childNodes);
  for (var r = 0; r < rootNodes.length; r++) {
    var rootNode = rootNodes[r];
    if (rootNode.nodeType === 1) roots.push(walk(rootNode, seed));
    else if (rootNode.nodeType === 3) {
      var rootText = (rootNode.textContent || '').trim();
      if (rootText) roots.push({ tag: '#text', attrs: {}, style: {}, text: rootText, children: [] });
    }
  }
  // Portalled content lives outside \`#storybook-root\`: both ports append their
  // portal containers to \`document.body\`, so everything a Popper, Modal,
  // Drawer or Tooltip renders was invisible to the diff. A component whose
  // whole subject is portalled — OverflowTooltip — reported "0 diff" while
  // comparing nothing but its anchor. The containers are walked as extra
  // roots, in the order the registry creates them, and skipped when empty so
  // no story's snapshot shape changes unless it actually portals something.
  var PORTAL_CONTAINER_IDS = ['mzn-portal-container', 'mzn-alert-container'];
  for (var p = 0; p < PORTAL_CONTAINER_IDS.length; p++) {
    var portalContainer = document.getElementById(PORTAL_CONTAINER_IDS[p]);
    if (!portalContainer) continue;
    var portalNodes = Array.from(portalContainer.childNodes);
    for (var q = 0; q < portalNodes.length; q++) {
      if (portalNodes[q].nodeType === 1) roots.push(walk(portalNodes[q], seed));
    }
  }
  if (roots.length === 1) return roots[0];
  return { tag: '#roots', attrs: {}, style: {}, children: roots };
}
`;

export type StoryArgs = {
  argTypes: Record<
    string,
    {
      type: string | null;
      options: string[] | null;
      control: string | null;
      /** Whether the docgen failed to enumerate the type (see ARGS_SOURCE). */
      unresolved: boolean;
    }
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
    // Rows hidden from the Controls panel are not part of the scenario a
    // reader compares by hand. React's docgen infers option lists that Vue's
    // does not, and comparing those on a disabled row reports a difference
    // nobody can see.
    if (def && def.table && def.table.disable) continue;
    var t = def && def.type;
    var typeName = typeof t === 'string' ? t : (t && typeof t === 'object' && 'name' in t ? String(t.name) : null);
    var opts = def && Array.isArray(def.options) ? def.options.slice().sort() : null;
    var ctl = def && def.control;
    var ctlName = typeof ctl === 'string' ? ctl : (ctl && typeof ctl === 'object' && 'type' in ctl ? String(ctl.type) : null);
    // Whether the target's docgen actually enumerated the type. \`other\` is
    // what vue-component-meta reports for anything it could not follow, and a
    // union whose every member is \`other\` is the same gap one level down —
    // an inline \`'left' | 'right'\` comes back that way, so Storybook has no
    // option list to build a radio from and falls back to the object control.
    var unresolved = false;
    if (t && typeof t === 'object') {
      if (t.name === 'other') unresolved = true;
      else if (t.name === 'union' && Array.isArray(t.value) && t.value.length) {
        unresolved = t.value.every(function (member) {
          return member && member.name === 'other';
        });
      }
    }
    argTypes[name] = { type: typeName, options: opts, control: ctlName, unresolved: unresolved };
  }
  return { argTypes: argTypes, initialArgs: story.initialArgs || {} };
}
`;
