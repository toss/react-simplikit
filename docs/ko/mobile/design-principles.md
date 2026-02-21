# 설계 원칙

`@react-simplikit/mobile`은 `react-simplikit`의 핵심 원칙을 따르면서, 모바일 환경에 특화된 고려사항을 추가로 다루고 있어요.

## 핵심 원칙

### React의 생명주기를 존중하고 간섭하지 않기

`@react-simplikit/mobile`은 React의 생명주기에 직접적으로 간섭하는 구현체를 포함하지 않아요.
예를 들어, `useMount`나 `useLifecycles`와 같은 훅을 제공하지 않고, React의 기본 동작을 존중하고 활용하는 접근 방식을 선호해요.

### 의존성 없음을 통한 가볍고 빠른 성능

`@react-simplikit/mobile`은 의존성이 전혀 없어요. 추가 라이브러리에 의존하지 않음으로써 프로젝트에 통합할 때 번들 크기를 최소화하고 성능 저하에 대한 우려를 없애요.

### 100% 테스트 커버리지를 통한 신뢰성 보장

`@react-simplikit/mobile`은 모든 함수와 분기를 철저하게 테스트해요.
기본 기능뿐만 아니라 각 구현체의 SSR 환경 고려사항도 포함하는 포괄적인 테스트를 작성하여, 예상치 못한 동작으로 인한 문제를 방지해요.

### 쉬운 이해와 사용을 위한 포괄적인 문서

`@react-simplikit/mobile`은 사용자가 각 기능을 빠르게 이해하고 활용할 수 있도록 상세한 문서를 제공해요. 문서에는 다음이 포함돼요:

- **JSDoc 주석**: 각 함수의 동작, 매개변수, 반환 값에 대한 자세한 설명.
- **사용 가이드**: 즉시 시작할 수 있는 명확하고 따라하기 쉬운 지침.
- **실용적인 예제**: 실제 시나리오에서 구현체를 활용하는 방법을 보여주는 예제.

### 완전한 TypeScript 지원을 통한 타입 안전성

`@react-simplikit/mobile`은 처음부터 TypeScript로 구축되었어요. 모든 훅과 유틸리티는 다음을 제공해요:

- **엄격한 타입 정의**: 모든 매개변수, 반환 값, 옵션이 완전히 타입화되어 있어요
- **IntelliSense 지원**: IDE에서 자동완성과 인라인 문서를 제공받을 수 있어요
- **제네릭 타입**: 타입 정보를 보존하는 유연한 API를 제공해요
- **`any` 타입 없음**: 타입 안전성을 손상시키는 escape hatch를 사용하지 않아요

## API 설계 표준

### 훅 반환 값

훅 반환 값에 대해 일관된 패턴을 따르고 있어요:

- **객체**: 상태와 관련 값들에 사용 (예: `useKeyboardHeight(): { keyboardHeight }`, `useVisualViewport(): { viewport }`)
- **void**: 사이드 이펙트 전용 훅에 사용 (예: `useBodyScrollLock(): void`)

### 파라미터

- 필수 파라미터가 먼저 오고, 선택 파라미터가 뒤에 와요
- 3개 이상의 선택 파라미터가 있는 경우 옵션 객체를 사용해요

### SSR 안전 패턴

모든 훅은 SSR 안전 패턴을 따라요:

```typescript
// ✅ SSR 안전 - 모든 훅이 이 패턴을 따라요
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

## 모바일 특화 원칙

### 플랫폼 인식 설계

구현에서 iOS와 Android의 동작 차이를 고려해요:

- **Visual Viewport API 차이**:
  - iOS: 키보드가 나타나면 `offsetTop`이 음수가 돼요
  - Android: `offsetTop`은 일반적으로 0을 유지해요
- **키보드 높이 계산**: 정확한 측정을 위한 플랫폼별 처리

### SSR 안전성 우선

모든 훅은 안전한 서버 사이드 렌더링을 보장하기 위해 SSR 테스트를 포함해요:

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

### 성능 최적화

모바일 환경은 성능에 대한 특별한 주의가 필요해요:

- **이벤트 쓰로틀링/디바운싱**: 스크롤, 리사이즈 같은 빈번한 이벤트 최적화
- **패시브 이벤트 리스너**: 해당하는 경우 패시브 리스너 사용
- **React 트랜지션**: 급하지 않은 업데이트에 `startTransition` 활용
