![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | 한국어

견고한 애플리케이션을 만들기 위한 가볍고 의존성 없는 React 유틸리티 모음이에요.

## 패키지

| 패키지                                       | 설명                                                | 버전                                                                                                                      |
| -------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/core)           | Universal hooks - 순수 상태/로직 훅 (플랫폼 독립적) | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [@react-simplikit/mobile](./packages/mobile) | 모바일 웹 유틸리티 (viewport, keyboard, scroll)     | [![npm](https://img.shields.io/npm/v/@react-simplikit/mobile.svg)](https://www.npmjs.com/package/@react-simplikit/mobile) |

> **참고**: `react-simplikit`은 이제 웹과 모바일(React Native)에서 모두 동작하는 순수 상태/로직 훅만을 제공하는 Universal Hook Library로 유지됩니다. 브라우저/플랫폼 종속 훅들은 Deprecated 처리됩니다. 자세한 내용은 [packages/core/README-ko_kr.md](./packages/core/README-ko_kr.md)를 참고하세요.

## 특징

- **의존성 없음** - 매우 가벼워요
- **100% TypeScript** - 완벽한 타입 안전성
- **100% 테스트 커버리지** - 신뢰할 수 있어요
- **SSR 안전** - Next.js 등 SSR 프레임워크에서 동작해요
- **Tree-shakeable** - 사용하는 것만 번들에 포함돼요

## 설치

```bash
# Core utilities
npm install react-simplikit

# Mobile web utilities
npm install @react-simplikit/mobile
```

## 빠른 시작

### react-simplikit

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

### @react-simplikit/mobile

```tsx
import { useAvoidKeyboard, useBodyScrollLock } from '@react-simplikit/mobile';

function ChatInput() {
  const { ref, style } = useAvoidKeyboard();

  return (
    <div ref={ref} style={style}>
      <input type="text" placeholder="메시지를 입력하세요..." />
    </div>
  );
}

function Modal({ isOpen }) {
  useBodyScrollLock(isOpen);
  // ...
}
```

## 문서

자세한 문서는 [react-simplikit.slash.page](https://react-simplikit.slash.page/ko)를 참고하세요.

## 레포지토리 구조

```
packages/
├── core/    # react-simplikit (hooks, components, utils)
└── mobile/  # @react-simplikit/mobile (mobile web utilities)
```

## 기여하기

커뮤니티의 모든 분들의 기여를 환영해요! 기여 가이드를 확인하세요.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](./LICENSE)를 참고하세요.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
