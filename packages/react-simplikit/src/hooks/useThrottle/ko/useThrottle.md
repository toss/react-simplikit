# useThrottle

`useThrottle`은 콜백 함수의 스로틀링된 버전을 만드는 리액트 훅이에요. 스크롤이나 리사이즈 이벤트를 처리할 때처럼 함수가 호출되는 빈도를 제한해야 할 때 유용해요.

## 인터페이스

```ts
function useThrottle<F extends (...args: any[]) => unknown>(
  callback: F,
  throttleMs: number,
  options?: ThrottleOptions
): F & { cancel: () => void };
```

### 파라미터

<Interface
  required
  name="callback"
  type="F"
  description="스로틀링할 함수예요."
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="호출을 스로틀링할 간격(밀리초)이에요."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="스로틀 동작을 제어하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 스로틀 구간이 시작될 때 즉시 호출할 수 있어요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code>이면 대기 중인 호출을 지연 시간이 지난 뒤 최신 인자로 실행할 수 있어요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="스로틀링된 함수를 반환해요. 이 함수에는 대기 중인 실행을 취소하는 <code>cancel</code> 메서드가 있어요."
/>

## 예시

```tsx
const throttledScroll = useThrottle(
  () => {
    console.log('Scroll event');
  },
  200,
  { leading: true, trailing: true }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
