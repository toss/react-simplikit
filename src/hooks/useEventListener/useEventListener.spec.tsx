import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useEventListener } from './useEventListener.ts';

describe('useEventListener', () => {
  it('should add event listener to the element', () => {
    const fn = vi.fn();

    const TestComponent = () => {
      const ref = useEventListener('click', fn);
      return <button ref={ref}>Button</button>;
    };

    render(<TestComponent />);
    fireEvent.click(screen.getByRole('button'));

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
