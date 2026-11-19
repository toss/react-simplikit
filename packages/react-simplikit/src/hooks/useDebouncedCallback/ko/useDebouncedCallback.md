# useDebouncedCallback

`useDebouncedCallback`는 전달받은 콜백 함수의 디바운스된 버전을 반환하는 리액트 훅이에요. 함수 실행을 지연시키고 여러 번의 호출을 하나로 묶어 이벤트 처리를 최적화하는 데 도움이 돼요.
디바운스된 함수는 `callback`과 같은 인자를 받고, 마지막 호출의 인자를 그대로 전달해요.

'leading'과 'trailing'을 모두 설정하면 지연 기간의 시작과 끝에 모두 함수를 호출해요. 다만 이렇게 동작하려면 디바운스 대기 시간 안에 디바운스된 함수를 최소 두 번 호출해야 해요. 한 번 호출해서는 함수가 두 번 실행되지 않기 때문이에요.

컴포넌트가 언마운트되거나 `debounceMs`, `leading`, `trailing`이 바뀌면 대기 중인 호출을 취소해요.
`.cancel()`은 대기 중인 호출만 취소하고, `callback`이 이미 시작한 작업은 멈추지 않아요.
`.cancel()` 뒤의 다음 호출은 새 연속 호출로 시작하므로, `leading`이 `true`이면 바로 실행돼요.

## 인터페이스

```ts
function useDebouncedCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="옵션 객체예요."
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: '디바운스할 함수예요.',
    },
    {
      name: 'options.debounceMs',
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
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="<code>callback</code>과 같은 인자를 받는 디바운스된 함수예요. 대기 중인 디바운스 실행을 취소하는 <code>cancel</code> 메서드도 포함해요."
/>

## 예시

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback({
    callback: setQuery,
    debounceMs: 300,
  });

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <button type="button" onClick={() => setQueryDebounced.cancel()}>
        대기 중인 업데이트 취소
      </button>
      <p>검색어: {query}</p>
    </>
  );
}
```
