# useAsyncEffect

`useAsyncEffect`는 React 컴포넌트에서 비동기 부작용을 처리하기 위한 커스텀 훅이에요. 이 훅은 `useEffect`와 동일한 클린업 패턴을 따르며, 비동기 작업이 안전하게 처리되도록 보장해요.

## Interface
```ts
function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: DependencyList,
): void;

```

### 파라미터

<Interface
  required
  name="effect"
  type="() => Promise<void | (() => void)>"
  description="<code>useEffect</code> 패턴으로 실행되는 비동기 함수에요. 이 함수는 선택적으로 클린업 함수를 반환할 수 있어요."
/>

<Interface
  name="deps"
  type="DependencyList"
  description="의존성 배열이에요. 이 배열의 어떤 값이 변경되면 효과는 다시 실행돼요. 생략하면, 컴포넌트가 마운트될 때 한 번만 실행돼요."
/>

### 반환 값

이 훅은 아무 것도 반환하지 않아요.

## 예시

```tsx
useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('언마운트되거나 의존성이 변경될 때 클린업해요');
  };
}, [dependency]);
```
  
