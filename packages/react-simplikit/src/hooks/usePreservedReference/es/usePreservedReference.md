# usePreservedReference

`usePreservedReference` es un Hook de React que te ayuda a conservar la referencia de un valor
cuando no ha cambiado y te permite usar el estado más reciente de forma segura.
Evita renderizados innecesarios y te permite acceder siempre a los datos más recientes.

## Interfaz

```ts
function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual?: (a: T, b: T) => boolean
): T;
```

### Parámetros

<Interface
  required
  name="value"
  type="T"
  description="El valor cuya referencia quieres conservar. Devuelve una nueva referencia si la comparación indica que el valor del estado ha cambiado."
/>

<Interface
  name="areValuesEqual"
  type="(a: T, b: T) => boolean"
  description="Una función opcional para determinar si dos valores son iguales. De forma predeterminada, usa <code>JSON.stringify</code> para compararlos."
/>

### Valor de retorno

<Interface
  name=""
  type="T"
  description="Devuelve la misma referencia si el valor se considera igual al anterior; de lo contrario, devuelve una nueva referencia."
/>

## Ejemplo

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state);

  return <div>{preservedState.key}</div>;
}
```

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(
    state,
    (a, b) => a.key === b.key
  );

  return <div>{preservedState.key}</div>;
}
```
