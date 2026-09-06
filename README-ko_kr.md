![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | 한국어 | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | [Español](./README-es.md)

견고한 애플리케이션을 만들기 위한 가볍고 의존성 없는 React 유틸리티 모음이에요.

## 패키지

| 패키지                                        | 설명                                                                                             | 버전                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | React 훅, 컴포넌트, 유틸리티: 상태와 로직, 브라우저 이벤트, 모바일 웹(키보드, 안전 영역, 뷰포트) | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [react-simplikit-codemod](./packages/codemod) | `react-simplikit` 업그레이드에 맞춰 코드베이스를 고쳐 쓰는 codemod                               | [![npm](https://img.shields.io/npm/v/react-simplikit-codemod.svg)](https://www.npmjs.com/package/react-simplikit-codemod) |

## 특징

- **의존성 없음** - 매우 가벼워요
- **100% TypeScript** - 완벽한 타입 안전성
- **100% 테스트 커버리지** - 신뢰할 수 있어요
- **SSR 안전** - Next.js 등 SSR 프레임워크에서 동작해요
- **Tree-shakeable** - 사용하는 것만 번들에 포함돼요

## 설치

```bash
npm install react-simplikit
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

### 고정 요소를 온스크린 키보드 위에 유지하기

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="메시지를 입력하세요..." />
    </div>
  );
}
```

## 문서

자세한 문서는 [react-simplikit.slash.page](https://react-simplikit.slash.page/ko)를 참고하세요.

## 레포지토리 구조

```
packages/
├── react-simplikit/    # 라이브러리
├── codemod/            # react-simplikit-codemod
└── plugin/             # AI 코딩 어시스턴트용 에이전트 스킬
```

## 기여하기

모든 분들의 기여를 환영해요! 기여 가이드를 확인하세요.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](./LICENSE)를 참고하세요.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
