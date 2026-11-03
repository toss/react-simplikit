---
'react-simplikit': major
---

`useLongPress` now listens to pointer events instead of paired mouse and touch events.

The returned handlers are `onPointerDown`, `onPointerUp`, `onPointerLeave`, and `onPointerCancel`, plus `onPointerMove` when `moveThreshold` is set. `onMouseDown`, `onMouseUp`, `onMouseLeave`, `onTouchStart`, `onTouchEnd`, `onMouseMove`, and `onTouchMove` are no longer returned. Callbacks receive `React.PointerEvent` instead of `MouseEvent | TouchEvent`.

```ts
// before
const handlers = useLongPress(onLongPress, { delayMs: 400, onClick });
<button onMouseDown={handlers.onMouseDown} onTouchStart={handlers.onTouchStart} />;

// after
const handlers = useLongPress(onLongPress, { delayMs: 400, onClick });
<button {...handlers} />;
```

A press is one pointer stream, so the emulated `mousedown` and `mouseup` that browsers fire after a tap no longer start a second press or call `onClick` again. This replaces the 1 second window that ignored mouse presses after a touch. The hook ignores a non-primary pointer and any mouse button other than the primary button. `pointercancel` cancels the press, including when the browser takes the pointer to scroll, and a cancelled press does not call `onClick`. Leaving the element cancels a pending press the same way; if the long press already fired, `onPointerLeave` and `onPointerCancel` call `onLongPressEnd`.
