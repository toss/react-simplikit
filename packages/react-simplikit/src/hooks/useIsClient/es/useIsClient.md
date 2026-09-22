# useIsClient

`useIsClient` es un Hook de React que devuelve `true` solo en el entorno del cliente.
Su uso principal es distinguir entre el renderizado en el cliente y el renderizado en el servidor (SSR).
El estado cambia a `true` únicamente después de que el componente se monta en el entorno del cliente.

## Interfaz

```ts
function useIsClient(): boolean;
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="boolean"
  description="Devuelve <code>true</code> en un entorno del cliente y <code>false</code> en caso contrario."
/>

## Ejemplo

```tsx
function ClientSideContent() {
  const isClient = useIsClient();

  if (!isClient) {
    return <div>Cargando...</div>; // Renderizado en el servidor
  }

  return <div>Contenido renderizado en el cliente</div>; // Renderizado en el cliente
}
```

```tsx
function ClientOnlyMap() {
  const isClient = useIsClient();

  if (!isClient) return null;

  return <div id="map" />;
}
```

```tsx
function ClientTheme() {
  const isClient = useIsClient();

  const theme = isClient ? localStorage.getItem('theme') : 'light';

  return <div>Tema actual: {theme}</div>;
}
```
