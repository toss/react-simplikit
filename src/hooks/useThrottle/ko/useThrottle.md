# useThrottle

`useThrottle`는 콜백 함수를 제한된 속도로 호출할 수 있도록 하는 React 훅이에요. 예를 들어 스크롤이나 리사이즈 이벤트를 처리할 때와 같이 함수 호출 속도를 제한하는 데 유용해요.

## 인터페이스

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options: { edges?: Array<'leading' | 'trailing'> }
): F & { cancel: () => void };
```

### 파라미터

<Interface
  required
  name="callback"
  type="F"
  description="제한할 함수예요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="함수가 제한되어 호출되는 밀리초 단위의 시간이에요."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="제한의 동작을 제어하는 옵션이에요."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '함수가 시작, 끝 또는 둘 다에서 호출되어야 하는지를 지정하는 선택적 배열이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="대기 중인 실행을 취소할 수 있는 <code>cancel</code> 메서드와 함께 제한된 함수를 반환해요."
/>

## 예시

```tsx
const throttledScroll = useThrottle(
  () => {
    console.log('스크롤 이벤트');
  },
  200,
  { edges: ['leading', 'trailing'] }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
