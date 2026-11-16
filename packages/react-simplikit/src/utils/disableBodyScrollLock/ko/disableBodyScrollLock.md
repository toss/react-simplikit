# disableBodyScrollLock

`disableBodyScrollLock`은 body 스크롤 잠금을 해제하는 유틸리티 함수예요. `enableBodyScrollLock`으로 잠근 스크롤을 풀고 저장해 둔 스크롤 위치로 되돌려요.

SSR 환경에서 호출해도 안전해요. 서버에서는 아무 동작도 하지 않아요. 스크롤이 잠겨 있지 않을 때 호출해도 아무 동작도 하지 않아요.

## 인터페이스

```ts
function disableBodyScrollLock(): void;
```

### 파라미터

이 함수는 파라미터를 받지 않아요.

### 반환 값

<Interface name="" type="void" description="" />

## 예시

```tsx
// 모달이 열릴 때
enableBodyScrollLock();

// 모달이 닫힐 때
disableBodyScrollLock();
```
