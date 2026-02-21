# isServer

`isServer`은 코드가 서버에서 실행되는지 확인하는 유틸리티 함수에요. `window`이 정의되지 않은 SSR (서버사이드 렌더링) 환경에서는 `true`를 반환하고, 클라이언트 사이드 환경에서는 `false`를 반환해요.

## 인터페이스

```ts
function isServer(): boolean;
```

### 파라미터

### 반환 값

<Interface
  name=""
  type="boolean"
  description="서버 환경 (SSR)에서 실행 중이면 <code>false</code>이고, 그렇지 않으면 <code>true</code>야요."/>

## 예시

```tsx
if (isServer()) {
  // SSR에 안전한 코드
  return null;
}

// 클라이언트 전용 코드
window.addEventListener('resize', handleResize);
```
