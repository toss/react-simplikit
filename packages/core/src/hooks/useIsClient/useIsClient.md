# useIsClient

`useIsClient` is a React hook that returns `true` only in the client-side environment. It is primarily used to differentiate between client-side and server-side rendering (SSR). The state is set to `true` only after the component is mounted in the client-side environment.

## Interface

```ts
function useIsClient(): boolean;
```

### Return Value

<Interface
  name=""
  type="boolean"
  description="Returns <code>true</code> in a client-side environment, and <code>false</code> otherwise."
/>

## Example

```tsx
import { useIsClient } from 'react-simplikit';

function ClientSideContent() {
  const isClient = useIsClient();

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return <div>Client-side rendered content</div>;
}
```
