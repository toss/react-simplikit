# @react-simplikit/mobile

[![npm version](https://img.shields.io/npm/v/@react-simplikit/mobile.svg)](https://www.npmjs.com/package/@react-simplikit/mobile)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)

[English](./README.md) | 한국어

모바일 웹을 위한 React 유틸리티 - iOS Safari와 Android Chrome의 뷰포트, 키보드, 레이아웃 문제를 해결해요.

## 왜 필요한가요?

모바일 웹 개발은 어려워요. iOS Safari와 Android Chrome에는 다음과 같은 문제가 있어요:

- 키보드가 열릴 때 뷰포트 높이 변경
- 모달에서 body 스크롤 문제
- Safe area inset 처리
- Visual viewport 불일치

`@react-simplikit/mobile`은 이러한 일반적인 문제에 대한 검증된 솔루션을 제공해요.

## 특징

- **키보드 처리** - 가상 키보드에 의해 콘텐츠가 가려지는 것을 방지
- **Body scroll lock** - 모달에서 배경 스크롤 방지
- **Visual viewport** - 실제 보이는 영역 추적
- **Safe area** - 노치와 홈 인디케이터 처리
- **기기 감지** - iOS, Android, 브라우저 타입 감지
- **SSR 안전** - Next.js 등 SSR 프레임워크에서 동작

## 설치

```bash
npm install @react-simplikit/mobile
# or
yarn add @react-simplikit/mobile
# or
pnpm add @react-simplikit/mobile
```

## 빠른 시작

### 키보드 회피

```tsx
import { useAvoidKeyboard } from '@react-simplikit/mobile';

function ChatInput() {
  const { ref, style } = useAvoidKeyboard();

  return (
    <div ref={ref} style={style}>
      <input type="text" placeholder="메시지를 입력하세요..." />
    </div>
  );
}
```

### Body Scroll Lock

```tsx
import { useBodyScrollLock } from '@react-simplikit/mobile';

function Modal({ isOpen, children }) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
}
```

### Visual Viewport

```tsx
import { useVisualViewport } from '@react-simplikit/mobile';

function Component() {
  const viewport = useVisualViewport();

  return (
    <div style={{ height: viewport.height }}>
      실제 보이는 높이: {viewport.height}px
    </div>
  );
}
```

## 포함된 기능

### Hooks

| Hook                 | 설명                                      |
| -------------------- | ----------------------------------------- |
| `useAvoidKeyboard`   | 키보드에 의해 콘텐츠가 가려지는 것을 방지 |
| `useBodyScrollLock`  | body 스크롤 잠금 (모달용)                 |
| `useVisualViewport`  | visual viewport 크기 추적                 |
| `useScrollDirection` | 스크롤 방향 감지                          |
| `useNetworkStatus`   | 네트워크 연결 상태 모니터링               |
| `usePageVisibility`  | 페이지 가시성 상태 추적                   |

### Utilities

| Utility               | 설명                      |
| --------------------- | ------------------------- |
| `bodyScrollLock`      | 명령형 스크롤 잠금 제어   |
| `getSafeArea`         | safe area insets 가져오기 |
| `getKeyboardHeight`   | 키보드 높이 추정          |
| `isIOS` / `isAndroid` | 기기 감지                 |
| `isServer`            | SSR 환경 체크             |

## 브라우저 지원

- iOS Safari 13+
- Android Chrome 80+
- 데스크톱 브라우저 (graceful fallback)

## 관련 패키지

- [react-simplikit](https://www.npmjs.com/package/react-simplikit) - Core hooks & utilities

## 기여하기

기여를 환영해요! [기여 가이드](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md)를 확인하세요.

## 라이선스

MIT © Viva Republica, Inc. 자세한 내용은 [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE)를 참고하세요.
