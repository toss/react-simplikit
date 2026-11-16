# enableBodyScrollLock

`enableBodyScrollLock`은 body 스크롤을 잠그는 유틸리티 함수예요. body에 고정 위치(fixed positioning)를 적용해서 스크롤되지 않게 막아요. 모달, 드로어 같은 오버레이 컴포넌트를 열 때 유용해요.

SSR 환경에서 호출해도 안전해요. 서버에서는 아무 동작도 하지 않아요. 잠금을 해제하기 전까지는 다시 호출해도 아무 효과가 없어요.

## 인터페이스

```ts
function enableBodyScrollLock(): void;
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
