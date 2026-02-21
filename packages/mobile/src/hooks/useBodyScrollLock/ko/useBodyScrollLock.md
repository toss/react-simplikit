# useBodyScrollLock

컴포넌트가 마운트될 때 body 스크롤을 잠그고, 언마운트될 때 자동으로 해제하는 React 훅이에요. 모달, 드로어 등 배경 스크롤을 방지해야 하는 오버레이 컴포넌트에서 유용하게 사용할 수 있어요.

## 인터페이스

```ts
function useBodyScrollLock(): void;
```

### 매개변수

이 훅은 매개변수를 받지 않아요.

### 반환값

이 훅은 `void`를 반환해요 (반환값 없음).

## 예제

### 기본 사용법

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```

### 여러 모달 - 단일 잠금 패턴

여러 개의 모달이 겹쳐서 표시될 때는 각 모달에 개별적으로 잠금을 적용하는 대신, 부모 레벨에서 단일 잠금을 사용하세요.

```tsx
// Multiple modals - single lock pattern
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
- **자동 정리**: 컴포넌트가 언마운트될 때 스크롤 잠금이 자동으로 해제되어, 적절한 정리가 보장돼요.
- **여러 모달**: 여러 모달이 겹쳐서 표시되는 경우, 각 모달에 개별적으로 잠금을 적용하지 말고 부모 레벨에서 단일 잠금을 구현하세요. 이렇게 하면 충돌을 방지하고 일관된 동작을 보장할 수 있어요.
- **브라우저 지원**: `enableBodyScrollLock`과 `disableBodyScrollLock` 유틸리티가 적용하는 CSS 수정을 지원하는 모든 최신 브라우저에서 작동해요.
