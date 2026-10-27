import { MouseEvent } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useDoubleClick } from './useDoubleClick.ts';

function TestComponent({
  delay = 250,
  onClick,
  onDoubleClick,
}: {
  delay?: number;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onDoubleClick: (event: MouseEvent<HTMLElement>) => void;
}) {
  const handleEvent = useDoubleClick({
    delay,
    click: onClick,
    doubleClick: onDoubleClick,
  });

  return <button onClick={handleEvent}>Test Button</button>;
}

describe('useDoubleClick', () => {
  let clickSpy: Mock;
  let doubleClickSpy: Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    clickSpy = vi.fn();
    doubleClickSpy = vi.fn();
  });

  afterEach(() => {
    // The unmount test spies on window.clearTimeout; restore it so tests added after it see the real timer API
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('calls single click handler after delay if no double click', async () => {
    const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });

    expect(clickSpy).not.toHaveBeenCalled();
    expect(doubleClickSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(250);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(doubleClickSpy).not.toHaveBeenCalled();
  });

  it('calls double click handler instead of single click when clicked twice quickly', () => {
    const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });
    fireEvent.click(button, { detail: 2 });

    vi.advanceTimersByTime(250);

    expect(clickSpy).not.toHaveBeenCalled();
    expect(doubleClickSpy).toHaveBeenCalledTimes(1);
  });

  it('does not throw if click is not provided', () => {
    const { getByText } = render(<TestComponent onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });

    vi.advanceTimersByTime(250);

    expect(doubleClickSpy).not.toHaveBeenCalled();
  });

  it('calls double click handler only once on double click', () => {
    const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });
    fireEvent.click(button, { detail: 2 });

    vi.advanceTimersByTime(250);

    expect(clickSpy).not.toHaveBeenCalled();
    expect(doubleClickSpy).toHaveBeenCalledTimes(1);
  });

  it('resets timeout if component unmounts early', () => {
    const { unmount, getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });
    unmount();

    vi.advanceTimersByTime(250);

    expect(clickSpy).not.toHaveBeenCalled();
    expect(doubleClickSpy).not.toHaveBeenCalled();
  });

  it('respects custom delay time', () => {
    const { getByText } = render(<TestComponent delay={500} onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });

    vi.advanceTimersByTime(250);

    expect(clickSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(250);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call click if doubleClick is triggered before delay', () => {
    const { getByText } = render(<TestComponent delay={300} onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });

    vi.advanceTimersByTime(150);

    fireEvent.click(button, { detail: 2 });

    vi.advanceTimersByTime(150);

    expect(clickSpy).not.toHaveBeenCalled();
    expect(doubleClickSpy).toHaveBeenCalledTimes(1);
  });

  it('cleans up timers on unmount to prevent memory leaks', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount, getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
    const button = getByText('Test Button');

    fireEvent.click(button, { detail: 1 });
    unmount();

    vi.advanceTimersByTime(250);

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  describe('activation without a click count (detail 0)', () => {
    it('calls click immediately for keyboard-style activation', () => {
      const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
      const button = getByText('Test Button');

      fireEvent.click(button, { detail: 0 });

      expect(clickSpy).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(250);

      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(doubleClickSpy).not.toHaveBeenCalled();
    });

    it('calls click for a programmatic button.click()', () => {
      const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);

      getByText('Test Button').click();

      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(doubleClickSpy).not.toHaveBeenCalled();
    });

    it('forwards the original event to click', () => {
      const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);

      fireEvent.click(getByText('Test Button'), { detail: 0 });

      expect(clickSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'click', detail: 0 }));
    });

    it('does not throw if click is not provided', () => {
      const { getByText } = render(<TestComponent onDoubleClick={doubleClickSpy} />);
      const button = getByText('Test Button');

      expect(() => fireEvent.click(button, { detail: 0 })).not.toThrow();

      vi.advanceTimersByTime(250);

      expect(doubleClickSpy).not.toHaveBeenCalled();
    });

    it('calls click for every repeated activation', () => {
      const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
      const button = getByText('Test Button');

      fireEvent.click(button, { detail: 0 });
      fireEvent.click(button, { detail: 0 });
      fireEvent.click(button, { detail: 0 });

      expect(clickSpy).toHaveBeenCalledTimes(3);
      expect(doubleClickSpy).not.toHaveBeenCalled();
    });

    it('does not cancel a pending mouse click', () => {
      const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
      const button = getByText('Test Button');

      fireEvent.click(button, { detail: 1 });
      vi.advanceTimersByTime(100);
      fireEvent.click(button, { detail: 0 });

      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(clickSpy).toHaveBeenLastCalledWith(expect.objectContaining({ detail: 0 }));

      vi.advanceTimersByTime(150);

      expect(clickSpy).toHaveBeenCalledTimes(2);
      expect(clickSpy).toHaveBeenLastCalledWith(expect.objectContaining({ detail: 1 }));
      expect(doubleClickSpy).not.toHaveBeenCalled();
    });

    it('keeps the mouse double click working after a detail 0 activation', () => {
      const { getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
      const button = getByText('Test Button');

      fireEvent.click(button, { detail: 0 });
      fireEvent.click(button, { detail: 1 });
      fireEvent.click(button, { detail: 2 });

      vi.advanceTimersByTime(250);

      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(doubleClickSpy).toHaveBeenCalledTimes(1);
    });

    it('does not call click after unmount', () => {
      const { unmount, getByText } = render(<TestComponent onClick={clickSpy} onDoubleClick={doubleClickSpy} />);
      const button = getByText('Test Button');

      fireEvent.click(button, { detail: 1 });
      fireEvent.click(button, { detail: 0 });
      unmount();

      vi.advanceTimersByTime(250);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
