# useNetworkStatus

`useNetworkStatus`는 Network Information API에 접근하는 리액트 훅이에요. 연결 타입, 품질, 속도, 사용자의 데이터 절약 모드 설정 같은 네트워크 연결 데이터를 가공하지 않고 그대로 제공해요. API를 지원하지 않는 브라우저(Safari, Firefox 등)에서는 모든 속성이 `undefined`예요.

## 인터페이스

```ts
function useNetworkStatus(): NetworkStatus;
```

### 파라미터

이 함수는 파라미터를 받지 않아요.

### 반환 값

<Interface
name=""
type="NetworkStatus"
description="네트워크 연결 데이터를 담은 객체예요."
:nested="[
{
name: 'effectiveType',
type: &quot;'slow-2g' | '2g' | '3g' | '4g' | undefined&quot;,
required: false,
description: '연결 품질이에요. API를 지원하지 않으면 <code>undefined</code>를 반환해요.',
},
{
name: 'type',
type: &quot;'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax' | undefined&quot;,
required: false,
description: '물리적 연결 타입이에요. API를 지원하지 않으면 <code>undefined</code>를 반환해요.',
},
{
name: 'downlink',
type: 'number | undefined',
required: false,
description: 'Mbps 단위의 다운링크 속도예요. API를 지원하지 않으면 <code>undefined</code>를 반환해요.',
},
{
name: 'rtt',
type: 'number | undefined',
required: false,
description: '밀리초 단위의 왕복 시간이에요. API를 지원하지 않으면 <code>undefined</code>를 반환해요.',
},
{
name: 'saveData',
type: 'boolean | undefined',
required: false,
description: '사용자의 데이터 절약 모드 설정이에요. API를 지원하지 않으면 <code>undefined</code>를 반환해요.',
},
]"
/>

## 예시

### 적응형 이미지 품질

```tsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // 앱의 요구사항에 맞춰 품질을 결정해요
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

  // 커스텀 로직: 대역폭이 충분한 wifi에서만 자동재생해요
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```

## 참고사항

### 브라우저 지원

- **Chrome/Edge (Android)**: 모든 속성 완전 지원
- **Chrome/Edge (Desktop)**: 부분 지원 (`effectiveType`, `downlink`, `rtt`, `saveData` 사용 가능; `type`은 `undefined`일 수 있음)
- **Firefox**: 지원하지 않음 (모든 속성이 `undefined`)
- **Safari**: 지원하지 않음 (모든 속성이 `undefined`)

### SSR 안전성

이 훅은 SSR 환경에서 안전하게 동작해요. 서버와 클라이언트의 첫 렌더링에서는 빈 객체 `{}`를 반환하고, 마운트된 뒤 연결 정보를 읽어요. 네트워크 변경 사항은 브라우저 환경에서만 구독해요.

### 사용 권장사항

- 모든 브라우저가 이 API를 지원하지는 않으므로 값을 쓰기 전에 항상 `undefined`인지 확인하세요.
- Network Information API를 지원하지 않는 브라우저를 위한 대체 동작을 제공하세요.
- 이 훅은 필수 기능이 아니라 사용자 경험을 높이는 데 쓰세요.
- 어떤 콘텐츠를 전달할지 정할 때는 `effectiveType`과 `saveData`를 함께 고려하세요.

### 참고 자료

- [Network Information API 명세](https://wicg.github.io/netinfo/)
- [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
