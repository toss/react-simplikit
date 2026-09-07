# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | 한국어 | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | [Español](./README-es.md)

훅, 컴포넌트, 유틸리티를 제공하는 가볍고 의존성 없는 React 유틸리티 라이브러리예요.

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

- **훅** — 상태와 로직(`useToggle`, `useDebounce`, `useList` 등), 브라우저 이벤트(`useIntersectionObserver`, `useOutsideClickEffect` 등), 모바일 웹(`useAvoidKeyboard`, `useSafeAreaInset`, `useVisualViewport` 등)
- **컴포넌트** — `SwitchCase`, `Separated`, `ImpressionArea`
- **유틸리티** — `buildContext`, `mergeProps`, `mergeRefs`, 그리고 `isIOS`, `getKeyboardHeight` 같은 모바일 웹 헬퍼

한 줄 설명이 붙은 전체 목록은 [레퍼런스 페이지](https://react-simplikit.slash.page/ko/reference.html)에 있어요.

## 문서

자세한 문서는 [react-simplikit.slash.page](https://react-simplikit.slash.page/ko)를 참고하세요.

## 기여하기

기여를 환영해요! [기여 가이드](https://github.com/toss/react-simplikit/blob/main/.github/CONTRIBUTING.md)를 확인하세요.

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE)를 참고하세요.
