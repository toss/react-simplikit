# useBodyScrollLock

컴포넌트가 마운트될 때 body 스크롤을 잠그고, 언마운트될 때 자동으로 해제하는 React 훅이에요. 모달, 드로어 등 배경 스크롤을 방지해야 하는 오버레이 컴포넌트에서 유용하게 사용할 수 있어요.

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

- **SSR 안전성**: 이 훅은 `useEffect`를 사용하기 때문에 클라이언트 사이드에서만 실행되어, 서버 사이드 렌더링(SSR)에서도 안전하게 사용할 수 있어요.
- **자동 정리**: 컴포넌트가 언마운트될 때 스크롤 잠금이 해제돼요.
- **여러 모달**: 여러 모달이 겹쳐서 표시되는 경우, 각 모달에 개별적으로 잠금을 적용하지 말고 부모 레벨에서 단일 잠금을 구현하세요. 이렇게 하면 충돌을 방지하고 일관된 동작을 보장할 수 있어요.
- **잠금 방식**: `enableBodyScrollLock`이 `body`를 `position: fixed`와 `overflow: hidden`으로 고정하고 스크롤 위치를 data 속성에 저장해요. `disableBodyScrollLock`이 그 스타일을 제거하고 저장한 위치로 되돌려요.
