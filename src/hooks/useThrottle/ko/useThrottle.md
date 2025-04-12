# useThrottle

리액트 훅이 콜백 함수의 쓰로틀 버전을 생성해요. 이는 스크롤 또는 리사이즈 이벤트를 처리할 때와 같이 함수가 호출되는 빈도를 제한하는 데 유용해요.

## 인터페이스
```ts
function useThrottle<F>(
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
  description="쓰로틀이 적용될 함수예요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="호출을 쓰로틀해야 하는 밀리초 단위의 시간이에요."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="쓰로틀의 동작을 제어하는 옵션이에요."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: 'false',
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '함수가 선행 엣지, 후행 엣지, 또는 둘 다에서 호출되어야 하는지를 지정하는 선택적 배열이에요. (선행 엣지: leading edge, 후행 엣지: trailing edge)'
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="보류 중인 실행을 취소하는 <code>cancel</code> 메서드를 가진 쓰로틀된 함수를 반환해요."
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
  
