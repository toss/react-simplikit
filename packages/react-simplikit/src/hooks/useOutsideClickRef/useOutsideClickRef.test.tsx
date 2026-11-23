import { StrictMode, Suspense, useState } from 'react';
import { flushSync } from 'react-dom';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useOutsideClickRef } from './useOutsideClickRef.ts';

// `fireEvent.click` defaults to `detail: 0`, which is how keyboard clicks arrive.
// A pointer click carries a click count and is preceded by its own `pointerdown`.
function pointerClick(element: Element) {
  fireEvent.pointerDown(element);
  fireEvent.click(element, { detail: 1 });
}

function Container({ onOutsideClick, enabled }: { onOutsideClick: () => void; enabled?: boolean }) {
  const ref = useOutsideClickRef({ onOutsideClick, enabled });

  return (
    <>
      <div ref={ref} data-testid="container">
        <button data-testid="inside">Inside</button>
      </div>
      <button data-testid="outside">Outside</button>
    </>
  );
}

describe('useOutsideClickRef', () => {
  it('calls the callback when clicking outside the attached element', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    pointerClick(screen.getByTestId('outside'));

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback when clicking inside or on a descendant', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    pointerClick(screen.getByTestId('container'));
    pointerClick(screen.getByTestId('inside'));

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('treats every element sharing the ref as inside, including svg', () => {
    const onOutsideClick = vi.fn();

    function Shared() {
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <>
          <button ref={ref} data-testid="trigger">
            Trigger
          </button>
          <div ref={ref} data-testid="menu">
            Menu
          </div>
          <svg ref={ref} data-testid="icon" />
          <button data-testid="outside">Outside</button>
        </>
      );
    }

    render(<Shared />);

    pointerClick(screen.getByTestId('trigger'));
    pointerClick(screen.getByTestId('menu'));
    pointerClick(screen.getByTestId('icon'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('keeps the same ref across renders', () => {
    const { result, rerender } = renderHook(() => useOutsideClickRef({ onOutsideClick: () => {} }));
    const firstRef = result.current;

    rerender();

    expect(result.current).toBe(firstRef);
  });

  it('calls the latest callback after re-render', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Container onOutsideClick={first} />);

    rerender(<Container onOutsideClick={second} />);
    pointerClick(screen.getByTestId('outside'));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('keeps the press origin when the callback changes mid-press', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Container onOutsideClick={first} />);

    fireEvent.pointerDown(screen.getByTestId('inside'));
    rerender(<Container onOutsideClick={second} />);
    fireEvent.click(screen.getByTestId('outside'), { detail: 1 });
    expect(second).not.toHaveBeenCalled();

    pointerClick(screen.getByTestId('outside'));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('still treats the remaining element as inside after one of them unmounts', () => {
    const onOutsideClick = vi.fn();

    function Toggle({ open }: { open: boolean }) {
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <>
          <button ref={ref} data-testid="trigger">
            Trigger
          </button>
          {open && <div ref={ref}>Menu</div>}
          <button data-testid="outside">Outside</button>
        </>
      );
    }

    const { rerender } = render(<Toggle open />);
    rerender(<Toggle open={false} />);

    pointerClick(screen.getByTestId('trigger'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does not call the callback once every attached element has unmounted', () => {
    const onOutsideClick = vi.fn();

    function Menu({ open }: { open: boolean }) {
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <>
          {open && <div ref={ref}>Menu</div>}
          <button data-testid="outside">Outside</button>
        </>
      );
    }

    const { rerender } = render(<Menu open />);
    rerender(<Menu open={false} />);

    pointerClick(screen.getByTestId('outside'));
    pointerClick(document.body);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('calls the callback on every outside click while an always-rendered trigger holds the ref', () => {
    const onOutsideClick = vi.fn();

    function Dropdown({ open }: { open: boolean }) {
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <>
          <button ref={ref}>Trigger</button>
          {open && <div ref={ref}>Menu</div>}
          <button data-testid="outside">Outside</button>
        </>
      );
    }

    render(<Dropdown open={false} />);

    pointerClick(screen.getByTestId('outside'));
    pointerClick(screen.getByTestId('outside'));

    expect(onOutsideClick).toHaveBeenCalledTimes(2);
  });

  // React 18 is not installed here, so its `ref(null)` call on detach is made by hand.
  it('handles the React 18 null call without knowing which element left (simulated)', () => {
    const onOutsideClick = vi.fn();
    const { result } = renderHook(() => useOutsideClickRef({ onOutsideClick }));
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);

    result.current(a);
    result.current(b);
    result.current(null);
    a.remove();

    pointerClick(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    pointerClick(b);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    b.remove();
    pointerClick(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('covers an element the component does not render when the ref is called by hand', () => {
    const onOutsideClick = vi.fn();
    const { result } = renderHook(() => useOutsideClickRef({ onOutsideClick }));
    const toolbar = document.createElement('div');
    document.body.append(toolbar);

    result.current(toolbar);

    pointerClick(toolbar);
    expect(onOutsideClick).not.toHaveBeenCalled();

    pointerClick(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    toolbar.remove();
  });

  it('drops disconnected elements when another element attaches', () => {
    const onOutsideClick = vi.fn();
    const { result } = renderHook(() => useOutsideClickRef({ onOutsideClick }));
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);

    result.current(a);
    a.remove();
    result.current(b);

    pointerClick(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    b.remove();
  });

  it('registers listeners once under StrictMode', () => {
    const onOutsideClick = vi.fn();
    render(
      <StrictMode>
        <Container onOutsideClick={onOutsideClick} />
      </StrictMode>
    );

    pointerClick(screen.getByTestId('inside'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('decides before the target removes itself during the click', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);
    const inside = screen.getByTestId('inside');
    inside.addEventListener('click', () => inside.remove());

    pointerClick(inside);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('decides before an inside handler removes the menu during the click', () => {
    const onOutsideClick = vi.fn();

    function Dropdown() {
      const [open, setOpen] = useState(true);
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <>
          <button ref={ref}>Trigger</button>
          {open && (
            <div ref={ref}>
              <button data-testid="item" onClick={() => flushSync(() => setOpen(false))}>
                Item
              </button>
            </div>
          )}
        </>
      );
    }

    render(<Dropdown />);

    // A keyboard click has no press origin to fall back on.
    fireEvent.click(screen.getByTestId('item'));

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it("calls the callback before the clicked element's own handlers", () => {
    const calls: string[] = [];

    function Menu() {
      const ref = useOutsideClickRef({ onOutsideClick: () => calls.push('outside') });

      return (
        <>
          <div ref={ref}>Menu</div>
          <button data-testid="apply" onClick={() => calls.push('apply')}>
            Apply
          </button>
        </>
      );
    }

    render(<Menu />);

    pointerClick(screen.getByTestId('apply'));

    expect(calls).toEqual(['outside', 'apply']);
  });

  it('still calls the callback when an outside handler stops propagation', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);
    const outside = screen.getByTestId('outside');
    outside.addEventListener('click', event => event.stopPropagation());

    pointerClick(outside);

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does not close a menu that mounts during the click that opens it', () => {
    const onOutsideClick = vi.fn();

    function Menu() {
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <div ref={ref} data-testid="menu">
          Menu
        </div>
      );
    }

    function App() {
      const [open, setOpen] = useState(false);

      return (
        <>
          {/* In a browser, React renders a click's update and runs its effects before the click reaches `document`.
              `flushSync` does the same here. */}
          <button data-testid="trigger" onClick={() => flushSync(() => setOpen(true))}>
            Open
          </button>
          {open && <Menu />}
        </>
      );
    }

    render(<App />);

    pointerClick(screen.getByTestId('trigger'));
    expect(onOutsideClick).not.toHaveBeenCalled();
    expect(screen.getByTestId('menu')).toBeDefined();

    pointerClick(screen.getByTestId('trigger'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does not close a menu whose `enabled` turns true during the opening click', () => {
    const onOutsideClick = vi.fn();

    function Dropdown() {
      const [open, setOpen] = useState(false);
      const ref = useOutsideClickRef({ onOutsideClick, enabled: open });

      return (
        <>
          <button data-testid="trigger" onClick={() => flushSync(() => setOpen(true))}>
            Open
          </button>
          {open && (
            <div ref={ref} data-testid="menu">
              Menu
            </div>
          )}
          <button data-testid="outside">Outside</button>
        </>
      );
    }

    render(<Dropdown />);

    pointerClick(screen.getByTestId('trigger'));
    expect(onOutsideClick).not.toHaveBeenCalled();
    expect(screen.getByTestId('menu')).toBeDefined();

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });
  it('keeps the press origin when `enabled` turns true during that press', () => {
    const onOutsideClick = vi.fn();

    function Dropdown() {
      const [open, setOpen] = useState(false);
      const ref = useOutsideClickRef({ onOutsideClick, enabled: open });

      return (
        <>
          <button ref={ref} data-testid="trigger" onPointerDown={() => flushSync(() => setOpen(true))}>
            Open
          </button>
          {open && <div ref={ref}>Menu</div>}
        </>
      );
    }

    render(<Dropdown />);

    fireEvent.pointerDown(screen.getByTestId('trigger'));
    // Dragging from the trigger and releasing elsewhere sends the click to a common ancestor.
    fireEvent.click(document.body, { detail: 1 });

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('does not call the callback while disabled', () => {
    const onOutsideClick = vi.fn();
    const { rerender } = render(<Container onOutsideClick={onOutsideClick} enabled={false} />);

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).not.toHaveBeenCalled();

    rerender(<Container onOutsideClick={onOutsideClick} enabled />);
    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('stops calling the callback once `enabled` turns false', () => {
    const onOutsideClick = vi.fn();
    const { rerender } = render(<Container onOutsideClick={onOutsideClick} />);

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    rerender(<Container onOutsideClick={onOutsideClick} enabled={false} />);
    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('treats a pointer press that starts outside and ends inside as an outside click', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    fireEvent.pointerDown(screen.getByTestId('outside'));
    // The browser sends the click to the common ancestor of the press and release targets.
    fireEvent.click(document.body, { detail: 1 });

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('keeps the press origin when an inside pointerdown handler removes the menu', () => {
    const onOutsideClick = vi.fn();

    function Dropdown() {
      const [open, setOpen] = useState(true);
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <>
          <button ref={ref}>Trigger</button>
          {open && (
            <div ref={ref}>
              <button data-testid="item" onPointerDown={() => flushSync(() => setOpen(false))}>
                Item
              </button>
            </div>
          )}
        </>
      );
    }

    render(<Dropdown />);

    fireEvent.pointerDown(screen.getByTestId('item'));
    // The pressed item is gone, so the click lands on an ancestor outside every remaining element.
    fireEvent.click(document.body, { detail: 1 });

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('treats a click inside an open shadow root as inside', () => {
    const onOutsideClick = vi.fn();
    const { result } = renderHook(() => useOutsideClickRef({ onOutsideClick }));
    const host = document.createElement('div');
    document.body.append(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const inner = document.createElement('button');
    shadowRoot.append(inner);

    result.current(inner);

    fireEvent.pointerDown(inner, { composed: true });
    fireEvent.click(inner, { detail: 1, composed: true });
    expect(onOutsideClick).not.toHaveBeenCalled();

    pointerClick(document.body);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    host.remove();
  });

  it('does not treat a pointer press that starts inside and ends outside as an outside click', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    fireEvent.pointerDown(screen.getByTestId('inside'));
    // The browser sends the click to the common ancestor of the press and release targets.
    fireEvent.click(document.body, { detail: 1 });
    expect(onOutsideClick).not.toHaveBeenCalled();

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('ignores a press flag left by a press that never produced a click', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    fireEvent.pointerDown(screen.getByTestId('inside'));
    fireEvent.click(screen.getByTestId('outside'));

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('ignores a press flag left by a cancelled touch press', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    fireEvent.pointerDown(screen.getByTestId('inside'));
    fireEvent.pointerCancel(screen.getByTestId('inside'));
    fireEvent.click(screen.getByTestId('outside'));

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('ignores a press flag left by a right-button press', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    fireEvent.pointerDown(screen.getByTestId('inside'), { button: 2 });
    fireEvent.contextMenu(screen.getByTestId('inside'));
    fireEvent.click(screen.getByTestId('outside'));

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('calls the callback for a keyboard click outside', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);

    fireEvent.click(screen.getByTestId('outside'));

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  // Documents a known limit: the ref ignores `ref(null)`, so a panel that Suspense hides stays attached.
  it('keeps an element hidden by Suspense as attached', async () => {
    const onOutsideClick = vi.fn();
    const never = new Promise<never>(() => {});

    function Suspender({ suspend }: { suspend: boolean }) {
      if (suspend) {
        throw never;
      }

      return null;
    }

    function App({ suspend }: { suspend: boolean }) {
      const ref = useOutsideClickRef({ onOutsideClick });

      return (
        <>
          <Suspense fallback={<span>Loading</span>}>
            <div ref={ref} data-testid="panel">
              Panel
            </div>
            <Suspender suspend={suspend} />
          </Suspense>
          <button data-testid="outside">Outside</button>
        </>
      );
    }

    const { rerender } = render(<App suspend={false} />);
    const panel = screen.getByTestId('panel');

    await act(async () => {
      rerender(<App suspend />);
    });

    expect(panel.isConnected).toBe(true);
    expect(panel.style.display).toBe('none');

    pointerClick(screen.getByTestId('outside'));
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('ignores a click event without a target', () => {
    const onOutsideClick = vi.fn();
    render(<Container onOutsideClick={onOutsideClick} />);
    const nullTargetEvent = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 });
    Object.defineProperty(nullTargetEvent, 'target', { value: null });

    document.dispatchEvent(nullTargetEvent);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('removes the listeners on unmount', () => {
    const onOutsideClick = vi.fn();
    const { result, unmount } = renderHook(() => useOutsideClickRef({ onOutsideClick }));
    // An element that stays in the document keeps the set non-empty, so a leaked listener would still call back.
    const toolbar = document.createElement('div');
    document.body.append(toolbar);
    result.current(toolbar);

    unmount();
    pointerClick(document.body);

    expect(onOutsideClick).not.toHaveBeenCalled();

    toolbar.remove();
  });
});
