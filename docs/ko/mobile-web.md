# 모바일 웹

모바일 웹 환경에서 발생하는 다양한 UI 문제를 해결하는 React 훅 모음이에요.

## 왜 이 훅들인가요?

모바일 웹 개발에는 데스크톱에서는 없는 문제들이 있어요. 각 문제마다 `react-simplikit`에 훅이 있어요:

| 문제                                                | 사용                                                                                               |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 하단 고정 요소가 온스크린 키보드에 가려져요         | [useAvoidKeyboard](/ko/hooks/useAvoidKeyboard)                                                     |
| 키보드 높이나 표시 여부를 읽고 싶어요               | [useKeyboardHeight](/ko/hooks/useKeyboardHeight), [isKeyboardVisible](/ko/utils/isKeyboardVisible) |
| 시트나 모달이 열린 동안 body 스크롤을 잠그고 싶어요 | [useBodyScrollLock](/ko/hooks/useBodyScrollLock)                                                   |
| 노치와 홈 인디케이터 영역을 피하고 싶어요           | [useSafeAreaInset](/ko/hooks/useSafeAreaInset), [getSafeAreaInset](/ko/utils/getSafeAreaInset)     |
| 사용자가 실제로 보는 영역을 추적하고 싶어요         | [useVisualViewport](/ko/hooks/useVisualViewport)                                                   |
| 스크롤 방향에 따라 헤더를 숨기거나 보여주고 싶어요  | [useScrollDirection](/ko/hooks/useScrollDirection)                                                 |
| 네트워크 연결 상태에 맞춰 콘텐츠를 조절하고 싶어요  | [useNetworkStatus](/ko/hooks/useNetworkStatus)                                                     |
| 페이지가 백그라운드로 가면 작업을 멈추고 싶어요     | [usePageVisibility](/ko/hooks/usePageVisibility)                                                   |
| 플랫폼에 따라 분기하고 싶어요                       | [isIOS](/ko/utils/isIOS), [isAndroid](/ko/utils/isAndroid)                                         |

모든 항목은 `react-simplikit`에서 named import로 가져오고, [레퍼런스](/ko/reference)에 다른 항목들과 함께 실려 있어요.

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

## 앞으로의 방향 {#roadmap}

모바일 화면은 작고 그 작은 공간 안에서 UI가 의도대로 보이지 않는 경우가 많아요. 키보드에 요소가 가려지고, 기기마다 안전 영역이 다르고, 브라우저가 보고하는 뷰포트와 사용자가 실제로 보는 영역이 다른 경우도 잦아요. 예외적인 상황이 아니라 모바일 개발에서 늘 마주치는 현실이에요.

### 문제: 모바일 화면에서 불안정한 UI

모바일 기기에서 사용자가 화면에서 보는 것과 개발자가 기대하는 것이 항상 일치하지는 않아요. 흔히 마주치는 상황들을 살펴볼게요:

- **키보드가 입력 필드를 가리는 경우**: 사용자가 텍스트 입력 필드를 탭하면 온스크린 키보드가 올라오면서, 입력 필드나 하단에 고정된 제출 버튼을 완전히 가릴 수 있어요.
- **안전 영역의 불일치**: 노치, 둥근 모서리, 홈 인디케이터(아이폰 하단 바 등)가 있는 기기에는 콘텐츠를 배치하면 안 되는 예약 영역이 있어요. 하지만 이 영역은 기기와 OS 버전마다 달라요.
- **뷰포트 혼란**: 브라우저의 레이아웃 뷰포트와 실제 보이는 영역(비주얼 뷰포트)은 크게 다를 수 있어요. 특히 키보드가 열려 있거나 페이지가 확대된 경우에 `position: fixed` 요소가 예상치 못한 위치에 나타날 수 있어요.

이런 문제들은 특정 OS나 기기에 국한되지 않아요. iOS Safari든 Android Chrome이든, 어떤 모바일 브라우저든 근본적인 문제는 같아요: **보이는 영역이 예측 불가능하고, 표준 CSS만으로는 이를 안정적으로 처리할 수 없다**는 것이에요.

### 우리의 접근: 비주얼 뷰포트에 집중

브라우저의 특이한 동작을 불안정한 우회 방법으로 처리하는 대신, 이 훅들은 사용자가 특정 순간에 실제로 볼 수 있는 화면 영역, 즉 **비주얼 뷰포트(Visual Viewport)**를 중심으로 설계됐어요.

[Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API)를 기반으로 다음을 할 수 있어요:

- **키보드 출현을 감지하고 대응**하여 하단 고정 요소가 자연스럽게 비켜나도록 해요.
- **안전 영역 인셋을 읽어** 노치, 홈 인디케이터 등 기기별 예약 영역을 올바르게 처리해요.
- **실제 보이는 영역을 추적**하여 브라우저의 레이아웃 엔진이 가정하는 것이 아닌, 사용자가 실제로 보는 것을 기반으로 레이아웃을 결정할 수 있게 해요.

목표는 단순해요: **비주얼 뷰포트 안에서 UI가 안정적이고 예측 가능하게 렌더링되도록 하는 것**이에요.

### 크로스 플랫폼, 크로스 디바이스

모바일 웹은 본질적으로 크로스 플랫폼이고, 이 훅들도 그래요. 다음 환경에서 일관되게 동작하도록 설계되었어요:

- **iOS와 Android** — 두 가지 주요 모바일 플랫폼. 둘이 다르게 동작하는 부분(iOS는 키보드가 열려 있는 동안 `visualViewport.offsetTop`을 음수로 보고하고, Android는 0을 유지한 채 레이아웃을 리사이즈해요)은 훅이 처리하니 직접 신경 쓰지 않아도 돼요.
- **다양한 브라우저** — Safari, Chrome, Samsung Internet 등.
- **다양한 기기 폼 팩터** — 소형 폰부터 대형 화면 기기까지, 노치나 홈 인디케이터의 유무에 관계없이.

특정 API를 사용할 수 없는 환경(예: 구형 브라우저의 `window.visualViewport`)에서는 UI가 깨지지 않도록 안전한 폴백을 제공해요.

### 다음 계획

모바일 웹의 UI 문제를 해결하는 훅을 계속 추가하고 있어요. 기준은 언제나 같아요: **기기나 OS에 관계없이 모바일 UI 개발을 예측 가능하고 안정적으로 만드는 것**이에요. 모바일 UI에서 흔히 겪는 불편함이 있다면, 아마 이미 그 문제를 위한 깔끔하고 선언적인 해결책을 만들고 있을 거예요.
