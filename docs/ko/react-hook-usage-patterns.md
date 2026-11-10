# React Hook Usage Patterns

> 출처: React 공식 문서 (react.dev)
> 관련: [Hook Design Principles](./hook-design-principles.md)

코딩 스타일이 아닌 **hooks를 올바르게 사용하는 패턴**. 16개 원칙 (U1-U17, U4 제거).

---

## State Design (6개)

### U1. 파생 가능한 값은 state에 넣지 마라

기존 props/state에서 계산 가능한 값은 렌더 중에 계산. useEffect 동기화 → 1렌더 지연 + 불필요한 추가 렌더.

> 📖 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) > _"If something can be calculated from the existing props or state, don't put it in state. Instead, calculate it during rendering."_

```ts
// ❌ const [fullName, setFullName] = useState('');
//    useEffect(() => { setFullName(first + ' ' + last); }, [first, last]);
// ✅ const fullName = first + ' ' + last;
```

### U2. props를 state에 복사하지 마라

prop을 useState에 복사하면 부모가 값을 바꿔도 조용히 무시됨. prop을 그대로 쓰거나, 의도한 복사라면 `initialX`로 명명.

> 📖 [Choosing the State Structure — Avoid redundant state](https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state) > _"If you can calculate some information from the component's props or its existing state variables during rendering, you should not put that information into that component's state."_

```ts
// ❌ const [color, setColor] = useState(messageColor);
// ✅ const color = messageColor;
// ✅ function Message({ initialColor }: ...) { const [color, setColor] = useState(initialColor); }
```

### U3. 렌더에 영향 없는 값은 useRef

interval ID, 이전 값, 내부 플래그 → useState 대신 useRef. 불필요한 리렌더 방지. `ref.current`는 렌더 중 읽기/쓰기 금지.

> 📖 [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs) > _"When you want a component to 'remember' some information, but you don't want that information to trigger new renders, you can use a ref."_

```ts
// ❌ const [intervalId, setIntervalId] = useState<number | null>(null);
// ✅ const intervalRef = useRef<number | null>(null);
```

### U5. 불가능한 상태를 discriminated union으로 제거

N개 boolean → 불가능한 상태가 섞인 2^N 조합. status union 타입 하나로 불가능한 상태를 타입 수준에서 차단.

