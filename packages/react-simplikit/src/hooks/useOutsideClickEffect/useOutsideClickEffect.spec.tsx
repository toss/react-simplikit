import { useState } from 'react';
import { flushSync } from 'react-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOutsideClickEffect } from './useOutsideClickEffect.ts';

// A newly rendered container ignores clicks until the current task ends, so wait for that before clicking.
async function waitForActivation() {
  await act(() => new Promise(resolve => setTimeout(resolve, 0)));
}

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
    await waitForActivation();

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

  it('should handle multiple containers', async () => {
    const onOutsideClick = vi.fn();
    render(<MultipleContainers onOutsideClick={onOutsideClick} />);
    await waitForActivation();

    // 외부 요소 클릭
    fireEvent.click(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('container1'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('container2'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listeners', async () => {
    const onOutsideClick = vi.fn();
    const { unmount } = render(<TestComponent onOutsideClick={onOutsideClick} />);
    await waitForActivation();

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

  it('should not call callback for the click that mounted it', async () => {
    const onOutsideClick = vi.fn();

    const Popup = () => {
      const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

      useOutsideClickEffect(containerRef, onOutsideClick);

      return <div ref={setContainerRef}>Popup</div>;
    };

    const PopupTrigger = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <>
          {/* In a browser, React renders a click's update and runs its effects before the click reaches `document`.
              `flushSync` does the same here. */}
          <button data-testid="trigger" onClick={() => flushSync(() => setIsOpen(true))}>
            Open
          </button>
          {isOpen && <Popup />}
        </>
      );
    };

    render(<PopupTrigger />);

    fireEvent.click(screen.getByTestId('trigger'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    await waitForActivation();

    fireEvent.click(screen.getByTestId('trigger'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should not call callback for the click that renders the container of an already mounted hook', async () => {
    const onOutsideClick = vi.fn();

    const Menu = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

      useOutsideClickEffect(containerRef, onOutsideClick);

      return (
        <>
          <button data-testid="trigger" onClick={() => flushSync(() => setIsOpen(true))}>
            Open
          </button>
          {isOpen && <div ref={setContainerRef}>Menu</div>}
        </>
      );
    };

    render(<Menu />);
    await waitForActivation();

    fireEvent.click(screen.getByTestId('trigger'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    await waitForActivation();

    fireEvent.click(screen.getByTestId('trigger'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should call callback for an outside click that re-renders with the same containers', async () => {
    const onOutsideClick = vi.fn();

    const Counter = () => {
      const [count, setCount] = useState(0);
      const [container1Ref, setContainer1Ref] = useState<HTMLDivElement | null>(null);
      const [container2Ref, setContainer2Ref] = useState<HTMLDivElement | null>(null);

      // A new array on every render, with the same elements.
      useOutsideClickEffect([container1Ref, container2Ref], onOutsideClick);

      return (
        <>
          <button data-testid="outside" onClick={() => flushSync(() => setCount(count + 1))}>
            {count}
          </button>
          <div ref={setContainer1Ref}>Container 1</div>
          <div ref={setContainer2Ref}>Container 2</div>
        </>
      );
    };

    render(<Counter />);
    await waitForActivation();

    fireEvent.click(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('should handle null target event', async () => {
    const onOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={onOutsideClick} />);
    await waitForActivation();

    const nullTargetEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(nullTargetEvent, 'target', { value: null });

    document.dispatchEvent(nullTargetEvent);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });
});
