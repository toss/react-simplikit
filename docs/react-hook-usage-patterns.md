# React Hook Usage Patterns

> Source: React official documentation (react.dev)
> Related: [Hook Design Principles](./hook-design-principles.md)
> Korean version: [ko/react-hook-usage-patterns.md](./ko/react-hook-usage-patterns.md)

Patterns for **correctly using hooks** — not coding style, but React-specific best practices. 16 principles (U1-U17, U4 removed).

---

## State Design (6)

### U1. Derive Instead of Syncing with State

If a value can be computed from existing props or state, calculate it during render. Syncing with useEffect causes a 1-render delay + unnecessary extra render.

> 📖 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) > _"If something can be calculated from the existing props or state, don't put it in state. Instead, calculate it during rendering."_

```ts
// ❌ const [fullName, setFullName] = useState('');
//    useEffect(() => { setFullName(first + ' ' + last); }, [first, last]);
// ✅ const fullName = first + ' ' + last;
```

### U2. Don't Mirror Props in State

Copying a prop into useState means parent changes are silently ignored. Use the prop directly, or name it `initialX` if intentional.

> 📖 [Choosing the State Structure — Avoid redundant state](https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state) > _"If you can calculate some information from the component's props or its existing state variables during rendering, you should not put that information into that component's state."_

```ts
// ❌ const [color, setColor] = useState(messageColor);
// ✅ const color = messageColor;
// ✅ function Message({ initialColor }: ...) { const [color, setColor] = useState(initialColor); }
```

### U3. Use useRef for Non-Rendered Values

Interval IDs, previous values, internal flags — use useRef instead of useState. Avoids unnecessary re-renders. Never read/write `ref.current` during rendering.

> 📖 [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs) > _"When you want a component to 'remember' some information, but you don't want that information to trigger new renders, you can use a ref."_

```ts
// ❌ const [intervalId, setIntervalId] = useState<number | null>(null);
// ✅ const intervalRef = useRef<number | null>(null);
```

### U5. Eliminate Impossible States with Discriminated Unions

N booleans → 2^N combinations with invalid states. A single status union type prevents impossible states at the type level.

