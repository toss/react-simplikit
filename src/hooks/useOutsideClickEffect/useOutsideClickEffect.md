# useOutsideClickEffect

`useOutsideClickEffect` is a hook that invokes a callback when a click event occurs on an element outside the entered container.

## Interface

```ts
function useOutsideClickEffect(container: HTMLElement | HTMLElement[] | null, callback: () => void): void;
```

### Parameters

- `container`: A single HTML element, array of HTML elements, or null
- `callback`: Function to be called when clicking outside the container(s)

### Returns

This hook doesn't return any value.

## Examples

### Basic Usage

```tsx
import { useOutsideClickEffect } from 'reactive-kit';

function Example() {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect(wrapperEl, () => {
    console.log('outside clicked!');
  });

  return <div ref={setWrapperEl}>Content</div>;
}
```

### Multiple Containers

```tsx
function Example() {
  const [wrapperEl1, setWrapperEl1] = useState<HTMLDivElement | null>(null);
  const [wrapperEl2, setWrapperEl2] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect([wrapperEl1, wrapperEl2], () => {
    console.log('clicked outside both elements!');
  });

  return (
    <div>
      <div ref={setWrapperEl1}>Container 1</div>
      <div ref={setWrapperEl2}>Container 2</div>
    </div>
  );
}
```

### Handling Modal component

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

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>Click outside to close this modal.</p>
      </Modal>
    </div>
  );
}
```
