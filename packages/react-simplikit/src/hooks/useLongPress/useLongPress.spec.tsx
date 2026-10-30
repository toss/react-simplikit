import { type PointerEvent as ReactPointerEvent } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useLongPress } from './useLongPress.ts';

// jsdom 25 has no PointerEvent (jsdom 27+ ships one). Testing Library would otherwise
// construct a plain Event and drop pointerId, button, and client coordinates.
installPointerEventPolyfill();

type PointerInit = {
  pointerId?: number;
  button?: number;
  buttons?: number;
  isPrimary?: boolean;
  pointerType?: string;
  clientX?: number;
  clientY?: number;
};

type PressTargetProps = {
  onLongPress: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onClick?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onLongPressEnd?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  delayMs?: number;
  moveThreshold?: { x?: number; y?: number };
};

function PressTarget({ onLongPress, onClick, onLongPressEnd, delayMs, moveThreshold }: PressTargetProps) {
  const handlers = useLongPress(onLongPress, { delayMs, onClick, onLongPressEnd, moveThreshold });

  return (
    <button type="button" data-testid="test-button" {...handlers}>
      Press me
    </button>
  );
}

function pointerInit(overrides: PointerInit = {}): PointerInit {
  return {
    pointerId: 1,
    button: 0,
    buttons: 1,
    isPrimary: true,
    pointerType: 'mouse',
    clientX: 0,
    clientY: 0,
    ...overrides,
  };
}

function createCallbacks() {
  return {
    onLongPress: vi.fn(),
    onClick: vi.fn(),
    onLongPressEnd: vi.fn(),
  };
}

