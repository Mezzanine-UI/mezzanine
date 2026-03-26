import '@testing-library/jest-dom';

// Suppress known test environment noise that is not actionable:
//
// 1. react-transition-group v4 calls setState in componentDidMount which triggers
//    "not configured to support act(...)" in React 19 test environments.
//    Known incompatibility with no upstream fix available.
//    ref: https://github.com/reactjs/react-transition-group/issues/955
//
// 2. jsdom does not implement cross-origin navigation. Clicking <a href="…"> that
//    is not a hash change emits this error. It is a jsdom limitation, not a real bug.
const originalConsoleError = console.error.bind(console);
console.error = (...args: Parameters<typeof console.error>) => {
  const msg = args[0];
  // Normalize to string for matching — handles both string messages and Error objects
  const text: string =
    typeof msg === 'string'
      ? msg
      : msg != null &&
          typeof (msg as { message?: unknown }).message === 'string'
        ? (msg as { message: string }).message
        : String(msg);

  if (
    text.includes('not configured to support act') ||
    text.includes('not wrapped in act') ||
    text.includes('Not implemented: navigation')
  ) {
    return;
  }

  originalConsoleError(...args);
};

// Mock CSS imports to avoid Jest parsing errors
jest.mock('overlayscrollbars/overlayscrollbars.css', () => ({}));

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {
    // Mock implementation
  }

  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
};
