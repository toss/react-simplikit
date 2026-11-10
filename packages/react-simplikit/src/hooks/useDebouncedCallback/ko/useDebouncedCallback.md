# useDebouncedCallback

`useDebouncedCallback`는 전달받은 콜백 함수의 디바운스된 버전을 반환하는 리액트 훅이에요. 함수 실행을 지연시키고 여러 번의 호출을 하나로 묶어 이벤트 처리를 최적화하는 데 도움이 돼요.

'leading'과 'trailing'을 모두 설정하면 지연 기간의 시작과 끝에 모두 함수를 호출해요. 다만 이렇게 동작하려면 디바운스 대기 시간 안에 디바운스된 함수를 최소 두 번 호출해야 해요. 한 번 호출해서는 함수가 두 번 실행되지 않기 때문이에요.

## 인터페이스

```ts
function useDebouncedCallback<T>(options: Object): (nextValue: T) => void;
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="옵션 객체예요."
  :nested="[
    {
      name: 'options.onChange',
      type: '(newValue: T) => void',
      required: true,
      description:
        '디바운스할 콜백이에요. 마지막으로 전달된 값과 같은 값으로 호출하면 건너뛰어요.',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: true,
      description:
        '함수 실행을 지연할 밀리초(ms)예요.',
    },
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
  type="(nextValue: T) => void"
  description="값을 <code>onChange</code>에 전달하는 디바운스된 함수예요."
/>

## 예시

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback({
    onChange: setQuery,
    timeThreshold: 300,
  });

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <p>검색어: {query}</p>
    </>
  );
}
```
