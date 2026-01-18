import { afterEach, describe, expect, it, vi } from 'vitest';

import { getKeyboardHeight } from './getKeyboardHeight.ts';
import { isKeyboardVisible } from './isKeyboardVisible.ts';

vi.mock('./getKeyboardHeight.ts', () => ({
  getKeyboardHeight: vi.fn(),
}));

const mockGetKeyboardHeight = vi.mocked(getKeyboardHeight);

describe('isKeyboardVisible', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when keyboard height is greater than 0', () => {
    mockGetKeyboardHeight.mockReturnValue(300);

    expect(isKeyboardVisible()).toBe(true);
  });

  it('should return false when keyboard height is 0', () => {
    mockGetKeyboardHeight.mockReturnValue(0);

    expect(isKeyboardVisible()).toBe(false);
  });

  it('should call getKeyboardHeight internally', () => {
    mockGetKeyboardHeight.mockReturnValue(0);

    isKeyboardVisible();

    expect(mockGetKeyboardHeight).toHaveBeenCalledTimes(1);
  });

  describe('edge cases', () => {
    it('should return true for small keyboard height', () => {
      mockGetKeyboardHeight.mockReturnValue(1);

      expect(isKeyboardVisible()).toBe(true);
    });

    it('should return true for large keyboard height', () => {
      mockGetKeyboardHeight.mockReturnValue(500);

      expect(isKeyboardVisible()).toBe(true);
    });
  });
});
