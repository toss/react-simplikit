# useVisualViewport

Visual Viewport의 변화를 추적하는 리액트 훅이에요.

모바일 WebView에서 실제로 보이는 영역을 반환해요. 이 영역은 키보드가 나타나거나 사용자가 화면을 확대·축소하거나 스크롤할 때 바뀌어요.

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
      description: '픽셀 단위의 뷰포트 너비예요.',
    },
    {
      name: 'viewport.height',
      type: 'number',
      required: false,
      description: '픽셀 단위의 뷰포트 높이예요.',
    },
    {
      name: 'viewport.offsetLeft',
      type: 'number',
      required: false,
      description: '레이아웃 뷰포트 기준 왼쪽 오프셋(픽셀)이에요. 가로 스크롤이나 패닝이 일어나지 않으면 보통 0이에요.',
    },
    {
      name: 'viewport.offsetTop',
      type: 'number',
      required: false,
      description: '레이아웃 뷰포트 기준 상단 오프셋(픽셀)이에요. iOS에서는 키보드가 나타날 때 음수가 되므로(예: -300px는 키보드 높이 300px를 의미) 키보드 높이는 <code>-offsetTop</code>으로 구하세요. Android에서는 일반적으로 0으로 유지돼요.',
    },
    {
      name: 'viewport.scale',
      type: 'number',
      required: false,
      description: '핀치 줌 배율이에요. 1.0이면 확대하지 않은 상태, 1.0보다 크면 확대한 상태, 1.0보다 작으면 축소한 상태예요. 축소는 드물고 뷰포트 설정에 따라 달라요.',
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

- **SSR 안전성**: `viewport`는 SSR 환경이나 Visual Viewport API를 지원하지 않는 브라우저에서 `null`이에요. `viewport`의 속성을 읽기 전에 항상 `null`인지 확인하세요.
- **브라우저 지원**: 최신 모바일 브라우저는 Visual Viewport API를 지원해요. 지원하지 않는 환경에서는 훅이 `null`을 반환해요.
- **성능**: 업데이트를 리액트의 `startTransition`으로 감싸서 뷰포트가 바뀌어도 긴급한 렌더링을 막지 않아요.
- **더 간단한 대안**: 키보드 높이만 필요하다면 더 간단한 API인 `useKeyboardHeight()`를 사용하세요.
- **플랫폼 차이점**: iOS에서는 키보드가 나타날 때 `offsetTop`이 음수가 되고 Android에서는 일반적으로 0으로 유지돼요.
- **사용 사례**: 키보드 표시 감지, 핀치 줌 제스처 대응, 뷰포트에 맞춘 레이아웃 구성, 줌 레벨에 따른 UI 표시·숨김에 쓸 수 있어요.
