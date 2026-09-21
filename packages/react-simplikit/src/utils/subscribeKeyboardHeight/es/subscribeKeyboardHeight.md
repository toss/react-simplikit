# subscribeKeyboardHeight

`subscribeKeyboardHeight` es una función de utilidad que permite suscribirte a los cambios en la altura del teclado en pantalla.

La función invoca el callback proporcionado siempre que la altura del teclado pueda cambiar,
incluso cuando el teclado aparece, desaparece o cambia de tamaño.

Internamente, esta función escucha los eventos `resize` y `scroll`
del área visible (Visual Viewport):

- `resize`: ocurre cuando cambia la altura del área visible
- `scroll`: ocurre cuando cambia el desplazamiento del área visible
  (importante en iOS, donde el área visible puede desplazarse sin cambiar de tamaño)

Optimizaciones de rendimiento:

- Limita la frecuencia de forma predeterminada (16 ms, ~60 fps) para evitar invocaciones excesivas del callback
- Omite el callback cuando la altura no ha cambiado (deduplicación)

## Interfaz

```ts
function subscribeKeyboardHeight(
  options: SubscribeKeyboardHeightOptions
): SubscribeKeyboardHeightResult;
```

### Parámetros

<Interface
  required
  name="options"
  type="SubscribeKeyboardHeightOptions"
  description="Opciones de configuración"
  :nested="[
    {
      name: 'options.callback',
      type: '(height: number) => void',
      required: true,
      description:
        'Una función que recibe la altura actualizada del teclado en píxeles.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'Si es true, la función invoca el callback inmediatamente con la altura actual del teclado.',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '16',
      description: 'Intervalo de limitación de frecuencia en milisegundos.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="SubscribeKeyboardHeightResult"
  description="Un objeto que contiene la función para cancelar la suscripción."
  :nested="[
    {
      name: 'unsubscribe',
      type: '() => void',
      required: false,
      description:
        'Cancela la suscripción de todos los receptores de eventos y deja de recibir actualizaciones de la altura del teclado.',
    },
  ]"
/>

## Ejemplo

```tsx
const { unsubscribe } = subscribeKeyboardHeight({
  callback: height => {
    footer.style.paddingBottom = `${height}px`;
  },
  immediate: true,
});

// Más adelante, cuando necesites realizar la limpieza
unsubscribe();
```
