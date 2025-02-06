# useAsyncEffect

`useAsyncEffect`는 React 컴포넌트에서 비동기 작업을 처리하기 위한 커스텀 훅이에요.
`useEffect`와 동일한 정리(cleanup) 패턴을 따르면서, 비동기 작업을 안전하게 수행할 수 있도록 도와줘요.
이를 활용하면 `useEffect` 내부에서 `async` 함수를 직접 사용하는 대신, 더 간결하고 안정적으로 비동기 코드를 작성할 수 있어요.

## 인터페이스

```tsx
function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps?: DependencyList): void;
```

### 파라미터

- `effect` (`() => Promise<void | (() => void)>`): `useEffect` 패턴으로 실행할 비동기 함수예요.  
  이 함수는 비동기 작업을 수행하고, 선택적으로 정리(cleanup) 함수를 반환할 수 있어요.
- `deps` (`DependencyList`): 의존성 배열이에요.  
  이 배열의 값이 변경될 때마다 `effect`가 다시 실행돼요. 생략하면 마운트 시 한 번만 실행돼요.

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
import { useAsyncEffect } from 'reactive-kit';

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
