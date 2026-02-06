# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | 한국어

React 환경에서 유용하게 사용할 수 있는 다양한 훅, 컴포넌트, 유틸리티를 제공하는 가볍고 강력한 라이브러리예요.

## 특징

- **의존성 없음** - 매우 가벼워요
- **100% TypeScript** - 완벽한 타입 안전성
- **100% 테스트 커버리지** - 신뢰할 수 있어요
- **SSR 안전** - Next.js 등 SSR 프레임워크에서 동작해요
- **Tree-shakeable** - 사용하는 것만 번들에 포함돼요

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

## 설치

```bash
npm install react-simplikit
# or
yarn add react-simplikit
# or
pnpm add react-simplikit
```

## 빠른 시작

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

## 포함된 기능

### Hooks

| Hook                      | 설명                                                  |
| ------------------------- | ----------------------------------------------------- |
| `useBooleanState`         | boolean 상태를 핸들러와 함께 관리                     |
| `useDebounce`             | 값을 디바운스                                         |
| `useDebouncedCallback`    | 콜백 함수를 디바운스                                  |
| `useInterval`             | 선언적으로 인터벌 설정                                |
| `useIntersectionObserver` | 요소 가시성 관찰                                      |
| `usePreservedCallback`    | 안정적인 콜백 참조                                    |
| `usePreservedReference`   | 안정적인 객체 참조                                    |
| ...                       | [모든 훅 보기](https://react-simplikit.slash.page/ko) |

### Components

| Component        | 설명                        |
| ---------------- | --------------------------- |
| `SwitchCase`     | 선언적 switch-case 렌더링   |
| `Separated`      | 구분자와 함께 아이템 렌더링 |
| `ImpressionArea` | 요소 노출 추적              |

### Utilities

| Utility  | 설명             |
| -------- | ---------------- |
| `assert` | 런타임 assertion |
| `noop`   | 빈 함수          |

## 문서

자세한 문서는 [react-simplikit.slash.page](https://react-simplikit.slash.page/ko)를 참고하세요.

## 관련 패키지

- [@react-simplikit/mobile](https://www.npmjs.com/package/@react-simplikit/mobile) - 모바일 웹 유틸리티

## 기여하기

기여를 환영해요! [기여 가이드](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md)를 확인하세요.

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE)를 참고하세요.
