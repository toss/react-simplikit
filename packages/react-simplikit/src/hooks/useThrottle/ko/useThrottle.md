# useThrottle

`useThrottle`은 콜백 함수의 스로틀링된 버전을 만드는 리액트 훅이에요. 스크롤이나 리사이즈 이벤트를 처리할 때처럼 함수가 호출되는 빈도를 제한해야 할 때 유용해요.

## 인터페이스

```ts
function useThrottle<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
  options?: { edges?: Array<'leading' | 'trailing'> }
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
  name="wait"
  type="number"
  description="호출을 스로틀링할 간격(밀리초)이에요."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="스로틀 동작을 제어하는 옵션이에요."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '함수를 시작점, 끝점, 또는 둘 다에서 호출할지 지정하는 배열이에요. 생략할 수 있어요.',
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
