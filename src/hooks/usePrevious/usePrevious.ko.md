# usePrevious

입력된 상태의 이전 값을 반환해요. 이전 값은 리렌더링이 발생할 때마다 계산되고, 기본적으로는 상태의 값이 변경될 때 업데이트 되어요. 상태 값의 변경을 감지하는 기준이 되는 compare 함수는 기본적으로 `prev === next` 계산을 수행해요.

## 인터페이스

```typescript
function usePrevious<T>(state: T, compare?: (prev: T, next: T) => boolean): T;
```

### 파라미터

- `state` (`T`): 이전 값을 구할 대상 상태에요.
- `compare` (`(prev: T | undefined, next: T) => boolean`, optional): 값이 변했는 지 감지하기 위한 비교 함수예요. 기본적으로는 `prev === next`를 통해 값을 비교해요.

### 반환 값

상태의 이전 값이에요.

## 예시

### 기본 예제

```typescript
const [count, setCount] = useState(0);

// 초기 값은 `0`예요.
const previousCount = usePrevious(count);

// ...

setCount(prev => prev + 1); // count: 1, previous: 0

setUnrelated(prev => prev + 1); // previous: 0

setCount(prev => prev + 1); // count: 2, previous: 1
```

### 커스텀 compare 함수 사용

```typescript
const compareObject = (prev: Record<string, unknown> | undefined, next: Record<string, unknown>) => {
  if (prev === undefined) {
    return false;
  }

  return Object.entries(prev).every(([key, value]) => next[key] === value);
};

const [data, setData] = useState({ hello: 'world' });
const [unrelated, setUnrelated] = useState(0);

// initial value of previousData is `{ hello: 'world' }`
const previousData = usePrevious(data, customCompare);

// ...

setUnrelated(prev => prev + 1); // previous: { hello: 'world' }

setData({ hello: 'world!' }); // data: { hello: 'world!' }, previous: { hello: 'world' }
```
