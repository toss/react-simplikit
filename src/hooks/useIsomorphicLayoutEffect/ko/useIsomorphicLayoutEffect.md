# useIsomorphicLayoutEffect

`useIsomorphicLayoutEffect`는 서버 사이드 렌더링 중에 경고를 발생시키지 않고 `useLayoutEffect`의 동작을 제공하는 리액트 훅이에요. SSR 동안에는 동기적으로 측정하거나 변경할 DOM이 없기 때문에, 리액트는 `useLayoutEffect`의 사용에 대해 경고해요. 이 훅은 DOM 업데이트 후, 페인트 전에 동기적으로 실행되어 다음에 이상적이에요:

- 렌더링 후 DOM 요소를 측정할 때
- 페인트 전에 DOM 변경을 적용할 때
- UI 깜빡임이나 레이아웃 이동을 방지할 때
- 클라이언트와 서버 환경 모두를 안전하게 지원할 때

## Interface

```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList
): void;
```

### 파라미터

<Interface
  requi...   name="effect"
  type="React.EffectCallback"
  description="이펙트 함수예요."
/>

<Interface
  name="deps"
  type="React.DependencyList"
  description="옵션으로 제공되는 의존성 배열이에요."
/>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
useIsomorphicLayoutEffect(() => {
  // 클라이언트 측에서 레이아웃 단계 동안 실행될 코드예요
}, [dep1, dep2, ...]);
```
