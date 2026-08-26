import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

/**
 * jsdom ships neither of these, and components that observe their own size or
 * scroll a container throw on construction without them. Both are inert
 * stubs: jsdom reports zero-sized boxes anyway, so a real implementation
 * would deliver nothing useful.
 */
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function scrollTo(): void {};
}
