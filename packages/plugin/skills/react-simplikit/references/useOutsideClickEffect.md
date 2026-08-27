# useOutsideClickEffect

`useOutsideClickEffect` is a React hook that triggers a callback when a click event occurs outside the specified container(s). It is useful for closing modals, dropdowns, tooltips, and other UI components when clicking outside.

## Interface

```ts
function useOutsideClickEffect(
  container: HTMLElement | HTMLElement[] | null,
  callback: () => void
): void;
```

### Parameters

<Interface
  required
  name="container"
  type="HTMLElement | HTMLElement[] | null"
  description="A single HTML element, an array of HTML elements, or <code>null</code>. If <code>null</code>, no event listener is attached."
/>

<Interface
  required
  name="callback"
  type="() => void"
  description="A function that is executed when clicking outside the specified container(s)."
/>

### Return Value

This hook does not return anything.

## Example

```tsx
import { useOutsideClickEffect } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect(wrapperEl, () => {
    console.log('Outside clicked!');
  });

  return <div ref={setWrapperEl}>Content</div>;
}
```
