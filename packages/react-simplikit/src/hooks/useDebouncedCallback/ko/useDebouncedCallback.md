# useDebouncedCallback

`useDebouncedCallback`는 제공된 콜백 함수를 디바운스된 버전으로 반환하는 리액트 훅이에요. 이는 함수 실행을 지연시키고 여러 호출을 하나로 묶어 이벤트 처리를 최적화하는 데 도움이 돼요. 'leading'과 'trailing'이 모두 포함된 경우, 함수는 지연 기간의 시작과 끝에 모두 호출돼요. 하지만 이렇게 동작하려면 디바운스 밀리초(ms) 내에 최소 두 번 호출되어야 해요, 한 번의 디바운스된 함수 호출로 함수가 두 번 호출되지 않아요.

## 인터페이스

```ts
function useDebouncedCallback<T>(
  onChange: (newValue: T) => void,
  debounceMs: number,
  options?: DebounceOptions
): (nextValue: T) => void;
```

### 파라미터

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="값을 전달받을 콜백이에요."
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="디바운스 지연 시간(ms)이에요."
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="추가 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 시작에 호출돼요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 끝에 호출돼요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="(nextValue: T) => void"
  description="값을 <code>onChange</code>에 전달하는 디바운스된 함수예요."
/>

## 예시

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback(setQuery, 300);

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <p>검색어: {query}</p>
    </>
  );
}
```
