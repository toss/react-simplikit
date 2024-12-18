import '@testing-library/jest-dom';

import React, { forwardRef, MutableRefObject, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCombinedRefs } from './useCombinedRef.ts';

const Component = forwardRef<HTMLDivElement, Record<string, unknown>>((_, parentRef) => {
  const localRef = useRef<HTMLDivElement>(null);
  const combinedRef = useCombinedRefs(localRef, parentRef);

  return (
    <div ref={combinedRef} data-testid="test-div">
      Test
    </div>
  );
});

Component.displayName = 'Component';

describe('useCombinedRefs', () => {
  it('should update all refs when the ref value changes', () => {
    const parentRef = { current: null } as MutableRefObject<HTMLDivElement | null>;
    render(<Component ref={parentRef} />);

    const divElement = screen.getByTestId('test-div');

    // Assert the parentRef is updated
    expect(parentRef.current).toBe(divElement);
  });

  it('should call callback refs with the correct value', () => {
    const callbackRef = vi.fn();
    render(<Component ref={callbackRef} />);

    const divElement = screen.getByTestId('test-div');

    // Assert the callbackRef is called with the correct element
    expect(callbackRef).toHaveBeenCalledWith(divElement);
  });

  it('should handle null refs gracefully', () => {
    const parentRef = null;
    render(<Component ref={parentRef} />);

    const divElement = screen.getByTestId('test-div');

    // Assert the component renders without errors
    expect(divElement).toBeInTheDocument();
  });

  it('should handle multiple refs', () => {
    const parentRef = { current: null } as MutableRefObject<HTMLDivElement | null>;
    const callbackRef = vi.fn();
    render(
      <Component
        ref={ref => {
          callbackRef(ref);
          parentRef.current = ref;
        }}
      />
    );

    const divElement = screen.getByTestId('test-div');

    // Assert the callbackRef and parentRef are updated
    expect(callbackRef).toHaveBeenCalledWith(divElement);
    expect(parentRef.current).toBe(divElement);
  });
});
