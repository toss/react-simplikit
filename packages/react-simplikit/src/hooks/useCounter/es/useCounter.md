# useCounter

`useCounter` es un Hook de React que te permite gestionar el estado de un contador numérico con funciones para incrementar, decrementar y restablecer su valor.
Opcionalmente, puedes proporcionar valores mínimo y máximo para limitar el rango del contador.

## Interfaz

```ts
function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions
): UseCounterReturn;
```

### Parámetros

<Interface
  name="initialValue"
  type="number"
  description="Valor inicial del contador. El valor predeterminado es 0."
/>

<Interface
  required
  name="options"
  type="UseCounterOptions"
  description="Las opciones del contador."
  :nested="[
    {
      name: 'options.min',
      type: 'number',
      required: false,
      description:
        'Valor mínimo que puede alcanzar el contador. Si no lo proporcionas, no hay límite inferior.',
    },
    {
      name: 'options.max',
      type: 'number',
      required: false,
      description:
        'Valor máximo que puede alcanzar el contador. Si no lo proporcionas, no hay límite superior.',
    },
    {
      name: 'options.step',
      type: 'number',
      required: false,
      defaultValue: '1',
      description: 'Cantidad que puedes sumar o restar. El valor predeterminado es 1.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="UseCounterReturn"
  description="Un objeto con el valor del contador y las funciones de control."
  :nested="[
    {
      name: 'count',
      type: 'number',
      required: false,
      description: 'El valor actual del contador.',
    },
    {
      name: 'increment',
      type: '() => void',
      required: false,
      description: 'Una función para incrementar el contador.',
    },
    {
      name: 'decrement',
      type: '() => void',
      required: false,
      description: 'Una función para decrementar el contador.',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: 'Una función para restablecer el contador a su valor inicial.',
    },
    {
      name: 'setCount',
      type: '(value: number | ((prev: number) => number)) => void',
      required: false,
      description:
        'Una función para actualizar el contador con un valor específico o con una función que devuelve un nuevo valor.',
    },
  ]"
/>

## Ejemplo

```tsx
import { useCounter } from 'react-simplikit';

function ShoppingCart() {
  const { count, increment, decrement, reset } = useCounter(1, {
    min: 1,
    max: 10,
  });

  return (
    <div>
      <span>Cantidad: {count}</span>
      <button type="button" onClick={decrement}>
        -
      </button>
      <button type="button" onClick={increment}>
        +
      </button>
      <button type="button" onClick={reset}>
        Restablecer
      </button>
    </div>
  );
}
```
