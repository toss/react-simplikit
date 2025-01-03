# useAsyncEffect

`useAsyncEffect`는 React 컴포넌트에서 비동기 작업을 처리하기 위한 커스텀 훅이에요. `useEffect`와 동일한 정리(cleanup) 패턴을 따르면서, 비동기 작업을 안전하게 수행할 수 있도록 도와줘요.

## 인터페이스

```ts
function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps?: DependencyList): void;
```

### 파라미터

- `effect` (`() => Promise<void | (() => void)>`): useEffect 패턴으로 실행할 비동기 함수이에요.
- `deps` (`DependencyList`): 의존성 배열이에요.

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
import { useAsyncEffect } from 'reactie';

function Component() {
  const [data, setData] = useState<Data | null>(null);

  useAsyncEffect(async () => {
    const data = await fetchData();
    setData(data);

    return () => {
      // cleanup logic
    };
  }, [dependency]);

  return (
    <div>
      <p>Data: {data}</p>
    </div>
  );
}
```
