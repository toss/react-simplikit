# @react-simplikit/mobile

모바일 웹 환경에서 발생하는 다양한 UI 문제를 해결하는 React 훅 모음이에요.

## Why @react-simplikit/mobile?

모바일 웹 개발에는 데스크톱에서는 없는 고유한 문제들이 있어요:

- **키보드 회피**: 온스크린 키보드가 올라오면 하단 고정 요소가 가려지는 문제
- **스크롤 방향 감지**: 스크롤에 따라 헤더나 네비게이션 바를 숨기거나 보여주기
- **네트워크 상태 모니터링**: 연결 속도에 따라 콘텐츠 품질 조절하기
- **페이지 가시성 추적**: 앱이 백그라운드로 갈 때 비디오나 분석 일시정지하기
- **Visual Viewport 변화**: 모바일 브라우저에서 줌, 키보드, 뷰포트 리사이즈 처리하기

`@react-simplikit/mobile`은 이러한 시나리오를 최소한의 설정으로 처리할 수 있는 검증된 훅들을 제공해요.

## Quick Start

```bash
npm install @react-simplikit/mobile
```

### Button CTA 예제

가장 흔한 모바일 UI 패턴 - 키보드 위로 이동하는 하단 고정 버튼:

```tsx
import { useAvoidKeyboard } from '@react-simplikit/mobile';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

### 채팅 입력창 예제

키보드 위에 위치하는 입력창이 있는 채팅 인터페이스:

```tsx
import { useState } from 'react';
import { useAvoidKeyboard } from '@react-simplikit/mobile';

function ChatInput() {
  const { style } = useAvoidKeyboard();
  const [message, setMessage] = useState('');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        gap: '8px',
        padding: '12px',
        ...style,
      }}
    >
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button>Send</button>
    </div>
  );
}
```

### Safe Area 적용

홈 인디케이터가 있는 기기(예: iPhone)의 경우 safe area 오프셋을 추가할 수 있어요:

```tsx
import { useAvoidKeyboard } from '@react-simplikit/mobile';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

## 제공하는 훅

| 훅                                                        | 설명                                        |
| --------------------------------------------------------- | ------------------------------------------- |
| [useAvoidKeyboard](/ko/mobile/hooks/useAvoidKeyboard)     | 고정 요소를 온스크린 키보드 위로 이동시켜요 |
| [useKeyboardHeight](/ko/mobile/hooks/useKeyboardHeight)   | 현재 키보드 높이를 반환해요                 |
| [useBodyScrollLock](/ko/mobile/hooks/useBodyScrollLock)   | 모달과 오버레이를 위해 body 스크롤을 잠가요 |
| [useScrollDirection](/ko/mobile/hooks/useScrollDirection) | 스크롤 방향(위/아래)을 감지해요             |
| [useNetworkStatus](/ko/mobile/hooks/useNetworkStatus)     | 네트워크 연결 상태를 모니터링해요           |
| [usePageVisibility](/ko/mobile/hooks/usePageVisibility)   | 페이지 가시성 상태를 추적해요               |
| [useVisualViewport](/ko/mobile/hooks/useVisualViewport)   | Visual Viewport 크기와 오프셋을 제공해요    |
