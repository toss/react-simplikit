# useKeyboardHeight

`useKeyboardHeight` es un Hook de React que hace un seguimiento de la altura del teclado en pantalla.
Devuelve la altura actual del teclado en píxeles, que se actualiza automáticamente
cuando el teclado aparece, desaparece o cambia de tamaño.

## Interfaz

```ts
function useKeyboardHeight(
  options?: UseKeyboardHeightOptions
): UseKeyboardHeightResult;
```

### Parámetros

<Interface
  name="options"
  type="UseKeyboardHeightOptions"
  description="Opciones de configuración."
  :nested="[
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
  type="UseKeyboardHeightResult"
  description="Un objeto que contiene la altura actual del teclado."
  :nested="[
    {
      name: 'keyboardHeight',
      type: 'number',
      required: false,
      description:
        'La altura actual del teclado en píxeles. Es 0 cuando el teclado está oculto.',
    },
  ]"
/>

## Ejemplo

```tsx
function ChatInput() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div style={{ paddingBottom: `${keyboardHeight}px` }}>
      <input type="text" placeholder="Escribe un mensaje..." />
    </div>
  );
}
```

```tsx
function KeyboardStatus() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div>
      {keyboardHeight > 0
        ? `El teclado está abierto (${keyboardHeight}px)`
        : 'El teclado está cerrado'}
    </div>
  );
}
```
