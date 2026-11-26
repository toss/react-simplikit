/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { useOutsideClickRef } from './useOutsideClickRef.ts';

describe('useOutsideClickRef SSR environment', () => {
  it('should be safe on server side rendering', () => {
    const onOutsideClick = vi.fn();

    function Component() {
      const ref = useOutsideClickRef({ onOutsideClick });

      return createElement('div', { ref }, 'Inside');
    }

    expect(typeof window).toBe('undefined');
    expect(renderToString(createElement(Component))).toBe('<div>Inside</div>');
    expect(onOutsideClick).not.toHaveBeenCalled();
  });
});
