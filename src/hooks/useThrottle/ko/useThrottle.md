# useThrottle

리액트 훅으로, 콜백 함수를 제한된 버전으로 만들어 줘요. 이는 예를 들어 스크롤이나 리사이즈 이벤트를 처리할 때, 함수가 호출되는 속도를 제한하는 데 유용해요.

## 인터페이스
```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options: { edges?: Array<"leading" | "trailing"> },
): F & { cancel: () => void };

```

### 파라미터

<Interface
  required
  name="callback"
  type="F"
  description="제한된 버전으로 만들 함수예요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="호출을 제한할 밀리초 수예요."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="스로틀 동작을 제어하기 위한 옵션이에요."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: 'false',
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '함수가 시작점, 끝점, 또는 두 곳 모두에서 호출될지를 지정하는 선택적 배열이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="<code>cancel</code> 메서드로 대기 중인 실행을 취소할 수 있는 제한된 함수를 반환해요."
/>


## 예시

```tsx
const throttledScroll = useThrottle(() => {
  console.log('스크롤 이벤트');
}, 200, { edges: ['leading', 'trailing'] });

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```

