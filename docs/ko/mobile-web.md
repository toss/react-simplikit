# 모바일 유틸리티

모바일 웹 환경에서 발생하는 다양한 UI 문제를 해결하는 React 훅 모음이에요.

## 왜 모바일 유틸리티인가요?

모바일 웹 개발에는 데스크톱에서는 없는 고유한 문제들이 있어요:

- **키보드 회피**: 온스크린 키보드가 올라오면 하단 고정 요소가 가려지는 문제
- **스크롤 방향 감지**: 스크롤에 따라 헤더나 네비게이션 바를 숨기거나 보여주기
- **네트워크 상태 모니터링**: 연결 속도에 따라 콘텐츠 품질 조절하기
- **페이지 가시성 추적**: 앱이 백그라운드로 갈 때 비디오나 분석 일시정지하기
- **Visual Viewport 변화**: 모바일 브라우저에서 줌, 키보드, 뷰포트 리사이즈 처리하기

`react-simplikit`은 이러한 시나리오를 최소한의 설정으로 처리할 수 있는 검증된 훅들을 제공해요.

## Quick Start

```bash
npm install react-simplikit
```

### Button CTA 예제

가장 흔한 모바일 UI 패턴 - 키보드 위로 이동하는 하단 고정 버튼:

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

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
import { useAvoidKeyboard } from 'react-simplikit';

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
import { useAvoidKeyboard } from 'react-simplikit';

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

| 훅                                                 | 설명                                        |
| -------------------------------------------------- | ------------------------------------------- |
| [useAvoidKeyboard](/ko/hooks/useAvoidKeyboard)     | 고정 요소를 온스크린 키보드 위로 이동시켜요 |
| [useKeyboardHeight](/ko/hooks/useKeyboardHeight)   | 현재 키보드 높이를 반환해요                 |
| [useBodyScrollLock](/ko/hooks/useBodyScrollLock)   | 모달과 오버레이를 위해 body 스크롤을 잠가요 |
| [useScrollDirection](/ko/hooks/useScrollDirection) | 스크롤 방향(위/아래)을 감지해요             |
| [useNetworkStatus](/ko/hooks/useNetworkStatus)     | 네트워크 연결 상태를 모니터링해요           |
| [usePageVisibility](/ko/hooks/usePageVisibility)   | 페이지 가시성 상태를 추적해요               |
| [useVisualViewport](/ko/hooks/useVisualViewport)   | Visual Viewport 크기와 오프셋을 제공해요    |

## 앞으로의 방향

모바일 화면은 작고 그 작은 공간 안에서 UI가 의도대로 보이지 않는 경우가 많아요. 키보드에 요소가 가려지고, 기기마다 다른 SafeArea가 다르고, 브라우저가 보여주는 viewport와 사용자가 실제로 보는 영역의 차이가 빈번하게 발생해요.

### 문제: 모바일 화면에서 불안정한 UI

모바일 기기에서 사용자가 화면에서 보는 것과 개발자가 기대하는 것이 항상 일치하지는 않아요. 흔히 마주치는 상황들을 살펴볼게요:

- **키보드가 입력 필드를 가리는 경우**: 사용자가 텍스트 입력 필드를 탭하면 온스크린 키보드가 올라오면서, 입력 필드나 하단에 고정된 제출 버튼을 완전히 가릴 수 있어요.
- **안전 영역의 불일치**: 노치, 둥근 모서리, 홈 인디케이터(아이폰 하단 바 등)가 있는 기기에는 콘텐츠를 배치하면 안 되는 예약 영역이 있어요. 하지만 이 영역은 기기와 OS 버전마다 달라요.
- **뷰포트 혼란**: 브라우저의 레이아웃 뷰포트와 실제 보이는 영역(비주얼 뷰포트)은 크게 다를 수 있어요. 특히 키보드가 열려 있거나 페이지가 확대된 경우에 `position: fixed` 요소가 예상치 못한 위치에 나타날 수 있어요.

이런 문제들은 특정 OS나 기기에 국한되지 않아요. iOS Safari든 Android Chrome이든, 어떤 모바일 브라우저든 근본적인 문제는 같아요: **보이는 영역이 예측 불가능하고, 표준 CSS만으로는 이를 안정적으로 처리할 수 없다**는 것이에요.

### 우리의 접근: 비주얼 뷰포트에 집중

`react-simplikit`의 모바일 유틸리티는 이러한 문제들을 해결하기 위해 명확한 접근 방식을 취해요. 브라우저의 특이한 동작을 불안정한 우회 방법으로 처리하는 대신, **비주얼 뷰포트(Visual Viewport)** — 사용자가 특정 순간에 실제로 볼 수 있는 화면 영역 — 를 중심으로 설계해요.

[Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)를 기반으로, 다음과 같은 훅들을 제공해요:

- **키보드 출현을 감지하고 대응**하여 하단 고정 요소가 자연스럽게 비켜나도록 해요.
- **안전 영역 인셋을 읽어** 노치, 홈 인디케이터 등 기기별 예약 영역을 올바르게 처리해요.
- **실제 보이는 영역을 추적**하여 브라우저의 레이아웃 엔진이 가정하는 것이 아닌, 사용자가 실제로 보는 것을 기반으로 레이아웃을 결정할 수 있게 해요.

목표는 단순해요: **비주얼 뷰포트 안에서 UI가 안정적이고 예측 가능하게 렌더링되도록 하는 것**이에요.

### 크로스 플랫폼, 크로스 디바이스

특정 OS나 기기 모델에 국한되고 싶지 않아요. 모바일 웹은 본질적으로 크로스 플랫폼이고, `react-simplikit`은 이를 지향해요.

우리의 훅들은 다음 환경에서 일관되게 동작하도록 설계되었어요:

- **iOS와 Android** — 두 가지 주요 모바일 플랫폼.
- **다양한 브라우저** — Safari, Chrome, Samsung Internet 등.
- **다양한 기기 폼 팩터** — 소형 폰부터 대형 화면 기기까지, 노치나 홈 인디케이터의 유무에 관계없이.

특정 API를 사용할 수 없는 환경(예: 구형 브라우저의 `window.visualViewport`)에서는 UI가 깨지지 않도록 안전한 폴백을 제공해요.

### 앞으로의 방향

`react-simplikit`에서 제공하는 모바일 훅들을 계속 확장해 나갈 예정이에요. 항상 같은 원칙에 따라: **기기나 OS에 관계없이 모바일 UI 개발을 예측 가능하고 안정적으로 만드는 것**이에요. 모바일 UI에서 흔히 겪는 불편함이 있다면, 우리는 그것에 대한 깔끔하고 선언적인 해결책을 만들고 있을 거예요.

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

## 모바일 특화 가이드라인

### 실제 기기 테스트

- iOS Safari와 Android Chrome에서 테스트하는 것을 권장해요
- Visual Viewport API 동작은 실제 기기에서 확인해야 해요

### 플랫폼 차이

구현 시 다음 플랫폼 차이를 고려해주세요:

| 기능                       | iOS                         | Android               |
| -------------------------- | --------------------------- | --------------------- |
| `visualViewport.offsetTop` | 키보드가 나타나면 음수가 됨 | 일반적으로 0 유지     |
| 키보드 동작                | 뷰포트가 밀려 올라감        | 레이아웃을 리사이즈함 |

### window/document 접근 패턴

브라우저 API에 접근할 때는 항상 SSR 안전 패턴을 사용해주세요:

```typescript
// ✅ SSR 안전 패턴
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// 이제 window/document를 안전하게 사용할 수 있어요
window.visualViewport?.addEventListener('resize', handler);
```
