# useControlledState

`useControlledState` es un Hook de React que te permite gestionar tanto estados controlados como no controlados.
Si pasas el estado a `value`, será un estado controlado, y si lo pasas a `defaultValue`, será un estado no controlado.
Si pasas tanto `value` como `defaultValue`, `value` tendrá prioridad.

## Interfaz

```ts
function useControlledState<T>(props: Object): [T, Dispatch<SetStateAction<T>>];
```

### Parámetros

<Interface
  required
  name="props"
  type="Object"
  description=""
  :nested="[
    {
      name: 'props.value',
      type: 'T',
      required: false,
      description: 'El valor del estado.',
    },
    {
      name: 'props.defaultValue',
      type: 'T',
      required: false,
      description: 'El valor predeterminado del estado.',
    },
    {
      name: 'props.onChange',
      type: '(value: T) => void',
      required: false,
      description:
        'El callback que se ejecuta cuando cambia el estado.',
    },
    {
      name: 'props.equalityFn',
      type: '(prev: T, next: T) => boolean',
      required: false,
      description:
        'La función que compara el valor anterior con el siguiente.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="[T, Dispatch<SetStateAction<T>>]"
  description="El estado y la función para actualizarlo."
/>

## Ejemplo

```tsx
type ToggleProps = {
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
};

function Toggle({ value, defaultValue, onChange }: ToggleProps) {
  const [on, setOn] = useControlledState({
    value,
    defaultValue: defaultValue ?? false,
    onChange,
  });

  return (
    <button onClick={() => setOn(prev => !prev)}>
      {on ? 'ACTIVADO' : 'DESACTIVADO'}
    </button>
  );
}
```
