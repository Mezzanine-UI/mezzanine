import '@testing-library/jest-dom';

// Mock CSS imports to avoid Jest parsing errors
jest.mock('overlayscrollbars/overlayscrollbars.css', () => ({}));

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
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
