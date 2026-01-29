import '@testing-library/jest-dom';

// Mock CSS imports to avoid Jest parsing errors
jest.mock('overlayscrollbars/overlayscrollbars.css', () => ({}));
