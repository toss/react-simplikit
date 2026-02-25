# isServer

`isServer` is a utility function that checks if the code is running on the server. It returns `true` in SSR (Server-Side Rendering) environments where `window` is undefined, and `false` in client-side environments.

## Interface

```ts
function isServer(): boolean;
```

### Parameters

### Return Value

<Interface
  name=""
  type="boolean"
  description="if running in a server environment (SSR), <code>false</code> otherwise."
/>

## Example

```tsx
if (isServer()) {
  // SSR-safe code
  return null;
}

// Client-only code
window.addEventListener('resize', handleResize);
```
