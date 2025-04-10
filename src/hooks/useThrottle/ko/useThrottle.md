# useThrottle

리액트 훅으로, 콜백 함수를 제한된 버전으로 만드는 데 사용해요. 이는 스크롤이나 리사이즈 이벤트를 처리할 때와 같이 함수 호출 빈도를 제한하는 데 유용해요.

## Interface
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
  description="스로틀링할 함수예요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="스로틀링 호출을 밀리초로 제한할 수예요."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="스로틀의 동작을 제어하기 위한 옵션이에요."
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="<code>cancel</code> 메서드를 가진 제한된 함수를 반환해요. 대기 중인 실행을 취소할 수 있어요."
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
  