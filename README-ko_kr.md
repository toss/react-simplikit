![react-simplikit](src/public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | 한국어

`react-simplikit`은 React 환경에서 유용하게 사용할 수 있는 다양한 유틸리티를 제공하는 가볍고 강력한 라이브러리예요.

- `react-simplikit`은 의존성이 없어서 매우 가벼워요.
- `react-simplikit`은 100% 테스트 커버리지를 통해 신뢰성을 보장해요.
- `react-simplikit`은 JSDoc과 풍부한 문서, 예제를 제공해서 어떤 개발자도 쉽게 사용할 수 있어요.

## 라이브러리 운영 방향

**react-simplikit은 이제 완전히 순수한 상태/로직 훅만을 위한 Universal Hook Library로 유지됩니다.**

react-simplikit은 웹/앱(React Native 등) 어디서든 동작 가능한, **플랫폼에 종속되지 않은 순수 상태/로직 훅만을 제공하는 라이브러리**로 재편됩니다.

### 유지되는 것: 순수 상태/로직 훅

특정 플랫폼 API에 의존하지 않는 순수 로직 기반 훅들은 계속 제공돼요:

- `useToggle`, `useBooleanState`, `useCounter` 같은 상태 관리 훅
- `usePrevious`, `useMount` 같은 라이프사이클 훅
- `useDebounce`, `useThrottle` 같은 유틸리티 훅
- **기존 프로젝트의 Backward Compatibility(BC)는 보존돼요**

### Deprecated 되는 것: 브라우저/플랫폼 결합 훅

다음과 같이 브라우저에 강하게 의존하는 훅들은 Deprecated 처리돼요:

- `useGeolocation` - `navigator.geolocation` 의존
- `useStorageState` - `localStorage`/`sessionStorage` 의존
- `useIntersectionObserver` - `IntersectionObserver` API 의존
- `useImpressionRef` - `IntersectionObserver` + Visibility API 의존
- `useDoubleClick`, `useLongPress` - DOM 이벤트 + `window.setTimeout` 의존
- `useOutsideClickEffect` - DOM 이벤트 + `document` 의존
- `useVisibilityEvent` - `document.visibilityState` 의존

이 훅들은:

- 새 기능 추가나 적극적인 고도화는 진행하지 않고
- 문서 상에서 `@deprecated`로 명시하고
- 장기적으로는 메이저 버전 업데이트에서 제거를 검토할 수 있어요

### 패키지 상태

- react-simplikit은 **아카이브하지 않아요**
- 순수 상태/로직 훅들은 계속 유지돼요
- 치명적인 버그 수정, 최소한의 유지보수는 계속 진행할 예정이에요
- 새로운 브라우저/플랫폼 종속 훅을 추가하는 일은 이제 지양해요

## 예시

```tsx
import { useBooleanState } from 'react-simplikit';

function Component() {
  // `useBooleanState` 훅을 사용해 상태를 관리해요.
  const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] =
    useBooleanState(false);

  return (
    <div>
      <p>Bottom Sheet 상태: {open ? '열림' : '닫힘'}</p>
      <button onClick={openBottomSheet}>열기</button>
      <button onClick={closeBottomSheet}>닫기</button>
      <button onClick={toggleBottomSheet}>토글</button>
    </div>
  );
}
```

## 기여하기

커뮤니티에 있는 모든 분들에게 기여를 환영해요. 아래에 작성되어 있는 기여 가이드를 확인하세요.

[CONTRIBUTING](./src/docs/ko/contributing.md)

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](./LICENSE)를 참고하세요.
