# useDebouncedState

`useDebouncedState`는 상태를 직접 관리하고, 디바운스가 적용된 setter를 반환하는 리액트 훅이에요. 기본 설정에서는 마지막 setter 호출 뒤 `debounceMs` 밀리초가 지나면 상태가 갱신돼요. 검색 입력처럼 연속으로 발생하는 변경 요청을 마지막 값으로 모아 반영할 때 유용해요.

첫 렌더와 서버 렌더에서는 초기값을 그대로 반환해요. 마운트 시점에는 갱신을 예약하지 않으므로, `leading: true`이면 마운트 뒤 첫 setter 호출이 즉시 반영돼요. `leading`과 `trailing`이 모두 `false`이면 상태가 갱신되지 않아요.

컴포넌트가 언마운트되거나 `debounceMs`, `leading`, `trailing`이 변경되면 대기 중인 갱신을 취소해요.

## 인터페이스

```ts
function useDebouncedState<T>(
  initialValue: T,
  debounceMs: number,
  options?: DebounceOptions
): [state: T, setState: Dispatch<SetStateAction<T>>];
```

### 파라미터

<Interface
  required
  name="initialValue"
  type="T"
  description="첫 렌더에서만 사용하는 초기 상태 값이에요."
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="마지막 setter 호출 뒤 갱신하기 전까지 기다리는 밀리초 단위의 시간이에요."
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
        '<code>true</code>이면 유휴 기간 뒤 첫 setter 호출이 즉시 반영돼요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 <code>debounceMs</code> 밀리초 뒤 마지막 값이 반영돼요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="[state: T, setState: Dispatch<SetStateAction<T>>]"
  description="다음 요소를 담은 튜플이에요."
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: '현재 상태 값이에요.',
    },
    {
      name: 'setState',
      type: 'Dispatch<SetStateAction<T>>',
      required: false,
      description: '다음 상태 값이나 업데이트 함수를 받는 디바운스된 setter예요.',
    },
  ]"
/>

## 예시

```tsx
import { useDebouncedState } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useDebouncedState('', 300);

  return (
    <>
      <label>
        Search
        <input onChange={event => setQuery(event.target.value)} />
      </label>
      <output aria-live="polite">{query}</output>
    </>
  );
}
```
