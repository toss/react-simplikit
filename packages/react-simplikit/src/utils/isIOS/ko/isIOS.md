# isIOS

`isIOS`는 현재 기기에서 iOS 또는 iPadOS가 실행 중인지 감지하는 유틸리티 함수예요. 다만 iPad는 iPadOS 버전에 따라 플랫폼 정보가 달라요.

- iPadOS 13 이전의 iPad는 플랫폼을 'iPad'로 보고하거나, 사용자 에이전트가 /iPad/와 일치했어요.
- iPadOS 13부터 Apple은 웹사이트가 iPadOS를 데스크톱급 Safari로 취급하도록 플랫폼 문자열을 'MacIntel'로 변경했어요. 하지만 이런 기기는 여전히 멀티터치 기능을 노출해요.

## 인터페이스

```ts
function isIOS(userAgent?: string): boolean;
```

### 파라미터

<Interface
  name="userAgent"
  type="string"
  description="확인할 사용자 에이전트 문자열이에요. 넘기지 않으면 기본값으로 <code>navigator.userAgent</code>를 사용해요."
/>

### 반환 값

<Interface
  name=""
  type="boolean"
  description="기기에서 iOS 또는 iPadOS가 실행 중이면 <code>true</code>를, 그렇지 않으면 <code>false</code>를 반환해요. 서버 사이드 렌더링 환경에서는 <code>false</code>를 반환해요."
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
