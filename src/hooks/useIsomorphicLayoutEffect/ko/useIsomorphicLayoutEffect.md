# useIsomorphicLayoutEffect

SSR 중에는 동기적으로 측정하거나 변경할 DOM이 없어서 React는 useLayoutEffect 사용에 대해 경고해요. 이 훅은 브라우저에서 SSR 경고를 트리거하지 않고 useLayoutEffect의 동작을 제공해요. DOM 업데이트 후 페인트 전에 동기적으로 실행되며, 다음에 이상적이에요: 

- 렌더링 후 DOM 요소 측정
- 페인트 전 DOM 변경 적용
- UI 깜박임 또는 레이아웃 이동 방지
- 클라이언트와 서버 환경 모두 안전하게 지원

## 인터페이스
```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList,
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
  description="선택 가능한 의존성 배열이에요."
/>

### 반환 값

이 훅은 아무 것도 반환하지 않아요.

## 예시

```tsx
useIsomorphicLayoutEffect(() => {
  // 클라이언트 측의 레이아웃 단계에서 실행될 코드
}, [dep1, dep2, ...]);
```
  