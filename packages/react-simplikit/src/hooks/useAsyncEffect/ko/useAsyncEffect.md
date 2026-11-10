# useAsyncEffect

`useAsyncEffect`는 컴포넌트에서 비동기 사이드이펙트를 처리하는 React 훅이에요. `useEffect`와 같은 정리(cleanup) 패턴을 따르면서 비동기 작업을 안전하게 처리해요.

## 인터페이스

```ts
function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: DependencyList
): void;
```

### 파라미터

<Interface
  required
  name="effect"
  type="() => Promise<void | (() => void)>"
  description="<code>useEffect</code>와 같은 방식으로 실행되는 비동기 함수예요. 필요하면 정리 함수를 반환할 수 있어요."
/>

<Interface
  name="deps"
  type="DependencyList"
  description="의존성 배열이에요. 배열 안의 값이 바뀔 때마다 <code>effect</code>를 다시 실행해요. 생략하면 컴포넌트가 렌더링될 때마다 실행해요."
/>

### 반환 값

이 함수는 아무것도 반환하지 않아요.

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
