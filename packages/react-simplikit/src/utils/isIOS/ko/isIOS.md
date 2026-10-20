# isIOS

`isIOS`는 현재 기기가 iOS 또는 iPadOS를 실행 중인지 감지하는 유틸리티 함수예요.

User-Agent Client Hints API(`navigator.userAgentData.platform`)를 우선 사용하고, 없으면 레거시 `navigator.platform` / `navigator.userAgent` 문자열로 판별해요.

플랫폼에 따라 다음과 같은 차이가 있어요.

- iPadOS 13 이전에는 iPad가 플랫폼을 'iPad'로 보고했어요 (또는 UA에서 /iPad/와 일치함).
- iPadOS 13부터 Apple은 웹사이트가 iPadOS를 데스크톱급 Safari로 취급하도록 플랫폼 문자열을 'MacIntel'로 변경했어요. 그러나 이러한 기기는 여전히 멀티터치 기능을 노출해요.
- Chromium 계열 브라우저는 Client Hints `platform`을 `"iPhone"` 대신 `"iOS"`로 보고할 수 있어요.

## 인터페이스

```ts
function isIOS(userAgent?: string): boolean;
```

### 파라미터

<Interface
  name="userAgent"
  type="string"
  description="확인할 선택적 사용자 에이전트 문자열. 기본값은 <code>navigator.userAgent</code>예요. 인자로 넘기면 해당 문자열을 직접 매칭하고, 최신 iPadOS 판별은 데스크톱급 iPad Safari를 잡기 위해 실제 플랫폼·터치 API를 계속 사용해요."
/>

### 반환 값

<Interface
  name=""
  type="boolean"
  description="기기가 iOS 또는 iPadOS에서 실행 중이면 <code>true</code>를, 그렇지 않으면 <code>false</code>를 반환해요. 서버 사이드 렌더링 환경에서는 <code>false</code>를 반환해요."
/>

## 예시

```tsx
if (isIOS()) {
  // iOS에만 해당되는 코드
  enableIOSOptimizations();
}
```

```tsx
// 사용자 에이전트를 직접 넘기는 경우
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
