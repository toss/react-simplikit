# disableBodyScrollLock

`disableBodyScrollLock`는 body 스크롤을 잠금 해제하는 유틸리티 함수예요. `enableBodyScrollLock`에 의해 잠겨진 스크롤을 복원하고 저장된 스크롤 위치로 되돌아가요. SSR 환경에서 호출할 때 안전해요 (서버에서는 작동하지 않음). 잠겨 있지 않아도 호출해도 안전해요요.

## 인터페이스

```ts
function disableBodyScrollLock(): void;
```

### Parameters

### 반환 값

<Interface name="" type="void" description="" />

## 예시

```tsx
// 모달이 열릴 때
enableBodyScrollLock();

// 모달이 닫힐 때
disableBodyScrollLock();
```
