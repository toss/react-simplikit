# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | 한국어 | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md)

React 환경에서 유용하게 사용할 수 있는 다양한 훅, 컴포넌트, 유틸리티를 제공하는 가볍고 강력한 라이브러리예요.

## 특징

- **의존성 없음** - 매우 가벼워요
- **100% TypeScript** - 완벽한 타입 안전성
- **100% 테스트 커버리지** - 신뢰할 수 있어요
- **SSR 안전** - Next.js 등 SSR 프레임워크에서 동작해요
- **Tree-shakeable** - 사용하는 것만 번들에 포함돼요

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
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // 실제 API 호출
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="검색어를 입력하세요"
    />
  );
}
```

디바운스된 함수는 `.cancel()` 메서드를 제공하고, 컴포넌트가 언마운트되면 대기 중인 호출을 자동으로 취소해요.

## 포함된 기능

### Hooks

| Hook                      | 설명                                                  |
| ------------------------- | ----------------------------------------------------- |
| `useBooleanState`         | boolean 상태를 핸들러와 함께 관리                     |
| `useDebounce`             | 콜백 함수를 디바운스                                  |
| `useDebouncedCallback`    | 옵션 객체로 `onChange` 콜백을 디바운스                |
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

| Utility        | 설명                                           |
| -------------- | ---------------------------------------------- |
| `buildContext` | 반복 코드 없이 React Context 정의              |
| `mergeProps`   | `className`·`style`·이벤트를 합성해 props 병합 |
| `mergeRefs`    | 여러 ref를 하나의 ref로 결합                   |

## 문서

자세한 문서는 [react-simplikit.slash.page](https://react-simplikit.slash.page/ko)를 참고하세요.

## 관련 패키지

- [모바일 웹 유틸리티](https://react-simplikit.slash.page/ko/mobile/intro.html) - `react-simplikit`에 포함

## 기여하기

기여를 환영해요! [기여 가이드](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md)를 확인하세요.

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE)를 참고하세요.
