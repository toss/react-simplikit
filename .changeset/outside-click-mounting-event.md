---
'react-simplikit': patch
---

`useOutsideClickEffect` no longer calls the callback for the click that rendered its container. React runs the effects of a click's update before that click reaches `document`, so a popup opened by a button outside it closed again on the same click. Whenever a new container element appears, including on the first render, clicks are now ignored until a `setTimeout(0)` fires. A test that clicks outside right after rendering needs to wait for that timer first, for example with `await act(() => new Promise(resolve => setTimeout(resolve, 0)))`, or `vi.advanceTimersByTime(0)` with fake timers.
