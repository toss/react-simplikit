# useInputState

`useInputState` es un Hook de React que gestiona el estado de un campo de entrada con una transformación opcional del valor.
El controlador `onChange` que devuelve funciona tanto con elementos `<input>` como con elementos `<textarea>`.

## Interfaz

```ts
function useInputState(
  initialValue: string | (() => string) = '',
  transformValue: (value: string) => string = (v: string) => v
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
  type="(value: string) => string"
  description="Una función para transformar el valor del campo de entrada. La función predeterminada es una función identidad que devuelve el valor sin cambios."
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
