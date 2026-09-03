import { config, enableAutoUnmount } from '@vue/test-utils';

/**
 * jsdom ships neither of these, and components that observe their own size or
 * scroll a container throw on construction without them. Both are inert
 * stubs: jsdom reports zero-sized boxes anyway, so a real implementation
 * would deliver nothing useful.
 *
 * Ported from `packages/ng/jest.setup.ts` — the Angular-specific zone.js and
 * TestBed bootstrapping has no Vue equivalent and is deliberately omitted.
 */
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
}

if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function scrollTo(): void {};
}

/**
 * Unmount every wrapper after each test, the way React Testing Library's
 * `cleanup` does for the React suite.
 *
 * Without it a mounted component simply stays mounted, which is invisible
 * until a component holds module-level state: the scroll lock counts nested
 * locks, so backdrops left mounted by earlier tests keep the count above zero
 * and the body never unlocks. The component was fine; the suite was leaking.
 */
enableAutoUnmount(afterEach);

/**
 * Render real transitions.
 *
 * `@vue/test-utils` stubs `Transition` by default, which renders the child but
 * runs none of the JS hooks — so a transition that never fires looks exactly
 * like one that works. That is how MznFade shipped without ever applying an
 * opacity: every assertion was about the element being there, and the stub
 * always put it there.
 */
config.global.stubs.transition = false;
config.global.stubs['transition-group'] = false;
