# usePageVisibility

페이지 가시성 변화를 감지하는 React 훅이에요.

Page Visibility API를 사용하여 사용자가 탭을 전환하거나 브라우저를 최소화할 때를 감지해요. 애니메이션, 비디오, 백그라운드 작업을 일시 정지하거나 재개하여 성능과 사용자 경험을 개선하는 데 유용해요.

## 인터페이스

```ts
function usePageVisibility(): PageVisibility;
```

### 매개변수

이 훅은 매개변수를 받지 않아요.

### 반환값

<Interface
name=""
type="PageVisibility"
description="페이지 가시성 상태를 담은 객체예요."
:nested="[
{
name: 'isVisible',
type: 'boolean',
required: false,
description: '페이지가 현재 사용자에게 보이면 <code>true</code>',
},
{
name: 'visibilityState',
type: &quot;'visible' | 'hidden'&quot;,
required: false,
description: '페이지의 현재 가시성 상태',
},
]"
/>

## 예제

### 비디오 플레이어 제어

사용자가 다른 탭으로 전환하면 자동으로 비디오 재생을 일시 정지해요:

```tsx
function VideoPlayer() {
  const { isVisible } = usePageVisibility();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Pause video when tab is hidden
    if (!isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return <video ref={videoRef} src="video.mp4" />;
}
```

### 분석 추적

사용자가 페이지를 떠나거나 돌아올 때를 추적해요:

```tsx
function Analytics() {
  const { isVisible, visibilityState } = usePageVisibility();

  useEffect(() => {
    if (visibilityState === 'hidden') {
      // Track when user leaves the page
      analytics.track('page_hidden');
    }
  }, [visibilityState]);

  return null;
}
```

## 참고사항

- **SSR 안전성**: 서버 사이드 렌더링 중에는 Page Visibility API를 사용할 수 없으므로, 이 훅은 안전한 기본값인 `{ isVisible: true, visibilityState: 'visible' }`을 반환해요.
- **브라우저 지원**: Page Visibility API는 모든 최신 브라우저에서 지원돼요. 자세한 내용은 [MDN 브라우저 호환성](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#browser_compatibility)을 참고해주세요.
- **성능**: 이 훅은 네이티브 `visibilitychange` 이벤트를 사용하므로 고도로 최적화되어 있으며 성능 영향이 최소화돼요.
- **가시성 상태**: 이 훅은 더 이상 사용되지 않는 `'prerender'` 상태를 제외하고 `'visible'` 또는 `'hidden'`만 반환해요.
