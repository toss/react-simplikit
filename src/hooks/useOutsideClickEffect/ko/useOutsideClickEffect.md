# useOutsideClickEffect

`useOutsideClickEffect`는 지정한 컨테이너 외부에서 클릭 이벤트가 발생하면 콜백을 호출하는 React 훅이에요.
모달, 드롭다운, 툴팁 등의 UI 컴포넌트에서 외부 클릭 시 닫히도록 할 때 유용해요.

## 인터페이스

```ts
function useOutsideClickEffect(container: HTMLElement | HTMLElement[] | null, callback: () => void): void;
```

## 매개변수

- `container`: 단일 HTML 요소, HTML 요소 배열 또는 `null`.  
  감지할 요소를 지정해요. `null`이면 이벤트가 등록되지 않아요.
- `callback`: 컨테이너 외부 클릭 시 실행할 함수예요.

## 반환 값

이 훅은 반환 값이 없어요.

## 예시

### 기본 사용법

```tsx
import { useOutsideClickEffect } from 'reactive-kit';

function Example() {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect(wrapperEl, () => {
    console.log('외부가 클릭되었습니다!');
  });

  return <div ref={setWrapperEl}>컨텐츠</div>;
}
```

### 여러 컨테이너 처리

```tsx
import { useOutsideClickEffect } from 'reactive-kit';
function Example() {
  const [wrapperEl1, setWrapperEl1] = useState<HTMLDivElement | null>(null);
  const [wrapperEl2, setWrapperEl2] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect([wrapperEl1, wrapperEl2], () => {
    console.log('두 요소의 외부가 클릭되었습니다!');
  });

  return (
    <div>
      <div ref={setWrapperEl1}>컨테이너 1</div>
      <div ref={setWrapperEl2}>컨테이너 2</div>
    </div>
  );
}
```

### 모달 컴포넌트 처리

```tsx
import { useOutsideClickEffect } from 'reactive-kit';

function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const modalRef = useState<HTMLDivElement | null>(null);
  useOutsideClickEffect(isOpen ? modalRef.current : null, onClose);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        {children}
      </div>
    </div>
  );
}

// 사용 예시
function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>모달 제목</h2>
        <p>모달 외부를 클릭하면 닫힙니다.</p>
      </Modal>
    </div>
  );
}
```
