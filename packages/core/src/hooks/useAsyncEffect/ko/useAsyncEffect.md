# useAsyncEffect

`useAsyncEffect`는 리액트 컴포넌트에서 비동기 사이드이펙트를 처리하기 위한 커스텀 훅이에요. `useEffect`와 동일한 정리(clean-up) 패턴을 따르면서 비동기 작업이 안전하게 처리되도록 해요.

## 인터페이스

```ts
function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: DependencyList
): void;
```

### 파라미터

<Interface
  name="effect"
  type="() => Promise<void | (() => void)>"
  description="<code>useEffect</code> 패턴으로 실행되는 비동기 함수예요. 이 함수는 선택적으로 정리(clean-up) 함수를 반환할 수 있어요."
/>

<Interface
  name="deps"
  type="DependencyList"
  description="의존성 배열이에요. 이 배열의 값이 변경될 때마다 효과가 다시 실행돼요. 만약 생략하면, 컴포넌트가 리렌더링 될 때마다 실행돼요."
/>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('컴포넌트가 언마운트되거나 의존성이 변경될 때 정리해요');
  };
}, [dependencies]);
```
