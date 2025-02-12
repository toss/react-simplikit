import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useThrottle } from './useThrottle.ts';

describe('useThrottle', () => {
  it('should call throttle cancel when unmount', () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useThrottle(callback, 50));

    const cancel = vi.spyOn(result.current, 'cancel');

    unmount();

    expect(cancel).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
