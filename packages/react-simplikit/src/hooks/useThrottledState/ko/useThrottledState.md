# useThrottledState

`useThrottledState`는 상태를 직접 관리하고, 스로틀이 적용된 setter를 반환하는 리액트 훅이에요.
기본 설정에서는 첫 setter 호출을 즉시 반영하고, 이후 호출에는 `throttleMs`를 기준으로 스로틀을 적용하며,
대기 중인 마지막 값은 trailing 시점에 반영해요.
스크롤처럼 자주 발생하는 이벤트의 상태 갱신 빈도를 제한할 때 유용해요.

첫 렌더와 서버 렌더에서는 초기값을 그대로 반환해요. 마운트 시점에는 갱신을 예약하지 않으므로,
`leading: true`이면 마운트 뒤 첫 setter 호출이 즉시 반영돼요.
`leading`과 `trailing`이 모두 `false`이면 상태가 갱신되지 않아요.

컴포넌트가 언마운트되거나 `throttleMs`, `leading`, `trailing`이 변경되면 대기 중인 갱신을 취소해요.

## 인터페이스

```ts
function useThrottledState<T>(
  initialValue: T,
  throttleMs: number,
  options?: ThrottleOptions
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
  name="throttleMs"
  type="number"
  description="밀리초 단위의 스로틀 구간 길이예요."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="스로틀 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 스로틀 구간의 시작에서 즉시 갱신할 수 있어요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 지연 시간이 지난 뒤 최신 값으로 대기 중인 갱신을 실행할 수 있어요.',
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
      description: '다음 상태 값이나 이전 상태를 받는 updater 함수를 받는 스로틀된 setter예요.',
    },
  ]"
/>

## 예시

```tsx
import { useThrottledState } from 'react-simplikit';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useThrottledState(0, 200);

  return (
    <div onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
