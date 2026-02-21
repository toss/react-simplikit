# enableBodyScrollLock

`enableBodyScrollLock`은 body 스크롤을 잠그는 유틸리티 함수예요. 고정 위치를 적용해서 body가 스크롤되는 것을 막아요. 모달, 서랍 또는 다른 오버레이 컴포넌트를 열 때 유용해요. SSR 환경에서 안전하게 호출할 수 있어요 (서버에서는 작동하지 않아요). 여러 번 호출해도 잠금 해제되기 전까지는 효과가 없어요.

## 인터페이스

```ts
function enableBodyScrollLock(): void;
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
