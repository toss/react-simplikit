# useIsomorphicLayoutEffect

`useIsomorphicLayoutEffect`는 서버 측 렌더링 중 경고를 유발하지 않으면서 `useLayoutEffect`의 동작을 제공하는 리액트 훅이에요. SSR 동안, 동기적으로 측정하거나 변형할 DOM이 없으므로 리액트는 `useLayoutEffect` 사용에 대해 경고해요. 이 훅은 DOM 업데이트 후 동기적으로 실행되지만, 그리기 전에 실행되어 다음과 같은 경우에 이상적이에요: - 렌더링 후 DOM 요소 측정하기 - 그리기 전 DOM 변경 사항 적용하기 - UI 깜박임이나 레이아웃 이동 방지하기 - 클라이언트와 서버 환경 모두 안전하게 지원하기 위해

## 인터페이스

```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList
): void;
```

### 파라미터

<Interface
  required
  name="effect"
  type="React.EffectCallback"
  description="효과 함수예요."
/>

<Interface
  name="deps"
  type="React.DependencyList"
  description="옵션인 의존성 배열이에요."
/>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
useIsomorphicLayoutEffect(() => {
  // 클라이언트 측에서 레이아웃 단계 동안 실행될 코드예요
}, [dep1, dep2, ...]);
```