> 📖 [Choosing the State Structure — Avoid contradictions in state](https://react.dev/learn/choosing-the-state-structure#avoid-contradictions-in-state) > _"Since isSending and isSent should never be true at the same time, it is better to replace them with one status state variable."_

```ts
// ❌ const [isSending, setIsSending] = useState(false);
//    const [isSent, setIsSent] = useState(false);
// ✅ type Status = 'typing' | 'sending' | 'sent';
//    const [status, setStatus] = useState<Status>('typing');
```

### U6. Store IDs Instead of Duplicating Objects

Copying a selected item from a list into state → stale when source updates. Store the ID and derive during render.

> 📖 [Choosing the State Structure — Avoid duplication in state](https://react.dev/learn/choosing-the-state-structure#avoid-duplication-in-state) > _"The contents of the selectedItem is the same object as one of the items inside the items list. This means that the information about the item itself is duplicated in two places."_

```ts
// ❌ const [selectedItem, setSelectedItem] = useState(items[0]);
// ✅ const [selectedId, setSelectedId] = useState(items[0].id);
//    const selectedItem = items.find(i => i.id === selectedId);
```

### U7. Group Related State into a Single Object

State values that always change together → single setState for atomic updates.

> 📖 [Choosing the State Structure — Group related state](https://react.dev/learn/choosing-the-state-structure#group-related-state) > _"If some two state variables always change together, it might be a good idea to unify them into a single state variable."_

```ts
// ❌ const [x, setX] = useState(0); const [y, setY] = useState(0);
// ✅ const [position, setPosition] = useState({ x: 0, y: 0 });
```

---

## Effect Usage (7)

### U8. useEffect Is for External System Synchronization Only

Network, DOM APIs, browser APIs — synchronization only. Not for event handling or data transformation.

> 📖 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) > _"Effects are an escape hatch from the React paradigm. They let you 'step outside' of React and synchronize your components with some external system."_

```ts
// ❌ useEffect(() => { if (product.isInCart) showNotification('Added!'); }, [product]);
// ✅ function handleBuy() { addToCart(product); showNotification('Added!'); }
```

### U9. No useEffect Chains

One effect sets state → triggers next effect → cascading re-renders + untraceable. Consolidate in event handlers or reducers.

> 📖 [You Might Not Need an Effect — Chains of computations](https://react.dev/learn/you-might-not-need-an-effect#chains-of-computations) > _"The component (and its children) have to re-render between each set call in the chain."_

### U10. Reset State with key Prop

`key={id}` forces a clean remount. useEffect reset → stale value visible for one frame.

> 📖 [You Might Not Need an Effect — Resetting all state when a prop changes](https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes) > _"Instead, you can tell React that each user's profile is conceptually a different profile by giving it an explicit key."_

```ts
// ❌ useEffect(() => { setComment(''); }, [userId]);
// ✅ <Profile userId={userId} key={userId} />
```

### U11. Declare Effect-Only Objects/Functions Inside the Effect

Objects/functions declared in the component body get new references every render → effect re-runs every render.

> 📖 [Removing Effect Dependencies — Move dynamic objects and functions inside your Effect](https://react.dev/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect) > _"Object and function dependencies can make your Effect re-synchronize more often than you need."_

```ts
// ❌ const options = { serverUrl, roomId };
//    useEffect(() => { connect(options); }, [options]);
// ✅ useEffect(() => {
//      const options = { serverUrl, roomId };
//      connect(options);
//    }, [roomId]);
```

### U12. Use useSyncExternalStore for External Store Subscriptions

Browser APIs, third-party stores → use useSyncExternalStore instead of useState + useEffect. Prevents tearing in concurrent rendering + supports SSR server snapshots.

> 📖 [You Might Not Need an Effect — Subscribing to an external store](https://react.dev/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) > _"Although it's common to use Effects for this, React has a purpose-built Hook for subscribing to an external store that is preferred instead."_

### U13. Notify Parents from Event Handlers

When a child needs to notify a parent about state changes, call the parent's callback in the same event handler — not in useEffect. Prevents cascading re-renders.

> 📖 [You Might Not Need an Effect — Notifying parent components about state changes](https://react.dev/learn/you-might-not-need-an-effect#notifying-parent-components-about-state-changes) > _"Delete the Effect and instead update the state of both components within the same event handler."_

```ts
// ❌ useEffect(() => { onChange(isOn); }, [isOn]);
// ✅ function handleClick() { setIsOn(!isOn); onChange(!isOn); }
```

### U14. Async Effects Must Have Cleanup

fetch/timer/subscription without cleanup → race condition. Fast prop changes cause older responses to overwrite newer ones.

> 📖 [Synchronizing with Effects — Fetching data](https://react.dev/learn/synchronizing-with-effects#fetching-data) > _"If your Effect fetches something, the cleanup function should either abort the fetch or ignore its result."_

```ts
useEffect(
  function fetchResults() {
    let ignore = false;
    fetchAPI(query).then(data => {
      if (!ignore) setResults(data);
    });
    return () => {
      ignore = true;
    };
  },
  [query]
);
```

---

## Memoization (2)

### U15. useMemo Only for Measured Expensive Computations

Measure with `console.time`. If under 1ms, useMemo overhead exceeds saved computation.

> 📖 [useMemo — How to tell if a calculation is expensive](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) > _"If the overall logged time adds up to a significant amount (say, 1ms or more), it might make sense to memoize that calculation."_

### U16. useCallback Only When Passing to memo()-Wrapped Children

Stable reference to a non-memo() child has zero re-render prevention effect.

> 📖 [useCallback](https://react.dev/reference/react/useCallback) > _"You should only rely on useCallback as a performance optimization. If your code doesn't work without it, find the underlying problem and fix it first. Then you may add useCallback back."_

---

## Hook Design (1)

### U17. Extract Custom Hooks for Reusable Stateful Logic

No lifecycle wrappers (`useMount`, `useEffectOnce`). Only purpose-specific hooks (`useWindowSize`, `useOnlineStatus`).
Extraction criterion: Does the same state+effect pattern repeat in 2+ components?

> 📖 [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) > _"Custom Hooks let you share stateful logic, not state itself."_
