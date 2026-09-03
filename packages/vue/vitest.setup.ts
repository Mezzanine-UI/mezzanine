import { enableAutoUnmount } from '@vue/test-utils';

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
