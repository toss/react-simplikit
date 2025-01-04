import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOutsideClickEffect } from './useOutsideClickEffect.ts';

describe('useOutsideClickEffect', () => {
  const TestComponent = ({ onOutsideClick }: { onOutsideClick: () => void }) => {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

    useOutsideClickEffect(containerRef, onOutsideClick);

    return (
      <div data-testid="wrapper">
        <div data-testid="outside">Outside Element</div>
        <div ref={setContainerRef} data-testid="container">
          <button data-testid="inside">Inside Element</button>
        </div>
      </div>
    );
  };

  const MultipleContainers = ({ onOutsideClick }: { onOutsideClick: () => void }) => {
    const [container1Ref, setContainer1Ref] = useState<HTMLDivElement | null>(null);
    const [container2Ref, setContainer2Ref] = useState<HTMLDivElement | null>(null);

    useOutsideClickEffect([container1Ref, container2Ref], onOutsideClick);

    return (
      <div data-testid="wrapper">
        <div data-testid="outside">Outside Element</div>
        <div ref={setContainer1Ref} data-testid="container1">
          Container 1
        </div>
        <div ref={setContainer2Ref} data-testid="container2">
          Container 2
        </div>
      </div>
    );
  };

  it('should call callback when clicking outside', async () => {
    const onOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.click(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when clicking inside', () => {
    const onOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.click(screen.getByTestId('container'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('inside'));
    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('should handle multiple containers', () => {
    const onOutsideClick = vi.fn();
    render(<MultipleContainers onOutsideClick={onOutsideClick} />);

    // 외부 요소 클릭
    fireEvent.click(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('container1'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('container2'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listeners', () => {
    const onOutsideClick = vi.fn();
    const { unmount } = render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.click(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    unmount();

    fireEvent.click(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should handle null containers', () => {
    const onOutsideClick = vi.fn();
    const NullContainer = () => {
      useOutsideClickEffect(null, onOutsideClick);
      return <div data-testid="target">Test</div>;
    };

    render(<NullContainer />);

    fireEvent.click(screen.getByTestId('target'));
    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('should handle empty containers', () => {
    const onOutsideClick = vi.fn();

    const EmptyContainers = () => {
      useOutsideClickEffect([], onOutsideClick);
      return <div data-testid="target">Test</div>;
    };

    render(<EmptyContainers />);

    fireEvent.click(screen.getByTestId('target'));
    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('should handle null target event', () => {
    const onOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={onOutsideClick} />);

    const nullTargetEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(nullTargetEvent, 'target', { value: null });

    document.dispatchEvent(nullTargetEvent);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });
});
