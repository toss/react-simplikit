import { afterEach, describe, expect, it, vi } from 'vitest';

import { getKeyboardHeight } from './getKeyboardHeight.ts';

describe('getKeyboardHeight', () => {
  const originalVisualViewport = window.visualViewport;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'visualViewport', {
      value: originalVisualViewport,
      writable: true,
      configurable: true,
    });
  });

  it('should return 0 when visualViewport is not available', () => {
    Object.defineProperty(window, 'visualViewport', {
      value: null,
      writable: true,
      configurable: true,
    });

    expect(getKeyboardHeight()).toBe(0);
  });

  it('should return keyboard height when keyboard is visible', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);

    Object.defineProperty(window, 'visualViewport', {
      value: {
        height: 500,
        offsetTop: 0,
      },
      writable: true,
      configurable: true,
    });

    expect(getKeyboardHeight()).toBe(300);
  });

  it('should account for offsetTop in iOS behavior', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);

    Object.defineProperty(window, 'visualViewport', {
      value: {
        height: 450,
        offsetTop: 50,
      },
      writable: true,
      configurable: true,
    });

    expect(getKeyboardHeight()).toBe(300);
  });

  it('should return 0 when keyboard is not visible', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);

    Object.defineProperty(window, 'visualViewport', {
      value: {
        height: 800,
        offsetTop: 0,
      },
      writable: true,
      configurable: true,
    });

    expect(getKeyboardHeight()).toBe(0);
  });

  it('should return 0 when calculated height is negative', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);

    Object.defineProperty(window, 'visualViewport', {
      value: {
        height: 900,
        offsetTop: 0,
      },
      writable: true,
      configurable: true,
    });

    expect(getKeyboardHeight()).toBe(0);
  });
});
