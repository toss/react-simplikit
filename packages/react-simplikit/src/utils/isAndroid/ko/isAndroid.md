# isAndroid

`isAndroid`는 현재 기기가 안드로이드에서 실행 중인지 감지하는 유틸리티 함수예요.

**참고 사항**

- 모든 안드로이드 브라우저는 사용자 에이전트에 'Android' 토큰을 포함해요.

## 인터페이스

```ts
function isAndroid(userAgent?: string): boolean;
```

### 파라미터

<Interface
  name="userAgent"
  type="string"
  description="확인할 선택적 사용자 에이전트 문자열. 기본값은 <code>navigator.userAgent</code>이에요."
/>

### 반환 값

<Interface
  name=""
  type="boolean"
  description="기기가 안드로이드에서 실행 중이면 <code>true</code>를, 그렇지 않으면 <code>false</code>를 반환해요. 서버 사이드 렌더링 환경에서는 <code>false</code>를 반환해요."
/>

## 예시

```tsx
if (isAndroid()) {
  // 안드로이드에만 해당되는 코드
  enableAndroidOptimizations();
}
```

```tsx
// 사용자 에이전트를 직접 넘기는 경우
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
