# useScrollDirection

## Interface

```ts
function useScrollDirection(): void;
```

### Parameters

<Interface
  required
  name="options.throttleMs"
  type=""
  description="Throttle interval (default: 50ms)"
/>

### Return Value

<Interface
  name=""
  type=""
  description="direction state (direction: \'up\' | \'down\' | null, position: number)"
/>

## Example

````tsx
```tsx
function Header() {
  const { direction, position } = useScrollDirection();

  // Hide header on scroll down
  const isHidden = direction === 'down' && position > 100;

  return (
    <header className={isHidden ? 'hidden' : 'visible'}>
      My Header
    </header>
  );
}
````

```

```
