# useIsomorphicLayoutEffect

`useIsomorphicLayoutEffect`는 서버 사이드 렌더링 중에 경고를 일으키지 않고 브라우저에서 `useLayoutEffect`를 실행하는 리액트 훅이에요. SSR 환경에서는 동기적으로 측정하거나 변경할 DOM이 없기 때문에, `useLayoutEffect`를 사용하면 리액트가 경고를 보내요.

리액트는 서버에서 effect를 실행하지 않으므로 effect는 브라우저에서만 실행돼요. 서버에서 이 훅은 `useEffect`이고, 리액트는 이를 실행하지 않아요. 이 훅은 경고를 피하기 위해서만 존재해요. 서버에서 아무것도 실행하지 않으며, 서버 출력을 클라이언트와 맞춰 주지도 않아요.

브라우저에서는 DOM 업데이트 후 페인트 전에 동기적으로 실행되므로, 다음과 같은 상황에 적합해요.

- 렌더링 후 DOM 요소 측정
- 페인트 전 DOM 변경 적용
- UI 깜박임 또는 레이아웃 이동 방지

## 인터페이스

```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void;
```

### 파라미터

<Interface
  required
  name="effect"
  type="React.EffectCallback"
  description="발생시킬 사이드이펙트 함수예요."
/>

<Interface
  name="deps"
  type="React.DependencyList"
  description="선택 가능한 의존성 배열이에요."
/>

### 반환 값

이 함수는 아무 것도 반환하지 않아요.

## 예시

```tsx
useIsomorphicLayoutEffect(() => {
  // 클라이언트 측의 레이아웃 단계에서 실행될 코드
}, [dep1, dep2, ...]);
```
