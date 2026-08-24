import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;

// Cleanup after each test for @testing-library/react
afterEach(() => {
  cleanup();
});
