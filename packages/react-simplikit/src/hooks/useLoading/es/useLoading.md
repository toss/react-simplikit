# useLoading

`useLoading` es un Hook de React que simplifica la gestión del estado de carga de una `Promise`.
Proporciona un estado para indicar si hay una operación asíncrona en curso y una función para gestionar el estado de carga automáticamente.

## Interfaz

```ts
function useLoading(): [
  loading: boolean,
  startLoading: <T>(promise: Promise<T>) => Promise<T>,
];
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="[loading: boolean, startLoading: <T>(promise: Promise<T>) => Promise<T>]"
  description="Una tupla que contiene:"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description:
        'Representa el estado de carga actual. El valor inicial es <code>false</code>. Cambia a <code>true</code> cuando hay una tarea asíncrona en curso.',
    },
    {
      name: 'startLoading',
      type: '<T>(promise: Promise<T>) => Promise<T>',
      required: false,
      description:
        'Una función que ejecuta tareas asíncronas y gestiona el estado de carga. Esta función recibe una <code>Promise</code> como argumento y restablece automáticamente el estado <code>isLoading</code> a <code>false</code> cuando finaliza la <code>Promise</code>.',
    },
  ]"
/>

## Ejemplo

```tsx
function ConfirmButton() {
  const [loading, startLoading] = useLoading();

  const handleSubmit = useCallback(async () => {
    try {
      const result = await startLoading(postConfirmation());
      router.push(`/success?id=${result.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [startLoading]);

  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading ? 'Cargando...' : 'Confirmar'}
    </button>
  );
}
```
