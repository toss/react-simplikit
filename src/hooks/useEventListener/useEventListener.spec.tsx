import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useEventListener } from './useEventListener.ts';

describe('useEventListener Hook', () => {
  let handlerSpy: Mock;

  beforeEach(() => {
    handlerSpy = vi.fn();
  });

  it('should trigger window resize event', () => {
    function TestComponent() {
      useEventListener('resize', handlerSpy);

      return <div>Resize the window</div>;
    }

    render(<TestComponent />);

    global.dispatchEvent(new Event('resize'));

    expect(handlerSpy).toHaveBeenCalled();
  });

  it('should trigger window scroll event', () => {
    function TestComponent() {
      useEventListener('scroll', handlerSpy);

      return <div style={{ height: '100vh' }}>Scroll the window</div>;
    }

    render(<TestComponent />);

    global.dispatchEvent(new Event('scroll'));

    expect(handlerSpy).toHaveBeenCalled();
  });

  it('should trigger document visibilitychange event', () => {
    function TestComponent() {
      useEventListener('visibilitychange', handlerSpy, document);

      return <div>Visibility Change</div>;
    }

    render(<TestComponent />);

    document.dispatchEvent(new Event('visibilitychange'));

    expect(handlerSpy).toHaveBeenCalled();
  });

  it('should trigger document click event', () => {
    function TestComponent() {
      useEventListener('click', handlerSpy, document);

      return <div>Click anywhere in the document</div>;
    }

    render(<TestComponent />);

    fireEvent.click(document);

    expect(handlerSpy).toHaveBeenCalled();
  });

  it('should trigger element click event', () => {
    function TestComponent() {
      const buttonRef = useRef<HTMLButtonElement>(null);

      useEventListener('click', handlerSpy, buttonRef);

      return <button ref={buttonRef}>Click me</button>;
    }

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Click me'));

    expect(handlerSpy).toHaveBeenCalled();
  });

  it('should trigger element focus event', () => {
    function TestComponent() {
      const inputRef = useRef<HTMLInputElement>(null);

      useEventListener('focus', handlerSpy, inputRef);

      return <input ref={inputRef} />;
    }

    render(<TestComponent />);

    fireEvent.focus(screen.getByRole('textbox'));

    expect(handlerSpy).toHaveBeenCalled();
  });

  it('should not throw if ref is null and does not register listener', () => {
    function TestComponent() {
      const nullRef = useRef<HTMLDivElement>(null);

      useEventListener('click', handlerSpy, nullRef);

      return <div>Test</div>;
    }

    render(<TestComponent />);

    fireEvent.click(screen.getByText('Test'));

    expect(handlerSpy).not.toHaveBeenCalled();
  });
});
