# React Hook Usage Patterns

> 출처: React 공식 문서 (react.dev)
> 관련: [Hook Design Principles](./hook-design-principles.md)

코딩 스타일이 아닌 **hooks를 올바르게 사용하는 패턴**. 16개 원칙 (U1-U17, U4 제거).

---

## State Design (6개)

### U1. 파생 가능한 값은 state에 넣지 마라

기존 props/state에서 계산 가능한 값은 렌더 중에 계산. useEffect 동기화 → 1렌더 지연 + 불필요한 추가 렌더.

```ts
// ❌ const [fullName, setFullName] = useState('');
//    useEffect(() => { setFullName(first + ' ' + last); }, [first, last]);
// ✅ const fullName = first + ' ' + last;
```

### U2. props를 state에 복사하지 마라

prop을 useState에 넣으면 부모 변경 무시됨. 직접 사용하거나 `initialX`로 명명.

```ts
// ❌ const [color, setColor] = useState(messageColor);
// ✅ const color = messageColor;
// ✅ function Message({ initialColor }: ...) { const [color, setColor] = useState(initialColor); }
```

### U3. 렌더에 영향 없는 값은 useRef

interval ID, 이전값, 내부 플래그 → useState 대신 useRef. `ref.current`는 렌더 중 읽기/쓰기 금지.

```ts
// ❌ const [intervalId, setIntervalId] = useState<number | null>(null);
// ✅ const intervalRef = useRef<number | null>(null);
```

### U5. 불가능한 상태를 discriminated union으로 제거

N개 boolean → 2^N 조합. 단일 status union으로 불가능한 상태 타입 레벨 차단.

```ts
// ❌ const [isSending, setIsSending] = useState(false);
//    const [isSent, setIsSent] = useState(false);
// ✅ type Status = 'typing' | 'sending' | 'sent';
//    const [status, setStatus] = useState<Status>('typing');
```

### U6. 객체 복사 대신 ID 저장

리스트에서 선택된 항목을 state에 복사 → 원본 수정 시 stale. ID만 저장 + 렌더 시 파생.

```ts
// ❌ const [selectedItem, setSelectedItem] = useState(items[0]);
// ✅ const [selectedId, setSelectedId] = useState(items[0].id);
//    const selectedItem = items.find(i => i.id === selectedId);
```

### U7. 관련 state는 하나의 객체로 그룹화

항상 함께 변하는 state → 하나의 setState로 원자적 업데이트.

```ts
// ❌ const [x, setX] = useState(0); const [y, setY] = useState(0);
// ✅ const [position, setPosition] = useState({ x: 0, y: 0 });
```

---

## Effect Usage (7개)

### U8. useEffect는 외부 시스템 동기화 전용

네트워크, DOM API, 브라우저 API 동기화에만 사용. 이벤트 핸들링, 데이터 변환에는 쓰지 마라.

```ts
// ❌ useEffect(() => { if (product.isInCart) showNotification('Added!'); }, [product]);
// ✅ function handleBuy() { addToCart(product); showNotification('Added!'); }
```

### U9. useEffect 체인 금지

하나의 effect가 setState → 다음 effect 트리거 → 순차 리렌더 + 추적 불가. 이벤트 핸들러나 reducer로 통합.

### U10. state 리셋은 key prop으로

`key={id}`로 재마운트. useEffect 리셋 → stale 값 한 프레임 노출.

```ts
// ❌ useEffect(() => { setComment(''); }, [userId]);
// ✅ <Profile userId={userId} key={userId} />
```

### U11. effect 안에서만 쓰는 객체/함수는 effect 내부에 선언

컴포넌트 본문에 선언 → 매 렌더 새 참조 → effect 매번 재실행.

```ts
// ❌ const options = { serverUrl, roomId };
//    useEffect(() => { connect(options); }, [options]);
// ✅ useEffect(() => {
//      const options = { serverUrl, roomId };
//      connect(options);
//    }, [roomId]);
```

### U12. 외부 스토어 구독은 useSyncExternalStore

브라우저 API, 서드파티 스토어 구독 → useState+useEffect 대신 useSyncExternalStore. concurrent rendering tearing 방지 + SSR 서버 스냅샷 지원.

### U13. 부모 알림은 이벤트 핸들러에서

자식이 부모에게 state 변경 알릴 때 useEffect가 아닌 같은 이벤트 핸들러에서 콜백 호출. 연쇄 리렌더 방지.

```ts
// ❌ useEffect(() => { onChange(isOn); }, [isOn]);
// ✅ function handleClick() { setIsOn(!isOn); onChange(!isOn); }
```

### U14. 비동기 effect는 반드시 cleanup

fetch/timer/subscription → cleanup 없으면 race condition. 빠른 prop 변경 시 이전 응답이 이후 응답을 덮어씀.

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

### U16. useCallback은 memo() 래핑된 자식에 전달할 때만

memo() 없는 자식에 stable reference → 리렌더 방지 효과 없음.

---

## Hook Design (1개)

### U17. 커스텀 훅은 재사용 가능한 상태 로직 추출용

lifecycle wrapper(`useMount`, `useEffectOnce`) 금지. 구체적 동기화 목적 훅(`useWindowSize`, `useOnlineStatus`)만.
추출 기준: 동일 state+effect 패턴이 2개+ 컴포넌트에서 반복되는지?
