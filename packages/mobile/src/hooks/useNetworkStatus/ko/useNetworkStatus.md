# useNetworkStatus

Network Information API에 접근하는 React 훅이에요. 연결 타입, 품질, 속도, 사용자 설정을 포함한 네트워크 연결 데이터를 제공해요. API가 지원되지 않는 브라우저(Safari, Firefox 등)에서는 모든 속성이 undefined로 반환돼요.

## 인터페이스

```ts
function useNetworkStatus(): NetworkStatus;
```

### 파라미터

이 훅은 파라미터를 받지 않아요.

### 반환값

<Interface
name=""
type="NetworkStatus"
description="네트워크 연결 데이터를 담은 객체예요."
:nested="[
{
name: 'effectiveType',
type: &quot;'slow-2g' | '2g' | '3g' | '4g' | undefined&quot;,
required: false,
description: '연결 품질 지표 - API가 지원되지 않으면 undefined',
},
{
name: 'type',
type: &quot;'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax' | undefined&quot;,
required: false,
description: '물리적 연결 타입 - API가 지원되지 않으면 undefined',
},
{
name: 'downlink',
type: 'number | undefined',
required: false,
description: 'Mbps 단위의 다운링크 속도 - API가 지원되지 않으면 undefined',
},
{
name: 'rtt',
type: 'number | undefined',
required: false,
description: '밀리초 단위의 왕복 시간 - API가 지원되지 않으면 undefined',
},
{
name: 'saveData',
type: 'boolean | undefined',
required: false,
description: '사용자의 데이터 절약 모드 설정 - API가 지원되지 않으면 undefined',
},
]"
/>

## 예제

### 적응형 이미지 품질

```tsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // Determine quality based on your app's needs
  const useHighQuality = effectiveType === '4g' && !saveData;

  return (
    <img src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'} alt="Content" />
  );
}
```

### 조건부 비디오 자동재생

```tsx
function VideoPlayer() {
  const { type, downlink } = useNetworkStatus();

  // Custom logic: only autoplay on wifi with good bandwidth
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```

## 참고사항

### 브라우저 지원

- **Chrome/Edge (Android)**: 모든 속성 완전 지원
- **Chrome/Edge (Desktop)**: 부분 지원 (effectiveType, downlink, rtt, saveData 사용 가능; type은 undefined일 수 있음)
- **Firefox**: 지원하지 않음 (모든 속성이 undefined)
- **Safari**: 지원하지 않음 (모든 속성이 undefined)

### SSR 안정성

이 훅은 SSR 환경에서 안전하게 동작해요. 서버에서는 빈 객체 `{}`를 반환하고, 브라우저 환경에서만 네트워크 변경 사항을 구독해요.

### 사용 권장사항

1. API가 모든 브라우저에서 지원되지 않을 수 있으므로, 사용 전에 항상 undefined 값을 확인하세요
2. Network Information API를 지원하지 않는 브라우저를 위한 대체 동작을 제공하세요
3. 필수 기능이 아닌 사용자 경험 향상을 위해 이 훅을 사용하세요
4. 최적의 콘텐츠 전달 결정을 위해 `effectiveType`과 `saveData`를 함께 고려하세요

### 참고 자료

- [Network Information API 명세](https://wicg.github.io/netinfo/)
- [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
