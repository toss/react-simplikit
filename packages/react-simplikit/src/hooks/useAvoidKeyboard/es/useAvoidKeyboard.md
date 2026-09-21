# useAvoidKeyboard

`useAvoidKeyboard` es un Hook de React que ayuda a evitar que el teclado en pantalla cubra los elementos fijos en la parte inferior.
Devuelve un estilo CSS que puedes aplicar a elementos con `position: fixed`
para desplazarlos suavemente por encima del teclado cuando aparece.

## Interfaz

```ts
function useAvoidKeyboard(
  options?: UseAvoidKeyboardOptions
): UseAvoidKeyboardResult;
```

### Parámetros

<Interface
  name="options"
  type="UseAvoidKeyboardOptions"
  description="Opciones de configuración."
  :nested="[
    {
      name: 'options.safeAreaBottom',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        'Desplazamiento inferior base en píxeles cuando el teclado está oculto. Útil para tener en cuenta el área del indicador de inicio del iPhone.',
    },
    {
      name: 'options.transitionDuration',
      type: 'number',
      required: false,
      defaultValue: '200',
      description: 'Duración de la transición en milisegundos para una animación fluida.',
    },
    {
      name: 'options.transitionTimingFunction',
      type: 'CSSProperties[\'transitionTimingFunction\']',
      required: false,
      defaultValue: '\'ease-out\'',
      description: 'Función de temporización de la transición para la animación.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: 'Si es true, obtiene la altura inicial del teclado al montar el componente.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="UseAvoidKeyboardResult"
  description="Un objeto que contiene el estilo CSS para evitar que el teclado cubra el elemento."
  :nested="[
    {
      name: 'style',
      type: 'CSSProperties',
      required: false,
      description:
        'Objeto de estilo CSS que puedes aplicar al elemento fijo en la parte inferior. Contiene las propiedades <code>transform</code> y <code>transition</code>.',
    },
  ]"
/>

## Ejemplo

```tsx
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Enviar</button>
    </div>
  );
}
```

```tsx
// Con desplazamiento inferior del área segura (p. ej., para el indicador de inicio del iPhone)
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Enviar</button>
    </div>
  );
}
```
