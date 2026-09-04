# useDebouncedValue

`useDebouncedValue`는 전달받은 값의 디바운스된 사본을 반환하는 리액트 훅이에요. 상태는 호출자가 그대로 소유하고, 훅은 반환값이 그 상태를 얼마나 늦게 따라갈지만 조절해요. 반환값은 마지막 변경 뒤 `wait` 밀리초가 지나면 갱신되므로, 빠르게 바뀌는 상태에서 검색어나 검증 대상을 파생할 때 유용해요.

첫 렌더와 서버 렌더에서는 값을 그대로 돌려줘요. 마운트 시점에는 갱신을 예약하지 않으므로 `leading: true`이면 마운트 뒤 첫 변경이 즉시 반영돼요. `leading`과 `trailing`이 모두 `false`이면 반환값은 갱신되지 않아요.

값은 참조로 비교해요. 렌더마다 새 객체나 배열을 전달하면 반환값이 `wait` 밀리초마다 계속 갱신되니, `usePreservedReference` 같은 방법으로 참조를 먼저 안정화하세요.

## 인터페이스

```ts
function useDebouncedValue<T>(
  value: T,
  wait: number,
  options: DebounceOptions
): T;
```

### 파라미터

<Interface
  required
  name="value"
  type="T"
  description="디바운스할 값이에요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="마지막 변경 뒤 갱신까지 기다릴 밀리초(ms)예요."
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
        '<code>true</code>이면 유휴 상태 뒤 첫 변경을 즉시 반영해요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 마지막 변경을 <code>wait</code> 밀리초 뒤에 반영해요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="T"
  description="디바운스된 값이에요."
/>

## 예시

```tsx
import { useDebouncedValue } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SearchResults query={debouncedQuery} />
    </>
  );
}
```
