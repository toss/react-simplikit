# useInputState

`useInputState` es un Hook de React que gestiona el estado de un campo de entrada con una transformación opcional del valor.
El controlador `onChange` que devuelve funciona tanto con elementos `<input>` como con elementos `<textarea>`.

## Interfaz

```ts
function useInputState(
  initialValue: string | (() => string) = '',
  transformValue: (nextValue: string, previousValue: string) => string = (
    nextValue: string
  ) => nextValue
): [
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
];
```

### Parámetros

<Interface
  name="initialValue"
  type="string | (() => string)"
  description='El valor inicial del campo de entrada. El valor predeterminado es una cadena vacía (<code>""</code>).'
/>

<Interface
  name="transformValue"
  type="(nextValue: string, previousValue: string) => string"
  description="Una función para transformar el valor del campo de entrada. Recibe el valor anterior del estado como segundo argumento. La función predeterminada es una función identidad que devuelve el siguiente valor de entrada sin cambios."
/>

### Valor de retorno

<Interface
  name=""
  type="[value: string, onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>]"
  description="Una tupla que contiene:"
  :nested="[
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'El valor actual del estado.',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>',
      required: false,
      description: 'Una función para actualizar el estado.',
    },
  ]"
/>

## Ejemplo

```tsx
function Example() {
  const [value, onChange] = useInputState('');
  return (
    <>
      <input type="text" value={value} onChange={onChange} />
      <textarea value={value} onChange={onChange} />
    </>
  );
}
```