> 📖 [Choosing the State Structure — Avoid contradictions in state](https://react.dev/learn/choosing-the-state-structure#avoid-contradictions-in-state) > _"Since isSending and isSent should never be true at the same time, it is better to replace them with one status state variable."_

```ts
// ❌ const [isSending, setIsSending] = useState(false);
//    const [isSent, setIsSent] = useState(false);
// ✅ type Status = 'typing' | 'sending' | 'sent';
//    const [status, setStatus] = useState<Status>('typing');
```

### U6. 객체 복사 대신 ID 저장

리스트에서 선택된 항목을 state에 복사 → 원본 수정 시 stale. ID만 저장 + 렌더 시 파생.

> 📖 [Choosing the State Structure — Avoid duplication in state](https://react.dev/learn/choosing-the-state-structure#avoid-duplication-in-state) > _"The contents of the selectedItem is the same object as one of the items inside the items list. This means that the information about the item itself is duplicated in two places."_

```ts
// ❌ const [selectedItem, setSelectedItem] = useState(items[0]);
// ✅ const [selectedId, setSelectedId] = useState(items[0].id);
//    const selectedItem = items.find(i => i.id === selectedId);
```

### U7. 관련 state는 하나의 객체로 그룹화

항상 함께 변하는 state → 하나의 setState로 원자적 업데이트.

> 📖 [Choosing the State Structure — Group related state](https://react.dev/learn/choosing-the-state-structure#group-related-state) > _"If some two state variables always change together, it might be a good idea to unify them into a single state variable."_

```ts
// ❌ const [x, setX] = useState(0); const [y, setY] = useState(0);
// ✅ const [position, setPosition] = useState({ x: 0, y: 0 });
```

---

## Effect Usage (7개)

### U8. useEffect는 외부 시스템 동기화 전용

네트워크, DOM API, 브라우저 API 동기화에만 사용. 이벤트 처리나 데이터 변환에는 쓰지 않음.

> 📖 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) > _"Effects are an escape hatch from the React paradigm. They let you 'step outside' of React and synchronize your components with some external system."_

```ts
// ❌ useEffect(() => { if (product.isInCart) showNotification('Added!'); }, [product]);
// ✅ function handleBuy() { addToCart(product); showNotification('Added!'); }
```

### U9. useEffect 체인 금지

하나의 effect가 setState → 다음 effect 트리거 → 연쇄 리렌더 + 추적 불가. 이벤트 핸들러나 reducer로 통합.

> 📖 [You Might Not Need an Effect — Chains of computations](https://react.dev/learn/you-might-not-need-an-effect#chains-of-computations) > _"The component (and its children) have to re-render between each set call in the chain."_

### U10. state 리셋은 key prop으로

`key={id}`로 재마운트. useEffect 리셋 → stale 값 한 프레임 노출.

> 📖 [You Might Not Need an Effect — Resetting all state when a prop changes](https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes) > _"Instead, you can tell React that each user's profile is conceptually a different profile by giving it an explicit key."_

```ts
// ❌ useEffect(() => { setComment(''); }, [userId]);
// ✅ <Profile userId={userId} key={userId} />
```

### U11. effect 안에서만 쓰는 객체/함수는 effect 내부에 선언

컴포넌트 본문에 선언 → 매 렌더 새 참조 → effect 매번 재실행.

> 📖 [Removing Effect Dependencies — Move dynamic objects and functions inside your Effect](https://react.dev/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect) > _"Object and function dependencies can make your Effect re-synchronize more often than you need."_

```ts
// ❌ const options = { serverUrl, roomId };
//    useEffect(() => { connect(options); }, [options]);
// ✅ useEffect(() => {
//      const options = { serverUrl, roomId };
//      connect(options);
//    }, [roomId]);
```

### U12. 외부 스토어 구독은 useSyncExternalStore

브라우저 API, 서드파티 스토어 구독 → useState+useEffect 대신 useSyncExternalStore. 동시 렌더링(concurrent rendering)의 tearing 방지 + SSR 서버 스냅샷 지원.

> 📖 [You Might Not Need an Effect — Subscribing to an external store](https://react.dev/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) > _"Although it's common to use Effects for this, React has a purpose-built Hook for subscribing to an external store that is preferred instead."_

### U13. 부모 알림은 이벤트 핸들러에서

자식이 부모에게 state 변경을 알릴 때 useEffect가 아닌 같은 이벤트 핸들러에서 콜백 호출. 연쇄 리렌더 방지.

> 📖 [You Might Not Need an Effect — Notifying parent components about state changes](https://react.dev/learn/you-might-not-need-an-effect#notifying-parent-components-about-state-changes) > _"Delete the Effect and instead update the state of both components within the same event handler."_

```ts
// ❌ useEffect(() => { onChange(isOn); }, [isOn]);
// ✅ function handleClick() { setIsOn(!isOn); onChange(!isOn); }
```

### U14. 비동기 effect는 반드시 cleanup

fetch/timer/subscription → cleanup 없으면 race condition. 빠른 prop 변경 시 이전 응답이 이후 응답을 덮어씀.

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

## Memoization (2개)

### U15. useMemo는 1ms 이상 측정된 연산에만

`console.time`으로 측정해서 1ms 미만이면 useMemo 오버헤드가 더 큼.

> 📖 [useMemo — How to tell if a calculation is expensive](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) > _"If the overall logged time adds up to a significant amount (say, 1ms or more), it might make sense to memoize that calculation."_

### U16. useCallback은 memo() 래핑된 자식에 전달할 때만

memo()로 감싸지 않은 자식에는 참조를 안정적으로 유지해도 리렌더 방지 효과 없음.

> 📖 [useCallback](https://react.dev/reference/react/useCallback) > _"You should only rely on useCallback as a performance optimization. If your code doesn't work without it, find the underlying problem and fix it first. Then you may add useCallback back."_

---

## Hook Design (1개)

### U17. 커스텀 훅은 재사용 가능한 상태 로직 추출용

lifecycle wrapper(`useMount`, `useEffectOnce`) 금지. 목적이 분명한 훅(`useWindowSize`, `useOnlineStatus`)만.
추출 기준: 같은 state+effect 패턴이 2개 이상의 컴포넌트에서 반복되는지 확인.

> 📖 [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) > _"Custom Hooks let you share stateful logic, not state itself."_
