# useDebounce

`useDebounce`는 전달한 콜백 함수의 디바운스 버전을 반환하는 리액트 훅이에요. 함수 실행을 지연시키고 여러 호출을 하나로 묶어 이벤트 처리를 최적화하는 데 도움이 돼요.

기본 옵션에서는 추가 호출 없이 `debounceMs` 밀리초가 지나면 마지막 호출을 실행해요. 컴포넌트가 언마운트되거나 `debounceMs`, `leading`, `trailing`이 바뀌면 대기 중인 호출을 취소해요. `.cancel()`은 대기 중인 콜백만 취소하고 이미 시작한 네트워크 요청은 취소하지 않아요. 예시는 검색어를 서버로 보내지 않고 화면에 표시해요. 서버에서 검색하려면 `useDebounce`의 첫 번째 인자로 애플리케이션의 검색 콜백을 전달하세요.

## 인터페이스

```ts
function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  debounceMs: number,
  options?: DebounceOptions
): F & { cancel: () => void };
```

### 파라미터

<Interface
  required
  name="callback"
  type="F"
  description="디바운스할 함수예요."
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="함수 실행을 지연할 시간(밀리초)이에요."
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="디바운스 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '<code>true</code>이면 연속 호출이 시작될 때 함수를 호출해요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 연속 호출이 끝날 때 함수를 호출해요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="콜백 호출을 지연하는 디바운스된 함수예요. 대기 중인 디바운스 실행을 모두 취소하는 <code>cancel</code> 메서드도 포함해요."
/>

## 예시

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const debouncedSearch = useDebounce(setSubmittedQuery, 300);

  return (
    <section>
      <label>
        Search
        <input
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            debouncedSearch(event.target.value);
          }}
        />
      </label>
      <output aria-live="polite">{submittedQuery}</output>
      <button type="button" onClick={() => debouncedSearch.cancel()}>
        Cancel pending update
      </button>
    </section>
  );
}
```
