/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { useDoubleClick } from './useDoubleClick.ts';

describe('useDoubleClick SSR environment', () => {
  it('should be safe on server side rendering', () => {
    const click = vi.fn();
    const doubleClick = vi.fn();

    function Button() {
      const handleEvent = useDoubleClick({ click, doubleClick });

      return createElement('button', { onClick: handleEvent }, 'Test Button');
    }

    expect(typeof window).toBe('undefined');
    expect(renderToString(createElement(Button))).toBe('<button>Test Button</button>');
    expect(click).not.toHaveBeenCalled();
    expect(doubleClick).not.toHaveBeenCalled();
  });
});
