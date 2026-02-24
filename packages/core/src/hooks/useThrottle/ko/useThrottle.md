# useThrottle

콜백 함수를 제한적으로 실행하는 버전을 만들어요. 이 기능은 함수가 호출될 수 있는 빈도를 제한하는 데 유용하며, 예를 들어 스크롤이나 리사이즈 이벤트를 처리할 때 사용돼요.

## Interface

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
  description="스로틀링할 함수예요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="호출을 스로틀링할 밀리초의 수예요."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="스로틀의 동작을 제어하기 위한 옵션이에요."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '함수가 시작점, 끝점 또는 둘 다에서 호출될지 여부를 지정하는 선택적 배열이에요.',
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
