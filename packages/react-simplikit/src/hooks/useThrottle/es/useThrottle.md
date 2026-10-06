# useThrottle

`useThrottle` es un Hook de React que crea una versión de un callback con una frecuencia de ejecución limitada.
Te permite limitar la frecuencia con la que llamas a una función,
por ejemplo, al manejar eventos de desplazamiento o de cambio de tamaño.

## Interfaz

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: ThrottleOptions
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
  type="ThrottleOptions"
  description="Opciones para controlar la limitación de frecuencia."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, permite una llamada inmediata al inicio del intervalo de limitación de frecuencia.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, permite ejecutar una llamada pendiente después de la espera con los argumentos más recientes.',
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
  { leading: true, trailing: true }
);

useEffect(() => {
  window.addEventListener('scroll', throttledScroll);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    throttledScroll.cancel();
  };
}, [throttledScroll]);
```
