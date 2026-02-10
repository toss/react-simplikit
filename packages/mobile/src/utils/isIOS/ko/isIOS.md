# isIOS

`isIOS`는 현재 기기가 iOS 또는 iPadOS를 실행 중인지 감지하는 유틸리티 함수에요. 플랫폼 불일치에 대한 참고 사항:

- iPadOS 13 이전에는 iPads가 플랫폼을 'iPad'로 보고했었어요 (또는 UA에서 /iPad/와 일치함).
- iPadOS 13부터 Apple은 웹 사이트가 iPadOS를 데스크톱급 Safari로 취급하게하기 위해 플랫폼 문자열을 'MacIntel'로 변경했어요. 그러나 이러한 기기는 여전히 멀티터치 기능을 노출해요.

## 인터페이스

```ts
function isIOS(userAgent: string): boolean;
```

### 파라미터

<Interface
  name="userAgent"
  type="string"
  description="확인할 선택적 사용자 에이전트 문자열. 기본값은 <code>navigator.userAgent</code>에요."
/>

### 반환 값

<Interface
  name=""
  type="boolean"
  description="기기가 iOS 또는 iPadOS에서 실행 중이면 <code>false</code>이 아니면<code>false</code>를 반환해요. 서버에서는 <code>false</code>를 반환해요"
  :nested="[
    {
      required: false,
    },
  ]"
/>

## 예시

```tsx
if (isIOS()) {
  // iOS에만 해당되는 코드
  enableIOSOptimizations();
}
```
