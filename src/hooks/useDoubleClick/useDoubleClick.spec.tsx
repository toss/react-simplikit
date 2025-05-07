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
});
