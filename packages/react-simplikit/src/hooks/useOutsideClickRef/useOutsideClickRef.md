# useOutsideClickRef

`useOutsideClickRef` is a React hook that returns a callback ref and calls `onOutsideClick` when a click happens outside every element the ref is attached to.
Attach the same ref to a trigger, its menu and any portal content, and a press that starts inside and ends outside is not counted as an outside click.

## Interface

```ts
function useOutsideClickRef(options: Object): (element: Element | null) => void;
```

### Parameters

<Interface
  required
  name="options"
  type="Object"
  description="Options for detecting outside clicks."
  :nested="[
    {
      name: 'options.onOutsideClick',
      type: '() => void',
      required: true,
      description:
        'A function that is executed when a click happens outside every attached element. It runs before the clicked element\'s own <code>onClick</code>.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Whether to detect outside clicks. While <code>false</code>, <code>onOutsideClick</code> is not called.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="(element: Element | null) => void"
  description="A callback ref to pass to the <code>ref</code> attribute of each element that counts as inside. It keeps the same identity across renders."
/>

## Example

```tsx
import { useOutsideClickRef } from 'react-simplikit';
import { useState } from 'react';

function Dropdown({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClickRef({
    enabled: open,
    onOutsideClick: () => {
      setOpen(false);
      onClose();
    },
  });

  return (
    <>
      <button ref={ref} onClick={() => setOpen(prev => !prev)}>
        Menu
      </button>
      {open && <ul ref={ref}>...</ul>}
    </>
  );
}
```
