---
description: Choose a React utility by the problem you need to solve
---

# Common use cases

Start with the behavior you need, then open the API reference for its parameters and edge cases. [Install react-simplikit](/installation) before trying the examples.

## Choose an API

| Problem                             | API                                                   | What it provides                                           |
| ----------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| Show or hide content                | [useToggle](/hooks/useToggle)                         | A boolean and a toggle function                            |
| Wait for typing to pause            | [useDebouncedValue](/hooks/useDebouncedValue)         | A delayed copy of state; the input itself stays responsive |
| Delay a callback                    | [useDebounce](/hooks/useDebounce)                     | A callable function with a `.cancel()` method              |
| Limit callback frequency            | [useThrottledCallback](/hooks/useThrottledCallback)   | A callback limited to the configured interval              |
| Keep state across reloads           | [useStorageState](/hooks/useStorageState)             | State persisted in browser storage                         |
| React to a click outside an element | [useOutsideClickEffect](/hooks/useOutsideClickEffect) | An outside-click subscription                              |
| Keep an input above the keyboard    | [useAvoidKeyboard](/hooks/useAvoidKeyboard)           | A style for positioning a fixed element                    |
| Insert separators between children  | [Separated](/components/Separated)                    | Separators without a trailing separator                    |
| Attach multiple refs to one element | [mergeRefs](/utils/mergeRefs)                         | One ref callback that forwards to each ref                 |

## Show and hide details

Render `<Details />` in your React app. The button toggles both the content and its expanded state.

```tsx
import { useToggle } from 'react-simplikit';

export function Details() {
  const [open, toggle] = useToggle(false);

  return (
    <section>
      <button type="button" aria-expanded={open} onClick={toggle}>
        Details
      </button>
      {open && <p>Delivery takes 3–5 days.</p>}
    </section>
  );
}
```

## Filter after typing pauses

Render `<FruitSearch />` in your React app. Type `ap`: the input updates immediately, and the list shows Apple after 300 ms without another change. This example uses local data and needs no server.

```tsx
import { useState } from 'react';
import { useDebouncedValue } from 'react-simplikit';

const fruits = ['Apple', 'Banana', 'Orange'];

export function FruitSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const results = fruits.filter(fruit =>
    fruit.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <section>
      <label>
        Search fruit
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <ul aria-live="polite">
        {results.map(fruit => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </section>
  );
}
```

Use [useDebouncedValue](/hooks/useDebouncedValue) when you need a value for rendering. Use [useDebounce](/hooks/useDebounce) when an event should schedule a callback. Debouncing alone does not make an expensive calculation faster.

## SSR and cleanup

- Call hooks at the top level of a React component or custom hook. In a framework with Server Components, put these interactive examples in a Client Component (`'use client'`).

- `useDebouncedValue` returns the supplied value on the server and the first render. Give the server and client the same initial value; do not read `window` or storage during render to construct it.

- `useStorageState` uses `defaultValue` for the server snapshot and hydration, then reads browser storage on the client. Its storage listeners are removed on unmount.

- `useDebounce` cancels pending calls when the component unmounts or the debounce instance changes. It does not cancel a network request that has already started; the application must handle request cancellation or stale responses.

- Browser measurements can change after mount. Check the initial values and platform constraints in [Mobile Web](/mobile-web) and the individual API reference.

## Next steps

Browse the [full API reference](/reference) for other tools, or set up [AI Integration](/ai-integration) so your agent can find the same documentation.
