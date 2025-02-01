# useDebounce

`useDebounce`는 함수 호출을 지연시키고 여러 번의 연속된 호출을 하나로 묶어주는 React 훅이에요.

## 인터페이스

```ts
function useDebounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): F & { cancel: () => void };
```

### 파라미터

- `callback` (`F`): 디바운스할 함수예요.
- `wait` (`number`): 디바운스 대기 시간(밀리초)이에요.
- `options` (`object`): 디바운스 동작을 설정하는 옵션이에요.
  - `leading` (`boolean`): `true`면 시퀀스의 시작에서 함수를 실행해요. 기본값은 `false`예요.
  - `trailing` (`boolean`): `true`면 시퀀스의 끝에서 함수를 실행해요. 기본값은 `true`예요.

### 반환 값

디바운스된 함수를 반환해요. 이 함수는 원본 함수의 타입을 유지하면서 `cancel` 메서드를 추가로 가져요:

- `cancel` (`() => void`): 대기 중인 디바운스 실행을 취소하는 함수예요.

## 예시

```tsx
import { useDebounce } from 'reactive-kit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // 실제 검색 API 호출
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="검색어를 입력하세요"
    />
  );
}
```
