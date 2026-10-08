# useThrottle

콜백 함수를 제한적으로 실행하는 버전을 만들어요. 이 기능은 함수가 호출될 수 있는 빈도를 제한하는 데 유용하며, 예를 들어 스크롤이나 리사이즈 이벤트를 처리할 때 사용돼요.

## 인터페이스

```ts
function useThrottle<F extends (...args: any[]) => any>(
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
  description="호출을 스로틀링할 밀리초의 수예요."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="스로틀의 동작을 제어하기 위한 옵션이에요."
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
  description="<code>cancel</code> 메서드가 있는 스로틀링된 함수가 반환돼요, 이 메서드는 보류 중인 실행을 취소해요."
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
