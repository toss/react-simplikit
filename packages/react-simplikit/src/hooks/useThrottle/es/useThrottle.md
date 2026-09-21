# useThrottle

`useThrottle` es un Hook de React que crea una versión de un callback con una frecuencia de ejecución limitada.
Te permite limitar la frecuencia con la que llamas a una función,
por ejemplo, al manejar eventos de desplazamiento o de cambio de tamaño.

## Interfaz

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: { edges?: Array<'leading' | 'trailing'> }
): F & { cancel: () => void };
```

### Parámetros

<Interface
  required
  name="callback"
  type="F"
  description="La función cuya frecuencia de ejecución quieres limitar."
/>

<Interface
  required
  name="wait"
  type="number"
  description="El intervalo en milisegundos que limita la frecuencia de las llamadas."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="Opciones para controlar la limitación de frecuencia."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        'Un arreglo opcional que especifica si la función debe ejecutarse al inicio del intervalo, al final o en ambos momentos.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="Devuelve la función con frecuencia limitada y un método <code>cancel</code> para cancelar las ejecuciones pendientes."
/>

## Ejemplo

```tsx
const throttledScroll = useThrottle(
  () => {
    console.log('Evento de desplazamiento');
  },
  200,
  { edges: ['leading', 'trailing'] }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
