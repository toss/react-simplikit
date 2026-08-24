# useIsClient

`useIsClient` is a React hook that returns `true` only in the client-side environment. It is primarily used to differentiate between client-side and server-side rendering (SSR). The state is set to `true` only after the component is mounted in the client-side environment.

## Interface

```ts
function useIsClient(): boolean;
```

### Parameters

### Return Value

<Interface
  name=""
  type="boolean"
  description="<code>true</code> in a client"
  :nested="[
    {
      required: false,
    },
  ]"
/>

## Example

```tsx
function ClientSideContent() {
  const isClient = useIsClient();

  if (!isClient) {
    return <div>Loading...</div>; // Rendered on the server side
  }

  return <div>Client-side rendered content</div>; // Rendered on the client side
}

function ClientOnlyMap() {
  const isClient = useIsClient();

  if (!isClient) return null;

  return <div id="map" />;
}

function ClientTheme() {
  const isClient = useIsClient();

  const theme = isClient ? localStorage.getItem('theme') : 'light';

  return <div>Current theme: {theme}</div>;
}
```