async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

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

  it('should trigger onLongPress after the default delay', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget onLongPress={callbacks.onLongPress} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());
    expect(callbacks.onLongPress).not.toHaveBeenCalled();

    await advance(500);

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onLongPress.mock.calls[0]?.[0]).toMatchObject({
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
    });
  });

  it('should handle press and release without onClick and onLongPressEnd options', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());
    fireEvent.pointerUp(button, pointerInit());
    expect(onLongPress).not.toHaveBeenCalled();

    fireEvent.pointerDown(button, pointerInit());
    await advance(500);
    fireEvent.pointerUp(button, pointerInit());

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should respect custom delay timing', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} delayMs={1000} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());

    await advance(800);
    expect(onLongPress).not.toHaveBeenCalled();

    await advance(200);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should call onClick for short presses', () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());
    fireEvent.pointerUp(button, pointerInit());

    expect(callbacks.onClick).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick.mock.calls[0]?.[0]).toMatchObject({ pointerId: 1, pointerType: 'mouse' });
    expect(callbacks.onLongPress).not.toHaveBeenCalled();
  });

  it('should call onLongPressEnd after a successful long press', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());
    await advance(500);
    fireEvent.pointerUp(button, pointerInit());

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onLongPressEnd).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick).not.toHaveBeenCalled();
  });

  it('should cancel a pending long press on pointer leave', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());
    fireEvent.pointerLeave(button, pointerInit());

    await advance(500);

    expect(callbacks.onLongPress).not.toHaveBeenCalled();
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onLongPressEnd).not.toHaveBeenCalled();

    fireEvent.pointerUp(button, pointerInit());
    expect(callbacks.onClick).not.toHaveBeenCalled();

    fireEvent.pointerDown(button, pointerInit());
    fireEvent.pointerUp(button, pointerInit());
    expect(callbacks.onClick).toHaveBeenCalledTimes(1);
  });

  it('ends an active long press when the pointer leaves', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());
    await advance(500);
    fireEvent.pointerLeave(button, pointerInit());
    fireEvent.pointerUp(button, pointerInit());

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onLongPressEnd).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick).not.toHaveBeenCalled();
  });

  it('cancels a pending press on pointercancel without calling onClick', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerType: 'touch' }));
    await advance(100);
    fireEvent.pointerCancel(button, pointerInit({ pointerType: 'touch' }));
    await advance(500);
    fireEvent.pointerUp(button, pointerInit({ pointerType: 'touch' }));

    expect(callbacks.onLongPress).not.toHaveBeenCalled();
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onLongPressEnd).not.toHaveBeenCalled();

    fireEvent.pointerDown(button, pointerInit({ pointerType: 'touch' }));
    fireEvent.pointerUp(button, pointerInit({ pointerType: 'touch' }));
    expect(callbacks.onClick).toHaveBeenCalledTimes(1);
  });

  it('ends an active long press on pointercancel and ignores the following pointerup', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerType: 'touch' }));
    await advance(500);
    fireEvent.pointerCancel(button, pointerInit({ pointerType: 'touch' }));
    fireEvent.pointerLeave(button, pointerInit({ pointerType: 'touch' }));
    fireEvent.pointerUp(button, pointerInit({ pointerType: 'touch' }));

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onLongPressEnd).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick).not.toHaveBeenCalled();
  });

  it('should cancel long press when movement exceeds threshold', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} moveThreshold={{ x: 10, y: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 20, clientY: 0 }));
    await advance(500);
    fireEvent.pointerUp(button, pointerInit({ clientX: 20, clientY: 0 }));

    expect(callbacks.onLongPress).not.toHaveBeenCalled();
    expect(callbacks.onClick).not.toHaveBeenCalled();
  });

  it.each(['touch', 'pen'] as const)('should handle %s pointer events', async pointerType => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerType, pointerId: 7 }));
    await advance(500);

    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(onLongPress.mock.calls[0]?.[0]).toMatchObject({ pointerType, pointerId: 7 });
  });

  it('should cancel long press when X movement exceeds threshold', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} moveThreshold={{ x: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 20, clientY: 0 }));
    await advance(500);

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should cancel long press when Y movement exceeds threshold', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} moveThreshold={{ y: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 0, clientY: 20 }));
    await advance(500);

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('does not cancel when only the axis without a threshold moves', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} moveThreshold={{ y: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 100, clientY: 0 }));
    await advance(500);

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('cancels when horizontal movement stays inside the threshold and vertical movement does not', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} moveThreshold={{ x: 10, y: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 5, clientY: 20 }));
    await advance(500);

    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('should not cancel long press when movement is within threshold', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} moveThreshold={{ x: 10, y: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 5, clientY: 5 }));
    await advance(500);

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('does not cancel an active long press when the pointer keeps moving', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} moveThreshold={{ x: 10, y: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    await advance(500);
    fireEvent.pointerMove(button, pointerInit({ clientX: 40, clientY: 40 }));
    fireEvent.pointerUp(button, pointerInit({ clientX: 40, clientY: 40 }));

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onLongPressEnd).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick).not.toHaveBeenCalled();
  });

  it('should not track movement when no threshold is specified', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 100, clientY: 100 }));
    await advance(500);

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('should not track movement when threshold object is empty', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} moveThreshold={{}} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ clientX: 100, clientY: 100 }));
    await advance(500);

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('ignores movement from a pointer that did not start the press', async () => {
    const onLongPress = vi.fn();
    render(<PressTarget onLongPress={onLongPress} moveThreshold={{ x: 10, y: 10 }} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerId: 1, clientX: 0, clientY: 0 }));
    fireEvent.pointerMove(button, pointerInit({ pointerId: 2, clientX: 40, clientY: 40 }));
    await advance(500);

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('calls onClick once for a tap followed by emulated mouse events', () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerType: 'touch' }));
    fireEvent.pointerUp(button, pointerInit({ pointerType: 'touch' }));
    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });
    fireEvent.mouseUp(button);
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(callbacks.onClick).toHaveBeenCalledTimes(1);
    expect(callbacks.onLongPress).not.toHaveBeenCalled();
  });

  it('does not call onClick for emulated mouse events after a long press', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerType: 'touch' }));
    await advance(700);
    fireEvent.pointerUp(button, pointerInit({ pointerType: 'touch' }));
    fireEvent.mouseDown(button, { clientX: 0, clientY: 0 });
    fireEvent.mouseUp(button);

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onLongPressEnd).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick).not.toHaveBeenCalled();
  });

  it('handles a mouse pointer press immediately after a touch pointer press', () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerType: 'touch', pointerId: 4 }));
    fireEvent.pointerUp(button, pointerInit({ pointerType: 'touch', pointerId: 4 }));
    fireEvent.pointerDown(button, pointerInit({ pointerType: 'mouse', pointerId: 1 }));
    fireEvent.pointerUp(button, pointerInit({ pointerType: 'mouse', pointerId: 1 }));

    expect(callbacks.onClick).toHaveBeenCalledTimes(2);
    expect(callbacks.onLongPress).not.toHaveBeenCalled();
  });

  it('tracks a press whose pointer id is 0', () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerId: 0 }));
    fireEvent.pointerUp(button, pointerInit({ pointerId: 0 }));

    expect(callbacks.onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores a non-primary pointer', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerId: 2, isPrimary: false, pointerType: 'touch' }));
    await advance(500);
    fireEvent.pointerUp(button, pointerInit({ pointerId: 2, isPrimary: false, pointerType: 'touch' }));

    expect(callbacks.onLongPress).not.toHaveBeenCalled();
    expect(callbacks.onClick).not.toHaveBeenCalled();
  });

  it('ignores a non-primary mouse button', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ button: 2, buttons: 2 }));
    await advance(500);
    fireEvent.pointerUp(button, pointerInit({ button: 2, buttons: 0 }));

    expect(callbacks.onLongPress).not.toHaveBeenCalled();
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onLongPressEnd).not.toHaveBeenCalled();
  });

  it('does not let a second pointer restart the press', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerId: 1 }));
    await advance(400);
    fireEvent.pointerDown(button, pointerInit({ pointerId: 2, isPrimary: true }));
    fireEvent.pointerUp(button, pointerInit({ pointerId: 2 }));
    await advance(100);

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick).not.toHaveBeenCalled();

    fireEvent.pointerUp(button, pointerInit({ pointerId: 1 }));
    expect(callbacks.onLongPressEnd).toHaveBeenCalledTimes(1);
  });

  it('ends a mouse press on the single pointerup after a button chord', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ button: 0, buttons: 1 }));
    await advance(500);
    // Chord changes fire pointermove, not pointerdown or pointerup.
    fireEvent.pointerMove(button, pointerInit({ button: 2, buttons: 3 }));
    fireEvent.pointerMove(button, pointerInit({ button: 0, buttons: 2 }));
    fireEvent.pointerUp(button, pointerInit({ button: 2, buttons: 0 }));

    expect(callbacks.onLongPressEnd).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(button, pointerInit({ button: 0, buttons: 1 }));
    fireEvent.pointerUp(button, pointerInit({ button: 0, buttons: 0 }));

    expect(callbacks.onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores pointerleave and pointercancel from a pointer that is not tracked', async () => {
    const callbacks = createCallbacks();
    render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit({ pointerId: 1 }));
    fireEvent.pointerLeave(button, pointerInit({ pointerId: 2 }));
    fireEvent.pointerCancel(button, pointerInit({ pointerId: 2 }));
    await advance(500);

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
  });

  it('cancels a pending press on unmount', async () => {
    const callbacks = createCallbacks();
    const { unmount } = render(<PressTarget {...callbacks} />);
    const button = screen.getByTestId('test-button');

    fireEvent.pointerDown(button, pointerInit());
    await advance(250);
    expect(callbacks.onLongPress).not.toHaveBeenCalled();

    unmount();
    await advance(500);

    expect(callbacks.onLongPress).not.toHaveBeenCalled();
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onLongPressEnd).not.toHaveBeenCalled();
  });

  it('preserves the pending timer across a rerender', async () => {
    const callbacks = createCallbacks();
    const { rerender, unmount } = render(<PressTarget {...callbacks} />);

    fireEvent.pointerDown(screen.getByTestId('test-button'), pointerInit());
    await advance(250);

    rerender(<PressTarget {...callbacks} />);
    await advance(250);

    expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
    expect(callbacks.onClick).not.toHaveBeenCalled();
    expect(callbacks.onLongPressEnd).not.toHaveBeenCalled();
    unmount();
  });
});

function installPointerEventPolyfill() {
  if (typeof window.PointerEvent === 'function') {
    return;
  }

  class PointerEventPolyfill extends MouseEvent {
    readonly pointerId: number;
    readonly pointerType: string;
    readonly isPrimary: boolean;

    constructor(type: string, init: PointerEventInit = {}) {
      super(type, {
        bubbles: init.bubbles,
        cancelable: init.cancelable,
        composed: init.composed,
        clientX: init.clientX,
        clientY: init.clientY,
        screenX: init.screenX,
        screenY: init.screenY,
        button: init.button,
        buttons: init.buttons,
        ctrlKey: init.ctrlKey,
        shiftKey: init.shiftKey,
        altKey: init.altKey,
        metaKey: init.metaKey,
      });
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? '';
      this.isPrimary = init.isPrimary ?? false;
    }
  }

  Object.defineProperty(window, 'PointerEvent', {
    configurable: true,
    writable: true,
    value: PointerEventPolyfill,
  });
}
