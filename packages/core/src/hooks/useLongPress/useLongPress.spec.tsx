import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useLongPress } from './useLongPress.ts';

describe('useLongPress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is safe on server side rendering', () => {
    const onLongPress = vi.fn();
    renderHookSSR.serverOnly(() => useLongPress(onLongPress));

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should trigger onLongPress after the default delay', () => {
    const onLongPress = vi.fn();
    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress);
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button);
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should respect custom delay timing', () => {
    const onLongPress = vi.fn();
    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, { delay: 1000 });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should call onClick for short presses', () => {
    const onLongPress = vi.fn();
    const onClick = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, { onClick });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should call onLongPressEnd after a successful long press', () => {
    const onLongPress = vi.fn();
    const onLongPressEnd = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, { onLongPressEnd });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.mouseUp(button);

    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(onLongPressEnd).toHaveBeenCalledTimes(1);
  });

  it('should cancel long press on mouse leave', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress);
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button);
    fireEvent.mouseLeave(button);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should cancel long press when movement exceeds threshold', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, {
        moveThreshold: { x: 10, y: 10 },
      });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });

    fireEvent.mouseMove(button, { clientX: 20, clientY: 0 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should handle touch events', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress);
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.touchStart(button, {
      touches: [{ clientX: 0, clientY: 0 }],
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should cancel long press when X movement exceeds threshold', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, {
        moveThreshold: { x: 10 },
      });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });

    fireEvent.mouseMove(button, { clientX: 20, clientY: 0 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should cancel long press when Y movement exceeds threshold', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, {
        moveThreshold: { y: 10 },
      });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });

    fireEvent.mouseMove(button, { clientX: 0, clientY: 20 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should not cancel long press when movement is within threshold', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, {
        moveThreshold: { x: 10, y: 10 },
      });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });

    fireEvent.mouseMove(button, { clientX: 5, clientY: 5 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should not track movement when no threshold is specified', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress);
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });

    fireEvent.mouseMove(button, { clientX: 100, clientY: 100 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should not track movement when threshold object is empty', () => {
    const onLongPress = vi.fn();

    const TestComponent = () => {
      const longPressHandlers = useLongPress(onLongPress, {
        moveThreshold: {},
      });
      return (
        <button data-testid="test-button" {...longPressHandlers}>
          Press me
        </button>
      );
    };

    render(<TestComponent />);
    const button = screen.getByTestId('test-button');

    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });

    fireEvent.mouseMove(button, { clientX: 100, clientY: 100 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
