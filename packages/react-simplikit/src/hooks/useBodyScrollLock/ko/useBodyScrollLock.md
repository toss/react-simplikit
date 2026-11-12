# useBodyScrollLock

`useBodyScrollLock`은 컴포넌트가 마운트되어 있는 동안 body 스크롤을 잠그는 React 훅이에요. 마운트될 때 자동으로 잠그고 언마운트될 때 해제해요. 모달이나 드로어처럼 뒤에 있는 페이지가 스크롤되지 않아야 하는 오버레이 컴포넌트에 유용해요.

## 인터페이스

```ts
function useBodyScrollLock(): void;
```

### 파라미터

이 함수는 파라미터를 받지 않아요.

### 반환 값

이 함수는 아무것도 반환하지 않아요.

## 예시

### 기본 사용법

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```

### 여러 모달 - 단일 잠금 패턴

```tsx
// 겹치는 모달마다 잠그지 말고 부모 레벨에서 한 번만 잠가요
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

function App() {
  const hasModal = showModal1 || showModal2;

  return (
    <>
      {hasModal && <BodyScrollLock />}
      {showModal1 && <Modal1 />}
      {showModal2 && <Modal2 />}
    </>
  );
}
```

## 참고사항

- **SSR 안전성**: 잠금은 클라이언트에서만 실행되는 `useEffect` 안에서 적용돼요. 그래서 서버 사이드 렌더링(SSR) 중에도 안전하게 사용할 수 있어요.
- **자동 정리**: 컴포넌트가 언마운트될 때 스크롤 잠금이 해제돼요.
- **여러 모달**: 여러 모달이 겹쳐 표시되면 모달마다 잠그지 말고 부모 레벨에서 한 번만 잠그세요. 그래야 충돌을 피하고 동작을 일관되게 유지할 수 있어요.
- **잠금 방식**: `enableBodyScrollLock`이 `body`를 `position: fixed`와 `overflow: hidden`으로 고정하고 스크롤 위치를 data 속성에 저장해요. `disableBodyScrollLock`이 잠그기 전에 `body`에 있던 inline 스타일을 되돌려요. 잠겨 있는 동안 다른 코드가 바꾼 스타일은 그대로 둬요. 루트 요소(`html`)에 `scroll-behavior: smooth`가 있어도 저장한 위치로 바로 이동해요.
