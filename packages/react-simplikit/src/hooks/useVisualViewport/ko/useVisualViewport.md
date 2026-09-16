# useVisualViewport

Visual Viewport 변경사항을 추적하는 React 훅이에요.

모바일 WebView에서 실제로 보이는 영역을 반환해요. 키보드가 나타나거나 사용자가 줌/스크롤할 때 변경돼요.

## 인터페이스

```ts
function useVisualViewport(): { viewport: VisualViewportState | null };
```

### 파라미터

이 함수는 파라미터를 받지 않아요.

### 반환 값

<Interface
  name=""
  type="{ viewport: VisualViewportState | null }"
  description="Visual Viewport 상태를 담은 객체예요."
  :nested="[
    {
      name: 'viewport',
      type: 'VisualViewportState | null',
      required: false,
      description:
        'Visual Viewport 상태 객체예요. 지원하지 않는 환경(SSR 또는 Visual Viewport API 미지원 브라우저)에서는 <code>null</code>이에요.',
    },
    {
      name: 'viewport.width',
      type: 'number',
      required: false,
      description: '뷰포트 너비 (픽셀)',
    },
    {
      name: 'viewport.height',
      type: 'number',
      required: false,
      description: '뷰포트 높이 (픽셀)',
    },
    {
      name: 'viewport.offsetLeft',
      type: 'number',
      required: false,
      description: '레이아웃 뷰포트로부터의 왼쪽 오프셋 (픽셀). 일반적으로 0이며, 가로 스크롤이나 패닝이 발생할 때만 변경돼요',
    },
    {
      name: 'viewport.offsetTop',
      type: 'number',
      required: false,
      description: '레이아웃 뷰포트로부터의 상단 오프셋(픽셀)이에요. iOS에서는 키보드가 나타날 때 음수가 되므로(예: -300px는 키보드 높이 300px를 의미) 키보드 높이는 <code>-offsetTop</code>으로 구하세요. Android에서는 일반적으로 0으로 유지돼요.',
    },
    {
      name: 'viewport.scale',
      type: 'number',
      required: false,
      description: '핀치 줌 배율이에요. 1.0은 줌 없음, 1.0보다 크면 확대, 1.0보다 작으면 축소(드물며, 뷰포트 설정에 따라 달라요)예요.',
    },
  ]"
/>

## 예시

```tsx
function CustomLayout() {
  const { viewport } = useVisualViewport();

  // 항상 null부터 확인해요
  if (!viewport) {
    return <div>Visual Viewport not supported</div>;
  }

  const { width, height, offsetTop, scale } = viewport;

  // 사용자가 확대하면 플로팅 UI를 숨겨요
  const showFloatingUI = scale <= 1.3;

  return (
    <div style={{ height }}>
      {showFloatingUI && <FloatingButton />}
      Viewport-aware content
    </div>
  );
}
```

### 줌 감지하기

```tsx
const { viewport } = useVisualViewport();
if (viewport && viewport.scale > 1.3) {
  // 사용자가 확대하면 플로팅 UI를 숨겨요
  setShowFloatingButton(false);
}
```

## 참고사항

- **SSR 안전성**: `viewport`는 SSR 환경이나 Visual Viewport API를 지원하지 않는 브라우저에서 `null`이에요. viewport 속성에 접근하기 전에 항상 `null`인지 확인하세요.
- **브라우저 지원**: Visual Viewport API는 최신 모바일 브라우저에서 지원돼요. 지원하지 않는 환경에서는 훅이 `null`을 반환해요.
- **성능**: 뷰포트 변경 중 블로킹 업데이트를 방지하기 위해 React의 `startTransition`을 사용해요.
- **더 간단한 대안**: 키보드 높이만 필요하다면 더 간단한 API인 `useKeyboardHeight()`를 사용하세요.
- **플랫폼 차이점**: iOS에서는 키보드가 나타날 때 `offsetTop`이 음수가 되고, Android에서는 일반적으로 0으로 유지돼요.
- **사용 사례**: 키보드 나타남 감지, 핀치 줌 제스처에 반응, 뷰포트 인식 레이아웃 생성, 줌 레벨에 따른 UI 요소 표시/숨김에 쓸 수 있어요.
